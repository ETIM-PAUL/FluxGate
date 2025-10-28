import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { get_PreviewDeposit } from '../../../utils/protocol_int';
import { useGlobal } from '../../../context/global';

const TransactionPreviewPanel = ({ 
  amount, 
  atomiqOutput,
  getingAtomiqOutput,
  selectedProtocol, 
  selectedPool,
  onDeploy,
  isDeploying = false 
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
    if (amount && selectedProtocol?.id) {
      get_PreviewDeposit(amount, selectedProtocol?.id, selectedPool).then(result => {

        setDepositOutput(result.formattedVal);
      }).catch(error => {
        console.error('Error fetching Vesu deposit preview:', error);
        setDepositOutput('0.00000000');
      });
    }
  }, [amount, selectedPool]);


  const transactionSteps = [
    {
      step: 1,
      title: 'Bridge BTC to WBTC',
      description: 'Convert native Bitcoin to Wrapped Bitcoin via Atomiq',
      icon: 'ArrowRightLeft',
      status: 'pending'
    },
    {
      step: 2,
      title: 'Deploy to Starknet',
      description: 'Transfer WBTC to Starknet network',
      icon: 'Rocket',
      status: 'pending'
    },
    {
      step: 3,
      title: 'Protocol Allocation',
      description: `Deposit into ${selectedProtocol?.name || 'selected protocol'}`,
      icon: 'Target',
      status: 'pending'
    }
  ];

  const totalFees = parseFloat(fees?.bridgeFee) + parseFloat(fees?.networkFee) + parseFloat(fees?.protocolFee);
  const canDeploy = amount && parseFloat(amount) > 0 && selectedProtocol && parseFloat(amount) > totalFees;

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

      {/* Fee Breakdown */}
      <div className="space-y-3 pt-4 border-t border-border hidden">
        <h4 className="text-sm font-medium text-foreground">Fee Breakdown</h4>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Protocol Fee</span>
            <span className="text-foreground font-data">{(amount * 0.05)} BTC</span>
          </div>
          <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
            <span className="font-medium text-foreground">Total Fees</span>
            <span className="font-medium text-foreground font-data">
              {(Number(amount) + (amount * 0.05))} BTC
            </span>
          </div>
        </div>
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
      {(getingAtomiqOutput) &&
      <div className="bg-muted/50 rounded-lg">
          <div className="text-left mt-3">
            <span className="text-sm text-red-500">Fetching swap output...</span>
          </div>
      </div>
      }

      {(amount > 0 && isWalletConnected && !getingAtomiqOutput) &&
      <div className="bg-muted/50 rounded-lg">
        <div className="">
          <div>
            <span className="text-sm text-muted-foreground">You will receive after swapping</span>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-lg font-semibold text-foreground font-data">
                {atomiqOutput} WBTC
              </span>
            </div>
          </div>
          {!selectedProtocol &&
          <div className="text-left mt-3">
            <span className="text-sm text-red-500">Select a protocol and pool/strategy to see the protocol assets amount you will receive</span>
          </div>
          }
        </div>
      </div>
      }
      
      {(amount > 0 && selectedPool && !getingAtomiqOutput) &&
      <div className="bg-muted/50 rounded-lg">
        <div className="block items-center justify-between">
          <div>
            <span className="text-sm text-muted-foreground">You will receive after deposit, around</span>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-lg font-semibold text-foreground font-data">
                {depositOutput} {selectedProtocol?.id === "troves-vault" ? "tWBTC-E" : selectedPool?.name === "Prime" ? "vWBTC" : "vWBTC-Re7xBTC"}
              </span>
              {selectedProtocol && (
                <span className="text-sm text-accent hidden">
                  → {selectedProtocol?.name}
                </span>
              )}
            </div>
          </div>
          <div className="text-right hidden">
            <span className="text-sm text-muted-foreground">Expected APY</span>
            <div className="text-lg font-semibold text-success">
              {(Number(selectedPool?.supplyApr ?? 0)*100).toFixed(2) || '0.00'}%
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
        onClick={onDeploy}
        disabled={isDeploying || getingAtomiqOutput}
        loading={isDeploying}
        iconName="Rocket"
        iconPosition="left"
        className="mt-6 bg-gray-600 hover:bg-gray-700 cursor-pointer disabled:cursor-not-allowed"
      >
        {isDeploying ? 'Shuttling...' : selectedProtocol?.id === "troves-vault" ? 'Shuttle Yield Farming' : 'Shuttle Lending Interest '}
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