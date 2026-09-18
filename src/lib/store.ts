import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Lang, Lead, QueueItem, ReactionId, Story, StoryStatus, Submission } from "@/lib/types";
import { detectBrowserLang, isLang } from "@/lib/i18n/langs";
import { SPRINT_MS } from "@/lib/revenue";
import { isCatalogId, isCatalogSourceUrl } from "@/lib/data/stories";

const SATIRE_DENY = [
  "theonion.com",
  "babylonbee.com",
  "clickhole.com",
  "waterfordwhispersnews.com",
  "legorafi.fr",
  "nordpresse.be",
  "dailymash.co.uk",
  "elmundotoday.com",
  "worldnewsdailyreport.com",
  "huzlers.com",
  "empirenews.net",
  "newsbiscuit.com",
  "thespoof.com",
  "fakingnews.com",
  "thepoke.co.uk",
  "thepoke.com",
  "thedailymash.co.uk",
  "newsthump.com",
];

export type Theme = "light" | "dark";
export type CookieChoice = "unknown" | "all" | "necessary";
export type DeskStatusMap = Record<string, "held" | "deleted" | "published">;

interface AppState {
  lang: Lang;
  theme: Theme;
  cookies: CookieChoice;
  admin: boolean;
  hydrated: boolean;
  submissions: Submission[];
  inbox: QueueItem[];
  rejected: QueueItem[];
  /** Ids destroyed from Cambuse — never rehydrate. Lightweight, no archive body. */
  purgedIds: string[];
  extras: Story[];
  deskStatus: DeskStatusMap;
  frontPageIds: string[];
  allowList: string[];
  denyList: string[];
  newsletter: string[];
  contestVotes: Record<string, number>;
  contestVoted: string[];
  cupEntries: { id: string; country: string; url: string; notes: string; createdAt: string }[];
  contacts: { id: string; email: string; body: string; createdAt: string }[];
  leads: Lead[];
  reactions: Record<string, Partial<Record<ReactionId, number>>>;
  myReactions: Record<string, ReactionId>;
  fakeGuesses: Record<string, "yes" | "no">;
  shares: Record<string, number>;
  sprintEndsAt: string | null;
  setLang: (lang: Lang) => void;
  setTheme: (theme: Theme) => void;
  setCookies: (cookies: CookieChoice) => void;
  setAdmin: (on: boolean) => void;
  setHydrated: (on: boolean) => void;
  addSubmission: (s: Submission) => void;
  setInbox: (items: QueueItem[]) => void;
  mergeInboxFromServer: (items: QueueItem[]) => void;
  ingestRss: (items: QueueItem[]) => void;
  upsertInbox: (item: QueueItem) => void;
  rejectItem: (id: string, reason: string) => void;
  publishItem: (id: string) => void;
  publishQueueItem: (item: QueueItem) => Promise<boolean>;
  rejectQueueItem: (item: QueueItem, reason: string) => void;
  holdInboxItem: (item: QueueItem) => void;
  deleteInboxItem: (id: string) => void;
  addExtra: (story: Story) => void;
  updateStory: (story: Story) => void;
  setDeskStatus: (map: DeskStatusMap) => void;
  setStoryDeskStatus: (id: string, status: "held" | "deleted" | "published" | null) => void;
  hydrateDeskStatus: () => Promise<void>;
  hydratePublishedExtras: () => Promise<void>;
  applyStoryDeskStatus: (id: string, status: "held" | "deleted" | "published") => Promise<boolean>;
  setFrontPageIds: (ids: string[]) => void;
  hydrateFrontPage: () => Promise<void>;
  pinToFront: (storyId: string) => Promise<boolean>;
  unpinFromFront: (storyId: string) => Promise<boolean>;
  setAllowList: (list: string[]) => void;
  setDenyList: (list: string[]) => void;
  seedRegionalPress: () => void;
  addNewsletter: (email: string) => void;
  voteCup: (id: string) => boolean;
  addCupEntry: (entry: { country: string; url: string; notes: string }) => void;
  addContact: (email: string, body: string) => boolean;
  addLead: (lead: Omit<Lead, "id" | "createdAt">) => boolean;
  react: (storyId: string, reaction: ReactionId) => boolean;
  guessFake: (storyId: string, guess: "yes" | "no") => void;
  countShare: (key: string) => void;
  ensureSprint: () => string;
}

function applyDocument(lang: Lang, theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.lang = lang === "zh-TW" ? "zh-Hant" : lang;
  root.dir = lang === "ar" || lang === "he" || lang === "ur" ? "rtl" : "ltr";
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
}

let deskHydratePromise: Promise<void> | null = null;
let deskHydratedOnce = false;
let frontHydratePromise: Promise<void> | null = null;
let frontHydratedOnce = false;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      lang: "fr",
      theme: "dark",
      cookies: "unknown",
      admin: false,
      hydrated: false,
      submissions: [],
      inbox: [],
      rejected: [],
      purgedIds: [],
      extras: [],
      deskStatus: { s135: "held", s136: "held", s137: "held", s138: "held", s139: "held" },
      frontPageIds: [],
      allowList: [] as string[],
      denyList: [...SATIRE_DENY],
      newsletter: [],
      contestVotes: {},
      contestVoted: [],
      cupEntries: [],
      contacts: [],
      leads: [],
      reactions: {},
      myReactions: {},
      fakeGuesses: {},
      shares: {},
      sprintEndsAt: null,
      setLang: (lang) => {
        applyDocument(lang, get().theme);
        set({ lang });
      },
      setTheme: (theme) => {
        applyDocument(get().lang, theme);
        set({ theme });
      },
      setCookies: (cookies) => set({ cookies }),
      setAdmin: (admin) => set({ admin }),
      setHydrated: (hydrated) => set({ hydrated }),
      addSubmission: (s) => set({ submissions: [s, ...get().submissions] }),
      setInbox: (inbox) => set({ inbox }),
      mergeInboxFromServer: (items) => {
        const purged = new Set(get().purgedIds);
        const incoming = items.filter((i) => i?.id && !purged.has(i.id) && !purged.has(i.story?.id));
        const incomingIds = new Set(incoming.map((i) => i.id));
        const local = get().inbox.filter((i) => {
          if (!i?.id || purged.has(i.id) || purged.has(i.story?.id)) return false;
          if (incomingIds.has(i.id)) return false;
          return true;
        });
        set({ inbox: [...incoming, ...local] });
      },
      ingestRss: (items) => {
        const incoming = items.filter((i) => i?.id);
        if (!incoming.length) return;
        const incomingIds = new Set(incoming.flatMap((i) => [i.id, i.story?.id].filter(Boolean) as string[]));
        const local = get().inbox.filter((i) => !incomingIds.has(i.id) && !incomingIds.has(i.story?.id));
        set({
          inbox: [...incoming, ...local],
          purgedIds: get().purgedIds.filter((id) => !incomingIds.has(id)),
        });
      },
      upsertInbox: (item) => {
        const rss = item.id.startsWith("q-rss-") || item.submittedBy.startsWith("Veille ·") || item.submittedBy.startsWith("RSS");
        const purged = new Set(get().purgedIds);
        if (!rss && (purged.has(item.id) || (item.story?.id && purged.has(item.story.id)))) return;
        if (rss) {
          set({
            inbox: [item, ...get().inbox.filter((i) => i.id !== item.id)],
            purgedIds: get().purgedIds.filter((id) => id !== item.id && id !== item.story?.id),
          });
          return;
        }
        set({ inbox: [item, ...get().inbox.filter((i) => i.id !== item.id)] });
      },
      rejectItem: (id, reason) => {
        const item = get().inbox.find((i) => i.id === id);
        if (!item) return;
        get().rejectQueueItem(item, reason);
      },
      publishItem: (id) => {
        const item = get().inbox.find((i) => i.id === id);
        if (!item) return;
        void get().publishQueueItem(item);
      },
      publishQueueItem: async (item) => {
        const payload: Story = {
          ...item.story,
          status: "published",
          factChecked: true,
          publishedAt: item.story.publishedAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        try {
          const res = await fetch("/api/publish", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ story: payload, storyId: payload.id }),
          });
          const data = (await res.json().catch(() => ({}))) as {
            ok?: boolean;
            reason?: string;
            story?: Story;
            stories?: DeskStatusMap;
            ids?: string[];
            extras?: Story[];
          };
          if (res.status === 401 || data.reason === "unauthorized") {
            if (typeof window !== "undefined") {
              window.alert("Session cambuse expirée. Reconnecte-toi, puis Publier.");
            }
            return false;
          }
          if (!res.ok || !data.ok || !data.story) {
            if (typeof window !== "undefined") {
              window.alert("Publication non enregistrée (réseau). Réessaie.");
            }
            return false;
          }
          const published = data.story;
          const deskStatus = data.stories
            ? data.stories
            : { ...get().deskStatus, [published.id]: "published" as const };
          const extras = data.extras?.length
            ? data.extras
            : [published, ...get().extras.filter((s) => s.id !== published.id && s.id !== item.story.id)];
          set({
            inbox: get().inbox.filter(
              (i) => i.id !== item.id && i.story.id !== item.story.id && i.story.id !== published.id,
            ),
            extras,
            deskStatus,
            frontPageIds: Array.isArray(data.ids)
              ? data.ids
              : [published.id, ...get().frontPageIds.filter((id) => id !== published.id)],
          });
          return true;
        } catch {
          if (typeof window !== "undefined") {
            window.alert("Réseau. Réessaie.");
          }
          return false;
        }
      },
      rejectQueueItem: (item, _reason) => {
        // Hard destroy — no Refusés archive. reason kept for API compat only.
        const purged = [...new Set([item.id, ...get().purgedIds])].slice(0, 500);
        set({
          inbox: get().inbox.filter((i) => i.id !== item.id),
          rejected: [],
          purgedIds: purged,
          extras: get().extras.filter((s) => s.id !== item.story.id && s.id !== item.id),
        });
      },
      holdInboxItem: (item) => {
        const held = { ...item.story, status: "held" as const, updatedAt: new Date().toISOString() };
        set({
          inbox: [{ ...item, story: held }, ...get().inbox.filter((i) => i.id !== item.id)],
          extras: get().extras.map((s) => (s.id === held.id ? { ...s, status: "held" } : s)),
        });
        void get().applyStoryDeskStatus(held.id, "held");
      },
      deleteInboxItem: (id) => {
        const fromInbox = get().inbox.find((i) => i.id === id);
        const storyId = fromInbox?.story.id ?? id;
        const isCatalog = /^s\d+$/.test(storyId);
        const purged = isCatalog ? [...new Set([id, storyId, ...get().purgedIds])].slice(0, 500) : get().purgedIds;
        set({
          inbox: get().inbox.filter((i) => i.id !== id && i.story.id !== storyId),
          rejected: [],
          purgedIds: purged,
          extras: get().extras.filter((s) => s.id !== id && s.id !== storyId),
        });
        if (isCatalog) {
          void get().applyStoryDeskStatus(storyId, "deleted");
        }
      },
      addExtra: (story) => set({ extras: [story, ...get().extras] }),
      updateStory: (story) =>
        set({
          extras: [story, ...get().extras.filter((s) => s.id !== story.id)],
          inbox: get().inbox.map((i) => (i.story.id === story.id ? { ...i, story } : i)),
        }),
      setDeskStatus: (deskStatus) => set({ deskStatus }),
      setStoryDeskStatus: (id, status) => {
        const deskStatus = { ...get().deskStatus };
        if (status === null) delete deskStatus[id];
        else deskStatus[id] = status;
        const extras = get().extras.map((s): Story => {
          if (s.id !== id) return s;
          const nextStatus: StoryStatus = status === null ? "published" : status === "published" ? "published" : status;
          return { ...s, status: nextStatus };
        });
        set({ deskStatus, extras });
      },
      hydrateDeskStatus: async () => {
        if (deskHydratePromise) return deskHydratePromise;
        deskHydratePromise = (async () => {
          try {
            const res = await fetch("/api/desk-story-status", { cache: "no-store" });
            const data = (await res.json()) as { ok?: boolean; stories?: DeskStatusMap };
            if (res.ok && data?.ok && data.stories && typeof data.stories === "object") {
              get().setDeskStatus(data.stories);
            }
          } catch {
            /* keep cached map — never wipe holds on a failed fetch */
          } finally {
            deskHydratedOnce = true;
            deskHydratePromise = null;
          }
        })();
        return deskHydratePromise;
      },
      hydratePublishedExtras: async () => {
        try {
          const res = await fetch("/api/publish", { cache: "no-store" });
          const data = (await res.json()) as { ok?: boolean; stories?: Story[] };
          if (!res.ok || !data?.ok || !Array.isArray(data.stories)) return;
          const fromServer = data.stories.filter((s) => s && typeof s.id === "string" && !isCatalogId(s.id));
          const serverIds = new Set(fromServer.map((s) => s.id));
          const fromClient = get().extras.filter((s) => {
            if (!s?.id || isCatalogId(s.id)) return false;
            if (s.sources.some((x) => isCatalogSourceUrl(x.url))) return false;
            if (fromServer.length && serverIds.has(s.id)) return false;
            return true;
          });
          set({ extras: [...fromServer, ...fromClient] });
        } catch {
          /* keep local extras */
        }
      },
      applyStoryDeskStatus: async (id, status) => {
        const prevOverride = get().deskStatus[id];
        const prevExtra = get().extras.find((s) => s.id === id);
        // Optimistic — Cambuse must drop the row immediately.
        get().setStoryDeskStatus(id, status);
        if (status === "deleted" && get().frontPageIds.includes(id)) {
          void get().unpinFromFront(id);
        }
        try {
          const res = await fetch("/api/desk-story-status", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ storyId: id, status }),
          });
          const data = (await res.json()) as { ok?: boolean; stories?: DeskStatusMap };
          if (!res.ok || !data?.ok) {
            get().setStoryDeskStatus(id, prevOverride ?? null);
            if (prevExtra) {
              set({ extras: [prevExtra, ...get().extras.filter((s) => s.id !== id)] });
            }
            return false;
          }
          if (data.stories) get().setDeskStatus(data.stories);
          const extras = get().extras.map((s): Story => {
            if (s.id !== id) return s;
            const nextStatus: StoryStatus = status === "published" ? "published" : status;
            return { ...s, status: nextStatus };
          });
          set({ extras });
          if (status === "published") {
            void get().pinToFront(id);
          }
          return true;
        } catch {
          get().setStoryDeskStatus(id, prevOverride ?? null);
          if (prevExtra) {
            set({ extras: [prevExtra, ...get().extras.filter((s) => s.id !== id)] });
          }
          return false;
        }
      },
      setFrontPageIds: (frontPageIds) => set({ frontPageIds }),
      hydrateFrontPage: async () => {
        if (frontHydratePromise) return frontHydratePromise;
        frontHydratePromise = (async () => {
          try {
            const res = await fetch("/api/desk-front-page", { cache: "no-store" });
            const data = (await res.json()) as { ok?: boolean; ids?: string[] };
            if (data?.ok && Array.isArray(data.ids)) {
              get().setFrontPageIds(data.ids.filter((id) => typeof id === "string" && /^s\d+$/.test(id)));
            }
          } catch {
            /* keep cached ids */
          } finally {
            frontHydratedOnce = true;
            frontHydratePromise = null;
          }
        })();
        return frontHydratePromise;
      },
      pinToFront: async (storyId) => {
        if (!/^s\d+$/.test(storyId)) return false;
        try {
          const res = await fetch("/api/desk-front-page", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "pin", storyId }),
          });
          const data = (await res.json()) as { ok?: boolean; ids?: string[] };
          if (!res.ok || !data?.ok) return false;
          if (Array.isArray(data.ids)) get().setFrontPageIds(data.ids);
          else {
            const ids = get().frontPageIds.filter((id) => id !== storyId);
            get().setFrontPageIds([storyId, ...ids]);
          }
          return true;
        } catch {
          return false;
        }
      },
      unpinFromFront: async (storyId) => {
        if (!/^s\d+$/.test(storyId)) return false;
        try {
          const res = await fetch("/api/desk-front-page", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "unpin", storyId }),
          });
          const data = (await res.json()) as { ok?: boolean; ids?: string[] };
          if (!res.ok || !data?.ok) return false;
          if (Array.isArray(data.ids)) get().setFrontPageIds(data.ids);
          else get().setFrontPageIds(get().frontPageIds.filter((id) => id !== storyId));
          return true;
        } catch {
          return false;
        }
      },
      setAllowList: (allowList) => set({ allowList }),
      setDenyList: (denyList) => set({ denyList }),
      seedRegionalPress: () => {
        void import("@/lib/data/regional-press").then((mod) => {
          const merged = [
            ...new Set(
              [...get().allowList, ...mod.REGIONAL_PRESS_DOMAINS, ...mod.NATIONAL_DESK_DOMAINS].map((d) =>
                d.toLowerCase().replace(/^www\./, ""),
              ),
            ),
          ].sort((a, b) => a.localeCompare(b));
          set({ allowList: merged });
        });
      },
      addNewsletter: (email) => {
        const clean = email.trim().toLowerCase();
        if (!clean || get().newsletter.includes(clean)) return;
        set({ newsletter: [clean, ...get().newsletter] });
      },
      voteCup: (id) => {
        if (get().contestVoted.includes(id)) return false;
        const votes = get().contestVotes;
        set({
          contestVoted: [...get().contestVoted, id],
          contestVotes: { ...votes, [id]: (votes[id] ?? 0) + 1 },
        });
        return true;
      },
      addCupEntry: (entry) => {
        set({
          cupEntries: [
            { id: `cup-${Date.now()}`, createdAt: new Date().toISOString(), ...entry },
            ...get().cupEntries,
          ],
        });
      },
      addContact: (email, body) => {
        if (get().contacts.length > 80) return false;
        set({
          contacts: [
            { id: `c-${Date.now()}`, email, body, createdAt: new Date().toISOString() },
            ...get().contacts,
          ],
        });
        return true;
      },
      addLead: (lead) => {
        if (get().leads.length > 200) return false;
        set({
          leads: [
            {
              ...lead,
              id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              createdAt: new Date().toISOString(),
            },
            ...get().leads,
          ],
        });
        if (lead.email) get().addNewsletter(lead.email);
        return true;
      },
      react: (storyId, reaction) => {
        if (get().myReactions[storyId]) return false;
        const prev = get().reactions[storyId] ?? {};
        set({
          myReactions: { ...get().myReactions, [storyId]: reaction },
          reactions: {
            ...get().reactions,
            [storyId]: { ...prev, [reaction]: (prev[reaction] ?? 0) + 1 },
          },
        });
        return true;
      },
      guessFake: (storyId, guess) => {
        if (get().fakeGuesses[storyId]) return;
        set({ fakeGuesses: { ...get().fakeGuesses, [storyId]: guess } });
      },
      countShare: (key) => {
        const shares = get().shares;
        set({ shares: { ...shares, [key]: (shares[key] ?? 0) + 1 } });
      },
      ensureSprint: () => {
        const existing = get().sprintEndsAt;
        if (existing) return existing;
        const ends = new Date(Date.now() + SPRINT_MS).toISOString();
        set({ sprintEndsAt: ends });
        return ends;
      },
    }),
    {
      name: "yir-desk",
      version: 13,
      migrate: (persisted) => {
        const s = (persisted ?? {}) as {
          lang?: string;
          theme?: string;
          admin?: boolean;
          deskStatus?: DeskStatusMap;
          frontPageIds?: string[];
          rejected?: unknown;
          purgedIds?: string[];
          extras?: Story[];
        };
        if (!s.lang || s.lang === "en") s.lang = "fr";
        s.theme = "dark";
        delete s.admin;
        if (!s.deskStatus || typeof s.deskStatus !== "object") s.deskStatus = {};
        s.frontPageIds = [];
        // Drop Refusés archive — free storage; keep only lightweight purged ids.
        const oldRejected = Array.isArray(s.rejected) ? s.rejected : [];
        const fromRejected = oldRejected
          .map((r) => (r && typeof r === "object" && "id" in r ? String((r as { id: string }).id) : ""))
          .filter(Boolean);
        const purged = [...new Set([...(s.purgedIds ?? []), ...fromRejected])];
        // Revue seeds reappear until Publier. RSS leads are not durable deletes.
        s.purgedIds = purged
          .filter((id) => {
            if (id.startsWith("q-rss-")) return false;
            const n = /^s(\d+)$/.exec(id);
            if (!n) return true;
            const num = Number(n[1]);
            return num < 135 || num === 140 || num > 199;
          })
          .slice(0, 500);
        delete s.rejected;
        if (Array.isArray(s.extras)) {
          s.extras = s.extras.filter((e) => {
            if (!e || typeof e !== "object" || !e.id) return false;
            if (isCatalogId(e.id)) return false;
            return !e.sources?.some((x) => x?.url && isCatalogSourceUrl(x.url));
          });
        }
        return s as typeof persisted;
      },
      partialize: (s) => ({
        lang: s.lang,
        theme: s.theme,
        cookies: s.cookies,
        submissions: s.submissions,
        inbox: s.inbox,
        purgedIds: s.purgedIds,
        extras: s.extras,
        deskStatus: s.deskStatus,
        allowList: s.allowList,
        denyList: s.denyList,
        newsletter: s.newsletter,
        contestVotes: s.contestVotes,
        contestVoted: s.contestVoted,
        cupEntries: s.cupEntries,
        leads: s.leads,
        reactions: s.reactions,
        myReactions: s.myReactions,
        fakeGuesses: s.fakeGuesses,
        shares: s.shares,
        sprintEndsAt: s.sprintEndsAt,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        if (!isLang(state.lang)) state.lang = detectBrowserLang();
        if (!state.contestVotes) state.contestVotes = {};
        if (!state.contestVoted) state.contestVoted = [];
        if (!state.cupEntries) state.cupEntries = [];
        if (!state.leads) state.leads = [];
        if (!state.reactions) state.reactions = {};
        if (!state.myReactions) state.myReactions = {};
        if (!state.fakeGuesses) state.fakeGuesses = {};
        if (!state.shares) state.shares = {};
        if (!state.deskStatus) state.deskStatus = {};
        if (!state.frontPageIds) state.frontPageIds = [];
        if (!Array.isArray(state.allowList)) state.allowList = [];
        if (!Array.isArray(state.denyList) || !state.denyList.length) state.denyList = [...SATIRE_DENY];
        applyDocument(state.lang, state.theme);
        state.setHydrated(true);
        void state.hydrateDeskStatus();
        void state.hydrateFrontPage();
        void state.hydratePublishedExtras();
      },
    },
  ),
);

export function bootstrapClientPrefs() {
  if (typeof window === "undefined") return;
  const store = useAppStore.getState();
  if (!store.hydrated) {
    const detected = detectBrowserLang();
    if (store.lang === "en" && !window.localStorage.getItem("yir-desk")) {
      store.setLang(detected === "en" ? "fr" : detected);
    }
    applyDocument(useAppStore.getState().lang, useAppStore.getState().theme);
    store.setHydrated(true);
  }
  void store.hydrateDeskStatus();
  void store.hydrateFrontPage();
  void store.hydratePublishedExtras();
}
