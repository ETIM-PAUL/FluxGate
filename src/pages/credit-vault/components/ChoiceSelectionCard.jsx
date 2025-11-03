import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import { useGlobal } from '../../../context/global';
import Button from '../../../components/ui/Button';
import { useEffect } from 'react';

const ChoiceSelectionCard = ({ 
  choice, 
  btcPrice,
  musdPrice,
  usdBtcValue,
  usdMusdValue,
  isConnected,
  amount,
  amountMUSD,
  onAmountChange,
  isSelected, 
  selectedChoice,
  onSelect,
  musdBalance,
  btcBalance
}) => {

  const getProtocolIcon = (type) => {
    switch (type) {
      case 'vault':
        return 'Vault';
      case 'lending':
        return 'Coins';
      default:
        return 'DollarSign';
    }
  };

  const handlePercentageClick = (percentage, e) => {
    e?.stopPropagation();
    if (isConnected) {
      const percentAmount = (parseFloat(selectedChoice?.id === "1" ? btcBalance : musdBalance) * percentage / 100)?.toFixed(8);
      onAmountChange(percentAmount);
    }
  };


  return (
    <div
      className={`border rounded-lg p-4 cursor-pointer transition-smooth ${
        isSelected
          ? 'border-green bg-accent/5 shadow-md'
          : 'border-border bg-card hover:border-accent/50 hover:bg-accent/2'
      }`}
      onClick={() => {onSelect(choice);}}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isSelected ? 'bg-accent text-white' : 'bg-muted text-muted-foreground'
          }`}>
            <Icon name={getProtocolIcon(choice?.type)} size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-foreground font-heading">
              {choice?.name}
            </h4>
            <p className="text-sm text-muted-foreground">
              {choice?.description}
            </p>
          </div>
        </div>
        
        {isSelected && (
          <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
            <Icon name="Check" size={14} color="white" />
          </div>
        )}
      </div>


      {/* Sub-Protocol Pools Section */}
      {(isSelected) && (
        <div className="mb-4">
          <div className="flex mb-3 items-center justify-between">
            <h5 className="text-sm font-medium text-foreground">{selectedChoice?.id === "1" ? "Enter BTC Amount to get Lending Interest" : "Enter MUSD Amount to get Lending Interest"}</h5>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Wallet" size={16} />
              <span>Balance: {selectedChoice?.id === "1" ? btcBalance : musdBalance} {selectedChoice?.id === "1" ? "BTC" : "MUSD"}</span>
            </div>
          </div>

          {selectedChoice?.id === "1" ? 
            <div className="relative">
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0.00001"
                  value={amount}
                  onChange={(e) => onAmountChange(e?.target?.value)}
                  className="text-right text-xl font-data pr-16"
                  step="0.00001"
                  min="0"
                  max={btcBalance}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                    <Icon name="Bitcoin" size={14} color="white" />
                  </div>
                  <span className="text-sm font-medium text-foreground">BTC</span>
                </div>
              </div>

              <div className="flex mt-3 items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  ≈ ${usdBtcValue} USD
                </span>
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <Icon name="TrendingUp" size={14} />
                  <span>${btcPrice?.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex mt-3 items-center space-x-2">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={(e) => handlePercentageClick(25, e)}
                  disabled={!isConnected}
                >
                  25%
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={(e) => handlePercentageClick(50, e)}
                  disabled={!isConnected}
                >
                  50%
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={(e) => handlePercentageClick(75, e)}
                  disabled={!isConnected}
                >
                  75%
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={(e) => handlePercentageClick(100, e)}
                  disabled={!isConnected}
                >
                  Max
                </Button>
              </div>
            </div>
            :
            <div className="relative">
              <div className="relative">
                <Input
                type="number"
                placeholder="100"
                value={amountMUSD}
                onChange={(e) => onAmountChange(e?.target?.value)}
                className="text-right text-xl font-data pr-16"
                step="10"
                min="0"
                max={musdBalance}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                  <Icon name="DollarSign" size={14} color="white" />
                </div>
                <span className="text-sm font-medium text-foreground">MUSD</span>
              </div>
              </div>

              <div className="flex mt-3 items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  ≈ ${usdMusdValue} USD
                </span>
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <Icon name="TrendingUp" size={14} />
                  <span>${musdPrice}</span>
                </div>
              </div>

              <div className="flex mt-3 items-center space-x-2">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={(e) => handlePercentageClick(25, e)}
                  disabled={!isConnected}
                >
                  25%
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={(e) => handlePercentageClick(50, e)}
                  disabled={!isConnected}
                >
                  50%
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={(e) => handlePercentageClick(75, e)}
                  disabled={!isConnected}
                >
                  75%
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={(e) => handlePercentageClick(100, e)}
                  disabled={!isConnected}
                >
                  Max
                </Button>
              </div>
            </div>
          }
          
        </div>
      )}
    </div>
  );
};

export default ChoiceSelectionCard;