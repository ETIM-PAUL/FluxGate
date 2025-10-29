import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useEffect } from 'react';
// import { getBtcBalance } from '../../api';
import toast from 'react-hot-toast';
import { useGlobal } from '../../context/global';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Header = () => {
  const location = useLocation();
  const [networkStatus, setNetworkStatus] = useState({
    bitcoin: 'connected',
    lightning: 'connected',
    starknet: 'connected'
  });
  const {
    isWalletConnected, 
    setIsWalletConnected, 
    btcBalance, 
    setBtcBalance, 
    walletAddress, 
    setWalletAddress, 
    isInstalled, 
    isConnecting, 
    setIsConnecting,
    handleConnect,
    handleDisconnect,
  } = useGlobal();
  const navigate = useNavigate();

  // Function to shorten wallet address
  const shortenAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const navigationItems = [
    {
      label: 'Deploy',
      path: '/bridge-and-deploy',
      icon: 'Rocket',
      tooltip: 'Bridge Bitcoin and deploy to yield protocols'
    },
    {
      label: 'Wallet',
      path: '/wallet',
      icon: 'Wallet',
      tooltip: 'View wallet address and portfolio balances'
    }
  ];


  const getNetworkStatusColor = (status) => {
    switch (status) {
      case 'connected':
        return 'text-success';
      case 'connecting':
        return 'text-warning';
      case 'disconnected':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };



  const Logo = () => (
    <div className="flex items-center space-x-3">
      <div className="h-32 bg-accent rounded-lg flex items-center justify-center">
        <img src="/download.png" alt="Flux Gate" className="w-full h-full object-cover" />
      </div>
    </div>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-100 bg-gradient-to-b from-gray-500 to-black border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Logo />
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigationItems?.map((item) => (
            <span
              key={item?.path}
              onClick = {() => navigate(item?.path)}
              className={`flex cursor-pointer items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-smooth group relative ${
                location?.pathname === item?.path
                  ? 'text-accent bg-accent/10' :'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              title={item?.tooltip}
            >
              <Icon 
                name={item?.icon} 
                size={16} 
                className={location?.pathname === item?.path ? 'text-accent' : 'text-current'} 
              />
              <span>{item?.label}</span>
              {location?.pathname === item?.path && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />
              )}
            </span>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Network Status */}
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 bg-muted rounded-md">
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${getNetworkStatusColor(networkStatus?.bitcoin)} animate-pulse-soft`} />
              <span className="text-xs text-muted-foreground">BTC</span>
            </div>
            <div className="w-px h-3 bg-border" />
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${getNetworkStatusColor(networkStatus?.lightning)} animate-pulse-soft`} />
              <span className="text-xs text-muted-foreground">LN</span>
            </div>
            <div className="w-px h-3 bg-border" />
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${getNetworkStatusColor(networkStatus?.starknet)} animate-pulse-soft`} />
              <span className="text-xs text-muted-foreground">STRK</span>
            </div>
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-3">
            {isWalletConnected && walletAddress && (
              <div className="hidden sm:flex items-center space-x-3 px-3 py-2 bg-surface rounded-md border">
                {/* Wallet Address */}
                {/* <div className="flex items-center space-x-2">
                  <Icon name="Wallet" size={16} className="text-accent" />
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Address</span>
                    <span className="text-sm font-mono text-foreground">
                      {shortenAddress(walletAddress)}
                    </span>
                  </div>
                </div> */}
                
                {/* Separator */}
                <div className="w-px h-6 bg-border" />
                
                {/* BTC Balance */}
                <div className="flex items-center space-x-2">
                  <Icon name="Bitcoin" size={16} className="text-orange-500" />
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Balance</span>
                    <span className="text-sm font-data text-foreground">
                      {btcBalance} BTC
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            {/* {!isWalletConnected ? 
            <Button
              variant="default"
              size="sm"
              onClick={handleConnect}
              iconName="Wallet"
              iconPosition="left"
              className="transition-smooth"
              disabled={isConnecting}
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
            :
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsWalletConnected(false);
                setIsConnecting(false);
                setWalletAddress(null);
                setBtcBalance('0.00000000');
              }}
              iconName="LogOut"
              iconPosition="left"
              className="transition-smooth"
            >
              Disconnect
            </Button>
            } */}
            <ConnectButton/>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon">
              <Icon name="Menu" size={20} />
            </Button>
          </div>
        </div>
      </div>
      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-border bg-surface">
        <nav className="flex">
          {navigationItems?.map((item) => (
            <a
              key={item?.path}
              href={item?.path}
              className={`flex-1 flex flex-col items-center justify-center py-3 text-xs font-medium transition-smooth ${
                location?.pathname === item?.path
                  ? 'text-accent bg-accent/10' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon 
                name={item?.icon} 
                size={18} 
                className={`mb-1 ${location?.pathname === item?.path ? 'text-accent' : 'text-current'}`} 
              />
              <span>{item?.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;