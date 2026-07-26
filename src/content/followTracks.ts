export type FollowTrackId = "chatbots" | "face" | "ml";

export interface FollowTrack {
  id: FollowTrackId;
  label: string;
  /** Suffix of an existing --camp-* custom property, e.g. "green" for var(--camp-green). */
  accent: "purple" | "green" | "yellow";
}

export const followTracks: FollowTrack[] = [
  { id: "chatbots", label: "Chatbots", accent: "purple" },
  { id: "face", label: "Face Detection", accent: "green" },
  { id: "ml", label: "Machine Learning", accent: "yellow" },
];
