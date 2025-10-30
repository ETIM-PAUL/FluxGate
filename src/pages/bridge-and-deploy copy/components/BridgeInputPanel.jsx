import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const BridgeInputPanel = ({ 
  amount, 
  btcPrice,
  onAmountChange, 
  walletBalance = '0.12345678',
  isWalletConnected = true 
}) => {
  const [usdValue, setUsdValue] = useState('0.00');

  useEffect(() => {
    if (amount && !isNaN(amount)) {
      const usdAmount = (parseFloat(amount) * btcPrice)?.toFixed(2);
      setUsdValue(usdAmount);
    } else {
      setUsdValue('0.00');
    }
  }, [amount, btcPrice]);

  const handleMaxClick = () => {
    if (isWalletConnected) {
      onAmountChange(walletBalance);
    }
  };

  const handlePercentageClick = (percentage) => {
    if (isWalletConnected) {
      const percentAmount = (parseFloat(walletBalance) * percentage / 100)?.toFixed(8);
      onAmountChange(percentAmount);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground font-heading">
          BTC Amount To Deposit
        </h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Wallet" size={16} />
          <span>Balance: {walletBalance} BTC</span>
        </div>
      </div>
      <div className="space-y-3">
        <div className="relative">
          <Input
            type="number"
            placeholder="0.00001"
            value={amount}
            onChange={(e) => onAmountChange(e?.target?.value)}
            className="text-right text-xl font-data pr-16"
            step="0.00001"
            min="0"
            max={walletBalance}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
            <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
              <Icon name="Bitcoin" size={14} color="white" />
            </div>
            <span className="text-sm font-medium text-foreground">BTC</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            ≈ ${usdValue} USD
          </span>
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Icon name="TrendingUp" size={14} />
            <span>${btcPrice?.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="xs"
            onClick={() => handlePercentageClick(25)}
            disabled={!isWalletConnected}
          >
            25%
          </Button>
          <Button
            variant="outline"
            size="xs"
            onClick={() => handlePercentageClick(50)}
            disabled={!isWalletConnected}
          >
            50%
          </Button>
          <Button
            variant="outline"
            size="xs"
            onClick={() => handlePercentageClick(75)}
            disabled={!isWalletConnected}
          >
            75%
          </Button>
          <Button
            variant="outline"
            size="xs"
            onClick={handleMaxClick}
            disabled={!isWalletConnected}
          >
            MAX
          </Button>
        </div>
      </div>
      {!isWalletConnected && (
        <div className="flex items-center space-x-2 p-3 bg-warning/10 border border-warning/20 rounded-md">
          <Icon name="AlertTriangle" size={16} className="text-warning" />
          <span className="text-sm text-warning">
            Connect your wallet to continue
          </span>
        </div>
      )}
    </div>
  );
};

export default BridgeInputPanel;