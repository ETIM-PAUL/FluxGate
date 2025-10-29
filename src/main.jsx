import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'
import { GlobalProvider } from './context/global.jsx'
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

const mezoTestnet = {
  id: 31611,
  name: 'Mezo Testnet',
  network: 'mezoTestnet',
  nativeCurrency: {
    name: 'Mezo Bitcoin',
    symbol: 'BTC',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.test.mezo.org'],
    },
  },
  blockExplorerUrls: ['https://explorer.test.mezo.org/'],
};

const config = getDefaultConfig({
  appName: 'AirClaim',
  projectId: '4940035ce4b4813061af223f7b3c77f4',
  chains: [mezoTestnet],
  ssr: false, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <GlobalProvider>
            <App />
            <Toaster/>
          </GlobalProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)
