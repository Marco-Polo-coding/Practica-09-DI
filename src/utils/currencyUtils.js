const exchangeRates = {
    EUR: 1, // Base
    USD: 1.1, // 1 EUR = 1.1 USD
    GBP: 0.85, // 1 EUR = 0.85 GBP
  };
  
  export const convertPrice = (priceInEUR, currency) => {
    const validCurrency = exchangeRates[currency] ? currency : "EUR"; // Asegura que la moneda sea válida
    const rate = exchangeRates[validCurrency];
    return (priceInEUR * rate).toFixed(2);
  };
  