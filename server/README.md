# Servidor Mock de API

Este servidor mock simula una API REST para desarrollo local del catálogo de países.

## 🚀 Inicio Rápido

### Instalar dependencias
```bash
npm install
```

### Ejecutar el servidor
```bash
npm start
```

O también puedes usar:
```bash
npm run dev
```

O directamente con Node:
```bash
node mockServer.js
```

## 📡 Endpoints Disponibles

### GET /api/paises
Obtiene todos los países con filtros opcionales

**Query Parameters:**
- `continente` (opcional): Filtrar por continente/región (ej: "Américas", "Asia", "Europa")
- `idioma` (opcional): Filtrar por idioma (ej: "Español", "Inglés", "Francés")
- `buscar` (opcional): Buscar por nombre común del país

**Ejemplo:**
```bash
curl http://localhost:3000/api/paises
curl http://localhost:3000/api/paises?continente=Américas
curl http://localhost:3000/api/paises?idioma=Español
curl http://localhost:3000/api/paises?buscar=argentina
curl http://localhost:3000/api/paises?continente=Américas&idioma=Español&buscar=argentina
```

**Respuesta:**
```json
{
  "success": true,
  "total": 25,
  "paises": [...]
}
```

### GET /api/paises/:cca3
Obtiene un país específico por código CCA3 (código de 3 letras)

**Ejemplo:**
```bash
curl http://localhost:3000/api/paises/ARG
curl http://localhost:3000/api/paises/USA
```

**Respuesta:**
```json
{
  "success": true,
  "pais": {
    "cca3": "ARG",
    "nombre": {
      "común": "Argentina",
      "oficial": "República Argentina"
    },
    "banderas": {
      "png": "https://flagcdn.com/w320/ar.png"
    },
    "capital": ["Buenos Aires"],
    "región": "Américas",
    "población": 45376763,
    ...
  }
}
```

### GET /api/continentes
Obtiene todas las regiones/continentes únicos disponibles

**Ejemplo:**
```bash
curl http://localhost:3000/api/continentes
```

**Respuesta:**
```json
{
  "success": true,
  "continentes": ["África", "Américas", "Asia", "Europa", "Oceanía"]
}
```

### GET /api/idiomas
Obtiene todos los idiomas únicos disponibles

**Ejemplo:**
```bash
curl http://localhost:3000/api/idiomas
```

**Respuesta:**
```json
{
  "success": true,
  "idiomas": ["Español", "Inglés", "Francés", "Alemán", ...]
}
```

### GET /api/paises/continente/:continente
Obtiene todas los países de un continente específico

**Ejemplo:**
```bash
curl http://localhost:3000/api/paises/continente/Américas
curl http://localhost:3000/api/paises/continente/Asia
```

### GET /api/paises/idioma/:idioma
Obtiene todos los países que hablan un idioma específico

**Ejemplo:**
```bash
curl http://localhost:3000/api/paises/idioma/Español
curl http://localhost:3000/api/paises/idioma/Inglés
```

## 🔧 Configuración

El servidor corre por defecto en `http://localhost:3000`

Puedes cambiar el puerto modificando la constante `PORT` en `mockServer.js`

## 📝 Notas

- Los datos no son persistentes (se resetean al reiniciar el servidor)
- CORS está habilitado para todas las peticiones
- Ideal para desarrollo y testing
- Los filtros son case-insensitive (no distinguen mayúsculas/minúsculas)

