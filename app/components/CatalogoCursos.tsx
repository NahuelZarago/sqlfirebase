"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Curso } from "@/lib/cursos";
import { inscribirme, listarCursos, mensajeDeError, misInscripciones, mismoId } from "@/lib/sqlconnect";
import { useUsuario } from "@/lib/useUsuario";
import FiltroCursos from "./FiltroCursos";

export default function CatalogoCursos() {
  const usuario = useUsuario();
  const [cursos, setCursos] = useState<Curso[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inscriptos, setInscriptos] = useState<string[]>([]);
  const [ocupado, setOcupado] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  // El catálogo es público: se lee aunque no haya sesión.
  useEffect(() => {
    listarCursos()
      .then(setCursos)
      .catch((e) => setError(mensajeDeError(e)));
  }, []);

  const cargarInscripciones = useCallback(async () => {
    if (!usuario) {
      setInscriptos([]);
      return;
    }
    try {
      const data = await misInscripciones();
      setInscriptos(data.alumno?.matriculas.map((m) => m.curso.id) ?? []);
    } catch {
      setInscriptos([]);
    }
  }, [usuario]);

  useEffect(() => {
    void cargarInscripciones();
  }, [cargarInscripciones]);

  async function alInscribirme(curso: Curso) {
    setOcupado(curso.id);
    setAviso(null);
    try {
      await inscribirme(curso.id);
      setAviso(`Listo: quedaste inscripto en "${curso.titulo}".`);
      await cargarInscripciones();
    } catch (e) {
      setAviso(mensajeDeError(e));
    } finally {
      setOcupado(null);
    }
  }

  if (error)
    return (
      <p className="alerta alerta--error">
        No se pudo cargar el catálogo: {error}
        <br />
        <small>En desarrollo: ¿están corriendo `npm run emulators` y se ejecutó `npm run seed`?</small>
      </p>
    );
  if (!cursos) return <p className="hint">Cargando cursos…</p>;

  return (
    <>
      {usuario === null && (
        <p className="hint">
          <Link href="/cuenta">Iniciá sesión o creá una cuenta</Link> para inscribirte.
        </p>
      )}
      {aviso && (
        <p className="alerta" role="status">
          {aviso}
        </p>
      )}
      <FiltroCursos
        cursos={cursos}
        accion={(c) => {
          if (!usuario) return null;
          const yaInscripto = inscriptos.some((id) => mismoId(id, c.id));
          if (yaInscripto) return <span className="estado-ok">✔ Inscripto</span>;
          return (
            <button
              type="button"
              className="button button--chico"
              disabled={ocupado === c.id}
              onClick={() => alInscribirme(c)}
            >
              {ocupado === c.id ? "Inscribiendo…" : "Inscribirme"}
            </button>
          );
        }}
      />
    </>
  );
}
