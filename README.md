# Prueba Técnica Frontend

Aplicación web desarrollada con **React 18 + TypeScript** que consume la API pública de **JSONPlaceholder** para listar publicaciones, ver su detalle, filtrar resultados y exportar información a **PDF** y **Excel**.

El proyecto fue construido con foco en:
- modularidad,
- reutilización,
- tipado fuerte con TypeScript,
- separación de responsabilidades,
- y una experiencia de usuario clara.

---

## Descripción del proyecto

La aplicación consume los endpoints:

- `/posts`
- `/comments`
- `/users`

y permite:

- visualizar una lista paginada de publicaciones,
- buscar publicaciones por título o contenido,
- filtrar por autor,
- navegar al detalle de una publicación,
- visualizar comentarios asociados,
- exportar la tabla visible actual a PDF,
- exportar el conjunto filtrado completo a Excel,
- usar una tabla genérica reutilizable `GenericTable<T>` en distintos contextos.

Además, se incorporaron algunos bonus opcionales:
- modo oscuro con toggle visible,
- persistencia de filtros y página en la URL,
- lazy loading de rutas,
- skeleton loader en la tabla.

---

## Funcionalidades implementadas

### Página principal
- Lista paginada de publicaciones (10 por página).
- Búsqueda en tiempo real por título o contenido.
- Filtro por autor.
- Navegación al detalle al hacer clic sobre una fila.

### Detalle de publicación
- Muestra título, cuerpo y autor.
- Lista todos los comentarios asociados.
- Botón para volver conservando filtros y página activa.

### Exportación a PDF
- Botón visible en la página principal.
- Exporta solo las publicaciones visibles actualmente.
- Incluye:
  - título del reporte,
  - fecha de generación,
  - filtros activos,
  - tabla con ID, título truncado, autor y número de comentarios,
  - encabezado,
  - pie con numeración,
  - filas alternadas par/impar.

### Exportación a Excel
- Botón visible en la página principal.
- Genera un archivo `.xlsx` con al menos 2 hojas:
  - **Publicaciones**: todas las publicaciones del filtro activo (sin paginación)
  - **Usuarios**: lista de usuarios
- Columnas exportadas:
  - Publicaciones: `ID`, `Título`, `Cuerpo`, `Usuario`, `Nº Comentarios`
  - Usuarios: `ID`, `Nombre`, `Email`, `Ciudad`

---

## Stack y librerías usadas

### Core
- **React 18**
- **TypeScript 5**
- **Vite**

### Enrutamiento
- **react-router-dom**

### Consumo de API
- **axios**

### Exportación PDF
- **@react-pdf/renderer**

### Exportación Excel
- **xlsx** (SheetJS)

### Estilos
- CSS propio, sin librerías UI externas para la tabla

---

## Instalación y ejecución local

### 1. Clonar el repositorio
```bash
git clone https://github.com/yerk00/frontend_test.git
cd frontend_test
npm i
npm run