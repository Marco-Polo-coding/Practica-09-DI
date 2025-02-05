// src/components/CourseDialog.jsx
import { useState, useEffect } from "react";
import { ref, get } from "firebase/database";
import database from "../../firebaseConfig";

// Función para sanitizar el correo para Firebase
const sanitizeEmail = (email) => {
  return email.replace(/\./g, ",");
};

const CourseDialog = ({ courseId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasAccess, setHasAccess] = useState(false); // Estado para verificar acceso al curso
  const [showLoginDialog, setShowLoginDialog] = useState(false); // Estado para el diálogo de inicio de sesión
  const [showNoAccessDialog, setShowNoAccessDialog] = useState(false); // Estado para el diálogo de sin acceso

  // Mapeo de IDs de cursos con sus respectivos enlaces de YouTube
  const youtubeLinks = {
    "0": "https://www.youtube.com/embed/videoseries?si=C_68kVQFAj2luljL&amp;list=PLw3xpQ527lU0Lo_ZD5N_W102p9ZxeNzQq",
    "1": "https://www.youtube.com/embed/videoseries?si=qOfkGZGkXi2tmtRa&amp;list=PLw3xpQ527lU2rmFT8k2ULrHSjJXVy8Xxw",
    "2": "https://www.youtube.com/embed/videoseries?si=3CWiSG6Hy9ADZyKb&amp;list=PLE9GU8FRiaIwtaXK5R-z2wwwjMAU7sl_d",
    "3": "https://www.youtube.com/embed/videoseries?si=VrnvRl5A-YttQDHL&amp;list=PLE9GU8FRiaIzHPVOpcHDK8q_2JaaZON0v",
    "4": "https://www.youtube.com/embed/videoseries?si=Bf2zaE2bT3J96kBi&amp;list=PLjEaoINr3zgFX8ZsChQVQsuDSjEqdWMAD",
    "5": "https://www.youtube.com/embed/videoseries?si=WD2IZuFPDOA7nvpQ&amp;list=PLjEaoINr3zgEL9UjPTLWQhLFAK7wVaRMR",
    "6": "https://www.youtube.com/embed/videoseries?si=jZ0yKelbXRSyWtAJ&amp;list=PLMXbAPr21di9nmPb0-72_avg9QhiPUHyg",
    "7": "https://www.youtube.com/embed/videoseries?si=sJbZzo4vfvUqgjWC&amp;list=PLMXbAPr21di_-1K8CMTAdIUZ-qhxwZwgS",
    "8": "https://www.youtube.com/embed/videoseries?si=sQVhN3TPEDtOBbWk&amp;list=PLMXbAPr21di-Ox-dmDwL2riWedei1dn9S"
  };

  const videoUrl = youtubeLinks[courseId] || "";

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
  }, [courseId]);

  const handleOpenDialog = () => {
    if (!isLoggedIn) {
      setShowLoginDialog(true); // Muestra el diálogo de inicio de sesión
      return;
    }

    if (!hasAccess) {
      setShowNoAccessDialog(true); // Muestra el diálogo de sin acceso
      return;
    }

    setIsOpen(true);
  };

  const closeLoginDialog = () => {
    setShowLoginDialog(false);
  };

  const closeNoAccessDialog = () => {
    setShowNoAccessDialog(false);
  };

  return (
    <>
      <button
        onClick={handleOpenDialog}
        className="bg-blue-600 hover:bg-blue-700 text-white text-center py-3 px-6 rounded-lg transition-colors block font-medium"
      >
        Acceder al curso
      </button>

      {/* Diálogo de inicio de sesión */}
      {showLoginDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative z-10 w-96 flex flex-col items-center text-center">
            <h2 className="text-lg font-semibold mb-4">
              Debes iniciar sesión para acceder al contenido del curso.
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
              Debes comprar este curso para acceder a su contenido.
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

      {/* Diálogo del curso */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
            <h2 className="text-xl font-bold mb-4">Ver curso</h2>
            <div className="relative w-full aspect-video">
              <iframe
                width="100%"
                height="315"
                src={videoUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="rounded-lg"
              ></iframe>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseDialog;
