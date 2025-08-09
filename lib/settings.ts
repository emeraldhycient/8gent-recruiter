export type MeetingProvider = "google_meet" | "zoom" | "msteams" | "webex" | "other"

export type Settings = {
  brandColor?: string
  careersUrl?: string
  meetingProvider?: MeetingProvider
  meetingApiKey?: string
}

declare global {
  // eslint-disable-next-line no-var
  var __MEM_SETTINGS__: Settings | undefined
}

function mem(): Settings {
  if (!globalThis.__MEM_SETTINGS__) {
    globalThis.__MEM_SETTINGS__ = {
      brandColor: "#111111",
      careersUrl: "https://example.com/careers",
      meetingProvider: "google_meet",
      meetingApiKey: "",
    }
  }
  return globalThis.__MEM_SETTINGS__!
}

export async function getSettings(): Promise<Settings> {
  return { ...mem() }
}

export async function updateSettings(update: Partial<Settings>): Promise<Settings> {
  const state = mem()
  Object.assign(state, update)
  return { ...state }
}
