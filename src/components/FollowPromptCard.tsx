import { useState } from "react";
import type { FollowPrompt } from "../content/followLessons";

interface FollowPromptCardProps {
  title: string;
  prompt: FollowPrompt;
  promptKey: string;
  copiedKey: string | null;
  onCopy: (key: string) => void;
  onAskCoach: (extraText: string) => void;
}

export function FollowPromptCard({ title, prompt, promptKey, copiedKey, onCopy, onAskCoach }: FollowPromptCardProps) {
  const [extra, setExtra] = useState("");
  const copied = copiedKey === promptKey;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(prompt.text);
    } catch {
      // Clipboard access can fail silently in some webviews; the prompt text is still visible to copy by hand.
    }
    onCopy(promptKey);
  }

  return (
    <div className="follow-prompt-card">
      <h3>{title}</h3>
      <pre className="follow-prompt-text">{prompt.text}</pre>
      {prompt.note && <p className="follow-prompt-note">{prompt.note}</p>}
      <label className="follow-prompt-extra-label" htmlFor={`follow-prompt-extra-${promptKey}`}>
        Add anything else? (optional)
      </label>
      <textarea
        id={`follow-prompt-extra-${promptKey}`}
        value={extra}
        onChange={(event) => setExtra(event.target.value)}
        rows={2}
        placeholder="Type extra details for the AI Coach here…"
      />
      <div className="follow-prompt-actions">
        <button className="camp-secondary" onClick={() => void handleCopy()}>
          {copied ? "Copied!" : "Copy prompt"}
        </button>
        <button className="camp-primary" onClick={() => onAskCoach(extra)}>
          Ask the AI Coach
        </button>
      </div>
      {copied && <span className="visually-hidden" role="status">Prompt copied to clipboard.</span>}
    </div>
  );
}
