import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundry";
import NotFound from "./pages/NotFound";
import BridgeAndDeploy from './pages/bridge-and-deploy';
import WalletSection from "./pages/wallet";
import CreditVault from "./pages/credit-vault";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<BridgeAndDeploy />} />
        <Route path="/swap-and-deploy" element={<BridgeAndDeploy />} />
        <Route path="/credit-vault" element={<CreditVault />} />
        <Route path="/wallet" element={<WalletSection />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
