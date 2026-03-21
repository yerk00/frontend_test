import { useLocation, useNavigate, useParams } from "react-router-dom";
import { GenericTable } from "../../components/GenericTable/GenericTable";
import type { ColumnDef } from "../../components/GenericTable/types";
import { usePostDetail } from "../../hooks/usePostDetail";
import type { Comment } from "../../types/api.types";
import "./PostDetailPage.css";

const getPostIdFromParam = (value: string | undefined): number | null => {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    return null;
  }

  return parsedValue;
};

const commentColumns: ColumnDef<Comment>[] = [
  {
    key: "name",
    header: "Nombre",
    width: "220px",
  },
  {
    key: "email",
    header: "Email",
    width: "240px",
  },
  {
    key: "body",
    header: "Comentario",
  },
];

export const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const postId = getPostIdFromParam(id);
  const { data, isLoading, error } = usePostDetail(postId);

  const handleBack = () => {
    navigate(`/pagina-principal${location.search}`);
  };

  if (postId === null) {
    return (
      <section className="post-detail-page">
        <button type="button" className="post-detail-page__back" onClick={handleBack}>
          ← Volver
        </button>

        <div className="post-detail-page__error">
          <h1>ID de publicación invalido</h1>
          <p>La URL no contiene un identificador valido.</p>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="post-detail-page">
        <button type="button" className="post-detail-page__back" onClick={handleBack}>
          ← Volver
        </button>

        <div className="post-detail-page__card">
          <h1>Cargando publicacion...</h1>
          <p>Estamos obteniendo el detalle y los comentarios asociados.</p>
        </div>
      </section>
    );
  }

  if (error || data === null) {
    return (
      <section className="post-detail-page">
        <button type="button" className="post-detail-page__back" onClick={handleBack}>
          ← Volver
        </button>

        <div className="post-detail-page__error">
          <h1>No pudimos cargar la publicación</h1>
          <p>{error ?? "No se encontró información para esta publicación."}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="post-detail-page">
      <button type="button" className="post-detail-page__back" onClick={handleBack}>
        ← Volver
      </button>

      <article className="post-detail-page__card">
        <h1>{data.post.title}</h1>
        <p className="post-detail-page__author">
          Autor: <strong>{data.author?.name ?? "Autor desconocido"}</strong>
        </p>
        <p className="post-detail-page__body">{data.post.body}</p>
      </article>

      <section className="post-detail-page__comments">
        <header className="post-detail-page__comments-header">
          <h2>Comentarios</h2>
          <span>{data.comments.length} registros</span>
        </header>

        <GenericTable<Comment>
          data={data.comments}
          columns={commentColumns}
          keyExtractor={(row) => row.id.toString()}
          emptyMessage="Esta publicación no tiene comentarios."
        />
      </section>
    </section>
  );
};