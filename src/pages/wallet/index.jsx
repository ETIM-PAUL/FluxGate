import React, { useState, useEffect } from 'react'
import Icon from '../../components/AppIcon'
import Button from '../../components/ui/Button'
import { useGlobal } from '../../context/global'
import { Helmet } from 'react-helmet'
import Header from '../../components/ui/Header'
import toast from 'react-hot-toast'
import { formatUnits } from 'viem'
import { useAccount, useBalance } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { MUSD_ADDR } from '../../utils/cn'
import { getLiquidityBal } from '../../calls/getLiquidityBal'

const WalletSection = () => {
  const {
    isWalletConnected,
    isInstalled,
    isConnecting,
    walletAddress,
    wBTCBalance,
  } = useGlobal();

  const [isLoading, setIsLoading] = useState(false);
  const [bridging, setBridging] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const [redeemAmount, setRedeemAmount] = useState('');
  const [selectedPercentage, setSelectedPercentage] = useState(100);
  const [poolBalance, setPoolBalance] = useState(null);
  
  const [mezoVaultData, setMezoVaultData] = useState({
    deposits: { primeAssetsVal:0, assetsVal: 0, amount: '0' },
    withdrawals: { count: 0, amount: '0' },
    redemptions: { count: 0, amount: '0' },
    balance: '0',
    primeVesuBalance: '0'
  });

  const fetchBal = async () => {
    await getLiquidityBal(address).then((res) => setPoolBalance(res))
  }

  useEffect(() => {
    if (isConnected) {
      fetchBal();
    }
  }, [])
  


  const shortenAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-muted rounded-lg"></div>
          <div>
            <div className="h-5 bg-muted rounded w-32 mb-2"></div>
            <div className="h-3 bg-muted rounded w-24"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-surface border border-border rounded-lg p-4">
              <div className="h-3 bg-muted rounded w-16 mb-2"></div>
              <div className="h-4 bg-muted rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );


  // Handle percentage selection
  const handlePercentageSelect = (percentage) => {
    setSelectedPercentage(percentage);
    const currentBalance = parseFloat(wBTCBalance || '0');
    const amount = (currentBalance * percentage / 100).toFixed(8);
    setRedeemAmount(amount);
  };


  // Close modal
  const handleCloseModal = () => {
    setShowRedeemModal(false);
    setSelectedProtocol(null);
    setRedeemAmount('');
    setSelectedPercentage(100);
  };

  const { address, isConnected } = useAccount();
  const btcBalance = useBalance({ address });
  const musdBalance = useBalance({ address, token: MUSD_ADDR })



  if (!isConnected) {
    return (
      <div>
        <Helmet>
          <title>Portfolio - Flux Gate</title>
          <meta name="description" content="View your portfolio balances" />
        </Helmet>

        <Header />

        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="w-full max-w-lg bg-card border border-border rounded-xl p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <Icon name="Wallet" size={24} className="text-accent" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Connect your wallet</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Connect your wallet to view your portfolio balances.
            </p>
            { (
              <ConnectButton/>
            )}
            <div className="mt-4 text-xs text-muted-foreground">
              By connecting, you agree to the platform terms and acknowledge risk in DeFi.
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Portfolio - Flux Gate</title>
        <meta name="description" content="View your portfolio balances" />
      </Helmet>

      <Header />
      <div className="px-4 mt-44">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Wallet Info Card */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Icon name="Wallet" size={20} className="text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Your Wallet</h3>
                  <p className="text-xs text-muted-foreground">Connected via Mezo Passport</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-surface border border-border rounded-lg p-4">
                <div className="text-xs text-muted-foreground mb-1">Address</div>
                <div className="flex items-center space-x-2">
                  <Icon name="Link" size={16} className="text-muted-foreground" />
                  <span className="text-sm font-mono text-foreground">{shortenAddress(address)}</span>
                </div>
              </div>

              <div className="bg-surface border border-border rounded-lg p-4">
                <div className="text-xs text-muted-foreground mb-1">BTC Balance</div>
                <div className="flex items-center space-x-2">
                  <Icon name="Bitcoin" size={16} className="text-orange-500" />
                  <span className="text-sm font-data text-foreground">{Number(btcBalance?.data?.formatted).toFixed(2) ?? '0.00000000'} BTC</span>
                </div>
              </div>

              <div className="bg-surface border border-border rounded-lg p-4">
                <div className="text-xs text-muted-foreground mb-1">Mezo USD (MUSD) Balance</div>
                <div className="flex items-center space-x-2">
                  <Icon name="Coins" size={16} className="text-accent" />
                  <span className="text-sm font-data text-foreground">{Number(musdBalance?.data?.formatted).toFixed(2) ?? '-'}</span>
                  <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowRedeemModal(true)}
                      className="text-xs w-fit p-2 cursor-pointer h-fit"
                    >
                      {bridging ? "Swapping" : "Swap to BTC"}
                    </Button>
                </div>
                <div className="mt-1 text-[10px] text-muted-foreground hidden">Shown after bridging</div>
              </div>
            </div>
          </div>

          {/* Protocol Sections */}
          {isLoading ? (
            <div className="space-y-6">
              <LoadingSkeleton />
              <LoadingSkeleton />
            </div>
          ) : (
            <div className="space-y-6">

          <div className="bg-muted/50 border border-border rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={18} className="text-muted-foreground mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Assets across Mezo Network.
              </p>
            </div>
          </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <Icon name="TrendingUp" size={20} className="text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Mezo MUSD/BTC Pool</h3>
                      <p className="text-xs text-muted-foreground">Automated vault farming</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-foreground">{poolBalance}</div>
                    <div className="text-xs text-muted-foreground">vAMM-MUSD/BTC</div>
                  </div>
                </div>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <Icon name="TrendingUp" size={20} className="text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Mezo Lending Market</h3>
                      <p className="text-xs text-muted-foreground">Automated lending protocol</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-foreground">{3}</div>
                    <div className="text-xs text-muted-foreground">vAMM-MUSD/BTC</div>
                  </div>
                </div>
              </div>
            </div>
          )}

         
        </div>
      </div>

      {/* Redeem Confirmation Modal */}
      {showRedeemModal && (
        <div className="fixed inset-0 z-10 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-gray-700 border border-border rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Redeem {selectedProtocol?.name}</h3>
              <button
                onClick={handleCloseModal}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-surface border border-border rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-2">Available Balance</div>
                <div className="text-lg font-semibold text-foreground">{wBTCBalance} WBTC</div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Select Percentage
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[25, 50, 75, 100].map((percentage) => (
                    <Button
                      key={percentage}
                      variant={selectedPercentage === percentage ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePercentageSelect(percentage)}
                      className="text-xs"
                    >
                      {percentage}%
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Amount to Swap
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={redeemAmount}
                    onChange={(e) => setRedeemAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="0.00000000"
                    step="0.00000001"
                    min="0"
                    max={selectedProtocol?.balance}
                  />
                  <div className="absolute right-3 top-2 text-sm text-muted-foreground">WBTC</div>
                </div>
              </div>

              <div className="bg-muted/50 border border-border rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <Icon name="Info" size={16} className="text-muted-foreground mt-0.5" />
                  <div className="text-xs text-muted-foreground">
                    <p className="mb-1">You will receive BTC tokens in your wallet.</p>
                    <p>This action cannot be undone.</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={handleCloseModal}
                  className="flex-1 cursor-pointer"
                  disabled={bridging}
                >
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  onClick={handleBridgingWBTC2BTC}
                  className="flex-1 cursor-pointer"
                  loading={bridging}
                  disabled={!wBTCBalance || parseFloat(wBTCBalance) <= 0}
                >
                  {bridging ? 'Swapping...' : 'Confirm Swap'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default WalletSection