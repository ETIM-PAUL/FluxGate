import { useEffect, useState } from "react";

export function useBTCPrice() {
  const [price, setPrice] = useState(null);

  useEffect(() => {
    async function fetchPrice() {
      const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd");
      const data = await res.json();
      setPrice(data.bitcoin.usd);
    }
    fetchPrice();
    const interval = setInterval(fetchPrice, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return price;
}
