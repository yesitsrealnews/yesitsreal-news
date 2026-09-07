import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/acheter")({
  beforeLoad: () => {
    throw redirect({ to: "/invest" });
  },
});
