import { useState, useEffect } from "react";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import PaisCard from "../components/PaisCard";
import { getPais } from "../services/api";
import { usePaisesRecientes } from "../hooks/usePaisesRecientes";

function Recientes() {
  const { recientes, limpiarRecientes } = usePaisesRecientes();
  const [paises, setPaises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;

    async function cargar() {
      try {
        setLoading(true);
        setError(null);
        // Un pedido por código, todos a la vez. Si uno falla se descarta (como en el vanilla)
        const lista = await Promise.all(
          recientes.map((cca3) => getPais(cca3).catch(() => null))
        );
        if (activo) setPaises(lista.filter(Boolean));
      } catch (err) {
        if (activo) setError("Error al cargar los países recientes.");
      } finally {
        if (activo) setLoading(false);
      }
    }

    cargar();
    return () => {
      activo = false;
    };
  }, [recientes]);

  return (
    <div className="recientes">
      <div className="container">
        <h2 className="page-title">Países Recientes</h2>

        {loading && <Loading message="Cargando países recientes..." />}
        {error && <ErrorMessage message={error} />}

        {!loading && !error && paises.length === 0 && (
          <p className="empty-message">No has visto ningún país aún.</p>
        )}

        {!loading && !error && paises.length > 0 && (
          <>
            <div className="paises-grid">
              {paises.map((pais) => (
                <PaisCard key={pais.cca3} pais={pais} />
              ))}
            </div>
            <button
              type="button"
              className="btn-home"
              style={{ marginTop: "1.5rem", cursor: "pointer", border: "none" }}
              onClick={limpiarRecientes}
            >
              🗑️ Limpiar recientes
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Recientes;
