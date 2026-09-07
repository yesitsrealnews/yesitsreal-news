import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/advertise")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
