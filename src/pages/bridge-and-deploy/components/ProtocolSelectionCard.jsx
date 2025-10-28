import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { useNavigate } from 'react-router-dom';

const ProtocolSelectionCard = ({ 
  protocol, 
  isSelected, 
  isSelectedPool,
  selectedProtocol,
  onSelect,
  setSelectedPool,
  onSelectPool
}) => {
  const [expandedPools, setExpandedPools] = useState({});
  const navigate = useNavigate();


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

  const handlePoolSelect = (pool) => {
    onSelectPool(pool);
  };

  return (
    <div
      className={`border rounded-lg p-4 cursor-pointer transition-smooth ${
        isSelected
          ? 'border-green bg-accent/5 shadow-md'
          : 'border-border bg-card hover:border-accent/50 hover:bg-accent/2'
      }`}
      onClick={() => {onSelect(protocol);setSelectedPool(null)}}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isSelected ? 'bg-accent text-white' : 'bg-muted text-muted-foreground'
          }`}>
            <Icon name={getProtocolIcon(protocol?.type)} size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-foreground font-heading">
              {protocol?.name}
            </h4>
            <p className="text-sm text-muted-foreground">
              {protocol?.description}
            </p>
          </div>
        </div>
        
        {isSelected && (
          <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
            <Icon name="Check" size={14} color="white" />
          </div>
        )}
      </div>

      {(isSelected && protocol?.pools.length === 0) &&
      <h5 className="text-sm font-medium text-foreground mb-3">Loading Available Pools/Strategies</h5>
      }

      {/* Sub-Protocol Pools Section */}
      {(isSelected && protocol?.pools.length > 0) && (
        <div className="mb-4">
          <h5 className="text-sm font-medium text-foreground mb-3">Available Pools</h5>
          <div className="space-y-2">
            {selectedProtocol.pools.map((pool) => (
              <div
                key={pool.id}
                className={`border rounded-lg p-3 transition-all ${
                  isSelectedPool?.id === pool.id
                    ? 'border-accent bg-accent/5'
                    : 'border-border bg-surface hover:border-accent/50'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePoolSelect(pool);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isSelectedPool?.id === pool.id ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                    }`}>
                      <Icon name="Coins" size={16} />
                    </div>
                    <div>
                      <h6 className="text-sm font-medium text-foreground">{pool.name}</h6>
                      <p className="text-xs text-muted-foreground">{pool.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {isSelectedPool?.id === pool.id && (
                      <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                        <Icon name="Check" size={12} color="green" />
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePoolExpansion(pool.id);
                      }}
                      className="p-1 hover:bg-muted rounded transition-colors"
                    >
                      <Icon 
                        name="ChevronDown" 
                        size={16} 
                        className={`text-muted-foreground transition-transform ${
                          expandedPools[pool.id] ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                  </div>
                </div>

                {/* Pool Stats */}
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">APY</div>
                    <div className="text-sm font-semibold text-foreground">{(Number(pool.supplyApr)*100).toFixed(2)}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">TVL</div>
                    <div className="text-sm font-semibold text-foreground">{pool.totalSupplied}</div>
                  </div>

                  {pool.maxUtilization !== "" &&
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Utilization</div>
                    <div className="text-sm font-semibold text-foreground">{(Number(pool.maxUtilization)*100).toFixed(2)}%</div>
                  </div>
                  }

                  {pool.interestRate !== "" &&
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Interest Rate</div>
                    <div className="text-sm font-semibold text-foreground">{(pool.interestRate)}</div>
                  </div>
                  }
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Risk</div>
                    <span className={`text-xs px-1 py-0.5 rounded`}>
                      {pool.risk}
                    </span>
                  </div>
                </div>

                {/* Expanded Pool Features */}
                {expandedPools[pool.id] && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <div className="text-xs text-muted-foreground">Utilization</div>
                        <div className="text-sm font-medium text-foreground">{pool.utilization}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Min Deposit</div>
                        <div className="text-sm font-medium text-foreground">{pool.minDeposit} WBTC</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-muted-foreground mb-2">Features</div>
                      <div className="flex flex-wrap gap-1">
                        {pool.features.map((feature, index) => (
                          <span
                            key={index}
                            className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-md"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* <div className="grid  hidden grid-cols-2 gap-4 mb-3">
        <div>
          <div className="flex items-center space-x-1 mb-1">
            <Icon name="TrendingUp" size={14} className="text-accent" />
            <span className="text-xs text-muted-foreground">Current Interest Rate</span>
          </div>
          <span className="text-lg font-semibold text-foreground font-data">
            {protocol?.interestRate}%
          </span>
        </div>
        
        <div>
          <div className="flex items-center space-x-1 mb-1">
            <Icon name="Shield" size={14} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Risk Detail</span>
          </div>
          <span onClick={() => navigate(protocol?.risk)} className={`text-xs px-2 py-1 rounded-full font-medium ${getRiskColor("medium")}`}>
           medium
          </span>
        </div>
      </div>
      <div className="space-y-2 hidden ">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Supply APR</span>
          <span className="text-foreground font-medium">
            {protocol?.supplyApy} WBTC
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Reserves</span>
          <span className="text-foreground font-medium">
            {protocol?.reserve} WBTC
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Max Utilization</span>
          <span className="text-foreground font-medium">
            {protocol?.maxUtilization} WBTC
          </span>
        </div>
      </div> */}
      {protocol?.features && protocol?.features?.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex flex-wrap gap-1">
            {protocol?.features?.map((feature, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-md"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProtocolSelectionCard;