import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/site-shell";
import { SectionArchive } from "@/components/stories/section-page";
import { isSectionId } from "@/lib/data/sections";
import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { SECTION_KEY } from "@/lib/i18n/keys";

export const Route = createFileRoute("/$section")({
  beforeLoad: ({ params }) => {
    if (params.section === "declarations") {
      throw redirect({ to: "/$section", params: { section: "politics" } });
    }
  },
  component: SectionRoute,
});

function SectionRoute() {
  const { section } = Route.useParams();
  if (!isSectionId(section)) {
    throw notFound();
  }
  const lang = useAppStore((s) => s.lang);
  const extras = useAppStore((s) => s.extras);
  const title = t(lang, SECTION_KEY[section] ?? "secWorld");
  return (
    <SiteShell>
      <title>{`${title} — YES IT'S REAL`}</title>
      <SectionArchive section={section} lang={lang} extras={extras} />
    </SiteShell>
  );
}
