"use client";

type ReportViewerFrameProps = {
  documentUrl: string;
  title: string;
  watermarkLabel: string;
  restrictionNote: string;
};

const WATERMARK_POSITIONS = Array.from({ length: 18 }, (_, index) => ({
  left: `${(index % 3) * 33 + 4}%`,
  top: `${Math.floor(index / 3) * 18 + 6}%`,
}));

function buildViewerUrl(documentUrl: string) {
  return `${documentUrl}#toolbar=0&navpanes=0&statusbar=0&messages=0&view=FitH`;
}

export function ReportViewerFrame({
  documentUrl,
  title,
  watermarkLabel,
  restrictionNote,
}: ReportViewerFrameProps) {
  return (
    <div
      className="space-y-3 select-none"
      onContextMenu={(event) => event.preventDefault()}
      onDragStart={(event) => event.preventDefault()}
    >
      <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-slate-950 shadow-card dark:border-slate-800">
        <div className="relative h-[78vh] min-h-[680px] w-full bg-slate-900">
          <iframe
            className="h-full w-full"
            referrerPolicy="same-origin"
            src={buildViewerUrl(documentUrl)}
            title={title}
          />

          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            {WATERMARK_POSITIONS.map((position, index) => (
              <div
                key={`${position.left}-${position.top}-${index}`}
                className="absolute text-[11px] font-semibold uppercase tracking-[0.28em] text-white/20"
                style={{
                  left: position.left,
                  top: position.top,
                  transform: "rotate(-24deg)",
                }}
              >
                {watermarkLabel}
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs leading-6 text-slate-500 dark:text-slate-400">{restrictionNote}</p>
    </div>
  );
}
