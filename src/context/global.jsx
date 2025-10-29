// src/context/global.jsx
import React, { createContext, useState, useContext, useEffect } from "react";

// Create the context
const GlobalContext = createContext();

// Create a provider component
export const GlobalProvider = ({ children }) => {
    const [isWalletConnected, setIsWalletConnected] = useState(null);
    const [btcBalance, setBtcBalance] = useState(null);
    const [walletAddress, setWalletAddress] = useState(null);
    const [wBTCBalance, setWBTCBalance] = useState(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState(null);
    const [btcPrice, setBtcPrice] = useState(null);
    const [protocols, setProtocols] = useState([]);

    const handleConnect = () => {
      setIsConnecting(true);
      setTimeout(() => {
        setIsConnecting(false);
      }, 1000);
    };

    const handleDisconnect = () => {
      setIsWalletConnected(false);
      setWalletAddress(null);
      setBtcBalance(null);
      setWBTCBalance(null);
      setProtocols([]);
    };

  const value = {
    isWalletConnected,
    setIsWalletConnected,
    isConnecting,
    setIsConnecting,
    btcBalance,
    btcPrice,
    setBtcBalance,
    wBTCBalance,
    setWBTCBalance,
    walletAddress,
    setWalletAddress,
    isInstalled,
    protocols,
    setIsInstalled,
    handleConnect,
    handleDisconnect,
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook to use the global context
export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobal must be used within a GlobalProvider");
  }
  return context;
};
