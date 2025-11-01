import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import { useGlobal } from '../../../context/global';

const ChoiceSelectionCard = ({ 
  choice, 
  amount,
  amountMUSD,
  onAmountChange,
  onMUSDAmountChange,
  isSelected, 
  selectedChoice,
  onSelect,
  swappedMUSDAmount,
  musdBalance,
  btcBalance,
  getingSwapOutput
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

          <div className='flex w-full justify-between'>
            <h5 className="text-sm font-medium text-foreground mb-3">{selectedChoice?.id === "1" ? "Enter BTC Amount to Swap to MUSD" : "Enter MUSD Amount to Deposit"}</h5>
            {selectedChoice?.id === "2" &&
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Wallet" size={16} />
              <span>Balance: {Number(musdBalance?.data?.formatted).toFixed(3)} MUSD</span>
            </div>
            }
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

              {getingSwapOutput &&
              <div className="mt-3">
                <span className="text-sm text-muted-foreground">Fetching swap output...</span>
              </div>
              }
              {!getingSwapOutput && swappedMUSDAmount &&
              <div className="mt-3">
                <span className="text-sm text-muted-foreground">You will receive {swappedMUSDAmount} MUSD after swapping</span>
              </div>
              }
            </div>
            :
            <div className="relative">
                <Input
                type="number"
                placeholder="100"
                value={amountMUSD}
                onChange={(e) => onMUSDAmountChange(e?.target?.value)}
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
          }
        </div>
      )}
    </div>
  );
};

export default ChoiceSelectionCard;