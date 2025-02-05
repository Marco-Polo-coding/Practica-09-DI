import React, { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import database from "../../firebaseConfig";

const HeroCarousel = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cargar cursos destacados desde Firebase
  useEffect(() => {
    const coursesRef = ref(database, "/");

    const unsubscribe = onValue(coursesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const coursesArray = Object.values(data).filter((course) => course.likes > 100);
        setFeaturedCourses(coursesArray);
      }
    });

    return () => unsubscribe();
  }, []);

  // Cambiar automáticamente el índice del carrusel cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredCourses.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredCourses]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredCourses.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? featuredCourses.length - 1 : prevIndex - 1
    );
  };

  if (featuredCourses.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">Cargando cursos destacados...</div>
    );
  }

  return (
    <div className="bg-white-100 py-10 mb-0 min-h-[500px]">
      <div className="max-w-6xl mx-auto px-4 relative overflow-hidden">
        <div
          className="flex transition-transform duration-1000 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {featuredCourses.map((course) => (
            <div
              key={course.id}
              className="flex-shrink-0 w-full h-[500px] flex items-center justify-between bg-white shadow-lg rounded-lg overflow-hidden"
            >
              <img
                src={course.image}
                alt={course.title}
                className="w-1/2 object-cover h-96"
              />
              <div className="p-6 w-1/2">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  {course.title}
                </h2>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <div className="flex items-center gap-4 mb-6">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {course.category}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                    {course.level}
                  </span>
                </div>
                <a
                  href={`/posts/${course.id}`}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Ver curso
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Controles de navegación */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white text-gray-800 p-2 rounded-full shadow-md hover:shadow-lg transition"
        >
          ⬅
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white text-gray-800 p-2 rounded-full shadow-md hover:shadow-lg transition"
        >
          ➡
        </button>
      </div>
    </div>
  );
};

export default HeroCarousel;
