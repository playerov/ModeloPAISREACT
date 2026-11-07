export function formatPoblacion(poblacion) {
  if (!poblacion) return "N/A";
  return new Intl.NumberFormat("es-ES").format(poblacion);
}