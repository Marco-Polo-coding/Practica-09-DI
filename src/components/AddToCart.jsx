// src/components/AddToCart.jsx
import { useState, useEffect } from "react";
import useCartStore from "../store/cartStore"; // Importar el store de Zustand
import useUserStore from "../store/userStore"; // Importar el store de usuario

const AddToCartButton = ({ course }) => {
  const addToCart = useCartStore((state) => state.addToCart); // Hook para añadir al carrito
  const cartItems = useCartStore((state) => state.cartItems); // Obtener los elementos actuales del carrito
  const purchasedCourses = useUserStore((state) => state.purchasedCourses); // Obtener los cursos comprados
  const [showDialog, setShowDialog] = useState(false);
  const [showPurchasedDialog, setShowPurchasedDialog] = useState(false); // Estado para el diálogo de curso comprado
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false); // Estado para el diálogo de duplicado

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    setIsLoggedIn(!!user); // Verificar si el usuario está logueado
  }, []);

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      setShowLoginDialog(true); // Mostrar el diálogo de inicio de sesión
      return;
    }

    // Verificar si el curso ya está comprado
    if (purchasedCourses.includes(course.id)) {
      setShowPurchasedDialog(true); // Mostrar el diálogo si el curso ya está comprado
      return;
    }

    // Verificar si el curso ya está en el carrito
    const courseExists = cartItems.some((item) => item.id === course.id);
    if (courseExists) {
      setShowDuplicateDialog(true); // Mostrar el diálogo si el curso ya está en el carrito
      return;
    }

    // Añadir al carrito utilizando Zustand
    addToCart(course);
    setShowDialog(true); // Mostrar mensaje de confirmación
    setTimeout(() => setShowDialog(false), 2000);
  };

  return (
    <div>
      <button
        onClick={handleAddToCart}
        className="mt-4 w-full text-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        Añadir al carrito
      </button>

      {/* Diálogo de confirmación */}
      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-4 text-center">
            <p className="text-lg font-medium text-gray-800">
              ¡Curso añadido al carrito!
            </p>
            <button
              onClick={() => setShowDialog(false)}
              className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Diálogo de curso comprado */}
      {showPurchasedDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-4 text-center">
            <p className="text-lg font-medium text-red-600">
              Ya tienes este curso comprado.
            </p>
            <button
              onClick={() => setShowPurchasedDialog(false)}
              className="mt-4 py-2 px-4 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Diálogo de inicio de sesión */}
      {showLoginDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-4 text-center">
            <p className="text-lg font-medium text-gray-800">
              Debes iniciar sesión para añadir cursos al carrito.
            </p>
            <button
              onClick={() => setShowLoginDialog(false)}
              className="mt-4 py-2 px-4 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Diálogo de curso duplicado */}
      {showDuplicateDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-4 text-center">
            <p className="text-lg font-medium text-gray-800">
              El curso ya está en el carrito.
            </p>
            <button
              onClick={() => setShowDuplicateDialog(false)}
              className="mt-4 py-2 px-4 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddToCartButton;