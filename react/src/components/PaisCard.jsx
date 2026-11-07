import { useNavigate } from "react-router-dom";
import { formatPoblacion } from "../utils/formatPoblacion";

const SIN_BANDERA = "https://via.placeholder.com/300x200?text=Sin+Bandera";

function PaisCard({ pais }) {
  const navigate = useNavigate();

  const nombre = pais.nombre?.común || "Sin nombre";
  const region = pais.región || "Sin región";
  const idiomas = Object.values(pais.idiomas || {}).join(", ") || "Sin idiomas";
  const bandera = pais.banderas?.png || SIN_BANDERA;

  const handleClick = () => {
    navigate(`/pais/${pais.cca3}`);
  };

  return (
    <div className="pais-card" onClick={handleClick}>
      <img
        src={bandera}
        alt={nombre}
        onError={(e) => {
          e.currentTarget.onerror = null; // evita un bucle si el placeholder también falla
          e.currentTarget.src = SIN_BANDERA;
        }}
      />
      <div className="pais-card-content">
        <h3>{nombre}</h3>
        <div className="pais-meta">
          <span>🌍 {region}</span>
          <span>🗣️ {idiomas}</span>
          <span>👥 {formatPoblacion(pais.población)}</span>
        </div>
      </div>
    </div>
  );
}

export default PaisCard;
