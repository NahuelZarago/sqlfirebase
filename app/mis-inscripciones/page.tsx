import ListaInscripciones from "../components/ListaInscripciones";

export const metadata = {
  title: "Mis inscripciones | Catálogo de Cursos",
};

export default function MisInscripcionesPage() {
  return (
    <section>
      <h1>Mis inscripciones</h1>
      <ListaInscripciones />
    </section>
  );
}
