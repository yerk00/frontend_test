import "./RouteFallback.css";

export const RouteFallback = () => {
  return (
    <div className="route-fallback" role="status" aria-live="polite">
      <div className="route-fallback__spinner" />
      <p>Cargando modulo...</p>
    </div>
  );
};