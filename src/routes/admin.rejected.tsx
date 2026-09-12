import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/rejected")({
  component: () => <Navigate to="/admin/inbox" />,
});
