// src/components/CourseSearch.jsx
import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import database from "../../firebaseConfig";
import { Link } from "react-router-dom";

const CourseSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState([]);

  // Cargar cursos desde Firebase
  useEffect(() => {
    const coursesRef = ref(database, "/");
    const unsubscribe = onValue(coursesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCourses(Object.values(data));
      }
    });
    return () => unsubscribe();
  }, []);

  // Manejar búsqueda
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const url = new URL(window.location.href);
    
    if (query) {
      url.searchParams.set('search', query);
    } else {
      url.searchParams.delete('search');
    }
    
    window.history.replaceState({}, '', url);
  };

  // Filtrar cursos
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar otros cursos..."
            className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={searchQuery}
            onChange={handleSearch}
          />
          <span className="absolute right-3 top-2.5 text-gray-400">
            🔍
          </span>
        </div>
      </div>

      {searchQuery && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCourses.map(course => (
            <Link 
              key={course.id} 
              to={`/posts/${course.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-32 object-cover"
                loading="lazy"
              />
              <div className="p-3">
                <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
                  {course.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseSearch;