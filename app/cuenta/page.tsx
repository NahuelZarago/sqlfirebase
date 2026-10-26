import FormularioCuenta from "../components/FormularioCuenta";

export const metadata = {
  title: "Mi cuenta | Catálogo de Cursos",
};

export default function CuentaPage() {
  return (
    <section>
      <h1>Mi cuenta</h1>
      <FormularioCuenta />
    </section>
  );
}
