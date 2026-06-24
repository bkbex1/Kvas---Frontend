import { useNavigate, type NavigateFunction } from "react-router-dom";
import { useRoutes } from "react-router-dom";
import { Suspense, useEffect, createElement } from "react";
import routes from "./config";
import MaintenanceGate from "./MaintenanceGate";

let navigateResolver: (navigate: ReturnType<typeof useNavigate>) => void;

declare global {
  interface Window {
    REACT_APP_NAVIGATE: ReturnType<typeof useNavigate>;
  }
}

export const navigatePromise = new Promise<NavigateFunction>((resolve) => {
  navigateResolver = resolve;
});

function RouteFallback() {
  return createElement(
    "div",
    {
      className: "min-h-screen grid place-items-center bg-[#FAFAF7] text-gray-500",
    },
    "Зареждане..."
  );
}

export function AppRoutes() {
  const element = useRoutes(routes);
  const navigate = useNavigate();
  useEffect(() => {
    window.REACT_APP_NAVIGATE = navigate;
    navigateResolver(window.REACT_APP_NAVIGATE);
  });
  return createElement(
    Suspense,
    { fallback: createElement(RouteFallback) },
    createElement(MaintenanceGate, null, element)
  );
}
