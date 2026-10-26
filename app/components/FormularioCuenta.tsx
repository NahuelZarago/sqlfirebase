"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { firebase } from "@/lib/firebase";
import { guardarAlumno } from "@/lib/sqlconnect";
import { useUsuario } from "@/lib/useUsuario";

function mensajeAuth(e: unknown): string {
  const codigo = (e as { code?: string })?.code ?? "";
  const mensajes: Record<string, string> = {
    "auth/email-already-in-use": "Ya existe una cuenta con ese email. Probá iniciar sesión.",
    "auth/invalid-email": "El email no es válido.",
    "auth/weak-password": "La contraseña tiene que tener al menos 6 caracteres.",
    "auth/invalid-credential": "Email o contraseña incorrectos.",
    "auth/user-not-found": "Email o contraseña incorrectos.",
    "auth/wrong-password": "Email o contraseña incorrectos.",
    "auth/operation-not-allowed": "El acceso con email/contraseña no está habilitado en la consola de Firebase.",
  };
  return mensajes[codigo] ?? String((e as { message?: string })?.message ?? e);
}

export default function FormularioCuenta() {
  const usuario = useUsuario();
  const [modo, setModo] = useState<"ingresar" | "registrarme">("ingresar");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    const { auth } = firebase();
    try {
      if (modo === "registrarme") {
        const cred = await createUserWithEmailAndPassword(auth, email, clave);
        await updateProfile(cred.user, { displayName: nombre });
        // Crea la fila en Alumno: id y email los pone el servidor desde el token.
        await guardarAlumno(nombre);
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, clave);
        // Asegura que exista la fila del alumno (p. ej. cuentas creadas antes del deploy).
        await guardarAlumno(cred.user.displayName || email.split("@")[0]);
      }
    } catch (err) {
      setError(mensajeAuth(err));
    } finally {
      setEnviando(false);
    }
  }

  if (usuario === undefined) return <p className="hint">Cargando…</p>;

  if (usuario)
    return (
      <div className="panel">
        <p>
          Sesión iniciada como <strong>{usuario.displayName || usuario.email}</strong>
          {usuario.displayName && <> ({usuario.email})</>}.
        </p>
        <p className="acciones">
          <Link className="button" href="/cursos">
            Ver cursos
          </Link>
          <Link className="button button--secundario" href="/mis-inscripciones">
            Mis inscripciones
          </Link>
          <button type="button" className="button button--secundario" onClick={() => signOut(firebase().auth)}>
            Cerrar sesión
          </button>
        </p>
      </div>
    );

  return (
    <form className="panel formulario" onSubmit={enviar}>
      <div className="chips" role="tablist" aria-label="Elegí una opción">
        <button
          type="button"
          role="tab"
          aria-selected={modo === "ingresar"}
          className={modo === "ingresar" ? "chip chip--activo" : "chip"}
          onClick={() => setModo("ingresar")}
        >
          Iniciar sesión
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={modo === "registrarme"}
          className={modo === "registrarme" ? "chip chip--activo" : "chip"}
          onClick={() => setModo("registrarme")}
        >
          Crear cuenta
        </button>
      </div>

      {modo === "registrarme" && (
        <label>
          Nombre
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} required autoComplete="name" />
        </label>
      )}
      <label>
        Email
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
      </label>
      <label>
        Contraseña
        <input
          type="password"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          required
          minLength={6}
          autoComplete={modo === "registrarme" ? "new-password" : "current-password"}
        />
      </label>

      {error && (
        <p className="alerta alerta--error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="button" disabled={enviando}>
        {enviando ? "Enviando…" : modo === "registrarme" ? "Crear cuenta" : "Ingresar"}
      </button>
    </form>
  );
}
