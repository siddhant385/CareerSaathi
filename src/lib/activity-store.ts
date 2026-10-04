export interface LiveActivityEvent {
  id: string;
  type: "trade_selected" | "callback_requested" | "portal_shared" | "audio_listened";
  timestamp: string;
  studentName: string;
  location: string;
  tradeTitle: string;
  details: string;
}

const LIVE_EVENTS_KEY = "careersaathi_live_activity_feed";

export function getStoredLiveEvents(): LiveActivityEvent[] {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(LIVE_EVENTS_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error("Failed to parse live events", e);
      }
    }
  }
  return [];
}

export function recordLiveEvent(event: Omit<LiveActivityEvent, "id" | "timestamp">): void {
  if (typeof window !== "undefined") {
    const existing = getStoredLiveEvents();
    const newEvent: LiveActivityEvent = {
      ...event,
      id: `ev_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    const updated = [newEvent, ...existing].slice(0, 50); // Keep last 50 events
    localStorage.setItem(LIVE_EVENTS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("careersaathi_live_event_logged"));
  }
}
