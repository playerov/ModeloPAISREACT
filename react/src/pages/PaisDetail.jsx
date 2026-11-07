import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import { getPais } from "../services/api";
import { usePaisesRecientes } from "../hooks/usePaisesRecientes";
import { formatPoblacion } from "../utils/formatPoblacion";

const SIN_BANDERA = "https://via.placeholder.com/400x300?text=Sin+Bandera";

function PaisDetail() {
  const { cca3 } = useParams();
  const navigate = useNavigate();
  const { agregarPaisReciente } = usePaisesRecientes();

  const [pais, setPais] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;

    async function cargar() {
      try {
        setLoading(true);
        setError(null);
        const data = await getPais(cca3);
        if (!activo) return;
        setPais(data);
        // Se guarda el código que vino del servidor, no el de la URL
        agregarPaisReciente(data.cca3);
      } catch (err) {
        if (activo) {
          setPais(null);
          setError("Error al cargar el país.");
        }
      } finally {
        if (activo) setLoading(false);
      }
    }

    cargar();
    return () => {
      activo = false;
    };
  }, [cca3, agregarPaisReciente]);

  // Datos derivados (solo cuando ya hay país)
  let contenido = null;

  if (loading) {
    contenido = <Loading message="Cargando país..." />;
  } else if (error) {
    contenido = <ErrorMessage message={error} />;
  } else if (!pais) {
    contenido = <p className="empty-message">País no encontrado.</p>;
  } else {
    const nombreComun = pais.nombre?.común || "Sin nombre";
    const nombreOficial = pais.nombre?.oficial || "";
    const capital = Array.isArray(pais.capital)
      ? pais.capital.join(", ")
      : pais.capital || "N/A";
    const idiomas = Object.entries(pais.idiomas || {});
    const monedas = Object.entries(pais.monedas || {}).filter(
      ([, info]) => info && typeof info === "object"
    );
    const banderaAlt = pais.banderas?.alt || "";

    contenido = (
      <div className="detalle-container">
        <div className="detalle-header">
          <div className="detalle-image">
            <img
              src={pais.banderas?.png || SIN_BANDERA}
              alt={nombreComun}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = SIN_BANDERA;
              }}
            />
          </div>
          <div className="detalle-info">
            <h2>{nombreComun}</h2>
            <p style={{ color: "#666", marginBottom: "1rem" }}>{nombreOficial}</p>
            <div className="detalle-meta">
              <span>
                🌍 <strong>Región:</strong> {pais.región || "N/A"}
              </span>
              <span>
                📍 <strong>Subregión:</strong> {pais.subregión || "N/A"}
              </span>
              <span>
                🏛️ <strong>Capital:</strong> {capital}
              </span>
              <span>
                👥 <strong>Población:</strong> {formatPoblacion(pais.población)}
              </span>
            </div>
          </div>
        </div>

        {idiomas.length > 0 && (
          <div className="detalle-section">
            <h3>Idiomas</h3>
            <ul className="info-list">
              {idiomas.map(([codigo, nombre]) => (
                <li key={codigo}>
                  <strong>{codigo.toUpperCase()}:</strong> {String(nombre)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {monedas.length > 0 && (
          <div className="detalle-section">
            <h3>Monedas</h3>
            <ul className="info-list">
              {monedas.map(([codigo, info]) => (
                <li key={codigo}>
                  <strong>{codigo}:</strong> {info.nombre || codigo}{" "}
                  {info.símbolo ? `(${info.símbolo})` : ""}
                </li>
              ))}
            </ul>
          </div>
        )}

        {banderaAlt && (
          <div className="detalle-section">
            <h3>Información de la Bandera</h3>
            <div className="descripcion">{banderaAlt}</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="pais-detail">
      <div className="container">
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Volver al catálogo
        </button>
        {contenido}
      </div>
    </div>
  );
}

export default PaisDetail;
