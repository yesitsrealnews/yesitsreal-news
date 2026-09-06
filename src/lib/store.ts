import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Lang, Lead, QueueItem, ReactionId, Story, Submission } from "@/lib/types";
import { detectBrowserLang, isLang } from "@/lib/i18n/langs";
import { SPRINT_MS } from "@/lib/revenue";

export type Theme = "light" | "dark";
export type CookieChoice = "unknown" | "all" | "necessary";

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
  addExtra: (story: Story) => void;
  updateStory: (story: Story) => void;
  setAllowList: (list: string[]) => void;
  setDenyList: (list: string[]) => void;
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
      allowList: ["reuters.example", "afp.example", "ap.example", "gov.uk", "europa.eu", "courts.example"],
      denyList: ["theonion.example", "babylonbee.example", "clickhole.example"],
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
        set({
          inbox: get().inbox.filter((i) => i.id !== item.id),
          extras: [published, ...get().extras.filter((s) => s.id !== published.id)],
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
      addExtra: (story) => set({ extras: [story, ...get().extras] }),
      updateStory: (story) =>
        set({
          extras: [story, ...get().extras.filter((s) => s.id !== story.id)],
          inbox: get().inbox.map((i) => (i.story.id === story.id ? { ...i, story } : i)),
        }),
      setAllowList: (allowList) => set({ allowList }),
      setDenyList: (denyList) => set({ denyList }),
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
      version: 3,
      migrate: (persisted) => {
        const s = (persisted ?? {}) as { lang?: string };
        if (!s.lang || s.lang === "en") s.lang = "fr";
        return s;
      },
      partialize: (s) => ({
        lang: s.lang,
        theme: s.theme,
        cookies: s.cookies,
        admin: s.admin,
        submissions: s.submissions,
        inbox: s.inbox,
        rejected: s.rejected,
        extras: s.extras,
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
}
