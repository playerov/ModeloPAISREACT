// Servidor Mock para desarrollo local
// Ejecutar con: node server/mockServer.js
import express from "express";
import cors from "cors";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Cargar datos de países
let paises = [];
try {
  const paisesData = readFileSync(
    join(__dirname, "../data/paises.json"),
    "utf-8"
  );
  paises = JSON.parse(paisesData) || [];
  console.log(`✅ Cargados ${paises.length} países`);
} catch (error) {
  console.error("Error cargando países:", error);
}

// Rutas de la API

// GET /api/paises - Obtener todos los países (con filtros opcionales)
app.get("/api/paises", (req, res) => {
  let resultado = [...paises];

  // Filtro por continente/región
  if (req.query.continente) {
    resultado = resultado.filter((pais) => {
      const region = pais.región;
      return region?.toLowerCase() === req.query.continente.toLowerCase();
    });
  }

  // Filtro por idioma
  if (req.query.idioma) {
    const idiomaBuscado = req.query.idioma.toLowerCase();
    resultado = resultado.filter((pais) => {
      const idiomas = pais.idiomas;
      if (!idiomas) return false;
      // Buscar en los valores de idiomas
      const valoresIdiomas = Object.values(idiomas);
      return valoresIdiomas.some((idioma) => {
        const idiomaStr = typeof idioma === "string" ? idioma : String(idioma);
        return idiomaStr.toLowerCase().includes(idiomaBuscado);
      });
    });
  }

  // Búsqueda por nombre común
  if (req.query.buscar) {
    const terminoBusqueda = req.query.buscar.toLowerCase();
    resultado = resultado.filter((pais) => {
      const nombreComun = pais.nombre?.común;
      return nombreComun?.toLowerCase().includes(terminoBusqueda);
    });
  }

  res.json({
    success: true,
    total: resultado.length,
    paises: resultado,
  });
});

// GET /api/paises/:cca3 - Obtener un país específico por código CCA3
app.get("/api/paises/:cca3", (req, res) => {
  const pais = paises.find(
    (p) => p.cca3?.toUpperCase() === req.params.cca3.toUpperCase()
  );

  if (!pais) {
    return res.status(404).json({
      success: false,
      message: "País no encontrado",
    });
  }

  res.json({
    success: true,
    pais: pais,
  });
});

// GET /api/continentes - Obtener todas las regiones/continentes únicos
app.get("/api/continentes", (req, res) => {
  const continentesSet = new Set();

  paises.forEach((pais) => {
    const region = pais.región;
    if (region) {
      continentesSet.add(region);
    }
  });

  const continentes = Array.from(continentesSet).sort();
  console.log(
    `📊 Continentes encontrados: ${continentes.length} - ${continentes.join(
      ", "
    )}`
  );
  res.json({
    success: true,
    continentes: continentes,
  });
});

// GET /api/idiomas - Obtener todos los idiomas únicos
app.get("/api/idiomas", (req, res) => {
  const idiomasSet = new Set();

  paises.forEach((pais) => {
    const idiomas = pais.idiomas;
    if (idiomas && typeof idiomas === "object") {
      Object.values(idiomas).forEach((idioma) => {
        if (idioma && typeof idioma === "string") {
          idiomasSet.add(idioma);
        }
      });
    }
  });

  const idiomas = Array.from(idiomasSet).sort();
  console.log(
    `🗣️ Idiomas encontrados: ${idiomas.length} (mostrando primeros 10: ${idiomas
      .slice(0, 10)
      .join(", ")})`
  );
  res.json({
    success: true,
    idiomas: idiomas,
  });
});

// GET /api/paises/continente/:continente - Obtener países por continente
app.get("/api/paises/continente/:continente", (req, res) => {
  const continente = req.params.continente;
  const paisesFiltrados = paises.filter((p) => {
    const region = p.región;
    return region?.toLowerCase() === continente.toLowerCase();
  });

  res.json({
    success: true,
    continente: continente,
    total: paisesFiltrados.length,
    paises: paisesFiltrados,
  });
});

// GET /api/paises/idioma/:idioma - Obtener países por idioma
app.get("/api/paises/idioma/:idioma", (req, res) => {
  const idiomaBuscado = req.params.idioma.toLowerCase();
  const paisesFiltrados = paises.filter((pais) => {
    const idiomas = pais.idiomas;
    if (!idiomas) return false;
    const valoresIdiomas = Object.values(idiomas);
    return valoresIdiomas.some((idioma) => {
      const idiomaStr = typeof idioma === "string" ? idioma : String(idioma);
      return idiomaStr.toLowerCase().includes(idiomaBuscado);
    });
  });

  res.json({
    success: true,
    idioma: idiomaBuscado,
    total: paisesFiltrados.length,
    paises: paisesFiltrados,
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 API Mock Server corriendo en http://localhost:${PORT}`);
  console.log(`📊 Endpoint: http://localhost:${PORT}/api/`);
  console.log(`🌍 Total de países cargados: ${paises.length}`);
});
