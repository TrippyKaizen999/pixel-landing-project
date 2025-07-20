export interface PlayerProfile {
  id: string;
  name: string;
  battletag: string;
  rank: string;
  sr: number;
  peakSr: number;
  preferredRoles: string[];
  preferredHeroes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GameClip {
  id: string;
  filename: string;
  type: "video" | "screenshot";
  uploadedAt: string;
  map: string;
  mode: string;
  hero: string;
  result: "victory" | "defeat" | "draw";
  duration?: string;
  sr?: number;
  srChange?: number;
  feedback?: string;
  stats?: Record<string, any>;
}

export interface GameSession {
  id: string;
  date: string;
  clips: GameClip[];
  totalSr: number;
  srChange: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
}

const STORAGE_KEYS = {
  PLAYER_PROFILE: "ow_coach_player_profile",
  GAME_CLIPS: "ow_coach_game_clips",
  GAME_SESSIONS: "ow_coach_game_sessions",
  APP_SETTINGS: "ow_coach_app_settings",
} as const;

// Player Profile Functions
export function getPlayerProfile(): PlayerProfile | null {
  const profile = localStorage.getItem(STORAGE_KEYS.PLAYER_PROFILE);
  return profile ? JSON.parse(profile) : null;
}

export function savePlayerProfile(profile: PlayerProfile): void {
  profile.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEYS.PLAYER_PROFILE, JSON.stringify(profile));
}

export function createDefaultProfile(): PlayerProfile {
  const profile: PlayerProfile = {
    id: crypto.randomUUID(),
    name: "Player",
    battletag: "",
    rank: "Unranked",
    sr: 0,
    peakSr: 0,
    preferredRoles: [],
    preferredHeroes: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  savePlayerProfile(profile);
  return profile;
}

// Game Clips Functions
export function getGameClips(): GameClip[] {
  const clips = localStorage.getItem(STORAGE_KEYS.GAME_CLIPS);
  return clips ? JSON.parse(clips) : [];
}

export function saveGameClip(clip: GameClip): void {
  const clips = getGameClips();
  const existingIndex = clips.findIndex((c) => c.id === clip.id);

  if (existingIndex >= 0) {
    clips[existingIndex] = clip;
  } else {
    clips.push(clip);
  }

  // Sort by upload date (newest first)
  clips.sort(
    (a, b) =>
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
  );

  localStorage.setItem(STORAGE_KEYS.GAME_CLIPS, JSON.stringify(clips));
}

export function deleteGameClip(clipId: string): void {
  const clips = getGameClips().filter((clip) => clip.id !== clipId);
  localStorage.setItem(STORAGE_KEYS.GAME_CLIPS, JSON.stringify(clips));
}

// Game Sessions Functions
export function getGameSessions(): GameSession[] {
  const sessions = localStorage.getItem(STORAGE_KEYS.GAME_SESSIONS);
  return sessions ? JSON.parse(sessions) : [];
}

export function saveGameSession(session: GameSession): void {
  const sessions = getGameSessions();
  const existingIndex = sessions.findIndex((s) => s.id === session.id);

  if (existingIndex >= 0) {
    sessions[existingIndex] = session;
  } else {
    sessions.push(session);
  }

  // Sort by date (newest first)
  sessions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  localStorage.setItem(STORAGE_KEYS.GAME_SESSIONS, JSON.stringify(sessions));
}

// Analytics Functions
export function getWinRate(): number {
  const clips = getGameClips();
  if (clips.length === 0) return 0;

  const wins = clips.filter((clip) => clip.result === "victory").length;
  return Math.round((wins / clips.length) * 100);
}

export function getCurrentSR(): number {
  const profile = getPlayerProfile();
  if (!profile) return 0;

  // Get most recent clip with SR data
  const clips = getGameClips();
  const clipWithSR = clips.find((clip) => clip.sr !== undefined);

  return clipWithSR?.sr || profile.sr;
}

export function getRecentSRChanges(): number[] {
  const clips = getGameClips()
    .filter((clip) => clip.srChange !== undefined)
    .slice(0, 10) // Last 10 games
    .reverse(); // Oldest first for chart

  return clips.map((clip) => clip.srChange!);
}

export function getHeroStats(): Record<
  string,
  { playTime: number; wins: number; total: number }
> {
  const clips = getGameClips();
  const stats: Record<
    string,
    { playTime: number; wins: number; total: number }
  > = {};

  clips.forEach((clip) => {
    if (!stats[clip.hero]) {
      stats[clip.hero] = { playTime: 0, wins: 0, total: 0 };
    }

    stats[clip.hero].total++;
    if (clip.result === "victory") {
      stats[clip.hero].wins++;
    }

    // Estimate play time from duration (rough approximation)
    if (clip.duration) {
      const [minutes, seconds] = clip.duration.split(":").map(Number);
      stats[clip.hero].playTime += minutes + seconds / 60;
    }
  });

  return stats;
}

// Settings Functions
export interface AppSettings {
  theme: "light" | "dark";
  notifications: boolean;
  autoUpload: boolean;
  aiModel: string;
  language: string;
}

export function getAppSettings(): AppSettings {
  const settings = localStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
  const defaultSettings: AppSettings = {
    theme: "dark",
    notifications: true,
    autoUpload: false,
    aiModel: "gpt-4",
    language: "en",
  };

  return settings
    ? { ...defaultSettings, ...JSON.parse(settings) }
    : defaultSettings;
}

export function saveAppSettings(settings: Partial<AppSettings>): void {
  const currentSettings = getAppSettings();
  const newSettings = { ...currentSettings, ...settings };
  localStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(newSettings));
}

// Initialize default data if none exists
export function initializeDefaultData(): void {
  if (!getPlayerProfile()) {
    createDefaultProfile();
  }

  // Add some sample data for demonstration
  const clips = getGameClips();
  if (clips.length === 0) {
    const sampleClips: GameClip[] = [
      {
        id: crypto.randomUUID(),
        filename: "kings_row_tracer_highlight.mp4",
        type: "video",
        uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        map: "King's Row",
        mode: "Escort",
        hero: "Tracer",
        result: "victory",
        duration: "8:42",
        sr: 2650,
        srChange: 25,
        feedback:
          "Great positioning and target prioritization. Focus on managing blinks more efficiently during team fights.",
      },
      {
        id: crypto.randomUUID(),
        filename: "temple_anubis_rein_game.mp4",
        type: "video",
        uploadedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        map: "Temple of Anubis",
        mode: "Assault",
        hero: "Reinhardt",
        result: "defeat",
        duration: "12:15",
        sr: 2625,
        srChange: -22,
        feedback:
          "Shield management needs improvement. Try to communicate more with your team about when you're dropping shield.",
      },
      {
        id: crypto.randomUUID(),
        filename: "ilios_ana_highlight.mp4",
        type: "video",
        uploadedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        map: "Ilios",
        mode: "Control",
        hero: "Ana",
        result: "victory",
        duration: "15:33",
        sr: 2647,
        srChange: 28,
        feedback:
          "Excellent sleep dart usage and positioning. Your nano timing is improving significantly.",
      },
    ];

    sampleClips.forEach(saveGameClip);
  }
}
