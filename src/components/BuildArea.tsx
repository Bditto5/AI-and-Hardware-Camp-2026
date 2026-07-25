import { useEffect, useState } from "react";
import { BuildLab } from "./BuildLab";
import { FollowAlong } from "./FollowAlong";

type BuildTab = "lab" | "follow";

export interface PendingBuildTab {
  tab: BuildTab;
  nonce: number;
}

interface BuildAreaProps {
  onAskCoach: (message: string) => void;
  onAskFollowCoach: (message: string) => void;
  /** Selects this tab whenever it changes (by nonce), not just on first mount — BuildArea may already be mounted when a new selection arrives. Absent by default — no change to normal behavior. */
  initialTab?: PendingBuildTab;
}

interface PendingSeed {
  templateId?: string;
  projectName?: string;
  key: number;
}

export function BuildArea({ onAskCoach, onAskFollowCoach, initialTab }: BuildAreaProps) {
  const [tab, setTab] = useState<BuildTab>(() => initialTab?.tab ?? "lab");
  const [pendingSeed, setPendingSeed] = useState<PendingSeed | null>(null);

  useEffect(() => {
    if (initialTab) setTab(initialTab.tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTab?.nonce]);

  function openBuildLab(templateId?: string, projectName?: string) {
    setPendingSeed({ templateId, projectName, key: Date.now() });
    setTab("lab");
  }

  return (
    <div className="build-area">
      <nav className="editor-tabs build-area-tabs" aria-label="Build section">
        <button className={tab === "lab" ? "active" : ""} aria-current={tab === "lab" ? "page" : undefined} onClick={() => setTab("lab")}>
          Build Lab
        </button>
        <button className={tab === "follow" ? "active" : ""} aria-current={tab === "follow" ? "page" : undefined} onClick={() => setTab("follow")}>
          Follow Along
        </button>
      </nav>

      {tab === "lab" && (
        <BuildLab
          key={pendingSeed?.key ?? "default"}
          onAskCoach={onAskCoach}
          seedTemplateId={pendingSeed?.templateId}
          seedProjectName={pendingSeed?.projectName}
        />
      )}
      {tab === "follow" && <FollowAlong onAskCoach={onAskFollowCoach} onOpenBuildLab={openBuildLab} />}
    </div>
  );
}
