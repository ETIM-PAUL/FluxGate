// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
import "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";

/**
 * @title FlexibleCreditVault
 * @notice Fully flexible BTC-MUSD Credit Lines with mixed asset support
 * @dev Users can mix assets for lending and borrowing with flexible repayment
 */
contract FlexibleCreditVault is AccessControl, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // ============ Constants ============
    
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant APPROVED_BORROWER_ROLE = keccak256("APPROVED_BORROWER_ROLE");
    
    uint256 public constant PRECISION = 1e18;
    uint256 public constant SECONDS_PER_YEAR = 365 days;
    uint256 public constant MAX_LTV = 8000; // 80% max LTV (in basis points)
    uint256 public constant LIQUIDATION_THRESHOLD = 8500; // 85% liquidation threshold
    uint256 public constant LIQUIDATION_BONUS = 500; // 5% liquidation bonus
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public constant PRICE_VALIDITY_PERIOD = 3600; // 1 hour

    // Pyth price feed IDs
    bytes32 public constant MUSD_PRICE_ID = 0x0617a9b725011a126a2b9fd53563f4236501f32cf76d877644b943394606c6de;
    bytes32 public constant BTC_PRICE_ID = 0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43;

    // ============ Enums ============
    
    enum AssetType {
        MUSD,
        BTC
    }

    // ============ State Variables ============
    
    IERC20 public immutable musdToken;
    IERC20 public immutable btcToken;
    IPyth public immutable pyth;
    
    // Interest rates (in basis points per year)
    uint256 public borrowInterestRate = 800; // 8% APR
    uint256 public lenderInterestRate = 600; // 6% APR
    uint256 public protocolFee = 200; // 2%
    address public treasury;
    
    // Pool tracking by asset type
    struct PoolStats {
        uint256 totalDeposited;
        uint256 totalBorrowed;
        uint256 totalShares;
        uint256 protocolFees;
    }
    
    mapping(AssetType => PoolStats) public pools;
    
    // ============ Structs ============
    
    struct LenderPosition {
        uint256 musdDeposited;
        uint256 musdShares;
        uint256 musdLastUpdate;
        uint256 musdAccruedInterest;
        
        uint256 btcDeposited;
        uint256 btcShares;
        uint256 btcLastUpdate;
        uint256 btcAccruedInterest;
    }
    
    struct CollateralPosition {
        uint256 musdAmount;
        uint256 btcAmount;
    }
    
    struct DebtPosition {
        uint256 musdBorrowed;
        uint256 musdAccruedInterest;
        uint256 musdLastUpdate;
        
        uint256 btcBorrowed;
        uint256 btcAccruedInterest;
        uint256 btcLastUpdate;
    }
    
    struct BorrowerAccount {
        CollateralPosition collateral;
        DebtPosition debt;
        bool isActive;
    }
    
    // ============ Mappings ============
    
    mapping(address => LenderPosition) public lenders;
    mapping(address => BorrowerAccount) public borrowers;
    
    // ============ Events ============
    
    event Deposited(address indexed lender, AssetType assetType, uint256 amount, uint256 shares);
    event Withdrawn(address indexed lender, AssetType assetType, uint256 amount, uint256 shares);
    event CollateralAndBorrow(
        address indexed borrower,
        AssetType collateralType,
        uint256 collateralAmount,
        AssetType borrowType,
        uint256 borrowAmount
    );
    event CollateralAdded(address indexed borrower, AssetType assetType, uint256 amount);
    event Borrowed(address indexed borrower, AssetType assetType, uint256 amount);
    event LoanRepaid(address indexed borrower, AssetType assetType, uint256 principal, uint256 interest);
    event CollateralWithdrawn(address indexed borrower, AssetType assetType, uint256 amount);
    event Liquidated(
        address indexed borrower,
        address indexed liquidator,
        uint256 debtAmount
    );
    event InterestClaimed(address indexed lender, AssetType assetType, uint256 amount);
    event InterestRatesUpdated(uint256 borrowRate, uint256 lenderRate);
    event ProtocolFeesCollected(AssetType assetType, uint256 amount);
    
    // ============ Constructor ============
    
    constructor(
        address _musdToken,
        address _btcToken,
        address _pythContract,
        address _treasury
    ) {
        require(_musdToken != address(0), "Invalid MUSD address");
        require(_btcToken != address(0), "Invalid BTC address");
        require(_pythContract != address(0), "Invalid Pyth address");
        require(_treasury != address(0), "Invalid treasury address");
        
        musdToken = IERC20(_musdToken);
        btcToken = IERC20(_btcToken);
        pyth = IPyth(_pythContract);
        treasury = _treasury;
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }
    
    // ============ Lender Functions ============
    
    /**
     * @notice Deposit MUSD or BTC to earn interest (can mix assets freely)
     */
    function deposit(AssetType assetType, uint256 amount) external nonReentrant whenNotPaused {
        require(amount > 0, "Amount must be > 0");
        
        _updateLenderInterest(msg.sender, assetType);
        
        PoolStats storage pool = pools[assetType];
        uint256 shares = pool.totalShares == 0 ? amount : (amount * pool.totalShares) / _getPoolValue(assetType);
        
        LenderPosition storage lender = lenders[msg.sender];
        if (assetType == AssetType.MUSD) {
            lender.musdDeposited += amount;
            lender.musdShares += shares;
        } else {
            lender.btcDeposited += amount;
            lender.btcShares += shares;
        }
        
        pool.totalShares += shares;
        pool.totalDeposited += amount;
        
        _transferIn(assetType, msg.sender, amount);
        
        emit Deposited(msg.sender, assetType, amount, shares);
    }
    
    /**
     * @notice Withdraw deposits plus earned interest for specific asset
     */
    function withdraw(AssetType assetType, uint256 shares) external nonReentrant {
        require(shares > 0, "Shares must be > 0");
        
        LenderPosition storage lender = lenders[msg.sender];
        uint256 lenderShares = assetType == AssetType.MUSD ? lender.musdShares : lender.btcShares;
        require(lenderShares >= shares, "Insufficient shares");
        
        _updateLenderInterest(msg.sender, assetType);
        
        PoolStats storage pool = pools[assetType];
        uint256 amount = (shares * _getPoolValue(assetType)) / pool.totalShares;
        
        require(_getAvailableLiquidity(assetType) >= amount, "Insufficient liquidity");
        
        if (assetType == AssetType.MUSD) {
            lender.musdShares -= shares;
            lender.musdDeposited = amount <= lender.musdDeposited ? lender.musdDeposited - amount : 0;
        } else {
            lender.btcShares -= shares;
            lender.btcDeposited = amount <= lender.btcDeposited ? lender.btcDeposited - amount : 0;
        }
        
        pool.totalShares -= shares;
        
        _transferOut(assetType, msg.sender, amount);
        
        emit Withdrawn(msg.sender, assetType, amount, shares);
    }
    
    /**
     * @notice Claim accrued interest for specific asset
     */
    function claimInterest(AssetType assetType) external nonReentrant {
        _updateLenderInterest(msg.sender, assetType);
        
        LenderPosition storage lender = lenders[msg.sender];
        uint256 interest = assetType == AssetType.MUSD ? lender.musdAccruedInterest : lender.btcAccruedInterest;
        require(interest > 0, "No interest to claim");
        require(_getAvailableLiquidity(assetType) >= interest, "Insufficient liquidity");
        
        if (assetType == AssetType.MUSD) {
            lender.musdAccruedInterest = 0;
        } else {
            lender.btcAccruedInterest = 0;
        }
        
        _transferOut(assetType, msg.sender, interest);
        
        emit InterestClaimed(msg.sender, assetType, interest);
    }
    
    // ============ Borrower Functions ============
    
    /**
     * @notice Deposit collateral and borrow in one transaction
     */
    function depositCollateralAndBorrow(
        AssetType collateralType,
        uint256 collateralAmount,
        AssetType borrowType,
        uint256 borrowAmount
    ) external nonReentrant whenNotPaused onlyRole(APPROVED_BORROWER_ROLE) {
        require(collateralAmount > 0, "Collateral must be > 0");
        require(borrowAmount > 0, "Borrow amount must be > 0");
        require(_getAvailableLiquidity(borrowType) >= borrowAmount, "Insufficient liquidity");
        
        BorrowerAccount storage borrower = borrowers[msg.sender];
        
        if (!borrower.isActive) {
            borrower.isActive = true;
            borrower.debt.musdLastUpdate = block.timestamp;
            borrower.debt.btcLastUpdate = block.timestamp;
        }
        
        _updateBorrowerInterest(msg.sender, borrowType);
        
        // Add collateral
        if (collateralType == AssetType.MUSD) {
            borrower.collateral.musdAmount += collateralAmount;
        } else {
            borrower.collateral.btcAmount += collateralAmount;
        }
        
        // Add debt
        if (borrowType == AssetType.MUSD) {
            borrower.debt.musdBorrowed += borrowAmount;
        } else {
            borrower.debt.btcBorrowed += borrowAmount;
        }
        
        pools[borrowType].totalBorrowed += borrowAmount;
        
        require(_isHealthy(msg.sender), "Insufficient collateral");
        
        _transferIn(collateralType, msg.sender, collateralAmount);
        _transferOut(borrowType, msg.sender, borrowAmount);
        
        emit CollateralAndBorrow(msg.sender, collateralType, collateralAmount, borrowType, borrowAmount);
    }
    
    /**
     * @notice Add more collateral (any asset)
     */
    function addCollateral(AssetType assetType, uint256 amount) 
        external 
        nonReentrant 
        whenNotPaused 
        onlyRole(APPROVED_BORROWER_ROLE) 
    {
        require(amount > 0, "Amount must be > 0");
        
        BorrowerAccount storage borrower = borrowers[msg.sender];
        
        if (!borrower.isActive) {
            borrower.isActive = true;
            borrower.debt.musdLastUpdate = block.timestamp;
            borrower.debt.btcLastUpdate = block.timestamp;
        }
        
        if (assetType == AssetType.MUSD) {
            borrower.collateral.musdAmount += amount;
        } else {
            borrower.collateral.btcAmount += amount;
        }
        
        _transferIn(assetType, msg.sender, amount);
        
        emit CollateralAdded(msg.sender, assetType, amount);
    }
    
    /**
     * @notice Borrow additional assets (any asset, can mix)
     */
    function borrow(AssetType assetType, uint256 amount) 
        external 
        nonReentrant 
        whenNotPaused 
        onlyRole(APPROVED_BORROWER_ROLE) 
    {
        require(amount > 0, "Amount must be > 0");
        require(_getAvailableLiquidity(assetType) >= amount, "Insufficient liquidity");
        
        BorrowerAccount storage borrower = borrowers[msg.sender];
        require(borrower.isActive, "Deposit collateral first");
        
        _updateBorrowerInterest(msg.sender, assetType);
        
        if (assetType == AssetType.MUSD) {
            borrower.debt.musdBorrowed += amount;
        } else {
            borrower.debt.btcBorrowed += amount;
        }
        
        pools[assetType].totalBorrowed += amount;
        
        require(_isHealthy(msg.sender), "Insufficient collateral");
        
        _transferOut(assetType, msg.sender, amount);
        
        emit Borrowed(msg.sender, assetType, amount);
    }
    
    /**
     * @notice Repay loan for specific asset type
     */
    function repay(AssetType assetType, uint256 amount) external nonReentrant {
        BorrowerAccount storage borrower = borrowers[msg.sender];
        
        uint256 borrowed = assetType == AssetType.MUSD ? borrower.debt.musdBorrowed : borrower.debt.btcBorrowed;
        require(borrowed > 0, "No debt for this asset");
        
        _updateBorrowerInterest(msg.sender, assetType);
        
        uint256 accruedInterest = assetType == AssetType.MUSD ? 
            borrower.debt.musdAccruedInterest : borrower.debt.btcAccruedInterest;
        
        uint256 totalDebt = borrowed + accruedInterest;
        uint256 repayAmount = (amount == 0 || amount > totalDebt) ? totalDebt : amount;
        
        uint256 interestPortion = repayAmount > accruedInterest ? accruedInterest : repayAmount;
        uint256 principalPortion = repayAmount - interestPortion;
        
        if (assetType == AssetType.MUSD) {
            borrower.debt.musdAccruedInterest -= interestPortion;
            borrower.debt.musdBorrowed -= principalPortion;
        } else {
            borrower.debt.btcAccruedInterest -= interestPortion;
            borrower.debt.btcBorrowed -= principalPortion;
        }
        
        pools[assetType].totalBorrowed -= principalPortion;
        pools[assetType].protocolFees += (interestPortion * protocolFee) / BASIS_POINTS;
        
        _transferIn(assetType, msg.sender, repayAmount);
        
        emit LoanRepaid(msg.sender, assetType, principalPortion, interestPortion);
    }
    
    /**
     * @notice Withdraw collateral (specific asset)
     */
    function withdrawCollateral(AssetType assetType, uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        
        BorrowerAccount storage borrower = borrowers[msg.sender];
        uint256 collateralAmount = assetType == AssetType.MUSD ? 
            borrower.collateral.musdAmount : borrower.collateral.btcAmount;
        require(collateralAmount >= amount, "Insufficient collateral");
        
        _updateBorrowerInterest(msg.sender, AssetType.MUSD);
        _updateBorrowerInterest(msg.sender, AssetType.BTC);
        
        if (assetType == AssetType.MUSD) {
            borrower.collateral.musdAmount -= amount;
        } else {
            borrower.collateral.btcAmount -= amount;
        }
        
        if (_getTotalDebtValueUSD(msg.sender) > 0) {
            require(_isHealthy(msg.sender), "Withdrawal would under-collateralize");
        }
        
        _transferOut(assetType, msg.sender, amount);
        
        emit CollateralWithdrawn(msg.sender, assetType, amount);
    }
    
    /**
     * @notice Liquidate undercollateralized position
     */
    function liquidate(
        address borrowerAddr,
        AssetType debtAsset,
        uint256 debtAmt,
        AssetType collAsset
    ) external nonReentrant {
        require(!_isHealthy(borrowerAddr), "Position is healthy");
        
        _updateBorrowerInterest(borrowerAddr, debtAsset);
        
        BorrowerAccount storage borrower = borrowers[borrowerAddr];
        
        uint256 borrowed = debtAsset == AssetType.MUSD ? borrower.debt.musdBorrowed : borrower.debt.btcBorrowed;
        uint256 interest = debtAsset == AssetType.MUSD ? borrower.debt.musdAccruedInterest : borrower.debt.btcAccruedInterest;
        
        uint256 totalDebt = borrowed + interest;
        require(totalDebt > 0 && debtAmt <= totalDebt, "Invalid debt amount");
        
        // Calculate collateral to seize
        uint256 debtValueUSD = (debtAmt * getPrice(debtAsset)) / PRECISION;
        uint256 collValueWithBonus = debtValueUSD * (BASIS_POINTS + LIQUIDATION_BONUS) / BASIS_POINTS;
        uint256 collToSeize = (collValueWithBonus * PRECISION) / getPrice(collAsset);
        
        uint256 availColl = collAsset == AssetType.MUSD ? borrower.collateral.musdAmount : borrower.collateral.btcAmount;
        require(availColl >= collToSeize, "Insufficient collateral");
        
        // Update state
        uint256 interestPortion = debtAmt > interest ? interest : debtAmt;
        uint256 principalPortion = debtAmt - interestPortion;
        
        if (debtAsset == AssetType.MUSD) {
            borrower.debt.musdAccruedInterest -= interestPortion;
            borrower.debt.musdBorrowed -= principalPortion;
        } else {
            borrower.debt.btcAccruedInterest -= interestPortion;
            borrower.debt.btcBorrowed -= principalPortion;
        }
        
        if (collAsset == AssetType.MUSD) {
            borrower.collateral.musdAmount -= collToSeize;
        } else {
            borrower.collateral.btcAmount -= collToSeize;
        }
        
        pools[debtAsset].totalBorrowed -= principalPortion;
        
        _transferIn(debtAsset, msg.sender, debtAmt);
        _transferOut(collAsset, msg.sender, collToSeize);
        
        emit Liquidated(borrowerAddr, msg.sender, debtAmt);
    }
    
    // ============ Price Functions ============
    
    function getMUSDPrice() public view returns (uint256) {
        PythStructs.Price memory priceData = pyth.getPriceNoOlderThan(MUSD_PRICE_ID, PRICE_VALIDITY_PERIOD);
        require(priceData.price > 0, "Invalid MUSD price");
        
        uint256 price = uint256(uint64(priceData.price));
        int32 expo = priceData.expo;
        
        if (expo >= 0) {
            return price * (10 ** uint32(expo)) * 1e18 / 1e8;
        } else {
            return price * 1e18 / (10 ** uint32(-expo)) / 1e8;
        }
    }
    
    function getBTCPrice() public view returns (uint256) {
        PythStructs.Price memory priceData = pyth.getPriceNoOlderThan(BTC_PRICE_ID, PRICE_VALIDITY_PERIOD);
        require(priceData.price > 0, "Invalid BTC price");
        
        uint256 price = uint256(uint64(priceData.price));
        int32 expo = priceData.expo;
        
        if (expo >= 0) {
            return price * (10 ** uint32(expo)) * 1e18 / 1e8;
        } else {
            return price * 1e18 / (10 ** uint32(-expo)) / 1e8;
        }
    }
    
    function getPrice(AssetType assetType) public view returns (uint256) {
        return assetType == AssetType.MUSD ? getMUSDPrice() : getBTCPrice();
    }
    
    // ============ View Functions ============
    
    function getLenderInfo(address lenderAddress) external view returns (
        uint256 musdDeposited,
        uint256 musdShares,
        uint256 musdValue,
        uint256 musdInterest,
        uint256 btcDeposited,
        uint256 btcShares,
        uint256 btcValue,
        uint256 btcInterest
    ) {
        LenderPosition memory lender = lenders[lenderAddress];
        
        musdDeposited = lender.musdDeposited;
        musdShares = lender.musdShares;
        if (pools[AssetType.MUSD].totalShares > 0) {
            musdValue = (musdShares * _getPoolValue(AssetType.MUSD)) / pools[AssetType.MUSD].totalShares;
        }
        musdInterest = lender.musdAccruedInterest + _calculateLenderInterest(lenderAddress, AssetType.MUSD);
        
        btcDeposited = lender.btcDeposited;
        btcShares = lender.btcShares;
        if (pools[AssetType.BTC].totalShares > 0) {
            btcValue = (btcShares * _getPoolValue(AssetType.BTC)) / pools[AssetType.BTC].totalShares;
        }
        btcInterest = lender.btcAccruedInterest + _calculateLenderInterest(lenderAddress, AssetType.BTC);
    }
    
    function getBorrowerInfo(address borrowerAddress) external view returns (
        uint256 musdCollateral,
        uint256 btcCollateral,
        uint256 musdBorrowed,
        uint256 musdDebtInterest,
        uint256 btcBorrowed,
        uint256 btcDebtInterest,
        uint256 healthFactor,
        uint256 totalCollateralUSD,
        uint256 totalDebtUSD
    ) {
        BorrowerAccount memory borrower = borrowers[borrowerAddress];
        
        musdCollateral = borrower.collateral.musdAmount;
        btcCollateral = borrower.collateral.btcAmount;
        
        musdBorrowed = borrower.debt.musdBorrowed;
        musdDebtInterest = borrower.debt.musdAccruedInterest + _calculateBorrowerInterest(borrowerAddress, AssetType.MUSD);
        
        btcBorrowed = borrower.debt.btcBorrowed;
        btcDebtInterest = borrower.debt.btcAccruedInterest + _calculateBorrowerInterest(borrowerAddress, AssetType.BTC);
        
        totalCollateralUSD = _getTotalCollateralValueUSD(borrowerAddress);
        totalDebtUSD = _getTotalDebtValueUSD(borrowerAddress);
        
        healthFactor = totalDebtUSD > 0 ? _calculateHealthFactor(borrowerAddress) : type(uint256).max;
    }
    
    function getPoolInfo(AssetType assetType) external view returns (
        uint256 totalDeposited,
        uint256 totalBorrowed,
        uint256 availableLiquidity,
        uint256 utilizationRate,
        uint256 protocolFees
    ) {
        PoolStats memory pool = pools[assetType];
        totalDeposited = pool.totalDeposited;
        totalBorrowed = pool.totalBorrowed;
        availableLiquidity = _getAvailableLiquidity(assetType);
        utilizationRate = _getUtilizationRate(assetType);
        protocolFees = pool.protocolFees;
    }
    
    function _getAvailableLiquidity(AssetType assetType) internal view returns (uint256) {
        IERC20 token = assetType == AssetType.MUSD ? musdToken : btcToken;
        return token.balanceOf(address(this)) - pools[assetType].protocolFees;
    }
    
    function _getUtilizationRate(AssetType assetType) internal view returns (uint256) {
        PoolStats memory pool = pools[assetType];
        if (pool.totalDeposited == 0) return 0;
        return (pool.totalBorrowed * BASIS_POINTS) / pool.totalDeposited;
    }
    
    // ============ Internal Functions ============
    
    function _getPoolValue(AssetType assetType) internal view returns (uint256) {
        PoolStats memory pool = pools[assetType];
        return pool.totalDeposited + pool.protocolFees;
    }
    
    function _updateLenderInterest(address lenderAddress, AssetType assetType) internal {
        LenderPosition storage lender = lenders[lenderAddress];
        
        if (assetType == AssetType.MUSD && lender.musdDeposited > 0) {
            lender.musdAccruedInterest += _calculateLenderInterest(lenderAddress, AssetType.MUSD);
            lender.musdLastUpdate = block.timestamp;
        } else if (assetType == AssetType.BTC && lender.btcDeposited > 0) {
            lender.btcAccruedInterest += _calculateLenderInterest(lenderAddress, AssetType.BTC);
            lender.btcLastUpdate = block.timestamp;
        }
    }
    
    function _calculateLenderInterest(address lenderAddress, AssetType assetType) internal view returns (uint256) {
        LenderPosition memory lender = lenders[lenderAddress];
        
        if (assetType == AssetType.MUSD && lender.musdDeposited > 0) {
            uint256 timeElapsed = block.timestamp - lender.musdLastUpdate;
            return (lender.musdDeposited * lenderInterestRate * timeElapsed) / (BASIS_POINTS * SECONDS_PER_YEAR);
        } else if (assetType == AssetType.BTC && lender.btcDeposited > 0) {
            uint256 timeElapsed = block.timestamp - lender.btcLastUpdate;
            return (lender.btcDeposited * lenderInterestRate * timeElapsed) / (BASIS_POINTS * SECONDS_PER_YEAR);
        }
        
        return 0;
    }
    
    function _updateBorrowerInterest(address borrowerAddress, AssetType assetType) internal {
        BorrowerAccount storage borrower = borrowers[borrowerAddress];
        
        if (assetType == AssetType.MUSD && borrower.debt.musdBorrowed > 0) {
            borrower.debt.musdAccruedInterest += _calculateBorrowerInterest(borrowerAddress, AssetType.MUSD);
            borrower.debt.musdLastUpdate = block.timestamp;
        } else if (assetType == AssetType.BTC && borrower.debt.btcBorrowed > 0) {
            borrower.debt.btcAccruedInterest += _calculateBorrowerInterest(borrowerAddress, AssetType.BTC);
            borrower.debt.btcLastUpdate = block.timestamp;
        }
    }
    
    function _calculateBorrowerInterest(address borrowerAddress, AssetType assetType) internal view returns (uint256) {
        BorrowerAccount memory borrower = borrowers[borrowerAddress];
        
        if (assetType == AssetType.MUSD && borrower.debt.musdBorrowed > 0) {
            uint256 timeElapsed = block.timestamp - borrower.debt.musdLastUpdate;
            return (borrower.debt.musdBorrowed * borrowInterestRate * timeElapsed) / (BASIS_POINTS * SECONDS_PER_YEAR);
        } else if (assetType == AssetType.BTC && borrower.debt.btcBorrowed > 0) {
            uint256 timeElapsed = block.timestamp - borrower.debt.btcLastUpdate;
            return (borrower.debt.btcBorrowed * borrowInterestRate * timeElapsed) / (BASIS_POINTS * SECONDS_PER_YEAR);
        }
        
        return 0;
    }
    
    function _getTotalCollateralValueUSD(address borrowerAddress) internal view returns (uint256) {
        BorrowerAccount memory borrower = borrowers[borrowerAddress];
        
        uint256 musdValueUSD = (borrower.collateral.musdAmount * getMUSDPrice()) / PRECISION;
        uint256 btcValueUSD = (borrower.collateral.btcAmount * getBTCPrice()) / PRECISION;
        
        return musdValueUSD + btcValueUSD;
    }
    
    function _getTotalDebtValueUSD(address borrowerAddress) internal view returns (uint256) {
        BorrowerAccount memory borrower = borrowers[borrowerAddress];
        
        uint256 musdDebt = borrower.debt.musdBorrowed + borrower.debt.musdAccruedInterest + 
            _calculateBorrowerInterest(borrowerAddress, AssetType.MUSD);
        uint256 btcDebt = borrower.debt.btcBorrowed + borrower.debt.btcAccruedInterest + 
            _calculateBorrowerInterest(borrowerAddress, AssetType.BTC);
        
        uint256 musdDebtUSD = (musdDebt * getMUSDPrice()) / PRECISION;
        uint256 btcDebtUSD = (btcDebt * getBTCPrice()) / PRECISION;
        
        return musdDebtUSD + btcDebtUSD;
    }
    
    function _isHealthy(address borrowerAddress) internal view returns (bool) {
        return _calculateHealthFactor(borrowerAddress) >= PRECISION;
    }
    
    function _calculateHealthFactor(address borrowerAddress) internal view returns (uint256) {
        uint256 totalCollateralUSD = _getTotalCollateralValueUSD(borrowerAddress);
        uint256 totalDebtUSD = _getTotalDebtValueUSD(borrowerAddress);
        
        if (totalDebtUSD == 0) return type(uint256).max;
        
        uint256 maxDebtValue = (totalCollateralUSD * LIQUIDATION_THRESHOLD) / BASIS_POINTS;
        return (maxDebtValue * PRECISION) / totalDebtUSD;
    }
    
    function _transferIn(AssetType assetType, address from, uint256 amount) internal {
        IERC20 token = assetType == AssetType.MUSD ? musdToken : btcToken;
        token.safeTransferFrom(from, address(this), amount);
    }
    
    function _transferOut(AssetType assetType, address to, uint256 amount) internal {
        IERC20 token = assetType == AssetType.MUSD ? musdToken : btcToken;
        token.safeTransfer(to, amount);
    }
    
    // ============ Admin Functions ============
    
    function updateInterestRates(uint256 _borrowRate, uint256 _lenderRate) external onlyRole(ADMIN_ROLE) {
        require(_borrowRate >= _lenderRate, "Borrow rate must be >= lender rate");
        require(_borrowRate <= 5000, "Borrow rate too high"); // Max 50%
        
        borrowInterestRate = _borrowRate;
        lenderInterestRate = _lenderRate;
        protocolFee = _borrowRate - _lenderRate;
        
        emit InterestRatesUpdated(_borrowRate, _lenderRate);
    }
    
    function approveBorrower(address borrower) external onlyRole(ADMIN_ROLE) {
        grantRole(APPROVED_BORROWER_ROLE, borrower);
    }
    
    function revokeBorrower(address borrower) external onlyRole(ADMIN_ROLE) {
        revokeRole(APPROVED_BORROWER_ROLE, borrower);
    }
    
    function collectProtocolFees(AssetType assetType) external onlyRole(ADMIN_ROLE) {
        uint256 amount = pools[assetType].protocolFees;
        require(amount > 0, "No fees to collect");
        
        pools[assetType].protocolFees = 0;
        _transferOut(assetType, treasury, amount);
        
        emit ProtocolFeesCollected(assetType, amount);
    }
    
    function updateTreasury(address newTreasury) external onlyRole(ADMIN_ROLE) {
        require(newTreasury != address(0), "Invalid treasury");
        treasury = newTreasury;
    }
    
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }
    
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }
}