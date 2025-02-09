// src/components/RegisterDialog.jsx
import { useState } from "react";
import { ref, set } from "firebase/database";
import database from "../../firebaseConfig";

const RegisterDialog = ({ onClose, onRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegister = async () => {
    if (!email || !password) {
      setErrorMessage("Por favor, completa todos los campos.");
      return;
    }

    try {
      // Reemplazar puntos en el correo electrónico para evitar problemas en Firebase
      const emailKey = email.replace(/\./g, ",");

      // Referencia a la base de datos Firebase
      const userRef = ref(database, `users/${emailKey}`);

      // Crear un nuevo usuario
      const newUser = {
        email,
        password,
        purchasedCourses: [], // Inicializa la lista de cursos comprados vacía
      };

      // Guardar el nuevo usuario en Firebase
      await set(userRef, newUser);

      // Guardar sesión en localStorage para persistencia
      localStorage.setItem("loggedInUser", JSON.stringify(newUser));

      // Llamar a la función callback para actualizar el estado en el Header
      onRegister(email);

      setSuccessMessage("Registro exitoso. ¡Bienvenido!");
      setTimeout(() => {
        setSuccessMessage("");
        onClose(); // Cerrar el diálogo después de mostrar el mensaje
        setTimeout(() => {
          window.location.reload(); // Recargar la página después de cerrar el diálogo
        }, 500); // Dar un pequeño retraso para asegurarse de que el diálogo se cierre primero
      }, 2000);
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      setErrorMessage("Hubo un problema al registrar el usuario.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <h2 className="text-xl font-bold mb-4">Registrarse</h2>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Mensajes de error y éxito */}
        {errorMessage && (
          <div className="mt-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mt-4 p-3 bg-green-100 text-green-600 rounded-lg text-sm">
            {successMessage}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={handleRegister}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Registrarse
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterDialog;
