import type { FollowLesson, FollowStep } from "../content/followLessons";
import { FollowMediaSlot } from "./FollowMediaSlot";
import { FollowPromptCard } from "./FollowPromptCard";

interface FollowStepPanelProps {
  lesson: FollowLesson;
  activeStepId: string;
  doneStepIds: string[];
  onSelectStep: (stepId: string) => void;
  onToggleStep: (stepId: string) => void;
  copiedKey: string | null;
  onCopy: (key: string) => void;
  onAskCoach: (message: string) => void;
  stacked: boolean;
}

const TARGET_LABEL: Record<NonNullable<FollowStep["target"]>, string> = {
  html: "Focus: the HTML tab",
  css: "Focus: the CSS tab",
  javascript: "Focus: the JavaScript tab",
};

function bugReportPrompt(lesson: FollowLesson): { text: string; note?: string } {
  const thing = lesson.track === "chatbots" ? "code" : lesson.track === "face" ? "Scratch project" : "model or Scratch project";
  return {
    text: `My ${thing} does not work. Here is what I expected, what happened, and my code.`,
    note: "Fill in your real details before you send it — the more specific, the better the help.",
  };
}

function composeMessage(lesson: FollowLesson, step: FollowStep, promptText: string, extraText: string): string {
  const parts = [`Lesson: ${lesson.title}. Step ${step.label}: ${step.title}.`, promptText];
  const extra = extraText.trim();
  if (extra) parts.push(extra);
  return parts.join("\n\n").slice(0, 24_000);
}

function StepBody({
  lesson,
  step,
  isDone,
  onToggle,
  copiedKey,
  onCopy,
  onAskCoach,
}: {
  lesson: FollowLesson;
  step: FollowStep;
  isDone: boolean;
  onToggle: () => void;
  copiedKey: string | null;
  onCopy: (key: string) => void;
  onAskCoach: (message: string) => void;
}) {
  const bugPrompt = bugReportPrompt(lesson);
  return (
    <div className="follow-step-body">
      <h2>
        Step {step.label}: {step.title}
      </h2>
      <p className="follow-step-why">{step.why}</p>
      {step.target && <p className="follow-step-target">{TARGET_LABEL[step.target]}</p>}
      <ol className="follow-step-actions">
        {step.actions.map((action) => (
          <li key={action}>{action}</li>
        ))}
      </ol>

      <FollowMediaSlot src={step.shot} caption={step.shotCaption} />

      {step.prompt && (
        <FollowPromptCard
          title="Copy-ready prompt"
          prompt={step.prompt}
          promptKey={`${step.id}-main`}
          copiedKey={copiedKey}
          onCopy={onCopy}
          onAskCoach={(extra) => onAskCoach(composeMessage(lesson, step, step.prompt!.text, extra))}
        />
      )}

      <FollowPromptCard
        title="Stuck? Report the bug"
        prompt={bugPrompt}
        promptKey={`${step.id}-bugreport`}
        copiedKey={copiedKey}
        onCopy={onCopy}
        onAskCoach={(extra) => onAskCoach(composeMessage(lesson, step, bugPrompt.text, extra))}
      />

      <button className={`follow-mark-done ${isDone ? "done" : ""}`} onClick={onToggle} aria-pressed={isDone}>
        {isDone ? "Marked done ✓" : "Mark this step done"}
      </button>
    </div>
  );
}

function FinishCard({ lesson }: { lesson: FollowLesson }) {
  return (
    <div className="follow-finish-card">
      <p className="camp-eyebrow">LESSON COMPLETE</p>
      <h2>Nice work finishing {lesson.title}!</h2>
      <div className="follow-finish-grid">
        <div>
          <h3>You should now be able to</h3>
          <ul>
            {lesson.success.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Try next</h3>
          <ul>
            {lesson.extensions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function FollowStepPanel({
  lesson,
  activeStepId,
  doneStepIds,
  onSelectStep,
  onToggleStep,
  copiedKey,
  onCopy,
  onAskCoach,
  stacked,
}: FollowStepPanelProps) {
  const allDone = lesson.steps.every((step) => doneStepIds.includes(step.id));

  if (stacked) {
    return (
      <div className="follow-step-panel follow-step-panel-stacked">
        {lesson.steps.map((step) => (
          <StepBody
            key={step.id}
            lesson={lesson}
            step={step}
            isDone={doneStepIds.includes(step.id)}
            onToggle={() => onToggleStep(step.id)}
            copiedKey={copiedKey}
            onCopy={onCopy}
            onAskCoach={onAskCoach}
          />
        ))}
        {allDone && <FinishCard lesson={lesson} />}
      </div>
    );
  }

  const activeIndex = lesson.steps.findIndex((step) => step.id === activeStepId);
  const activeStep = lesson.steps[activeIndex] ?? lesson.steps[0];
  const nextStep = lesson.steps[activeIndex + 1];

  return (
    <div className="follow-step-panel">
      <nav className="follow-step-chips" aria-label="Lesson steps">
        {lesson.steps.map((step) => {
          const isDone = doneStepIds.includes(step.id);
          const isCurrent = step.id === activeStep.id;
          return (
            <button
              key={step.id}
              className={`follow-step-chip ${isCurrent ? "current" : ""} ${isDone ? "done" : ""}`}
              aria-current={isCurrent ? "step" : undefined}
              onClick={() => onSelectStep(step.id)}
            >
              <span className="follow-step-chip-number">{isDone ? "✓" : step.label}</span>
              {step.title}
            </button>
          );
        })}
      </nav>

      <StepBody
        lesson={lesson}
        step={activeStep}
        isDone={doneStepIds.includes(activeStep.id)}
        onToggle={() => onToggleStep(activeStep.id)}
        copiedKey={copiedKey}
        onCopy={onCopy}
        onAskCoach={onAskCoach}
      />

      {nextStep ? (
        <button className="camp-secondary follow-next-step" onClick={() => onSelectStep(nextStep.id)}>
          Next step →
        </button>
      ) : (
        allDone && <FinishCard lesson={lesson} />
      )}
    </div>
  );
}
