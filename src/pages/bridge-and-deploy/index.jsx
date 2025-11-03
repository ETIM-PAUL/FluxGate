import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import TransactionStatusOverlay from '../../components/ui/TransactionStatusOverlay';
import BridgeInputPanel from './components/BridgeInputPanel';
import TransactionPreviewPanel from './components/TransactionPreviewPanel';
import Icon from '../../components/AppIcon';
import { useGlobal } from '../../context/global';
import ChoiceSelectionCard from './components/ChoiceSelectionCard';
import { useAccount, useBalance } from 'wagmi';
import { BTC_ADDR, FACTORY_ADDR, MUSD_ADDR, ROUTER_ADDR } from '../../utils/cn';
import { useBTCPrice } from '../wallet/getBTCPrice';
import { getAmountsOut } from '../../calls/getAmountsOutput';
import { formatUnits, parseUnits } from 'viem';
import { swapBTCToMUSD } from '../../calls/swapBTCToMUSD';
import toast from 'react-hot-toast';
import { quoteAddLiquidity } from '../../calls/quoteAddLiquidity';
import { provideLiquidity } from '../../calls/provideLiquidity';
import { useNavigate } from 'react-router-dom';


const BridgeAndDeploy = () => {
  
  
  const [amount, setAmount] = useState('');
  const [amountBTC, setAmountBTC] = useState('');
  const [amountMUSD, setAmountMUSD] = useState('');
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState([]);
  const [txHash, setTxHash] = useState("");
  const [getingSharesOutput, setGettingSharesOutput] = useState(false);
  const [getingSwapOutput, setGettingSwapOutput] = useState(false);
  const [showTransactionStatus, setShowTransactionStatus] = useState(false);
  const [sharesOutput, setSharesOutput] = useState([]);
  const [swappedMUSDAmount, setSwappedMUSDAmount] = useState(null);
  
  const { address, isConnected } = useAccount();
  const btcBalance = useBalance({ address });
  const btcPrice = useBTCPrice();
  const navigate = useNavigate();
  const musdBalance = useBalance({ address, token: MUSD_ADDR })

  const handleTransactionClose = () => {
    setAmount('');
    setAmountMUSD('');
    setAmountBTC('')
    navigate("/wallet")
    setStatus([])
  };

  const handleAmountSet = (amount) => {
    setAmount(amount);
    handleQuoteAddLiquidity(amountMUSD, amount);
  };
  
  const handleSelectedChoice = (choice) => {
    setSelectedChoice(choice);
    setAmountMUSD('');
    setAmountBTC('');
    setSharesOutput([]);
  };

  const handleGetOutputForSwapping = async (amountIn) => {
    setAmountBTC(amountIn);
    if (Number(amountIn) <= 0) {
      setSwappedMUSDAmount(null);
      return;
    }
    setGettingSwapOutput(true);
    try {
      const out = await getAmountsOut({
        router: ROUTER_ADDR,
        amountIn: parseUnits(amountIn.toString(), 18), // 1 token with 18 decimals
        routes: [
          {
            from: BTC_ADDR,
            to: MUSD_ADDR,
            stable: false,
            factory: FACTORY_ADDR,
          },
        ],
        rpcUrl: "https://rpc.test.mezo.org", // e.g., Avalanche, Mezo, etc.
      });
      
      
      setSwappedMUSDAmount(Number(formatUnits(out[1], 18)).toFixed(3));
      setGettingSwapOutput(false);
      handleQuoteAddLiquidity(Number(formatUnits(out[1], 18)), amount);
    } catch (error) {
      setGettingSwapOutput(false);
      console.error("Error getting amount out for BTC to MUSD:", error);
    }
  };

  const handleQuoteAddLiquidity = async (amountMusd, amountBTC) => {
    setAmountMUSD(amountMusd);
    let amount_musd;

    amount_musd = amountMusd

    if (Number(amountBTC ?? amount) <= 0 || Number(amount_musd) <= 0) {
      return;
    }
    setGettingSharesOutput(true);
    try {
      const out = await quoteAddLiquidity({
        amountMUSD: parseUnits(amount_musd.toString(), 18),
        amountBTC: parseUnits((amountBTC ?? amount).toString(), 18),
      });
      
      setSharesOutput(out);
      setGettingSharesOutput(false);
    } catch (error) {
      setGettingSharesOutput(false);
      console.error("Error getting amount out for BTC to MUSD:", error);
    }
  };

  const handleAddLiquidity = async () => {
    if (Number(amount) <= 0) {
      toast.error("Please enter BTC amount");
      return;
    }
    if (!selectedChoice?.id) {
      toast.error("Please select a choice");
      return;
    }
    if ((Number(amount) <= 0 || Number(swappedMUSDAmount) <= 0) && selectedChoice?.id === "1") {
      toast.error("Please enter a valid amount for both BTC and MUSD");
      return;
    }
    if ((Number(amount) <= 0 || Number(amountMUSD) <= 0) && selectedChoice?.id === "2") {
      toast.error("Please enter a valid amount for both BTC and MUSD");
      return;
    }
    setIsProcessing(true);
    setShowTransactionStatus(true);
    try {
      if (selectedChoice?.id === "1") {
        await swapBTCToMUSD(parseUnits(amountBTC.toString(), 18), address);
        setStatus([...status, "swapped"]);
        const tx2 = await provideLiquidity(parseUnits(amount.toString(), 18), parseUnits(swappedMUSDAmount.toString(), 18), address);
        setStatus([...status, "depositedToPool"]);
        setTimeout(() => {
          setStatus([...status], "completed");
          setTxHash(tx2.hash)
          toast.success("Liquidity Shares Active")
        }, 1500);
      } else {
        const tx2 = await provideLiquidity(parseUnits(amount.toString(), 18), parseUnits(amountMUSD.toString(), 18), address);
        setStatus([...status, "depositedToPool"]);
        setTimeout(() => {
          setStatus([...status], "completed");
          setTxHash(tx2.hash)
          toast.success("Liquidity Shares Active")
        }, 1500);
      }
    } catch (error) { 
      setShowTransactionStatus(false);
      setIsProcessing(false);
      setStatus([]);
      console.error("Error depositing Assets:", error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Swap & Invest - Flux Gate</title>
        <meta name="description" content="Swap your Bitcoin to MUSD and invest in yield-generating vaults with one click" />
      </Helmet>
      <div className="min-h-screen z-10 bg-background">
        <Header />
        
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Icon name="Rocket" size={24} className="text-accent" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground font-heading">
                    Swap & Invest - Flux Gate
                  </h1>
                  <p className="text-muted-foreground">
                  Swap your Bitcoin to MUSD and invest in Volatile AMM - MUSD/BTC Pool with one click
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="TrendingUp" size={16} className="text-success" />
                    <span className="text-sm text-muted-foreground">Assets</span>
                  </div>
                  <span className="text-2xl font-bold text-foreground font-data">2</span>
                </div>
                
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="DollarSign" size={16} className="text-accent" />
                    <span className="text-sm text-muted-foreground">Total Reserves</span>
                  </div>
                  <span className="text-2xl font-bold text-foreground">$12.7M</span>
                </div>
                
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Users" size={16} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Active Pools</span>
                  </div>
                  <span className="text-2xl font-bold text-foreground">1</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Input & Protocol Selection */}
              <div className="lg:col-span-2 space-y-6">
                {/* Bridge Input Panel */}
                <BridgeInputPanel
                  amount={amount}
                  btcPrice={btcPrice}
                  onAmountChange={handleAmountSet}
                  walletBalance={btcBalance?.data?.formatted}
                  isWalletConnected={isConnected}
                />

                {/* Protocol Selection */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground font-heading">
                      Select Choice for MUSD Asset
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {[
                      {
                        id: "1",
                        name: "BTC to MUSD and Deposit",
                        description: "Swap BTC to MUSD and deposit to the vault",
                        icon: "Rocket",
                      },
                      {
                        id: "2",
                        name: "MUSD/BTC Deposit from Wallet",
                        description: "Deposit MUSD into vault directly from my wallet balance",
                        icon: "Rocket",
                      },
                    ]?.map((choice,index) => (
                      <ChoiceSelectionCard
                        key={index}
                        choice={choice}
                        amount={amountBTC}
                        amountMUSD={amountMUSD}
                        onAmountChange={handleGetOutputForSwapping}
                        onMUSDAmountChange={handleQuoteAddLiquidity}
                        isSelected={selectedChoice?.id === choice?.id}
                        selectedChoice={selectedChoice}
                        onSelect={handleSelectedChoice}
                        swappedMUSDAmount={swappedMUSDAmount}
                        musdBalance={musdBalance}
                        btcBalance={btcBalance?.data?.formatted}
                        getingSwapOutput={getingSwapOutput}
                      />
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column - Transaction Preview */}
              <div className="space-y-6">
                <TransactionPreviewPanel
                  amount={amount}
                  sharesOutput={sharesOutput}
                  getingSharesOutput={getingSharesOutput}
                  selectedChoice={selectedChoice}
                  onDeposit={() => handleAddLiquidity()}
                  isDepositing={isProcessing}
                />

                {/* Security Notice */}
                <div className="bg-muted/50 border border-border rounded-lg p-4 hidden">
                  <div className="flex items-start space-x-3">
                    <Icon name="Shield" size={20} className="text-accent mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">
                        Security Features
                      </h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Non-Custodial Architecture</li>
                        <li>• Smart contract audit verification</li>
                        <li>• Real-time risk monitoring</li>
                        <li>• Layer 2 Security Inheritance</li>
                        <li>• Trustless Cross-Chain Bridge</li>
                      </ul>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </main>

        {/* Transaction Status Overlay */}
        <TransactionStatusOverlay
          isVisible={showTransactionStatus}
          onClose={handleTransactionClose}
          status={status}
          tx={txHash}
          selectedChoice={selectedChoice}
        />
      </div>
    </>
  );
};

export default BridgeAndDeploy;
