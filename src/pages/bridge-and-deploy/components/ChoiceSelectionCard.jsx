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
  isSelected, 
  isSelectedChoice,
  selectedChoice,
  onSelect,
  setSelectedChoice,
  onSelectChoice
}) => {
  const [expandedPools, setExpandedPools] = useState({});
  const navigate = useNavigate();

  const {
    btcBalance,
    mUSDBalance,
  } = useGlobal();


  const getRiskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'low':
        return 'text-success bg-success/10';
      case 'medium':
        return 'text-warning bg-warning/10';
      case 'high':
        return 'text-error bg-error/10';
      default:
        return 'text-white bg-muted';
    }
  };

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

  const togglePoolExpansion = (poolId) => {
    setExpandedPools(prev => ({
      ...prev,
      [poolId]: !prev[poolId]
    }));
  };

  const handleChoiceSelect = (choice) => {
    onSelectChoice(choice);
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
          <h5 className="text-sm font-medium text-foreground mb-3">{selectedChoice?.id === "1" ? "Enter BTC Amount to Swap to MUSD" : "Enter MUSD Amount to Deposit"}</h5>

          {selectedChoice?.id === 1 ? 
            <div className="relative">
              <Input
                type="number"
                placeholder="0.00000000"
                value={amount}
                onChange={(e) => onAmountChange(e?.target?.value)}
                className="text-right text-xl font-data pr-16"
                step="0.00000001"
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
            :
            <div>
                  <Input
                type="number"
                placeholder="0.00000000"
                value={amountMUSD}
                onChange={(e) => onAmountChange(e?.target?.value)}
                className="text-right text-xl font-data pr-16"
                step="0.00000001"
                min="0"
                max={mUSDBalance}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                  <Icon name="Bitcoin" size={14} color="white" />
                </div>
                <span className="text-sm font-medium text-foreground">BTC</span>
              </div>
            </div>
          }
        </div>
      )}
    </div>
  );
};

export default ChoiceSelectionCard;