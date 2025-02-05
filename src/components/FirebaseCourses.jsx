// src/components/FirebaseCourses.jsx
import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import database from "../../firebaseConfig";
import AddToCartButton from "../components/AddToCart.jsx"; // Importamos el botón de carrito
import useUserStore from "../store/userStore"; // Importar el store de usuario

const FirebaseCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");

  const purchasedCourses = useUserStore((state) => state.purchasedCourses); // Cursos comprados

  // Carga de cursos desde Firebase
  useEffect(() => {
    const coursesRef = ref(database, "/");
    const unsubscribe = onValue(coursesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const coursesArray = Object.entries(data)
          .map(([id, course]) => ({ id, ...course }))
          .filter((course) => course.title && course.image); // Filtrar cursos con datos válidos
        setCourses(coursesArray);

        // Extraer categorías únicas
        const uniqueCategories = [
          ...new Set(coursesArray.map((course) => course.category)),
        ];
        setCategories(uniqueCategories.sort());
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Leer filtros desde la URL al cargar la página
  useEffect(() => {
    const url = new URL(window.location.href);
    const categoryFromUrl = url.searchParams.get("category");
    const levelFromUrl = url.searchParams.get("level");

    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
    if (levelFromUrl) {
      setSelectedLevel(levelFromUrl);
    }
  }, []);

  // Manejar cambio de categoría
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    const url = new URL(window.location.href);
    if (category) {
      url.searchParams.set("category", category);
      setSelectedCategory(category);
    } else {
      url.searchParams.delete("category");
      setSelectedCategory("");
    }
    window.history.pushState({}, "", url);
  };

  // Manejar cambio de nivel
  const handleLevelChange = (e) => {
    const level = e.target.value;
    const url = new URL(window.location.href);
    if (level) {
      url.searchParams.set("level", level);
      setSelectedLevel(level);
    } else {
      url.searchParams.delete("level");
      setSelectedLevel("");
    }
    window.history.pushState({}, "", url);
  };

  // Manejar reinicio de filtros
  const handleResetFilters = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("category");
    url.searchParams.delete("level");
    window.history.pushState({}, "", url);

    setSelectedCategory("");
    setSelectedLevel("");
  };

  // Filtrar cursos por categoría y nivel
  const filteredCourses = courses.filter((course) => {
    const categoryMatch = !selectedCategory || course.category === selectedCategory;
    const levelMatch = !selectedLevel || course.level === selectedLevel;
    return categoryMatch && levelMatch;
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
              <option key={category} value={category}>
                {category}
              </option>
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

        <div>
          <button
            onClick={handleResetFilters}
            className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Resetear Filtros
          </button>
        </div>
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
                <span>💵 {course.price}€</span>
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
