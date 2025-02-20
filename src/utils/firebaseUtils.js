import { ref, update } from "firebase/database";
import database from "../../firebaseConfig";

/**
 * Actualiza las preferencias del usuario en Firebase
 * @param {string} email - Correo del usuario
 * @param {Object} preferences - Preferencias a actualizar (ej: moneda, idioma)
 */
export const updateUserPreferences = async (email, preferences) => {
  if (!email) return;

  // Reemplazar puntos en el email para que Firebase lo acepte como clave
  const emailKey = email.replace(/\./g, ",");

  try {
    const userRef = ref(database, `users/${emailKey}`);

    await update(userRef, preferences);
    console.log("Preferencias actualizadas en Firebase:", preferences);
  } catch (error) {
    console.error("Error al actualizar preferencias:", error);
  }
};
