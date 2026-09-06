import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { SiteShell } from "@/components/site/site-shell";
import { NotFoundPage } from "@/components/site/not-found";
import appCss from "../styles.css?url";

const APP_NAME = "YES IT'S REAL";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${APP_NAME} — Real news. Unbelievably dumb.` },
      { name: "description", content: "Verified. Sourced. Unfortunately true. A global newsroom that only publishes real, fact-checked stories among the dumbest events on Earth. Not satire." },
      { name: "theme-color", content: "#141414" },
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
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Oswald:wght@500;600;700&display=swap",
      },
      { rel: "alternate", type: "application/rss+xml", href: "/rss.xml", title: "YES IT'S REAL" },
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
    <html lang="en" suppressHydrationWarning>
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
