"use client";

import { onAuthStateChanged, type User } from "firebase/auth";
import { useEffect, useState } from "react";
import { firebase } from "./firebase";

/** Usuario de Firebase Auth actual. `undefined` mientras se resuelve la sesión. */
export function useUsuario(): User | null | undefined {
  const [usuario, setUsuario] = useState<User | null | undefined>(undefined);
  useEffect(() => onAuthStateChanged(firebase().auth, setUsuario), []);
  return usuario;
}
