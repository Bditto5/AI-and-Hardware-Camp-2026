import { useState } from "react";

interface FollowMediaSlotProps {
  src?: string;
  caption?: string;
}

function isVideoPath(path: string): boolean {
  return /\.(mp4|webm|ogg)$/i.test(path);
}

export function FollowMediaSlot({ src, caption }: FollowMediaSlotProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="follow-media-placeholder">
        <span>{caption ?? "Media coming soon"}</span>
      </div>
    );
  }

  if (isVideoPath(src)) {
    return (
      <div className="follow-media-slot">
        <video controls preload="none" onError={() => setFailed(true)} aria-label={caption}>
          <source src={src} />
        </video>
        {caption && <p className="follow-media-caption">{caption}</p>}
      </div>
    );
  }

  return (
    <div className="follow-media-slot">
      <img src={src} alt={caption ?? ""} onError={() => setFailed(true)} />
      {caption && <p className="follow-media-caption">{caption}</p>}
    </div>
  );
}
