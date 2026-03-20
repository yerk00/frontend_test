import { Navigate, Route, Routes } from "react-router-dom";

const PostsPage = () => {
  return <div>PostsPage</div>;
};

const PostDetailPage = () => {
  return <div>PostDetailPage</div>;
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/pagina-principal" replace />} />
      <Route path="/pagina-principal" element={<PostsPage />} />
      <Route path="/pagina-principal/detail/:id" element={<PostDetailPage />} />
    </Routes>
  );
};