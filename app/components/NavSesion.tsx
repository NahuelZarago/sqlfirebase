"use client";

import Link from "next/link";
import { useUsuario } from "@/lib/useUsuario";

export default function NavSesion() {
  const usuario = useUsuario();
  return (
    <>
      {usuario && <Link href="/mis-inscripciones">Mis inscripciones</Link>}
      <Link href="/cuenta">{usuario ? usuario.displayName || "Mi cuenta" : "Ingresar"}</Link>
    </>
  );
}
