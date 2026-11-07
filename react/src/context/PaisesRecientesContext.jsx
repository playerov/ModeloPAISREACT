import { createContext, useState, useEffect, useCallback } from "react";

export const PaisesRecientesContext = createContext();

// Misma clave que usa el vanilla
const CLAVE = "paisesRecientes";
const LIMITE = 15;

function leerRecientes() {
  try {
    const guardado = localStorage.getItem(CLAVE);
    return guardado ? JSON.parse(guardado) : [];
  } catch {
    return [];
  }
}

export function PaisesRecientesProvider({ children }) {
  // Lectura inicial perezosa: se ejecuta una sola vez al montar
  const [recientes, setRecientes] = useState(leerRecientes);

  // Cada vez que cambia la lista, se guarda
  useEffect(() => {
    localStorage.setItem(CLAVE, JSON.stringify(recientes));
  }, [recientes]);

  // Sin duplicados, el más reciente primero, máximo 15.
  // useCallback: la función es estable y se puede poner en las dependencias de un useEffect.
  const agregarPaisReciente = useCallback((cca3) => {
    setRecientes((prev) => [cca3, ...prev.filter((c) => c !== cca3)].slice(0, LIMITE));
  }, []);

  const limpiarRecientes = useCallback(() => {
    setRecientes([]);
  }, []);

  return (
    <PaisesRecientesContext.Provider
      value={{ recientes, agregarPaisReciente, limpiarRecientes }}
    >
      {children}
    </PaisesRecientesContext.Provider>
  );
}
