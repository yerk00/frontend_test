# Prueba Frontend

Aplicacion web desarrollada con **React 18 + TypeScript** para listar publicaciones, ver su detalle, filtrar resultados y exportar información a **PDF** y **Excel**.

El proyecto fue construido con foco en:
- modularidad,
- reutilizacion,
- tipado con TypeScript,
- separacion de responsabilidades,

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
- navegar al detalle de una publicacion,
- visualizar comentarios asociados,
- exportar la tabla visible actual a PDF,
- exportar el conjunto filtrado completo a Excel,
- usar una tabla genérica reutilizable `GenericTable<T>` en distintos contextos.

Ademas algunos opcionales:
- modo oscuro con toggle visible,
- lazy loading de rutas,
- skeleton loader en la tabla.

---

