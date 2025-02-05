// src/components/LogoutConfirmationDialog.jsx
const LogoutConfirmationDialog = ({ onConfirm, onCancel }) => {
  const handleConfirm = () => {
    // Eliminar la sesión del usuario del localStorage
    localStorage.removeItem("loggedInUser");

    // Ejecutar la función callback proporcionada
    onConfirm();

    // Recargar la página actual
    setTimeout(() => {
      window.location.reload();
    }, 100); // Breve retraso para garantizar la ejecución de lógica previa
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
        <h2 className="text-lg font-bold mb-4">Confirmar Cierre de Sesión</h2>
        <p className="text-gray-700 mb-6">¿Estás seguro de que deseas cerrar sesión?</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="py-2 px-4 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmationDialog;
