// src/components/Header.jsx
import { useState, useEffect } from "react";
import useCartStore from "../store/cartStore"; // Importar el store de Zustand
import LoginDialog from "./LoginDialog";
import RegisterDialog from "./RegisterDialog";
import UserDialog from "./UserDialog";
import LogoutConfirmationDialog from "./LogoutConfirmationDialog";
import CartDialog from "./CartDialog";
import { ref, onValue } from "firebase/database";
import database from "../../firebaseConfig";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showCartDialog, setShowCartDialog] = useState(false);

  // Obtener el estado global del carrito desde Zustand
  const cartItems = useCartStore((state) => state.cartItems);

  // Cargar usuario logueado desde localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user) setLoggedInUser(user.email);
  }, []);

  // Cargar cursos desde Firebase
  useEffect(() => {
    const coursesRef = ref(database, "/");
    const unsubscribe = onValue(coursesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setCourses(Object.values(data));
    });
    return () => unsubscribe();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      const results = courses.filter((course) =>
        course?.title?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCourses(results);
    } else {
      setFilteredCourses([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setLoggedInUser(null);
    setShowUserDialog(false);
    setShowLogoutDialog(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo */}
        <a
          href="/"
          className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
        >
          Art Academy
        </a>

        {/* Barra de búsqueda */}
        <div className="flex-grow mx-8 relative flex items-center">
          <input
            type="text"
            placeholder="Buscar cursos por título..."
            className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
          {filteredCourses.length > 0 && (
            <div className="absolute top-12 left-0 w-full bg-white shadow-lg rounded-lg p-4 max-h-64 overflow-y-auto z-10">
              {filteredCourses.map((course) => (
                <a
                  key={course.id}
                  href={`/posts/${course.id}`}
                  className="flex items-center gap-4 p-2 hover:bg-gray-100 rounded-md transition"
                >
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                  <span className="text-gray-800 font-medium">
                    {course.title}
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Ícono de carrito */}
        <div
          className="mr-4 cursor-pointer relative text-2xl"
          onClick={() => setShowCartDialog(true)}
          title="Carrito de compras"
        >
          🛒
          {cartItems.length > 0 && (
            <span className="absolute -bottom-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {cartItems.length}
            </span>
          )}
        </div>

        {/* Botones de sesión */}
        <div className="flex items-center space-x-4">
          {loggedInUser ? (
            <div className="flex items-center space-x-2">
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => setShowUserDialog(true)}
              >
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  {loggedInUser.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-800">{loggedInUser}</span>
              </div>
              <button
                onClick={() => setShowLogoutDialog(true)}
                className="py-2 px-4 text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => setShowLoginDialog(true)}
                className="py-2 px-4 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => setShowRegisterDialog(true)}
                className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Registrarse
              </button>
            </>
          )}
        </div>
      </div>

      {/* Diálogos */}
      {showLoginDialog && (
        <LoginDialog
          onClose={() => setShowLoginDialog(false)}
          onLogin={(email) => setLoggedInUser(email)}
        />
      )}
      {showRegisterDialog && (
        <RegisterDialog
          onClose={() => setShowRegisterDialog(false)}
          onRegister={(email) => setLoggedInUser(email)}
        />
      )}
      {showUserDialog && (
        <UserDialog
          onClose={() => setShowUserDialog(false)}
          userEmail={loggedInUser}
        />
      )}
      {showLogoutDialog && (
        <LogoutConfirmationDialog
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutDialog(false)}
        />
      )}
      {showCartDialog && <CartDialog onClose={() => setShowCartDialog(false)} />}
    </header>
  );
};

export default Header;
