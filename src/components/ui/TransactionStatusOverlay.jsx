import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const TransactionStatusOverlay = ({ 
  isVisible = false, 
  onClose = () => {}, 
  transactionData = null,
  completedSteps = []
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const transactionSteps = [
    {
      id: 'bridge_confirmation',
      title: 'Bridge Confirmation',
      description: 'Confirming Bitcoin transaction on network',
      icon: 'ArrowRightLeft',
      estimatedTime: '20-50 minutes',
    },
    {
      id: 'protocol_deployment',
      title: 'Protocol Deployment',
      description: 'Deploying to yield protocol on Starknet',
      icon: 'Rocket',
      estimatedTime: '2-5 minutes',
    },
    {
      id: 'yield_position',
      title: 'Yield Position Active',
      description: 'Your Bitcoin is now earning yield',
      icon: 'TrendingUp',
      estimatedTime: 'Complete',
    }
  ];


  const getStepStatus = (step, index) => {
    if (step?.id === completedSteps[completedSteps?.length - 1]) return 'active';
    if (completedSteps.includes(step?.id)) return 'completed';
    return 'pending';
  };

  const getStepIcon = (step, status) => {
    if (status === 'completed') return 'CheckCircle';
    if (status === 'active') return step?.icon;
    return 'Circle';
  };

  const getStepIconColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success';
      case 'active':
        return 'text-accent';
      default:
        return 'text-muted-foreground';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-10 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-gray-700 rounded-lg shadow-lg max-w-md w-full mx-4 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name="Activity" size={20} className="text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground font-heading">
                Transaction Progress
              </h3>
              <p className="text-sm text-muted-foreground">
                {transactionData?.amount} BTC
              </p>
            </div>
          </div>
          
          {isCompleted && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          )}
        </div>

        {/* Transaction Hash */}
        {transactionData?.id && (
          <div className="px-6 py-3 bg-muted">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Transaction Hash</span>
              <Button variant="ghost" size="xs" iconName="ExternalLink" iconPosition="right">
                View on Explorer
              </Button>
            </div>
            <p className="text-xs font-data text-foreground mt-1 break-all">
              {transactionData?.id}
            </p>
          </div>
        )}

        {/* Progress Steps */}
        <div className="p-6 space-y-4">
          {transactionSteps?.map((step, index) => {
            const status = getStepStatus(step, index);
            const iconName = getStepIcon(step, status);
            const iconColor = getStepIconColor(status);

            return (
              <div key={index} className="flex items-start space-x-4">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  status === false ? 'bg-success/10' :
                  status === true ? 'bg-accent/10' : 'bg-muted'
                }`}>
                  <Icon 
                    name={iconName} 
                    size={16} 
                    className={`${iconColor} ${status === 'active' ? 'animate-pulse-soft' : ''}`} 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm font-medium ${
                      status === false ? 'text-success' :
                      status === true ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step?.title}
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      {step?.estimatedTime}
                    </span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-1">
                    {step?.description}
                  </p>
                  
                  {status === 'active' && (
                    <div className="mt-2 w-full bg-muted rounded-full h-1">
                      <div className="bg-accent h-1 rounded-full animate-pulse w-3/4 transition-all duration-1000" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/50">
          {isCompleted ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={16} className="text-success" />
                <span className="text-sm text-success font-medium">Transaction Complete</span>
              </div>
              <Button variant="default" size="sm" onClick={onClose}>
                View Portfolio
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-muted-foreground">Processing transaction...</span>
              </div>
              {/* <Button variant="outline" size="sm" onClick={onClose}>
                Minimize
              </Button> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionStatusOverlay;