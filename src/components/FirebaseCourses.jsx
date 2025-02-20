// src/components/FirebaseCourses.jsx
import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import database from "../../firebaseConfig";
import AddToCartButton from "../components/AddToCart.jsx"; // Botón de carrito
import useUserStore from "../store/userStore"; // Store de usuario
import useCurrencyStore from "../store/currencyStore"; // Store de moneda
import { convertPrice } from "../utils/currencyUtils"; // Conversión de moneda
import CoursePrice from "./CoursePrice.jsx";

const FirebaseCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");

  const purchasedCourses = useUserStore((state) => state.purchasedCourses);
  const { currency } = useCurrencyStore(); // Obtener moneda global

  // Carga de cursos desde Firebase
  useEffect(() => {
    const coursesRef = ref(database, "/");
    const unsubscribe = onValue(coursesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const coursesArray = Object.entries(data)
          .map(([id, course]) => ({ id, ...course }))
          .filter((course) => course.title && course.image); // Filtrar cursos válidos
        setCourses(coursesArray);

        // Extraer categorías únicas
        const uniqueCategories = [...new Set(coursesArray.map((course) => course.category))];
        setCategories(uniqueCategories.sort());
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Leer filtros desde la URL al cargar la página
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromUrl = urlParams.get("category");
    const levelFromUrl = urlParams.get("level");

    if (categoryFromUrl) setSelectedCategory(categoryFromUrl);
    if (levelFromUrl) setSelectedLevel(levelFromUrl);
  }, []);

  // Manejar filtros dinámicamente y actualizar URL
  const updateFilters = (param, value) => {
    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set(param, value);
    } else {
      url.searchParams.delete(param);
    }
    window.history.pushState({}, "", url);
  };

  // Cambiar categoría
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    updateFilters("category", e.target.value);
  };

  // Cambiar nivel
  const handleLevelChange = (e) => {
    setSelectedLevel(e.target.value);
    updateFilters("level", e.target.value);
  };

  // Resetear filtros
  const handleResetFilters = () => {
    setSelectedCategory("");
    setSelectedLevel("");
    const url = new URL(window.location.href);
    url.searchParams.delete("category");
    url.searchParams.delete("level");
    window.history.pushState({}, "", url);
  };

  // Filtrar cursos según la categoría y nivel seleccionados
  const filteredCourses = courses.filter((course) => {
    return (!selectedCategory || course.category === selectedCategory) &&
           (!selectedLevel || course.level === selectedLevel);
  });

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Cargando cursos...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pt-0">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Nuestros Cursos</h2>

      {/* Filtros */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 justify-center items-center">
        <div className="w-full md:max-w-xs">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="w-full md:max-w-xs">
          <select
            value={selectedLevel}
            onChange={handleLevelChange}
            className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">Todos los niveles</option>
            <option value="Básico">Básico</option>
            <option value="Avanzado">Avanzado</option>
          </select>
        </div>

        <button
          onClick={handleResetFilters}
          className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Resetear Filtros
        </button>
      </div>

      {/* Lista de cursos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const isPurchased = purchasedCourses.includes(course.id);

          return (
            <article
              key={course.id}
              className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105 ${
                isPurchased ? "border-2 border-green-500" : ""
              }`}
            >
              <div className="mb-4 relative h-48 overflow-hidden rounded-lg">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{course.title}</h3>
              <div className="flex gap-2 mb-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {course.category}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  {course.level}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                <span>🕒 {course.duration}</span>
                <span>💵 <CoursePrice price={course.price} /></span>
                <span>❤️ {course.likes}</span>
              </div>
              <a
                href={`/posts/${course.id}`}
                className="inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Ver curso
              </a>
              {isPurchased ? (
                <p className="mt-2 text-green-600 font-semibold text-center">¡Comprado!</p>
              ) : (
                <AddToCartButton course={course} />
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default FirebaseCourses;
