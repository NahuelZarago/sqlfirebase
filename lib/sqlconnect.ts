/**
 * Acceso a SQL Connect: la app invoca operaciones POR NOMBRE con sus variables.
 * Nunca manda SQL; el servidor solo ejecuta las operaciones declaradas en
 * dataconnect/cursos/*.gql y aplica el @auth de cada una.
 */
import { executeMutation, executeQuery, mutationRef, queryRef } from "firebase/data-connect";
import type { Curso, Nivel } from "./cursos";
import { firebase } from "./firebase";

export interface Matricula {
  fecha: string;
  curso: { id: string; titulo: string; nivel: Nivel; horas: number };
}

export interface MisInscripcionesData {
  alumno: { nombre: string; matriculas: Matricula[] } | null;
}

/** SQL Connect puede devolver los UUID sin guiones; los comparamos normalizados. */
export const mismoId = (a: string, b: string) =>
  a.replace(/-/g, "").toLowerCase() === b.replace(/-/g, "").toLowerCase();

export async function listarCursos(): Promise<Curso[]> {
  const { dc } = firebase();
  const r = await executeQuery(queryRef<{ cursos: Curso[] }, undefined>(dc, "ListCursos"));
  return r.data.cursos;
}

export async function guardarAlumno(nombre: string): Promise<void> {
  const { dc } = firebase();
  await executeMutation(mutationRef<unknown, { nombre: string }>(dc, "UpsertAlumno", { nombre }));
}

export async function inscribirme(cursoId: string): Promise<void> {
  const { dc } = firebase();
  await executeMutation(mutationRef<unknown, { cursoId: string }>(dc, "Inscribirme", { cursoId }));
}

export async function darmeDeBaja(cursoId: string): Promise<void> {
  const { dc } = firebase();
  await executeMutation(mutationRef<unknown, { cursoId: string }>(dc, "DarmeDeBaja", { cursoId }));
}

export async function misInscripciones(): Promise<MisInscripcionesData> {
  const { dc } = firebase();
  const r = await executeQuery(queryRef<MisInscripcionesData, undefined>(dc, "MisInscripciones"));
  return r.data;
}

/** Convierte errores de Firebase en un mensaje legible para la UI. */
export function mensajeDeError(e: unknown): string {
  const texto = String((e as { message?: string })?.message ?? e);
  if (/unauthenticated/i.test(texto)) return "Tenés que iniciar sesión para hacer esto.";
  if (/permission|denied/i.test(texto)) return "No tenés permiso para hacer esto.";
  if (/network|fetch|connect/i.test(texto)) return "No se pudo conectar con el servidor.";
  return texto;
}
