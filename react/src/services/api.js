const API_BASE = "http://localhost:3000/api";

export async function getPaises(filtros = {}) {
  try {
    // Solo se agregan a la URL los filtros que tienen valor
    const params = new URLSearchParams();
    if (filtros.buscar) params.append("buscar", filtros.buscar);
    if (filtros.continente) params.append("continente", filtros.continente);
    if (filtros.idioma) params.append("idioma", filtros.idioma);

    const query = params.toString();
    const response = await fetch(`${API_BASE}/paises${query ? `?${query}` : ""}`);
    if (!response.ok) throw new Error("No se pudieron obtener los países");

    const data = await response.json();
    return data.paises; // la lista viene envuelta: { success, total, paises }
  } catch (error) {
    console.error("Error al cargar países:", error);
    throw error;
  }
}

export async function getPais(cca3) {
  try {
    const response = await fetch(`${API_BASE}/paises/${cca3}`);
    if (!response.ok) throw new Error("País no encontrado");

    const data = await response.json();
    return data.pais; // { success, pais }
  } catch (error) {
    console.error("Error al cargar país:", error);
    throw error;
  }
}

export async function getContinentes() {
  try {
    const response = await fetch(`${API_BASE}/continentes`);
    if (!response.ok) throw new Error("No se pudieron obtener los continentes");

    const data = await response.json();
    return data.continentes;
  } catch (error) {
    console.error("Error al cargar continentes:", error);
    throw error;
  }
}

export async function getIdiomas() {
  try {
    const response = await fetch(`${API_BASE}/idiomas`);
    if (!response.ok) throw new Error("No se pudieron obtener los idiomas");

    const data = await response.json();
    return data.idiomas;
  } catch (error) {
    console.error("Error al cargar idiomas:", error);
    throw error;
  }
}
