import CatalogoCursos from "../components/CatalogoCursos";

export const metadata = {
  title: "Cursos | Catálogo de Cursos",
};

export default function CursosPage() {
  return (
    <section>
      <h1>Cursos disponibles</h1>
      <p className="hint">
        El catálogo se lee de PostgreSQL a través de SQL Connect (operación pública
        <code> ListCursos</code>). Para inscribirte necesitás una cuenta.
      </p>
      <CatalogoCursos />
    </section>
  );
}
