// Estado global de la aplicación
const state = {
  paises: [],
  paisesRecientes: JSON.parse(
    localStorage.getItem("paisesRecientes") || "[]"
  ),
  continentes: [],
  idiomas: [],
  currentPage: "home",
  currentPais: null,
};

// API Base URL
const API_BASE = "http://localhost:3000/api";

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  loadContinentes();
  loadIdiomas();
  loadPaises();
  loadPaisesRecientes();
  setupFilters();
});

// Navegación entre páginas
function initNavigation() {
  const navButtons = document.querySelectorAll(".nav-btn");
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const page = btn.dataset.page;
      showPage(page);
      navButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  document.getElementById("back-btn")?.addEventListener("click", () => {
    showPage("home");
    document
      .querySelector('.nav-btn[data-page="home"]')
      .classList.add("active");
    document
      .querySelector('.nav-btn[data-page="recientes"]')
      .classList.remove("active");
  });
}

function showPage(pageName) {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active");
  });

  const pageElement = document.getElementById(`${pageName}-page`);
  if (pageElement) {
    pageElement.classList.add("active");
    state.currentPage = pageName;

    // Si se muestra la página de recientes, recargar desde localStorage
    if (pageName === "recientes") {
      state.paisesRecientes = JSON.parse(
        localStorage.getItem("paisesRecientes") || "[]"
      );
      loadPaisesRecientes();
    }
  }
}

// Cargar continentes
async function loadContinentes() {
  try {
    const response = await fetch(`${API_BASE}/continentes`);
    const data = await response.json();
    if (data.success) {
      state.continentes = data.continentes;
      const select = document.getElementById("filter-continente");
      // Limpiar opciones existentes (excepto la primera "Todos los continentes")
      while (select.children.length > 1) {
        select.removeChild(select.lastChild);
      }
      // Agregar continentes
      data.continentes.forEach((continente) => {
        const option = document.createElement("option");
        option.value = continente;
        option.textContent = continente;
        select.appendChild(option);
      });
      console.log(`✅ Cargados ${data.continentes.length} continentes:`, data.continentes);
    }
  } catch (error) {
    console.error("Error cargando continentes:", error);
  }
}

// Cargar idiomas
async function loadIdiomas() {
  try {
    const response = await fetch(`${API_BASE}/idiomas`);
    const data = await response.json();
    if (data.success) {
      state.idiomas = data.idiomas;
      const select = document.getElementById("filter-idioma");
      // Limpiar opciones existentes (excepto la primera "Todos los idiomas")
      while (select.children.length > 1) {
        select.removeChild(select.lastChild);
      }
      // Agregar idiomas
      data.idiomas.forEach((idioma) => {
        const option = document.createElement("option");
        option.value = idioma;
        option.textContent = idioma;
        select.appendChild(option);
      });
      console.log(`✅ Cargados ${data.idiomas.length} idiomas (mostrando primeros 10):`, data.idiomas.slice(0, 10));
    }
  } catch (error) {
    console.error("Error cargando idiomas:", error);
  }
}

// Cargar países
async function loadPaises() {
  const loading = document.getElementById("loading");
  const errorMsg = document.getElementById("error-message");
  const container = document.getElementById("paises-container");

  loading.style.display = "block";
  errorMsg.style.display = "none";
  container.innerHTML = "";

  try {
    const continente = document.getElementById("filter-continente").value;
    const idioma = document.getElementById("filter-idioma").value;
    const buscar = document.getElementById("search-input").value;

    let url = `${API_BASE}/paises?`;
    const params = [];
    if (continente) params.push(`continente=${encodeURIComponent(continente)}`);
    if (idioma) params.push(`idioma=${encodeURIComponent(idioma)}`);
    if (buscar) params.push(`buscar=${encodeURIComponent(buscar)}`);

    url += params.join("&");

    const response = await fetch(url);
    const data = await response.json();

    if (data.success) {
      state.paises = data.paises;
      renderPaises(data.paises, container);
    } else {
      throw new Error("Error al cargar países");
    }
  } catch (error) {
    console.error("Error:", error);
    errorMsg.textContent =
      "Error al cargar los países. Asegúrate de que el servidor esté corriendo.";
    errorMsg.style.display = "block";
  } finally {
    loading.style.display = "none";
  }
}

// Renderizar países
function renderPaises(paises, container) {
  if (paises.length === 0) {
    container.innerHTML =
      '<p class="empty-message">No se encontraron países.</p>';
    return;
  }

  container.innerHTML = paises
    .map(
      (pais) => {
        const nombre = pais.nombre?.común || "Sin nombre";
        const region = pais.región || "Sin región";
        const idiomas = pais.idiomas || {};
        const idiomasLista = Object.values(idiomas).join(", ") || "Sin idiomas";
        const poblacion = pais.población;
        const bandera = pais.banderas?.png || "https://via.placeholder.com/300x200?text=Sin+Bandera";
        
        return `
        <div class="pais-card" onclick="showDetalle('${pais.cca3}')">
            <img src="${bandera}" alt="${nombre}" onerror="this.src='https://via.placeholder.com/300x200?text=Sin+Bandera'">
            <div class="pais-card-content">
                <h3>${nombre}</h3>
                <div class="pais-meta">
                    <span>🌍 ${region}</span>
                    <span>🗣️ ${idiomasLista}</span>
                    <span>👥 ${formatPoblacion(poblacion)}</span>
                </div>
            </div>
        </div>
    `;
      }
    )
    .join("");
}

// Formatear población
function formatPoblacion(poblacion) {
  if (!poblacion) return "N/A";
  return new Intl.NumberFormat("es-ES").format(poblacion);
}

// Mostrar detalle de país
async function showDetalle(cca3) {
  // Agregar a países recientes
  addToRecientes(cca3);

  const loading = document.getElementById("loading");
  const container = document.getElementById("detalle-container");

  loading.style.display = "block";
  container.innerHTML = "";

  try {
    const response = await fetch(`${API_BASE}/paises/${cca3}`);
    const data = await response.json();

    if (data.success) {
      state.currentPais = data.pais;
      renderDetalle(data.pais, container);
      showPage("detalle");
    } else {
      throw new Error("País no encontrado");
    }
  } catch (error) {
    console.error("Error:", error);
    container.innerHTML =
      '<p class="error-message">Error al cargar el país.</p>';
  } finally {
    loading.style.display = "none";
  }
}

// Renderizar detalle
function renderDetalle(pais, container) {
  const nombreComun = pais.nombre?.común || "Sin nombre";
  const nombreOficial = pais.nombre?.oficial || "";
  const region = pais.región || "N/A";
  const subregion = pais.subregión || "N/A";
  const poblacion = pais.población;
  const bandera = pais.banderas?.png || "https://via.placeholder.com/400x300?text=Sin+Bandera";
  const banderaAlt = pais.banderas?.alt || "";
  
  // Procesar idiomas
  const idiomasObj = pais.idiomas || {};
  const idiomas = Object.entries(idiomasObj).map(([codigo, nombre]) => ({
    codigo,
    nombre: typeof nombre === "string" ? nombre : String(nombre),
  }));

  // Procesar monedas
  const monedas = [];
  const monedasObj = pais.monedas || {};
  Object.entries(monedasObj).forEach(([codigo, info]) => {
    if (info && typeof info === "object") {
      monedas.push({
        codigo,
        nombre: info.nombre || codigo,
        simbolo: info.símbolo || "",
      });
    }
  });

  // Capital
  const capital = Array.isArray(pais.capital) ? pais.capital.join(", ") : (pais.capital || "N/A");

  container.innerHTML = `
        <div class="detalle-header">
            <div class="detalle-image">
                <img src="${bandera}" alt="${nombreComun}" onerror="this.src='https://via.placeholder.com/400x300?text=Sin+Bandera'">
            </div>
            <div class="detalle-info">
                <h2>${nombreComun}</h2>
                <p style="color: #666; margin-bottom: 1rem;">${nombreOficial}</p>
                <div class="detalle-meta">
                    <span>🌍 <strong>Región:</strong> ${region}</span>
                    <span>📍 <strong>Subregión:</strong> ${subregion}</span>
                    <span>🏛️ <strong>Capital:</strong> ${capital}</span>
                    <span>👥 <strong>Población:</strong> ${formatPoblacion(poblacion)}</span>
                </div>
            </div>
        </div>

        ${
          idiomas.length > 0
            ? `
        <div class="detalle-section">
            <h3>Idiomas</h3>
            <ul class="info-list">
                ${idiomas
                  .map(
                    (idioma) => `
                    <li><strong>${idioma.codigo.toUpperCase()}:</strong> ${idioma.nombre}</li>
                `
                  )
                  .join("")}
            </ul>
        </div>
        `
            : ""
        }

        ${
          monedas.length > 0
            ? `
        <div class="detalle-section">
            <h3>Monedas</h3>
            <ul class="info-list">
                ${monedas
                  .map(
                    (moneda) => `
                    <li><strong>${moneda.codigo}:</strong> ${moneda.nombre} ${moneda.simbolo ? `(${moneda.simbolo})` : ""}</li>
                `
                  )
                  .join("")}
            </ul>
        </div>
        `
            : ""
        }

        ${
          banderaAlt
            ? `
        <div class="detalle-section">
            <h3>Información de la Bandera</h3>
            <div class="descripcion">${banderaAlt}</div>
        </div>
        `
            : ""
        }
    `;
}

// Agregar a países recientes
function addToRecientes(cca3) {
  // Remover si ya existe
  state.paisesRecientes = state.paisesRecientes.filter((p) => p !== cca3);
  // Agregar al inicio
  state.paisesRecientes.unshift(cca3);
  // Limitar a 15 países
  state.paisesRecientes = state.paisesRecientes.slice(0, 15);
  // Guardar en localStorage
  localStorage.setItem(
    "paisesRecientes",
    JSON.stringify(state.paisesRecientes)
  );
}

// Cargar países recientes
async function loadPaisesRecientes() {
  const container = document.getElementById("recientes-container");

  // Actualizar estado desde localStorage antes de cargar
  state.paisesRecientes = JSON.parse(
    localStorage.getItem("paisesRecientes") || "[]"
  );

  if (state.paisesRecientes.length === 0) {
    container.innerHTML =
      '<p class="empty-message">No has visto ningún país aún.</p>';
    return;
  }

  try {
    // Cargar cada país reciente
    const paisesPromises = state.paisesRecientes.map((cca3) =>
      fetch(`${API_BASE}/paises/${cca3}`)
        .then((r) => r.json())
        .catch((err) => {
          console.error(`Error cargando país ${cca3}:`, err);
          return { success: false };
        })
    );

    const resultados = await Promise.all(paisesPromises);
    const paises = resultados.filter((r) => r.success).map((r) => r.pais);

    if (paises.length === 0) {
      container.innerHTML =
        '<p class="empty-message">No se pudieron cargar los países recientes.</p>';
      return;
    }

    renderPaises(paises, container);
  } catch (error) {
    console.error("Error cargando países recientes:", error);
    container.innerHTML =
      '<p class="empty-message">Error al cargar los países recientes.</p>';
  }
}

// Configurar filtros
function setupFilters() {
  document
    .getElementById("filter-continente")
    .addEventListener("change", loadPaises);
  document
    .getElementById("filter-idioma")
    .addEventListener("change", loadPaises);
  document
    .getElementById("search-input")
    .addEventListener("input", debounce(loadPaises, 500));
}

// Función debounce para búsqueda
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Hacer showDetalle disponible globalmente
window.showDetalle = showDetalle;

