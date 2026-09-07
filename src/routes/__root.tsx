import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { SiteShell } from "@/components/site/site-shell";
import { NotFoundPage } from "@/components/site/not-found";
import { GOOGLE_SITE_VERIFICATION, SEO_FR } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/brand";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: SEO_FR.title },
      { name: "description", content: SEO_FR.description },
      { name: "keywords", content: SEO_FR.keywords },
      { name: "theme-color", content: "#141414" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { name: "googlebot", content: "index, follow, max-image-preview:large" },
      { name: "googlebot-news", content: "index, follow" },
      { name: "application-name", content: SITE_NAME },
      { name: "news_keywords", content: "infos, faits divers, pas de satire, news, bizarre, vrai" },
      { name: "google-site-verification", content: GOOGLE_SITE_VERIFICATION },
      { name: "author", content: SITE_NAME },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "fr_FR" },
      { property: "og:locale:alternate", content: "en_GB" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@Yesitsarealnews" },
      { name: "twitter:creator", content: "@Yesitsarealnews" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Oswald:wght@500;600;700&family=Playfair+Display:ital,wght@0,700;0,800;1,700;1,800&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap",
      },
      { rel: "alternate", type: "application/rss+xml", href: `${SITE_URL}/rss.xml`, title: "YES IT'S REAL — Français" },
      { rel: "alternate", type: "application/rss+xml", href: `${SITE_URL}/rss-en.xml`, title: "YES IT'S REAL — English" },
    ],
  }),
  notFoundComponent: () => (
    <SiteShell>
      <NotFoundPage />
    </SiteShell>
  ),
  component: RootDocument,
});

function RootDocument() {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var r=localStorage.getItem('yir-desk');if(!r)return;var s=JSON.parse(r);var st=s&&s.state;if(!st)return;if(st.theme==='dark')document.documentElement.classList.add('dark');if(st.lang){document.documentElement.lang=st.lang==='zh-TW'?'zh-Hant':st.lang;if(st.lang==='ar'||st.lang==='he'||st.lang==='ur')document.documentElement.dir='rtl';}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="antialiased">
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
