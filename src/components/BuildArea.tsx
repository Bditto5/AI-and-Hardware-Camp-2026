import { useState } from "react";
import { BuildLab } from "./BuildLab";
import { FollowAlong } from "./FollowAlong";

type BuildTab = "lab" | "follow";

interface BuildAreaProps {
  onAskCoach: (message: string) => void;
  onAskFollowCoach: (message: string) => void;
}

interface PendingSeed {
  templateId?: string;
  projectName?: string;
  key: number;
}

export function BuildArea({ onAskCoach, onAskFollowCoach }: BuildAreaProps) {
  const [tab, setTab] = useState<BuildTab>("lab");
  const [pendingSeed, setPendingSeed] = useState<PendingSeed | null>(null);

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
