/**
 * Configuración PÚBLICA de la app web de Firebase.
 *
 * Consola de Firebase → ⚙ Configuración del proyecto → Tus apps → app web (</>).
 * Copiá apiKey, authDomain, projectId y appId.
 *
 * Estos valores NO son secretos: viajan en el bundle y cualquiera los puede leer.
 * Lo que protege los datos son las reglas @auth de cada operación (ver
 * dataconnect/cursos/*.gql y REFLEXION.md, pregunta 4).
 *
 * `projectId` tiene que ser el mismo que pusiste en .firebaserc.
 */
export const firebaseConfig = {
  apiKey: "AIzaSyDNw09vginDEXs_dfYs6MdNBSlMNutxTZE",
  authDomain: "proyecto-pa-38252.firebaseapp.com",
  projectId: "proyecto-pa-38252",
  appId: "1:696296988994:web:139aaf4ee5aa7e243d28db",
};
