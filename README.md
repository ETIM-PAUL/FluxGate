# Flux Gate - DeFi Platform on Mezo

Flux Gate is a decentralized finance (DeFi) platform built on the Mezo Testnet, enabling Bitcoin (BTC) and MUSD token swaps, liquidity provision, and credit vault operations for earning lending interest.

Most Bitcoin remains idle, earning no yield despite the explosion of DeFi opportunities. Moving BTC into DeFi today is complicated—it requires bridging, wrapping, connecting new wallets, and manually interacting with yield protocols. I wanted to make this process as simple as sending Bitcoin.
That's why I built FluxGate: a one-click bridge from Bitcoin to Mezo yield opportunities.
FluxGate enables you to:

Swap & Earn: Seamlessly swap BTC to Mezo USD and deposit into yield vaults with a single click.

Lend for Passive Income: Deposit BTC or MUSD into the Credit Vault to earn lending interest by backing institutional credit lines.

Flexible Asset Management: Mix and match collateral types (BTC/MUSD), borrow against your assets, and manage positions—all from one interface

No more juggling multiple wallets, bridges, and protocols. FluxGate transforms idle Mezo backed Bitcoin and/or Mezo USD into productive capital with the simplicity of a single flow.

## 🚀 Features

### 1. **Swap and Liquidity** (`/swap-and-deploy`)
- Swap BTC to MUSD tokens
- Provide liquidity to BTC/MUSD liquidity pools using BTC and swapped BTC-MUSD or MUSD
- View real-time swap rates and liquidity pool quotes
- Transaction status tracking with visual overlays

### 2. **Credit Vault** (`/credit-vault`)
- Deposit BTC or MUSD to earn passive lending interest
- Flexible asset mixing for lending operations
- Real-time price feeds via Pyth Network
- View vault statistics (APY, TVL, active vaults)

### 3. **Wallet** (`/wallet`)
- View wallet address and portfolio balances
- Track BTC and MUSD holdings
- Swap MUSD to BTC

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **Wagmi v2** - Ethereum React hooks
- **RainbowKit** - Wallet connection UI
- **React Router** - Client-side routing
- **Viem** - Ethereum TypeScript library
- **React Hot Toast** - Notification system

### Smart Contracts
- **Foundry** - Development framework
- **Solidity** - Smart contract language
- **Pyth Network** - Price oracle integration
- **OpenZeppelin** - Security contracts library

### Network
- **Mezo Testnet** (Chain ID: 31611)
  - RPC: `https://rpc.test.mezo.org`
  - Explorer: `https://explorer.test.mezo.org/`

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**
- **Foundry** (for smart contract development)

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Shuttle
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory (if needed):

```env
# Add any environment variables here
# Wallet Connect Project ID is configured in main.jsx
```

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

The application will start on `http://localhost:5173` (default Vite port).

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

The following addresses are configured in `src/utils/cn.js`:

- **MUSD Token**: `0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503`
- **BTC Token**: `0x7b7C000000000000000000000000000000000000`
- **Router**: `0x9a1ff7FE3a0F69959A3fBa1F1e5ee18e1A9CD7E9`
- **Factory**: `0x4947243CC818b627A5D06d14C4eCe7398A23Ce1A`
- **MUSD/BTC Pair**: `0xd16A5Df82120ED8D626a1a15232bFcE2366d6AA9`
- **Credit Vault**: `0x8fC445A415BBc2B5D0851344F46B0CD8866C26Bc`

## 🔐 Wallet Connection

The application uses **RainbowKit** for wallet connections. Supported wallets include:
- MetaMask
- WalletConnect
- Coinbase Wallet
- And other EVM-compatible wallets


## 🔍 Key Features Implementation

### Swap Functionality
- Uses mezo V2-style router for token swaps
- Real-time quote calculation via `getAmountsOut`
- Transaction status tracking with visual feedback

### Liquidity Provision
- Add liquidity to BTC/MUSD pools
- View expected LP shares before transaction
- Automatic balance checking and validation

### Credit Vault
- Deposit BTC or MUSD assets
- Automatic swap BTC to MUSD when needed
- Earning passive interest on deposits
- Real-time price feeds from Pyth Network

## 🐛 Troubleshooting

### Common Issues

1. **Wallet not connecting**
   - Ensure you're on Mezo Testnet
   - Check wallet extension is installed and unlocked

2. **Transaction fails**
   - Verify sufficient gas/balance
   - Check network is set to Mezo Testnet (Chain ID: 31611)

3. **Build errors**
   - Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility

## 📁 Project Structure

Shuttle/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Basic UI components (Button, Input, etc.)
│   │   ├── AppIcon.jsx      # Icon component
│   │   └── ErrorBoundry.jsx # Error boundary wrapper
│   ├── pages/               # Page components
│   │   ├── bridge-and-deploy/  # Swap and liquidity page
│   │   ├── credit-vault/       # Credit vault page
│   │   └── wallet/             # Wallet page
│   ├── calls/               # Smart contract interaction functions
│   │   ├── swapBTCToMUSD.js
│   │   ├── provideLiquidity.js
│   │   ├── quoteAddLiquidity.js
│   │   └── ...
│   ├── context/             # React context providers
│   │   └── global.jsx       # Global state management
│   ├── utils/               # Utility functions
│   │   ├── cn.js            # Class name utilities
│   │   └── protocol_int.js  # Protocol integration helpers
│   ├── Routes.jsx           # Application routing
│   ├── App.jsx              # Root component
│   └── main.jsx             # Application entry point
├── CreditVault/             # Smart contracts
│   ├── src/
│   │   └── CreditVault.sol  # Main credit vault contract
│   ├── script/              # Deployment scripts
│   ├── test/                # Contract tests
│   └── foundry.toml         # Foundry configuration
├── public/                  # Static assets
└── package.json             # Dependencies and scripts


## 📚 Documentation

- [Mezo Documentation](https://docs.mezo.org)
- [Wagmi Documentation](https://wagmi.sh)
- [RainbowKit Documentation](https://www.rainbowkit.com)
- [Foundry Book](https://book.getfoundry.sh)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

[Add your license here]

## 👥 Authors

[etimpaul22@gmail.com]

## 🙏 Acknowledgments

- Mezo Network for the testnet infrastructure
- Pyth Network for price oracle services
- OpenZeppelin for secure contract libraries

---

**Note**: This is a testnet application. Do not use real funds or expect production-level security guarantees.

