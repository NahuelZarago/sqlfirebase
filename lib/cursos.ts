/**
 * Tipos del catálogo. Desde la clase 2 los datos ya no están escritos en el
 * código: se leen de PostgreSQL con la operación ListCursos (lib/sqlconnect.ts).
 */
export type Nivel = "inicial" | "intermedio" | "avanzado";

export interface Curso {
  id: string;
  titulo: string;
  nivel: Nivel;
  horas: number;
  descripcion: string;
}
