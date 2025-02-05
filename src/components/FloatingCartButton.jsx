// src/components/FloatingCartButton.jsx
import useCartStore from "../store/cartStore"; // Importar el store

const FloatingCartButton = ({ onCartClick }) => {
  const cartItemsCount = useCartStore((state) => state.cartItems.length); // Obtener número de items

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg transition-colors relative"
        title="Ver carrito"
        onClick={onCartClick}
      >
        🛒
        {cartItemsCount > 0 && (
          <span className="absolute bottom-0 left-0 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
            {cartItemsCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default FloatingCartButton;
