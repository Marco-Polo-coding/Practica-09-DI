import { useEffect, useState } from "react";
import { ref, get, update } from "firebase/database";
import database from "../../firebaseConfig";
import useCurrencyStore from "../store/currencyStore";
import CoursePrice from "./CoursePrice"; // Importamos CoursePrice

// Función para sanitizar el correo para Firebase
const sanitizeEmail = (email) => email.replace(/\./g, ",");

const UserDialog = ({ onClose, userEmail }) => {
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("EUR"); // Estado de la moneda

  const { setCurrency } = useCurrencyStore(); // Acceder al store de moneda

  useEffect(() => {
    if (!userEmail) return;

    const fetchUserData = async () => {
      try {
        const sanitizedEmail = sanitizeEmail(userEmail);
        const userRef = ref(database, `users/${sanitizedEmail}`);

        // Obtener los datos del usuario desde Firebase
        const userSnapshot = await get(userRef);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.val();
          setPurchasedCourses(userData.purchasedCourses || []);
          setSelectedCurrency(userData.currency || "EUR"); // Obtener la moneda guardada
          setCurrency(userData.currency || "EUR"); // Actualizar Zustand con la moneda guardada
        }

        // Obtener todos los cursos
        const coursesRef = ref(database);
        const coursesSnapshot = await get(coursesRef);
        if (coursesSnapshot.exists()) {
          const coursesData = coursesSnapshot.val();
          setAllCourses(Object.values(coursesData).filter((item) => item.id));
        }
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    };

    fetchUserData();
  }, [userEmail, setCurrency]);

  // Manejar cambio de moneda
  const handleCurrencyChange = async (e) => {
    const newCurrency = e.target.value;
    setSelectedCurrency(newCurrency);
    setCurrency(newCurrency); // Actualizar Zustand

    if (userEmail) {
      const sanitizedEmail = sanitizeEmail(userEmail);
      const userRef = ref(database, `users/${sanitizedEmail}`);

      try {
        await update(userRef, { currency: newCurrency });
        console.log("Preferencia de moneda actualizada en Firebase:", newCurrency);
      } catch (error) {
        console.error("Error al actualizar la moneda en Firebase:", error);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative max-h-[90vh] overflow-hidden">
        <div className="overflow-y-auto max-h-[75vh] pr-2">
          <h2 className="text-2xl font-bold mb-4">Perfil del Usuario</h2>
          <div className="space-y-4">
            <p className="text-gray-700">
              <strong>Correo Electrónico:</strong> {userEmail}
            </p>
          </div>

          {/* Selector de moneda */}
          <div className="mt-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Preferencia de Moneda:
            </label>
            <select
              value={selectedCurrency}
              onChange={handleCurrencyChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="EUR">€ Euro</option>
              <option value="USD">$ Dólar</option>
              <option value="GBP">£ Libra</option>
            </select>
          </div>

          {/* Cursos Comprados */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Tus Cursos Comprados</h3>
            {purchasedCourses.length > 0 ? (
              <div className="space-y-4">
                {purchasedCourses.map((courseId) => {
                  const course = allCourses.find((item) => item.id === courseId);
                  return course ? (
                    <div key={courseId} className="p-4 border rounded-lg flex items-center justify-between">
                      <div>
                        <a href={`/posts/${course.id}`} className="font-medium text-blue-600 hover:underline">
                          {course.title}
                        </a>
                        <p className="text-gray-600 text-sm">{course.description}</p>
                        <p className="text-gray-800 font-semibold">Instructor: {course.instructor}</p>
                        {/* Mostrar precio con conversión de moneda */}
                        <p className="text-gray-800 font-semibold">
                          Precio: <CoursePrice price={course.price} />
                        </p>
                      </div>
                      <img src={course.image} alt={course.title} className="w-16 h-16 object-cover rounded-lg" />
                    </div>
                  ) : null;
                })}
              </div>
            ) : (
              <p className="text-gray-700">No has comprado cursos todavía.</p>
            )}
          </div>
        </div>

        {/* Botón de cerrar siempre visible */}
        <div className="mt-4 flex justify-end border-t pt-4">
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
