import type { Metadata } from "next";
import Link from "next/link";
import { buildInfo } from "@/lib/build-info";
import NavSesion from "./components/NavSesion";
import "./globals.css";

export const metadata: Metadata = {
  title: "Catálogo de Cursos | Práctica SQL Connect",
  description: "Catálogo de cursos con inscripciones: Next.js estático + Firebase Auth + SQL Connect.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <header className="site-header">
          <Link href="/" className="brand">
            Catálogo de Cursos
          </Link>
          <nav>
            <Link href="/">Inicio</Link>
            <Link href="/cursos">Cursos</Link>
            <NavSesion />
          </nav>
        </header>

        <main className="container">{children}</main>

        <footer className="site-footer">
          <span>
            Versión <code data-testid="build-sha">{buildInfo.commit}</code>
          </span>
          <span>
            Rama <code>{buildInfo.branch}</code>
          </span>
          <span>Build: {buildInfo.builtAt}</span>
        </footer>
      </body>
    </html>
  );
}
