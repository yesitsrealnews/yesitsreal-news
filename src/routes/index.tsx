import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/site-shell";
import { HomePage } from "@/components/stories/home-page";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const lang = useAppStore((s) => s.lang);
  const extras = useAppStore((s) => s.extras);
  const addNewsletter = useAppStore((s) => s.addNewsletter);
  return (
    <SiteShell>
      <HomePage lang={lang} extras={extras} onSubscribe={addNewsletter} />
    </SiteShell>
  );
}
