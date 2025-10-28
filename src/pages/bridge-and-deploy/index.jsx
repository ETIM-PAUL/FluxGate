import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import TransactionStatusOverlay from '../../components/ui/TransactionStatusOverlay';
import BridgeInputPanel from './components/BridgeInputPanel';
import ProtocolSelectionCard from './components/ProtocolSelectionCard';
import TransactionPreviewPanel from './components/TransactionPreviewPanel';
import Icon from '../../components/AppIcon';
import { useGlobal } from '../../context/global';


const BridgeAndDeploy = () => {
  
  const {
    isWalletConnected, 
    handleGetWBTCBal,
    walletAddress,
    starknetAddress,
    btcBalance,
    protocols,
    btcPrice
  } = useGlobal();
  
  
  const [amount, setAmount] = useState('');
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const [selectedPool, setSelectedPool] = useState(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [getingAtomiqOutput, setGettingAtomiqOutput] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [showTransactionStatus, setShowTransactionStatus] = useState(false);
  const [transactionData, setTransactionData] = useState(null);
  const [atomiqOutput, setAtomiqOutput] = useState(null);
  const [walletAccount, setWalletAccount] = useState(null);
  


  const handleTransactionClose = () => {
    setShowTransactionStatus(false);
    setTransactionData(null);
    setAmount('');
    setSelectedProtocol(null);
  };

  const handlePoolSelect = (pool) => {
    setSelectedPool(pool);
  };

  return (
    <>
      <Helmet>
        <title>Bridge & Deploy - Bitcoin Yield Shuttle</title>
        <meta name="description" content="Bridge your Bitcoin to Starknet and deploy to yield protocols with one click" />
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
                    Bridge & Deploy
                  </h1>
                  <p className="text-muted-foreground">
                    Convert your Bitcoin to yield-generating positions in one click
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
                    <span className="text-sm text-muted-foreground">Active Pools/Strategies</span>
                  </div>
                  <span className="text-2xl font-bold text-foreground">3</span>
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
                  onAmountChange={setAmount}
                  walletBalance={btcBalance}
                  isWalletConnected={true}
                />

                {/* Protocol Selection */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground font-heading">
                      Select Yield Protocol
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Icon name="Shield" size={16} />
                      <span>All protocols audited</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {protocols?.map((protocol,index) => (
                      <ProtocolSelectionCard
                        key={index}
                        protocol={protocol}
                        isSelected={selectedProtocol?.id === protocol?.id}
                        isSelectedPool={selectedPool}
                        selectedProtocol={selectedProtocol}
                        onSelect={setSelectedProtocol}
                        setSelectedPool={setSelectedPool}
                        onSelectPool={handlePoolSelect}
                      />
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column - Transaction Preview */}
              <div className="space-y-6">
                <TransactionPreviewPanel
                  amount={amount}
                  atomiqOutput={atomiqOutput}
                  getingAtomiqOutput={getingAtomiqOutput}
                  selectedProtocol={selectedProtocol}
                  selectedPool={selectedPool}
                  onDeploy={() => console.log("done")}
                  isDeploying={isDeploying}
                />

                {/* Security Notice */}
                <div className="bg-muted/50 border border-border rounded-lg p-4">
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

                {/* Protocol Comparison */}
                <div className="bg-card border border-border rounded-lg p-4">
                  <h4 className="text-sm font-medium text-foreground mb-3">
                    Protocol Comparison
                  </h4>

                  {protocols &&
                    <div className="space-y-2">
                      {protocols?.map((protocol) => (
                        <div key={protocol?.id} className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{protocol?.name}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-foreground font-medium">{protocol?.apy}%</span>
                            <span className={`px-1.5 py-0.5 rounded text-xs ${
                              protocol?.risk === 'Low' ? 'bg-success/10 text-success' :
                              protocol?.risk === 'Medium'? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'
                            }`}>
                              {protocol?.risk}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Transaction Status Overlay */}
        <TransactionStatusOverlay
          isVisible={showTransactionStatus}
          onClose={handleTransactionClose}
          transactionData={transactionData}
          completedSteps={completedSteps}
        />
      </div>
    </>
  );
};

export default BridgeAndDeploy;
