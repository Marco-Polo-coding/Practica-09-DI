import useCurrencyStore from "../store/currencyStore";
import { updateUserPreferences } from "../utils/firebaseUtils"; // ✅ Ahora sí existe

const CurrencySelector = ({ userEmail }) => {
  const { currency, setCurrency } = useCurrencyStore();

  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    setCurrency(newCurrency);

    // Si el usuario está logueado, actualizar Firebase
    if (userEmail) {
      updateUserPreferences(userEmail, { currency: newCurrency });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span>Moneda:</span>
      <select
        value={currency}
        onChange={handleCurrencyChange}
        className="border p-2 rounded"
      >
        <option value="EUR">€ Euro</option>
        <option value="USD">$ Dólar</option>
        <option value="GBP">£ Libra</option>
      </select>
    </div>
  );
};

export default CurrencySelector;
