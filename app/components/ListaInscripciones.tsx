"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { darmeDeBaja, mensajeDeError, misInscripciones, type MisInscripcionesData } from "@/lib/sqlconnect";
import { useUsuario } from "@/lib/useUsuario";

const formatoFecha = new Intl.DateTimeFormat("es-AR", { dateStyle: "medium", timeStyle: "short" });

export default function ListaInscripciones() {
  const usuario = useUsuario();
  const [data, setData] = useState<MisInscripcionesData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setError(null);
    try {
      setData(await misInscripciones());
    } catch (e) {
      setError(mensajeDeError(e));
    }
  }, []);

  useEffect(() => {
    if (usuario) void cargar();
  }, [usuario, cargar]);

  async function baja(cursoId: string) {
    setOcupado(cursoId);
    try {
      await darmeDeBaja(cursoId);
      await cargar();
    } catch (e) {
      setError(mensajeDeError(e));
    } finally {
      setOcupado(null);
    }
  }

  if (usuario === undefined) return <p className="hint">Cargando…</p>;
  if (usuario === null)
    return (
      <p className="hint">
        <Link href="/cuenta">Iniciá sesión</Link> para ver tus inscripciones.
      </p>
    );
  if (error) return <p className="alerta alerta--error">{error}</p>;
  if (!data) return <p className="hint">Cargando inscripciones…</p>;

  const matriculas = data.alumno?.matriculas ?? [];

  return (
    <>
      {data.alumno && <p className="lead">Hola, {data.alumno.nombre}.</p>}
      {matriculas.length === 0 ? (
        <p className="hint">
          Todavía no te inscribiste a ningún curso. <Link href="/cursos">Ver el catálogo</Link>.
        </p>
      ) : (
        <ul className="grilla">
          {matriculas.map((m) => (
            <li key={m.curso.id} className="card">
              <span className={`badge badge--${m.curso.nivel}`}>{m.curso.nivel}</span>
              <h2>{m.curso.titulo}</h2>
              <small>
                {m.curso.horas} horas · inscripto el {formatoFecha.format(new Date(m.fecha))}
              </small>
              <div className="card__accion">
                <button
                  type="button"
                  className="button button--chico button--secundario"
                  disabled={ocupado === m.curso.id}
                  onClick={() => baja(m.curso.id)}
                >
                  {ocupado === m.curso.id ? "Dando de baja…" : "Darme de baja"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
