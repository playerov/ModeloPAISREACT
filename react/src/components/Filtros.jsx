import { useState, useEffect } from "react";
import { getContinentes, getIdiomas } from "../services/api";
import { useDebounce } from "../hooks/useDebounce";

function Filtros({ onFilterChange }) {
  const [buscar, setBuscar] = useState("");
  const [continente, setContinente] = useState("");
  const [idioma, setIdioma] = useState("");
  const [continentes, setContinentes] = useState([]);
  const [idiomas, setIdiomas] = useState([]);

  // Solo el texto espera 400 ms; los selects responden al instante
  const buscarDebounced = useDebounce(buscar, 400);

  // Opciones de los selects: se piden una sola vez
  useEffect(() => {
    getContinentes().then(setContinentes).catch(() => setContinentes([]));
    getIdiomas().then(setIdiomas).catch(() => setIdiomas([]));
  }, []);

  // Avisa a Home cuando cambia algún filtro
  useEffect(() => {
    onFilterChange({ buscar: buscarDebounced, continente, idioma });
  }, [buscarDebounced, continente, idioma, onFilterChange]);

  return (
    <div className="filters">
      <select
        className="filter-select"
        value={continente}
        onChange={(e) => setContinente(e.target.value)}
      >
        <option value="">Todos los continentes</option>
        {continentes.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        className="filter-select"
        value={idioma}
        onChange={(e) => setIdioma(e.target.value)}
      >
        <option value="">Todos los idiomas</option>
        {idiomas.map((i) => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </select>

      <input
        type="text"
        className="search-input"
        placeholder="Buscar país..."
        value={buscar}
        onChange={(e) => setBuscar(e.target.value)}
      />
    </div>
  );
}

export default Filtros;
