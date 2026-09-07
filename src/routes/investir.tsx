import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/investir")({
  beforeLoad: () => {
    throw redirect({ to: "/invest" });
  },
});
