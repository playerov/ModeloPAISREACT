import { useState, useCallback } from "react";
import Filtros from "../components/Filtros";
import PaisCard from "../components/PaisCard";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import { usePaises } from "../hooks/usePaises";

function Home() {
  const [filtros, setFiltros] = useState({ buscar: "", continente: "", idioma: "" });
  const { paises, loading, error } = usePaises(filtros);

  // useCallback: la función tiene que ser estable. Filtros la usa en las dependencias de un
  // useEffect; si fuera una función nueva en cada render, el efecto correría sin parar (bucle infinito)
  const handleFilterChange = useCallback((nuevosFiltros) => {
    setFiltros(nuevosFiltros);
  }, []);

  return (
    <div className="home">
      <div className="container">
        {/* Filtros queda siempre visible: si el loading reemplazara toda la página,
            el input se desmontaría y perdería el foco en cada pedido */}
        <Filtros onFilterChange={handleFilterChange} />

        {loading && <Loading message="Cargando países..." />}
        {error && <ErrorMessage message={error} />}

        {!loading && !error && paises.length === 0 && (
          <p className="empty-message">No se encontraron países.</p>
        )}

        {!loading && !error && paises.length > 0 && (
          <div className="paises-grid">
            {paises.map((pais) => (
              <PaisCard key={pais.cca3} pais={pais} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
