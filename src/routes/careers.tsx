import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/site-shell";
import { LeadForm } from "@/components/site/lead-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import { EMAILS } from "@/lib/brand";
import { JOBS, jobCopy } from "@/lib/jobs";
import { ShareBar } from "@/components/site/share-bar";

export const Route = createFileRoute("/careers")({ component: CareersPage });

function CareersPage() {
  const lang = useAppStore((s) => s.lang);
  const roles = JOBS.map((j) => ({ id: j.slug, label: jobCopy(j, lang).title }));

  return (
    <SiteShell>
      <main id="main" className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <p className="kicker text-signal">{t(lang, "careersHiring")}</p>
        <h1 className="mt-2 font-serif text-5xl uppercase leading-[0.9] sm:text-7xl">{t(lang, "careersTitle")}</h1>
        <p className="mt-4 max-w-2xl text-lg">{t(lang, "careersDek")}</p>
        <p className="mt-3 text-sm">
          <a className="font-bold underline" href={`mailto:${EMAILS.jobs}`}>
            {EMAILS.jobs}
          </a>
        </p>
        <ShareBar lang={lang} path="/careers" headline={t(lang, "careersTitle")} className="mt-5" />

        <section className="mt-10 bg-scream p-6 text-scream-ink">
          <p className="kicker">{t(lang, "stringerTitle")}</p>
          <p className="mt-2 font-serif text-3xl uppercase leading-none">{t(lang, "stringerDek")}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="default" asChild>
              <a href="#apply">{t(lang, "careersApply")}</a>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/submit">{t(lang, "submit")}</Link>
            </Button>
          </div>
        </section>

        <h2 className="mt-12 font-serif text-3xl uppercase">{t(lang, "careersOpen")}</h2>
        <ul className="mt-6 space-y-6">
          {JOBS.map((job) => {
            const copy = jobCopy(job, lang);
            return (
              <li key={job.id} id={job.slug} className="border-2 border-ink bg-card p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="signal">{job.team}</Badge>
                  <Badge tone="muted">{job.type}</Badge>
                  <Badge tone="scream">{job.pay}</Badge>
                </div>
                <h3 className="mt-3 font-serif text-3xl uppercase leading-none">{copy.title}</h3>
                <p className="mt-2 text-sm text-ink-muted">
                  {job.location}
                </p>
                <p className="mt-3 text-sm">{copy.dek}</p>
                <ul className="mt-3 list-disc space-y-1 ps-5 text-sm">
                  {copy.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <a href="#apply" className="mt-4 inline-flex h-11 items-center text-xs font-extrabold uppercase tracking-[0.14em] underline">
                  {t(lang, "careersApply")}
                </a>
              </li>
            );
          })}
        </ul>

        <section id="apply" className="mt-12 border-2 border-ink p-6">
          <h2 className="font-serif text-3xl uppercase">{t(lang, "careersApply")}</h2>
          <p className="mt-2 text-sm text-ink-muted">{t(lang, "careersDek")}</p>
          <div className="mt-6">
            <LeadForm
              lang={lang}
              kind="job"
              roleOptions={roles}
              cta={t(lang, "applySend")}
              thanks={t(lang, "careersThanks")}
            />
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
