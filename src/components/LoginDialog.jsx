// src/components/LoginDialog.jsx
import { useState } from "react";

const LoginDialog = ({ onClose, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      setErrorMessage("Por favor, completa todos los campos.");
      return;
    }

    // Obtener usuarios registrados desde localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (!user) {
      setErrorMessage("Correo o contraseña incorrectos.");
      return;
    }

    // Guardar sesión en localStorage
    localStorage.setItem("loggedInUser", JSON.stringify(user));

    // Llamar a la función callback para actualizar el estado en el Header
    onLogin(user.email);

    setSuccessMessage("Inicio de sesión exitoso. ¡Bienvenido!");
    setTimeout(() => {
      setSuccessMessage("");
      onClose(); // Cerrar el diálogo tras mostrar el mensaje de éxito
      setTimeout(() => {
        window.location.reload(); // Recargar la página actual
      }, 100); // Asegurar que la recarga ocurra después del cierre
    }, 1000);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <h2 className="text-xl font-bold mb-4">Iniciar Sesión</h2>
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
            onClick={handleLogin}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginDialog;
