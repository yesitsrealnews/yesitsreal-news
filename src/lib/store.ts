import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Lang, Lead, QueueItem, ReactionId, Story, StoryStatus, Submission } from "@/lib/types";
import { detectBrowserLang, isLang } from "@/lib/i18n/langs";
import { SPRINT_MS } from "@/lib/revenue";
import {
  DEFAULT_DENY_DOMAINS,
  NATIONAL_DESK_DOMAINS,
  REGIONAL_PRESS_DOMAINS,
} from "@/lib/data/regional-press";

function uniqueSortedDomains(...lists: string[][]): string[] {
  return [...new Set(lists.flat().map((d) => d.toLowerCase().replace(/^www\./, "")))].sort((a, b) =>
    a.localeCompare(b),
  );
}

const DEFAULT_ALLOW_LIST = uniqueSortedDomains(REGIONAL_PRESS_DOMAINS, NATIONAL_DESK_DOMAINS);

export type Theme = "light" | "dark";
export type CookieChoice = "unknown" | "all" | "necessary";
export type DeskStatusMap = Record<string, "held" | "deleted">;

interface AppState {
  lang: Lang;
  theme: Theme;
  cookies: CookieChoice;
  admin: boolean;
  hydrated: boolean;
  submissions: Submission[];
  inbox: QueueItem[];
  rejected: QueueItem[];
  extras: Story[];
  deskStatus: DeskStatusMap;
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
  upsertInbox: (item: QueueItem) => void;
  rejectItem: (id: string, reason: string) => void;
  publishItem: (id: string) => void;
  publishQueueItem: (item: QueueItem) => void;
  rejectQueueItem: (item: QueueItem, reason: string) => void;
  holdInboxItem: (item: QueueItem) => void;
  deleteInboxItem: (id: string) => void;
  addExtra: (story: Story) => void;
  updateStory: (story: Story) => void;
  setDeskStatus: (map: DeskStatusMap) => void;
  setStoryDeskStatus: (id: string, status: "held" | "deleted" | null) => void;
  hydrateDeskStatus: () => Promise<void>;
  applyStoryDeskStatus: (id: string, status: "held" | "deleted" | "published") => Promise<boolean>;
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
}

let deskHydratePromise: Promise<void> | null = null;
let deskHydratedOnce = false;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      lang: "fr",
      theme: "light",
      cookies: "unknown",
      admin: false,
      hydrated: false,
      submissions: [],
      inbox: [],
      rejected: [],
      extras: [],
      deskStatus: {},
      allowList: DEFAULT_ALLOW_LIST,
      denyList: [...DEFAULT_DENY_DOMAINS],
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
      upsertInbox: (item) => set({ inbox: [item, ...get().inbox.filter((i) => i.id !== item.id)] }),
      rejectItem: (id, reason) => {
        const item = get().inbox.find((i) => i.id === id);
        if (!item) return;
        get().rejectQueueItem(item, reason);
      },
      publishItem: (id) => {
        const item = get().inbox.find((i) => i.id === id);
        if (!item) return;
        get().publishQueueItem(item);
      },
      publishQueueItem: (item) => {
        const published: Story = {
          ...item.story,
          status: "published",
          factChecked: true,
          publishedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const deskStatus = { ...get().deskStatus };
        delete deskStatus[published.id];
        set({
          inbox: get().inbox.filter((i) => i.id !== item.id),
          extras: [published, ...get().extras.filter((s) => s.id !== published.id)],
          deskStatus,
        });
      },
      rejectQueueItem: (item, reason) => {
        set({
          inbox: get().inbox.filter((i) => i.id !== item.id),
          rejected: [
            { ...item, story: { ...item.story, status: "rejected", rejectReason: reason } },
            ...get().rejected.filter((i) => i.id !== item.id),
          ],
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
        set({
          inbox: get().inbox.filter((i) => i.id !== id),
          rejected: get().rejected.filter((i) => i.id !== id),
        });
        if (/^s\d+$/.test(storyId)) {
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
          const nextStatus: StoryStatus = status === null ? "published" : status;
          return { ...s, status: nextStatus };
        });
        set({ deskStatus, extras });
      },
      hydrateDeskStatus: async () => {
        if (deskHydratedOnce) return;
        if (deskHydratePromise) return deskHydratePromise;
        deskHydratePromise = (async () => {
          try {
            const res = await fetch("/api/desk-story-status");
            const data = (await res.json()) as { ok?: boolean; stories?: DeskStatusMap };
            if (data?.ok && data.stories && typeof data.stories === "object") {
              get().setDeskStatus(data.stories);
            }
          } catch {
            /* keep cached map */
          } finally {
            deskHydratedOnce = true;
            deskHydratePromise = null;
          }
        })();
        return deskHydratePromise;
      },
      applyStoryDeskStatus: async (id, status) => {
        try {
          const res = await fetch("/api/desk-story-status", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ storyId: id, status }),
          });
          const data = (await res.json()) as { ok?: boolean; stories?: DeskStatusMap };
          if (!res.ok || !data?.ok) return false;
          if (data.stories) get().setDeskStatus(data.stories);
          else get().setStoryDeskStatus(id, status === "published" ? null : status);
          const extras = get().extras.map((s): Story => {
            if (s.id !== id) return s;
            const nextStatus: StoryStatus = status === "published" ? "published" : status;
            return { ...s, status: nextStatus };
          });
          set({ extras });
          return true;
        } catch {
          return false;
        }
      },
      setAllowList: (allowList) => set({ allowList }),
      setDenyList: (denyList) => set({ denyList }),
      seedRegionalPress: () => {
        const merged = uniqueSortedDomains(get().allowList, REGIONAL_PRESS_DOMAINS, NATIONAL_DESK_DOMAINS);
        set({ allowList: merged });
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
      version: 5,
      migrate: (persisted) => {
        const s = (persisted ?? {}) as { lang?: string; admin?: boolean; deskStatus?: DeskStatusMap };
        if (!s.lang || s.lang === "en") s.lang = "fr";
        delete s.admin;
        if (!s.deskStatus || typeof s.deskStatus !== "object") s.deskStatus = {};
        return s as typeof persisted;
      },
      partialize: (s) => ({
        lang: s.lang,
        theme: s.theme,
        cookies: s.cookies,
        submissions: s.submissions,
        inbox: s.inbox,
        rejected: s.rejected,
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
        applyDocument(state.lang, state.theme);
        state.setHydrated(true);
        if (!state.sprintEndsAt) state.ensureSprint();
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
  store.ensureSprint();
  void store.hydrateDeskStatus();
}
