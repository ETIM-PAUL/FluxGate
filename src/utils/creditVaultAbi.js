export const CreditVaultABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_musdToken",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_btcToken",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_pythContract",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_treasury",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "AccessControlBadConfirmation",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "internalType": "bytes32",
                "name": "neededRole",
                "type": "bytes32"
            }
        ],
        "name": "AccessControlUnauthorizedAccount",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "EnforcedPause",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ExpectedPause",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ReentrancyGuardReentrantCall",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            }
        ],
        "name": "SafeERC20FailedOperation",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "borrower",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "enum FlexibleCreditVault.AssetType",
                "name": "assetType",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "Borrowed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "borrower",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "enum FlexibleCreditVault.AssetType",
                "name": "assetType",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "CollateralAdded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "borrower",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "enum FlexibleCreditVault.AssetType",
                "name": "collateralType",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "collateralAmount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "enum FlexibleCreditVault.AssetType",
                "name": "borrowType",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "borrowAmount",
                "type": "uint256"
            }
        ],
        "name": "CollateralAndBorrow",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "borrower",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "enum FlexibleCreditVault.AssetType",
                "name": "assetType",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "CollateralWithdrawn",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "lender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "enum FlexibleCreditVault.AssetType",
                "name": "assetType",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "shares",
                "type": "uint256"
            }
        ],
        "name": "Deposited",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "lender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "enum FlexibleCreditVault.AssetType",
                "name": "assetType",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "InterestClaimed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "borrowRate",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "lenderRate",
                "type": "uint256"
            }
        ],
        "name": "InterestRatesUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "borrower",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "liquidator",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "debtAmount",
                "type": "uint256"
            }
        ],
        "name": "Liquidated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "borrower",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "enum FlexibleCreditVault.AssetType",
                "name": "assetType",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "principal",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "interest",
                "type": "uint256"
            }
        ],
        "name": "LoanRepaid",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "Paused",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "enum FlexibleCreditVault.AssetType",
                "name": "assetType",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "ProtocolFeesCollected",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "previousAdminRole",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "newAdminRole",
                "type": "bytes32"
            }
        ],
        "name": "RoleAdminChanged",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "sender",
                "type": "address"
            }
        ],
        "name": "RoleGranted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "sender",
                "type": "address"
            }
        ],
        "name": "RoleRevoked",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "Unpaused",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "lender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "enum FlexibleCreditVault.AssetType",
                "name": "assetType",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "shares",
                "type": "uint256"
            }
        ],
        "name": "Withdrawn",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "ADMIN_ROLE",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "APPROVED_BORROWER_ROLE",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "BASIS_POINTS",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "BTC_PRICE_ID",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "DEFAULT_ADMIN_ROLE",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "LIQUIDATION_BONUS",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "LIQUIDATION_THRESHOLD",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "MAX_LTV",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "MUSD_PRICE_ID",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "PRECISION",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "PRICE_VALIDITY_PERIOD",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "SECONDS_PER_YEAR",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "enum FlexibleCreditVault.AssetType",
                "name": "assetType",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "addCollateral",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "borrower",
                "type": "address"
            }
        ],
        "name": "approveBorrower",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "enum FlexibleCreditVault.AssetType",
                "name": "assetType",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "borrow",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "borrowInterestRate",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "borrowers",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "musdAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "btcAmount",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct FlexibleCreditVault.CollateralPosition",
                "name": "collateral",
                "type": "tuple"
            },
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "musdBorrowed",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "musdAccruedInterest",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "musdLastUpdate",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "btcBorrowed",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "btcAccruedInterest",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "btcLastUpdate",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct FlexibleCreditVault.DebtPosition",
                "name": "debt",
                "type": "tuple"
            },
            {
                "internalType": "bool",
                "name": "isActive",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "btcToken",
        "outputs": [
            {
                "internalType": "contract IERC20",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "enum FlexibleCreditVault.AssetType",
                "name": "assetType",
                "type": "uint8"
            }
        ],
        "name": "claimInterest",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "enum FlexibleCreditVault.AssetType",
                "name": "assetType",
                "type": "uint8"
            }
        ],
        "name": "collectProtocolFees",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "enum FlexibleCreditVault.AssetType",
                "name": "assetType",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "deposit",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "enum FlexibleCreditVault.AssetType",
                "name": "collateralType",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "collateralAmount",
                "type": "uint256"
            },
            {
                "internalType": "enum FlexibleCreditVault.AssetType",
                "name": "borrowType",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "borrowAmount",
                "type": "uint256"
            }
        ],
        "name": "depositCollateralAndBorrow",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getBTCPrice",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "borrowerAddress",
                "type": "address"
            }
        ],
        "name": "getBorrowerInfo",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "musdCollateral",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "btcCollateral",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "musdBorrowed",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "musdDebtInterest",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "btcBorrowed",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "btcDebtInterest",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "healthFactor",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "totalCollateralUSD",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "totalDebtUSD",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "lenderAddress",
                "type": "address"
            }
        ],
        "name": "getLenderInfo",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "musdDeposited",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "musdShares",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "musdValue",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "musdInterest",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "btcDeposited",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "btcShares",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "btcValue",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "btcInterest",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getMUSDPrice",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "enum FlexibleCreditVault.AssetType",
                "name": "assetType",
                "type": "uint8"
            }
        ],
        "name": "getPoolInfo",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "totalDeposited",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "totalBorrowed",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "availableLiquidity",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "utilizationRate",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "protocolFees",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "enum FlexibleCreditVault.AssetType",
                "name": "assetType",
                "type": "uint8"
            }
        ],
        "name": "getPrice",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            }
        ],
        "name": "getRoleAdmin",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "grantRole",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "hasRole",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "lenderInterestRate",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "lenders",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "musdDeposited",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "musdShares",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "musdLastUpdate",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "musdAccruedInterest",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "btcDeposited",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "btcShares",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "btcLastUpdate",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "btcAccruedInterest",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "borrowerAddr",
                "type": "address"
            },
            {
                "internalType": "enum FlexibleCreditVault.AssetType",
                "name": "debtAsset",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "debtAmt",
                "type": "uint256"
            },
            {
                "internalType": "enum FlexibleCreditVault.AssetType",
                "name": "collAsset",
                "type": "uint8"
            }
        ],
        "name": "liquidate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "musdToken",
        "outputs": [
            {
                "internalType": "contract IERC20",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "pause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "paused",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "enum FlexibleCreditVault.AssetType",
                "name": "",
                "type": "uint8"
            }
        ],
        "name": "pools",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "totalDeposited",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "totalBorrowed",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "totalShares",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "protocolFees",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "protocolFee",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "pyth",
        "outputs": [
            {
                "internalType": "contract IPyth",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "callerConfirmation",
                "type": "address"
            }
        ],
        "name": "renounceRole",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "enum FlexibleCreditVault.AssetType",
                "name": "assetType",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "repay",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "borrower",
                "type": "address"
            }
        ],
        "name": "revokeBorrower",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "revokeRole",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes4",
                "name": "interfaceId",
                "type": "bytes4"
            }
        ],
        "name": "supportsInterface",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "treasury",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "unpause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_borrowRate",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_lenderRate",
                "type": "uint256"
            }
        ],
        "name": "updateInterestRates",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newTreasury",
                "type": "address"
            }
        ],
        "name": "updateTreasury",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "enum FlexibleCreditVault.AssetType",
                "name": "assetType",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "shares",
                "type": "uint256"
            }
        ],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "enum FlexibleCreditVault.AssetType",
                "name": "assetType",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "withdrawCollateral",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]