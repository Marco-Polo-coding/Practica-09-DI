// src/components/UserDialog.jsx
import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import database from "../../firebaseConfig";

// Función para sanitizar el correo para Firebase
const sanitizeEmail = (email) => {
  return email.replace(/\./g, ",");
};

const UserDialog = ({ onClose, userEmail }) => {
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);

  useEffect(() => {
    if (!userEmail) return;

    const fetchUserCourses = async () => {
      try {
        const sanitizedEmail = sanitizeEmail(userEmail);
        const userRef = ref(database, `users/${sanitizedEmail}`);
        const coursesRef = ref(database);

        // Obtener los cursos comprados por el usuario
        const userSnapshot = await get(userRef);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.val();
          setPurchasedCourses(userData.purchasedCourses || []);
        }

        // Obtener todos los cursos
        const coursesSnapshot = await get(coursesRef);
        if (coursesSnapshot.exists()) {
          const coursesData = coursesSnapshot.val();
          setAllCourses(Object.values(coursesData).filter((item) => item.id)); // Filtrar para obtener solo cursos válidos
        }
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    };

    fetchUserCourses();
  }, [userEmail]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
        <h2 className="text-2xl font-bold mb-4">Perfil del Usuario</h2>
        <div className="space-y-4">
          <p className="text-gray-700">
            <strong>Correo Electrónico:</strong> {userEmail}
          </p>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Tus Cursos Comprados</h3>
          {purchasedCourses.length > 0 ? (
            <div className="space-y-4">
              {purchasedCourses.map((courseId) => {
                const course = allCourses.find((item) => item.id === courseId);
                return course ? (
                  <div
                    key={courseId}
                    className="p-4 border rounded-lg flex items-center justify-between"
                  >
                    <div>
                      {/* Título del curso como enlace */}
                      <a
                        href={`/posts/${course.id}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {course.title}
                      </a>
                      <p className="text-gray-600 text-sm">{course.description}</p>
                      <p className="text-gray-800 font-semibold">
                        Instructor: {course.instructor}
                      </p>
                    </div>
                    {/* Imagen del curso */}
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </div>
                ) : null;
              })}
            </div>
          ) : (
            <p className="text-gray-700">No has comprado cursos todavía.</p>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDialog;
