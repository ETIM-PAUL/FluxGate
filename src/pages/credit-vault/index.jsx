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


const CreditVault = () => {
  
  
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

  const handleGetOutput = async (amountIn) => {
    if (selectedChoice?.id === "1") {
      setAmountBTC(amountIn);
    } else {
      setAmountMUSD(amountIn);
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
        <title>BTC/MUSD Credit Vault - Flux Gate</title>
        <meta name="description" content="Deposit MUSD or BTC to earn lending interest while backing institutional credit lines secured by crypto collateral." />
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
                  BTC/MUSD Credit Vault - Flux Gate
                  </h1>
                  <p className="text-muted-foreground">
                  Deposit MUSD or BTC to earn lending interest while backing institutional credit lines secured by crypto collateral.
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="TrendingUp" size={16} className="text-success" />
                    <span className="text-sm text-muted-foreground">Best APY</span>
                  </div>
                  <span className="text-2xl font-bold text-foreground font-data">3.24%</span>
                </div>
                
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="DollarSign" size={16} className="text-accent" />
                    <span className="text-sm text-muted-foreground">Total TVL</span>
                  </div>
                  <span className="text-2xl font-bold text-foreground">$12.7M</span>
                </div>
                
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Users" size={16} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Active Vaults</span>
                  </div>
                  <span className="text-2xl font-bold text-foreground">1</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Input & Protocol Selection */}
              <div className="lg:col-span-2 space-y-6">

                {/* Protocol Selection */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground font-heading">
                      Select Asset for Earning Interest
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {[
                      {
                        id: "1",
                        name: "BTC Deposit",
                        description: "Deposit BTC to earn passive lending interest",
                        icon: "Rocket",
                      },
                      {
                        id: "2",
                        name: "MUSD Deposit",
                        description: "Deposit MUSD to earn passive lending interest",
                        icon: "Rocket",
                      },
                    ]?.map((choice,index) => (
                      <ChoiceSelectionCard
                        key={index}
                        choice={choice}
                        btcPrice={btcPrice}
                        isConnected={isConnected}
                        amount={amountBTC}
                        amountMUSD={amountMUSD}
                        onAmountChange={handleGetOutput}
                        isSelected={selectedChoice?.id === choice?.id}
                        selectedChoice={selectedChoice}
                        onSelect={handleSelectedChoice}
                        musdBalance={musdBalance?.data?.formatted}
                        btcBalance={btcBalance?.data?.formatted}
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

export default CreditVault;
