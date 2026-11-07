## Rúbrica - Examen React Atlas Países

Puntaje total sugerido: **100 puntos**.  

---

### 1. Routing y SPA (20 pts)
- Uso de BrowserRouter de `react-router-dom`.
- Navegación dinámica paramétrica (`useParams`) hacia `pais/:cca3`.
- Consumo idóneo de los métodos de navegación (rutas `/` y `/recientes`).

---

### 2. Consumo de API y Debounce (20 pts)
- Obtención de la lista de países completa y filtrada desde la mock API interna. 
- Componente interactivo de texto/select capaz de desencadenar re-renders coherentes del catálogo (Debounced search).

---

### 3. Páginas y componentes (20 pts)
- Integración perfecta de estilos HTML/CSS a JSX. Fragmentación atómica (`Card`, `Navbar`, `Filters`).
- Contemplación de interfaces cuando la búsqueda no arroja países.

---

### 4. Recientes API (Context & LocalStorage) (25 pts)
- Implementación impecable del historial asíncrono.
- Inyección de Contextos transparentes sobre el layout global del árbol de React.
- Mantenimiento coherente sin duplicar keys de países (hasta 15 limitados en LocalStorage).

---

### 5. Custom hooks y calidad general (15 pts)
- Extracción de lógicas impuras hacia Hooks personalizados dentro de `src/hooks`.
- Mantenimiento de principios Clean Code: Evitar manipulaciones de DOM de la escuela antigua.

---

### 6. Desaprobación automática (orientativa)
- Uso de `innerHTML` o querySelectors directos que subvierten el control del Virtual DOM.
- No existe el gestor de React Router en el índice inicial.
- Total fracaso al conectarse con el Mock Server provisto, cargando JSONs manuales.
