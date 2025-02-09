// src/components/CartDialog.jsx
import { useState } from "react";
import useCartStore from "../store/cartStore"; // Importar el store
import { ref, update, get } from "firebase/database";
import database from "../../firebaseConfig";

const CartDialog = ({ onClose }) => {
  const cartItems = useCartStore((state) => state.cartItems); // Obtener items del carrito
  const removeFromCart = useCartStore((state) => state.removeFromCart); // Hook para eliminar
  const clearCart = useCartStore((state) => state.clearCart); // Hook para limpiar carrito

  const [showSuccessDialog, setShowSuccessDialog] = useState(false); // Estado para el diálogo de éxito
  const [showErrorDialog, setShowErrorDialog] = useState(false); // Estado para el diálogo de error

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setShowErrorDialog(true);
      return;
    }

    // Obtener el usuario logueado desde localStorage
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser || !loggedInUser.email) {
      setShowErrorDialog(true);
      return;
    }

    try {
      // Referencia al nodo de usuarios en Firebase
      const userRef = ref(database, `users/${loggedInUser.email.replace(/\./g, ",")}`);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        console.error("El usuario no existe en Firebase.");
        setShowErrorDialog(true);
        return;
      }

      const userData = snapshot.val();
      const purchasedCourses = userData.purchasedCourses || [];

      // Agregar los cursos del carrito a los cursos comprados
      const updatedPurchasedCourses = [
        ...new Set([...purchasedCourses, ...cartItems.map((item) => item.id)]),
      ];

      // Actualizar los datos del usuario en Firebase
      await update(userRef, { purchasedCourses: updatedPurchasedCourses });

      // Actualizar el usuario logueado en localStorage
      const updatedUser = { ...loggedInUser, purchasedCourses: updatedPurchasedCourses };
      localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

      setShowSuccessDialog(true);
      clearCart();
    } catch (error) {
      console.error("Error al procesar la compra:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
        <h2 className="text-lg font-bold mb-4">Tu Carrito</h2>
        {cartItems.length === 0 ? (
          <p className="text-gray-700 mb-6">No tienes productos en tu carrito.</p>
        ) : (
          <div className="mb-6 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center p-4 border rounded-lg space-x-4"
              >
                {/* Imagen del curso */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                {/* Detalles del curso */}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                  <p className="text-gray-800 font-semibold">
                    💵 {item.price.toFixed(2)}€
                  </p>
                </div>
                {/* Botón para eliminar */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                  title="Eliminar del carrito"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center space-x-4">
          <button
            onClick={onClose}
            className="py-2 px-4 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Cerrar
          </button>
          {cartItems.length > 0 && (
            <>
              <button
                onClick={clearCart}
                className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Limpiar Carrito
              </button>
              <button
                onClick={handleCheckout}
                className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Comprar
              </button>
            </>
          )}
        </div>
      </div>

      {/* Diálogo de éxito */}
      {showSuccessDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 text-center">
            <p className="text-lg font-medium text-gray-800 mb-4">
              ¡Compra realizada con éxito!
            </p>
            <button
              onClick={() => {
                setShowSuccessDialog(false);
                onClose();
              }}
              className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Diálogo de error */}
      {showErrorDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 text-center">
            <p className="text-lg font-medium text-red-600 mb-4">
              No hay cursos en el carrito o no has iniciado sesión.
            </p>
            <button
              onClick={() => setShowErrorDialog(false)}
              className="py-2 px-4 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartDialog;
