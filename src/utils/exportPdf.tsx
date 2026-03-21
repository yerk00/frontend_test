import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from "@react-pdf/renderer";
import type { PostListItem } from "../types/view-models.types";
import { truncateText } from "./text";

interface DownloadPostsPdfReportParams {
  posts: PostListItem[];
  searchTerm: string;
  selectedUserLabel: string;
  currentPage: number;
  totalPages: number;
}

interface PostsPdfDocumentProps extends DownloadPostsPdfReportParams {
  generatedAt: string;
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 82,
    paddingBottom: 52,
    paddingHorizontal: 28,
    fontSize: 10,
    color: "#3b4758",
  },
  header: {
    position: "absolute",
    top: 18,
    left: 28,
    right: 28,
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 700,
    color: "#1f4e79",
    marginBottom: 4,
  },
  headerMeta: {
    fontSize: 9,
    color: "#4b5563",
    marginBottom: 2,
  },
  filtersBox: {
    marginBottom: 14,
    padding: 10,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 4,
  },
  filtersTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 5,
  },
  filtersText: {
    fontSize: 9,
    color: "#374151",
    marginBottom: 2,
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 4,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1f4e79",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  rowEven: {
    backgroundColor: "#ffffff",
  },
  rowOdd: {
    backgroundColor: "#f9fafb",
  },
  cell: {
    paddingVertical: 7,
    paddingHorizontal: 7,
    justifyContent: "center",
    fontSize: 9,
  },
  headerCell: {
    color: "#ffffff",
    fontWeight: 700,
  },
  idCell: {
    width: "10%",
  },
  titleCell: {
    width: "42%",
  },
  authorCell: {
    width: "28%",
  },
  commentsCell: {
    width: "20%",
    textAlign: "center",
  },
  emptyState: {
    padding: 16,
    textAlign: "center",
    color: "#6b7280",
    fontSize: 10,
  },
  footer: {
    position: "absolute",
    left: 28,
    right: 28,
    bottom: 18,
    fontSize: 9,
    color: "#6b7280",
    textAlign: "center",
  },
});

const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat("es-BO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const downloadBlob = (blob: Blob, filename: string) => {
  const fileUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = fileUrl;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(fileUrl);
};

const PostsPdfDocument = ({
  posts,
  searchTerm,
  selectedUserLabel,
  currentPage,
  totalPages,
  generatedAt,
}: PostsPdfDocumentProps) => {
  const normalizedSearch =
    searchTerm.trim().length > 0 ? searchTerm.trim() : "Sin búsqueda activa";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Text style={styles.headerTitle}>Reporte de Publicaciones</Text>
          <Text style={styles.headerMeta}>Fecha de generacion: {generatedAt}</Text>
          <Text style={styles.headerMeta}>
            Tabla exportada: publicaciones visibles en la página actual
          </Text>
        </View>

        <View style={styles.filtersBox}>
          <Text style={styles.filtersTitle}>Filtros activos</Text>
          <Text style={styles.filtersText}>Busqueda: {normalizedSearch}</Text>
          <Text style={styles.filtersText}>Autor: {selectedUserLabel}</Text>
          <Text style={styles.filtersText}>
            Pagina actual: {currentPage} de {totalPages}
          </Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader} wrap={false}>
            <Text style={[styles.cell, styles.headerCell, styles.idCell]}>ID</Text>
            <Text style={[styles.cell, styles.headerCell, styles.titleCell]}>Título</Text>
            <Text style={[styles.cell, styles.headerCell, styles.authorCell]}>Autor</Text>
            <Text style={[styles.cell, styles.headerCell, styles.commentsCell]}>
              Comentarios
            </Text>
          </View>

          {posts.length === 0 ? (
            <Text style={styles.emptyState}>
              No hay publicaciones visibles para exportar.
            </Text>
          ) : (
            posts.map((post, index) => (
              <View
                key={post.id}
                style={[
                  styles.row,
                  index % 2 === 0 ? styles.rowEven : styles.rowOdd,
                ]}
                wrap={false}
              >
                <Text style={[styles.cell, styles.idCell]}>{post.id}</Text>
                <Text style={[styles.cell, styles.titleCell]}>
                  {truncateText(post.title, 42)}
                </Text>
                <Text style={[styles.cell, styles.authorCell]}>
                  {post.authorName}
                </Text>
                <Text style={[styles.cell, styles.commentsCell]}>
                  {post.commentsCount}
                </Text>
              </View>
            ))
          )}
        </View>

        <Text
          style={styles.footer}
          fixed
          render={({ pageNumber, totalPages: totalDocumentPages }) =>
            `Página ${pageNumber} de ${totalDocumentPages}`
          }
        />
      </Page>
    </Document>
  );
};

export const downloadPostsPdfReport = async ({
  posts,
  searchTerm,
  selectedUserLabel,
  currentPage,
  totalPages,
}: DownloadPostsPdfReportParams): Promise<void> => {
  const generatedAt = formatDateTime(new Date());

  const blob = await pdf(
    <PostsPdfDocument
      posts={posts}
      searchTerm={searchTerm}
      selectedUserLabel={selectedUserLabel}
      currentPage={currentPage}
      totalPages={totalPages}
      generatedAt={generatedAt}
    />
  ).toBlob();

  downloadBlob(blob, "reporte-publicaciones.pdf");
};