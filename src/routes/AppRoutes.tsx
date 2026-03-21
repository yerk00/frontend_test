import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { RouteFallback } from "../components/RouteFallback/RouteFallback";

const PostsPage = lazy(() =>
  import("../pages/PostsPage/PostsPage").then((module) => ({
    default: module.PostsPage,
  }))
);

const PostDetailPage = lazy(() =>
  import("../pages/PostDetailPage/PostDetailPage").then((module) => ({
    default: module.PostDetailPage,
  }))
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<Navigate to="/pagina-principal" replace />} />
        <Route path="/pagina-principal" element={<PostsPage />} />
        <Route path="/pagina-principal/detail/:id" element={<PostDetailPage />} />
      </Routes>
    </Suspense>
  );
};