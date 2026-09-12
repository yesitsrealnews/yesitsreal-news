import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/contest")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
