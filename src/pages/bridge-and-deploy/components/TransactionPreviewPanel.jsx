import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { get_PreviewDeposit } from '../../../utils/protocol_int';
import { useGlobal } from '../../../context/global';

const TransactionPreviewPanel = ({ 
  amount, 
  sharesOutput,
  getingSharesOutput,
  selectedChoice, 
  onDeposit,
  isDepositing = false 
}) => {
  const [fees, setFees] = useState({
    protocolFee: '0.00005'
  });

  const {
    isWalletConnected
  } = useGlobal();
  
  const [slippage, setSlippage] = useState(0.5);
  const [depositOutput, setDepositOutput] = useState('0.00000000');

  useEffect(() => {
    if (amount && selectedChoice?.id) {
      get_PreviewDeposit(amount, 2).then(result => {

        setDepositOutput(result.toString());
      }).catch(error => {
        console.error('Error fetching vault shares preview:', error);
        setDepositOutput('0.00000000');
      });
    }
  }, [amount, selectedChoice]);


  const transactionSteps = [
    {
      step: 1,
      title: 'Swap BTC to MUSD',
      description: 'Convert Bitcoin to Mezo USD (MUSD)',
      icon: 'ArrowRightLeft',
      status: 'pending'
    },
    {
      step: 2,
      title: 'Deposit to Mezo Vault',
      description: 'Transfer MUSD/BTC to Mezo Vault',
      icon: 'Rocket',
      status: 'pending'
    },
    {
      step: 3,
      title: 'Vault Allocation',
      description: `Deposit into MUSD/BTC Vault`,
      icon: 'Target',
      status: 'pending'
    }
  ];

  const totalFees = parseFloat(fees?.bridgeFee) + parseFloat(fees?.networkFee) + parseFloat(fees?.protocolFee);
  const canDeploy = amount && parseFloat(amount) > 0 && selectedChoice && parseFloat(amount) > totalFees;

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground font-heading">
          Transaction Preview
        </h3>
        <div className="flex items-center space-x-2">
          <Icon name="Clock" size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">~15-45 min</span>
        </div>
      </div>

      {/* Transaction Flow */}
      <div className="space-y-3">
        {transactionSteps?.map((step, index) => (
          <div key={step?.step} className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-medium text-muted-foreground">
              {step?.step}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <Icon name={step?.icon} size={16} className="text-accent" />
                <span className="text-sm font-medium text-foreground">
                  {step?.title}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {step?.description}
              </p>
            </div>
            {index < transactionSteps?.length - 1 && (
              <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
            )}
          </div>
        ))}
      </div>


      {/* Slippage Settings */}
      <div className="space-y-3 hidden pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-foreground">Slippage Tolerance</h4>
          <div className="flex items-center space-x-2">
            <Button
              variant={slippage === 0.1 ? "default" : "outline"}
              size="xs"
              onClick={() => setSlippage(0.1)}
            >
              0.1%
            </Button>
            <Button
              variant={slippage === 0.5 ? "default" : "outline"}
              size="xs"
              onClick={() => setSlippage(0.5)}
            >
              0.5%
            </Button>
            <Button
              variant={slippage === 1.0 ? "default" : "outline"}
              size="xs"
              onClick={() => setSlippage(1.0)}
            >
              1.0%
            </Button>
          </div>
        </div>
      </div>

      {/* Expected Output */}
      {(getingSharesOutput) &&
      <div className="bg-muted/50 rounded-lg">
          <div className="text-left mt-3">
            <span className="text-sm text-red-500">Fetching swap output...</span>
          </div>
      </div>
      }

      {(amount > 0 && isWalletConnected && !getingSharesOutput) &&
      <div className="bg-muted/50 rounded-lg">
        <div className="">
          <div>
            <span className="text-sm text-muted-foreground">You will receive after swapping</span>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-lg font-semibold text-foreground font-data">
                {sharesOutput} MUSD
              </span>
            </div>
          </div>
          {!selectedChoice &&
          <div className="text-left mt-3">
            <span className="text-sm text-red-500">Select a protocol and pool/strategy to see the protocol assets amount you will receive</span>
          </div>
          }
        </div>
      </div>
      }
      
      {(amount > 0 && selectedChoice && !getingSharesOutput) &&
      <div className="bg-muted/50 rounded-lg">
        <div className="block items-center justify-between">
          <div>
            <span className="text-sm text-muted-foreground">You will receive after deposit, around</span>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-lg font-semibold text-foreground font-data">
                {depositOutput} MUSD
              </span>
              {selectedProtocol && (
                <span className="text-sm text-accent hidden">
                  → {selectedChoice?.name}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      }

      {/* Deploy Button */}
      <Button
        variant="default"
        size="lg"
        fullWidth
        onClick={onDeposit}
        disabled={isDepositing || getingSharesOutput}
        loading={isDepositing}
        iconName="Rocket"
        iconPosition="left"
        className="mt-6 bg-gray-600 hover:bg-gray-700 cursor-pointer disabled:cursor-not-allowed"
      >
        {isDepositing ? 'Processing...' : selectedChoice?.id === 1 ? 'Swap & Deposit' : 'Deposit'}
      </Button>
      {/* {!canDeploy && amount && parseFloat(amount) > 0 && (
        <div className="flex items-center space-x-2 p-3 bg-warning/10 border border-warning/20 rounded-md">
          <Icon name="AlertTriangle" size={16} className="text-warning" />
          <span className="text-sm text-warning">
            {!selectedProtocol 
              ? 'Please select a yield protocol' 
              : parseFloat(amount) <= totalFees 
                ? 'Amount must be greater than total fees' :'Invalid transaction parameters'
            }
          </span>
        </div>
      )} */}
    </div>
  );
};

export default TransactionPreviewPanel;