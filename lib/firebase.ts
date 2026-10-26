/**
 * Inicialización de Firebase (Auth + SQL Connect) para el navegador.
 *
 * - En `npm run dev` (NODE_ENV=development) se conecta a los EMULADORES locales
 *   (Auth en 9099, SQL Connect en 9399).
 * - En el build de producción habla con los servicios reales de Firebase; por eso
 *   la CSP de firebase.json necesita esos orígenes en connect-src (L6).
 *
 * Se inicializa de forma perezosa: el export estático prerenderiza en Node y ahí
 * no queremos crear clientes de Firebase.
 */
import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { connectAuthEmulator, getAuth, type Auth } from "firebase/auth";
import { connectDataConnectEmulator, getDataConnect, type DataConnect } from "firebase/data-connect";
import { firebaseConfig } from "./firebase-config";

/** Debe coincidir con dataconnect/dataconnect.yaml y dataconnect/cursos/connector.yaml. */
export const conectorCursos = { location: "us-east4", service: "catalogo", connector: "cursos" };

const usarEmuladores = process.env.NODE_ENV === "development";

let instancia: { app: FirebaseApp; auth: Auth; dc: DataConnect } | null = null;

export function firebase() {
  if (instancia) return instancia;

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const dc = getDataConnect(app, conectorCursos);

  if (usarEmuladores) {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
    connectDataConnectEmulator(dc, "127.0.0.1", 9399);
  }

  instancia = { app, auth, dc };
  return instancia;
}
