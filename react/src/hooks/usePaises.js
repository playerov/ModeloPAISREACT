import { useEffect, useState } from "react";
import { getPaises } from "../services/api";

// Carga el catálogo y lo vuelve a pedir cuando cambia algún filtro.
export function usePaises({ buscar = "", continente = "", idioma = "" }) {
  const [paises, setPaises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true; // evita pisar el estado con una respuesta vieja

    async function cargar() {
      try {
        setLoading(true);
        setError(null);
        const data = await getPaises({ buscar, continente, idioma });
        if (activo) setPaises(data);
      } catch (err) {
        if (activo) {
          setError("Error al cargar los países. Asegúrate de que el servidor esté corriendo.");
        }
      } finally {
        if (activo) setLoading(false);
      }
    }

    cargar();
    return () => {
      activo = false;
    };
  }, [buscar, continente, idioma]);

  return { paises, loading, error };
}
