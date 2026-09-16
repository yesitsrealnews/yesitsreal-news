import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/calibration")({
  beforeLoad: () => {
    throw redirect({ to: "/admin" });
  },
});
