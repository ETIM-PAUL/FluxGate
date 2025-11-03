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
import { AssetType, BTC_ADDR, FACTORY_ADDR, MUSD_ADDR, ROUTER_ADDR } from '../../utils/cn';
import { useBTCPrice } from '../wallet/getBTCPrice';
import { getAmountsOut } from '../../calls/getAmountsOutput';
import { formatUnits, parseUnits } from 'viem';
import { swapBTCToMUSD } from '../../calls/swapBTCToMUSD';
import toast from 'react-hot-toast';
import { quoteAddLiquidity } from '../../calls/quoteAddLiquidity';
import { provideLiquidity } from '../../calls/provideLiquidity';
import { useNavigate } from 'react-router-dom';
import { processLendingInterest } from '../../calls/processLendingInterest';
import { getMusdPrice } from '../../calls/getMusdPrice';
import { useEffect } from 'react';
import { getCreditVaultInfo } from '../../calls/getCreditVaultInfo';


const CreditVault = () => {
  
  
  const [amount, setAmount] = useState('');
  const [amountBTC, setAmountBTC] = useState('');
  const [amountMUSD, setAmountMUSD] = useState('');
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState([]);
  const [txHash, setTxHash] = useState("");
  const [getingSharesOutput, setGettingSharesOutput] = useState(false);
  const [showTransactionStatus, setShowTransactionStatus] = useState(false);
  const [sharesOutput, setSharesOutput] = useState([]);
  const [musdPrice, setMusdPrice] = useState(null);
  const [usdBtcValue, setUsdBtcValue] = useState('0.00');
  const [usdMusdValue, setUsdMusdValue] = useState('0.00');
  const [vaultInfo, setVaultInfo] = useState(null);
  
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

  const handleSelectedChoice = (choice) => {
    setSelectedChoice(choice);
    setAmountMUSD('');
    setAmountBTC('');
    setSharesOutput([]);
  };

  const handleGetOutput = async (amountIn) => {
    if (selectedChoice?.id === "1") {
      setAmountBTC(amountIn);
      const usdAmount = parseFloat(amountIn) * (selectedChoice?.id === "1" ? btcPrice : musdPrice)
      setUsdBtcValue(usdAmount);
    } else {
      setAmountMUSD(amountIn);
      const usdAmount = parseFloat(amountIn) * (selectedChoice?.id === "1" ? btcPrice : musdPrice)
      setUsdMusdValue(usdAmount);
    }
  };
  const handleGetMUSDPrice = async () => {
    const out = await getMusdPrice({
      rpcUrl: "https://rpc.test.mezo.org", // e.g., Avalanche, Mezo, etc.
    });
    setMusdPrice(formatUnits(out, 18))
  };
  const handleGetVaultInfo = async () => {
    const out = await getCreditVaultInfo({
      rpcUrl: "https://rpc.test.mezo.org", // e.g., Avalanche, Mezo, etc.
    });
    setVaultInfo(out)
  };


  const handleLendingInterest = async () => {
    if (Number(amountBTC) <= 0 && Number(amountMUSD) <= 0) {
      toast.error("Please enter a valid amount for both BTC and MUSD");
      return;
    }
    if (!selectedChoice?.id) {
      toast.error("Please select a choice");
      return;
    }
    setIsProcessing(true);
    // setShowTransactionStatus(true);
    try {
      if (selectedChoice?.id === "1") {
        const tx = await processLendingInterest(parseUnits(amountBTC.toString(), 18), AssetType?.BTC);
        setStatus([...status, "depositedToPool"]);
        setTimeout(() => {
          setStatus([...status], "completed");
          setTxHash(tx.hash)
          toast.success("Lending Interest Position Active")
        }, 1500);
        handleGetVaultInfo();
        setIsProcessing(false);
      } else {
        const tx = await processLendingInterest(parseUnits(amountMUSD.toString(), 18), AssetType?.MUSD);
        setStatus([...status, "depositedToPool"]);
        setTimeout(() => {
          setStatus([...status], "completed");
          setTxHash(tx.hash)
          toast.success("Lending Interest Position Active")
        }, 1500);
        handleGetVaultInfo();
        setIsProcessing(false);
      }
    } catch (error) { 
      // setShowTransactionStatus(false);
      setIsProcessing(false);
      setStatus([]);
      console.error("Error depositing Assets:", error);
    }
  };

  useEffect(() => {
    handleGetMUSDPrice();
    handleGetVaultInfo();
  }, [])
  

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
                    <span className="text-sm text-muted-foreground">BTC Liquidity</span>
                  </div>
                  <span className="text-2xl font-bold text-foreground font-data">{formatUnits(vaultInfo?.btcInfo[2] ?? 0, 18)} BTC</span>
                </div>
                
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="DollarSign" size={16} className="text-accent" />
                    <span className="text-sm text-muted-foreground">MUSD Liquidity</span>
                  </div>
                  <span className="text-2xl font-bold text-foreground font-data">{formatUnits(vaultInfo?.musdInfo[2] ?? 0, 18)} MUSD</span>
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
                        musdPrice={musdPrice}
                        usdBtcValue={usdBtcValue}
                        usdMusdValue={usdMusdValue}
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
                  onDeposit={() => handleLendingInterest()}
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
