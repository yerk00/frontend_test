# Prueba Técnica Frontend

Aplicación web desarrollada con **React 18 + TypeScript** para listar publicaciones, ver su detalle, filtrar resultados y exportar información a **PDF** y **Excel**.

El proyecto fue construido con foco en:
- modularidad,
- reutilización,
- tipado con TypeScript,
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

Además, se incorporaron:
- modo oscuro con toggle visible,
- persistencia de filtros y página en la URL,
- lazy loading de rutas,
- skeleton loader en la tabla.

---

## Funcionalidades implementadas

### Página principal

### Detalle de publicación

### Exportación a PDF

### Exportación a Excel


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


---

## Instalación y ejecución local

### 1. Clonar el repositorio
```bash
git clone https://github.com/yerk00/frontend_test.git
cd frontend_test
npm i
npm run