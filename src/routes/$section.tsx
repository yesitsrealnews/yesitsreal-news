import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/site-shell";
import { SectionArchive } from "@/components/stories/section-page";
import { isSectionId } from "@/lib/data/sections";
import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { DICT } from "@/lib/i18n/dict";
import { SECTION_KEY } from "@/lib/i18n/keys";
import { SITE_URL } from "@/lib/brand";

export const Route = createFileRoute("/$section")({
  beforeLoad: ({ params }) => {
    if (params.section === "declarations") {
      throw redirect({ to: "/$section", params: { section: "politics" } });
    }
    if (params.section === "crime") {
      throw redirect({ to: "/$section", params: { section: "courts" } });
    }
    if (params.section === "archive") {
      throw redirect({ to: "/" });
    }
    if (params.section === "investir" || params.section === "acheter" || params.section === "buy") {
      throw redirect({ to: "/invest" });
    }
    if (params.section === "credit") {
      throw redirect({ to: "/credits" });
    }
    if (!isSectionId(params.section)) {
      throw notFound();
    }
  },
  head: ({ params }) => {
    if (!isSectionId(params.section)) return {};
    const key = SECTION_KEY[params.section] ?? "secWorld";
    const label = DICT.fr[key] ?? params.section;
    const title = `${label} — YES IT'S REAL`;
    const url = `${SITE_URL}/${params.section}`;
    return {
      title,
      meta: [
        { title },
        {
          name: "description",
          content: `Rubrique ${label} — faits vrais, sourcés, déjà parus. Ça s’est vraiment passé. YES IT'S REAL.`,
        },
        { property: "og:title", content: title },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
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