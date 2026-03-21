import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GenericTable } from "../../components/GenericTable/GenericTable";
import type { ColumnDef } from "../../components/GenericTable/types";
import { useComments } from "../../hooks/useComments";
import { usePosts } from "../../hooks/usePosts";
import { useUsers } from "../../hooks/useUsers";
import type { PostListItem } from "../../types/view-models.types";
import { exportPostsToExcel } from "../../utils/exportExcel";
import { downloadPostsPdfReport } from "../../utils/exportPdf";
import {
  buildPostListItems,
  filterPosts,
  paginateItems,
} from "../../utils/posts.helpers";
import { truncateText } from "../../utils/text";
import "./PostsPage.css";

const POSTS_PER_PAGE = 10;

const getPageFromParam = (value: string | null): number => {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    return 1;
  }

  return parsedValue;
};

const getUserIdFromParam = (value: string | null): number | null => {
  if (!value) {
    return null;
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    return null;
  }

  return parsedValue;
};

const postColumns: ColumnDef<PostListItem>[] = [
  {
    key: "id",
    header: "ID",
    width: "80px",
  },
  {
    key: "title",
    header: "Título",
    width: "260px",
    render: (row) => truncateText(row.title, 48),
  },
  {
    key: "body",
    header: "Contenido",
    render: (row) => truncateText(row.body, 90),
  },
  {
    key: "authorName",
    header: "Autor",
    width: "180px",
  },
  {
    key: "commentsCount",
    header: "Comentarios",
    width: "140px",
  },
];

export const PostsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const { data: posts, isLoading: postsLoading, error: postsError } = usePosts();
  const { data: users, isLoading: usersLoading, error: usersError } = useUsers();
  const {
    data: comments,
    isLoading: commentsLoading,
    error: commentsError,
  } = useComments();

  const searchTerm = searchParams.get("search") ?? "";
  const selectedUserId = getUserIdFromParam(searchParams.get("userId"));
  const requestedPage = getPageFromParam(searchParams.get("page"));

  const isLoading = postsLoading || usersLoading || commentsLoading;
  const error = postsError ?? usersError ?? commentsError;

  const enrichedPosts = useMemo(() => {
    return buildPostListItems(posts, users, comments);
  }, [posts, users, comments]);

  const filteredPosts = useMemo(() => {
    return filterPosts(enrichedPosts, searchTerm, selectedUserId);
  }, [enrichedPosts, searchTerm, selectedUserId]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const currentPage = Math.min(requestedPage, totalPages);

  const visiblePosts = useMemo(() => {
    return paginateItems(filteredPosts, currentPage, POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  const selectedUserLabel = useMemo(() => {
    if (selectedUserId === null) {
      return "Todos los autores";
    }

    return users.find((user) => user.id === selectedUserId)?.name ?? "Autor desconocido";
  }, [selectedUserId, users]);

  useEffect(() => {
    if (requestedPage === currentPage) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);

    if (currentPage <= 1) {
      nextParams.delete("page");
    } else {
      nextParams.set("page", currentPage.toString());
    }

    setSearchParams(nextParams, { replace: true });
  }, [currentPage, requestedPage, searchParams, setSearchParams]);

  const updateParams = (updates: {
    search?: string;
    userId?: string;
    page?: number;
  }) => {
    const nextParams = new URLSearchParams(searchParams);

    if (updates.search !== undefined) {
      if (updates.search.trim().length === 0) {
        nextParams.delete("search");
      } else {
        nextParams.set("search", updates.search);
      }
    }

    if (updates.userId !== undefined) {
      if (updates.userId.length === 0) {
        nextParams.delete("userId");
      } else {
        nextParams.set("userId", updates.userId);
      }
    }

    if (updates.page !== undefined) {
      if (updates.page <= 1) {
        nextParams.delete("page");
      } else {
        nextParams.set("page", updates.page.toString());
      }
    }

    setSearchParams(nextParams);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateParams({
      search: event.target.value,
      page: 1,
    });
  };

  const handleUserChange = (event: ChangeEvent<HTMLSelectElement>) => {
    updateParams({
      userId: event.target.value,
      page: 1,
    });
  };

  const handlePreviousPage = () => {
    if (currentPage <= 1) {
      return;
    }

    updateParams({
      page: currentPage - 1,
    });
  };

  const handleNextPage = () => {
    if (currentPage >= totalPages) {
      return;
    }

    updateParams({
      page: currentPage + 1,
    });
  };

  const handleSelectPost = (post: PostListItem) => {
    const currentQuery = searchParams.toString();

    navigate({
      pathname: `/pagina-principal/detail/${post.id}`,
      search: currentQuery.length > 0 ? `?${currentQuery}` : "",
    });
  };

  const handleExportPdf = async () => {
    if (visiblePosts.length === 0) {
      return;
    }

    setExportError(null);
    setIsExportingPdf(true);

    try {
      await downloadPostsPdfReport({
        posts: visiblePosts,
        searchTerm,
        selectedUserLabel,
        currentPage,
        totalPages,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo exportar el PDF";

      setExportError(message);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleExportExcel = async () => {
    if (filteredPosts.length === 0) {
      return;
    }

    setExportError(null);
    setIsExportingExcel(true);

    try {
      exportPostsToExcel({
        posts: filteredPosts,
        users,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo exportar el Excel";

      setExportError(message);
    } finally {
      setIsExportingExcel(false);
    }
  };

  const areExportActionsDisabled =
    isLoading || Boolean(error) || isExportingPdf || isExportingExcel;

  return (
    <section className="posts-page">
      <header className="posts-page__header">
        <div>
          <h1>Publicaciones</h1>
          <p>
            Lista principal de publicaciones con busqueda, filtro por autor y
            paginacion.
          </p>
        </div>

        <div className="posts-page__actions">
          <button
            type="button"
            onClick={handleExportPdf}
            disabled={areExportActionsDisabled || visiblePosts.length === 0}
          >
            {isExportingPdf ? "Exportando PDF..." : "Exportar a PDF"}
          </button>

          <button
            type="button"
            onClick={handleExportExcel}
            disabled={areExportActionsDisabled || filteredPosts.length === 0}
          >
            {isExportingExcel ? "Exportando Excel..." : "Exportar a Excel"}
          </button>
        </div>
      </header>

      <section className="posts-page__filters">
        <div className="posts-page__field">
          <label htmlFor="search">Buscar</label>
          <input
            id="search"
            type="text"
            placeholder="Buscar por título o contenido"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="posts-page__field">
          <label htmlFor="userId">Autor</label>
          <select
            id="userId"
            value={selectedUserId?.toString() ?? ""}
            onChange={handleUserChange}
          >
            <option value="">Todos los autores</option>
            {users.map((user) => (
              <option key={user.id} value={user.id.toString()}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="posts-page__summary">
        <p>
          Mostrando <strong>{visiblePosts.length}</strong> de{" "}
          <strong>{filteredPosts.length}</strong> publicaciones filtradas.
        </p>
        <p>
          Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>.
        </p>
      </section>

      {exportError ? (
        <div className="posts-page__export-error">
          <p>{exportError}</p>
        </div>
      ) : null}

      {error ? (
        <div className="posts-page__error">
          <h2>No pudimos cargar la información</h2>
          <p>{error}</p>
        </div>
      ) : (
        <GenericTable<PostListItem>
          data={visiblePosts}
          columns={postColumns}
          isLoading={isLoading}
          emptyMessage="No se encontraron publicaciones con los filtros actuales."
          keyExtractor={(row) => row.id.toString()}
          onRowClick={handleSelectPost}
        />
      )}

      <section className="posts-page__pagination">
        <button
          type="button"
          onClick={handlePreviousPage}
          disabled={currentPage <= 1 || isLoading || Boolean(error)}
        >
          Anterior
        </button>

        <span>
          Página {currentPage} de {totalPages}
        </span>

        <button
          type="button"
          onClick={handleNextPage}
          disabled={currentPage >= totalPages || isLoading || Boolean(error)}
        >
          Siguiente
        </button>
      </section>
    </section>
  );
};