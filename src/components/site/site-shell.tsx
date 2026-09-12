import { useEffect, type ReactNode } from "react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Ticker } from "@/components/site/ticker";
import { AdSlot, MobileAnchorAd } from "@/components/site/ad-slot";
import { ADS_PUBLIC } from "@/lib/ads";
import { CookieBanner } from "@/components/site/cookie-banner";
import { bootstrapClientPrefs, useAppStore } from "@/lib/store";

export function SiteShell({ children }: { children: ReactNode }) {
  const lang = useAppStore((s) => s.lang);
  const theme = useAppStore((s) => s.theme);
  const cookies = useAppStore((s) => s.cookies);
  const setLang = useAppStore((s) => s.setLang);
  const setTheme = useAppStore((s) => s.setTheme);
  const setCookies = useAppStore((s) => s.setCookies);
  const showAnchor = ADS_PUBLIC && cookies !== "necessary";

  useEffect(() => {
    bootstrapClientPrefs();
  }, []);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Ticker lang={lang} />
      <Header
        lang={lang}
        theme={theme}
        onLang={setLang}
        onTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
      />
      <div className="mx-auto hidden max-w-7xl px-4 pt-4 md:block md:px-6">
        <AdSlot lang={lang} slot="leaderboard" salt="shell" />
      </div>
      <div className={showAnchor ? "pb-24 md:pb-0" : undefined}>{children}</div>
      <Footer lang={lang} />
      {cookies === "unknown" ? <CookieBanner lang={lang} onChoice={setCookies} /> : null}
      {showAnchor ? <MobileAnchorAd lang={lang} /> : null}
    </div>
  );
}
