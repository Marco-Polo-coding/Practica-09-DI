// src/components/LikeButton.jsx
import { useState, useEffect } from "react";
import { ref, get, update } from "firebase/database";
import database from "../../firebaseConfig";

// Función para sanitizar el correo para Firebase
const sanitizeEmail = (email) => {
  return email.replace(/\./g, ",");
};

const LikeButton = ({ courseId }) => {
  const [likes, setLikes] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasAccess, setHasAccess] = useState(false); // Verifica si el usuario compró el curso
  const [showLoginDialog, setShowLoginDialog] = useState(false); // Diálogo de inicio de sesión
  const [showNoAccessDialog, setShowNoAccessDialog] = useState(false); // Diálogo de sin acceso

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    setIsLoggedIn(!!user); // Verifica si hay un usuario logueado

    if (user) {
      const sanitizedEmail = sanitizeEmail(user.email);

      const checkAccess = async () => {
        try {
          const userRef = ref(database, `users/${sanitizedEmail}`);
          const snapshot = await get(userRef);

          if (snapshot.exists()) {
            const userData = snapshot.val();
            if (userData.purchasedCourses?.includes(courseId)) {
              setHasAccess(true);
            } else {
              setHasAccess(false);
            }
          } else {
            setHasAccess(false);
          }
        } catch (error) {
          console.error("Error al verificar el acceso al curso:", error);
        }
      };

      checkAccess();
    }

    const fetchLikes = async () => {
      try {
        const courseRef = ref(database, `/${courseId}`);
        const snapshot = await get(courseRef);
        if (snapshot.exists()) {
          const courseData = snapshot.val();
          setLikes(courseData.likes || 0);
        }
      } catch (error) {
        console.error("Error al obtener los likes:", error);
      }
    };

    fetchLikes();
  }, [courseId]);

  const handleLike = async () => {
    if (!isLoggedIn) {
      setShowLoginDialog(true); // Mostrar diálogo de inicio de sesión
      return;
    }

    if (!hasAccess) {
      setShowNoAccessDialog(true); // Mostrar diálogo de sin acceso
      return;
    }

    if (isUpdating) return;

    setIsUpdating(true);
    try {
      const newLikes = likes + 1;
      const courseRef = ref(database, `/${courseId}`);
      await update(courseRef, { likes: newLikes });
      setLikes(newLikes);
    } catch (error) {
      console.error("Error al actualizar los likes:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const closeLoginDialog = () => {
    setShowLoginDialog(false);
  };

  const closeNoAccessDialog = () => {
    setShowNoAccessDialog(false);
  };

  return (
    <div className="flex items-center justify-center relative">
      {/* Botón de "Me gusta" */}
      <button
        onClick={handleLike}
        disabled={isUpdating}
        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium border transition ${
          isUpdating
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        <span className="text-red-500 font-bold text-lg">❤️</span>
        <span className="text-gray-700 text-sm">{likes}</span>
      </button>

      {/* Diálogo de inicio de sesión */}
      {showLoginDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative z-10 w-96 flex flex-col items-center text-center">
            <h2 className="text-lg font-semibold mb-4">
              Debes iniciar sesión para dar "Me gusta".
            </h2>
            <button
              onClick={closeLoginDialog}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Diálogo de sin acceso */}
      {showNoAccessDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative z-10 w-96 flex flex-col items-center text-center">
            <h2 className="text-lg font-semibold mb-4">
              Debes comprar este curso para dar "Me gusta".
            </h2>
            <button
              onClick={closeNoAccessDialog}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LikeButton;
