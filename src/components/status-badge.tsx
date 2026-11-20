import { STATUS_LABEL } from "@/lib/format";
import type { PaintingStatus } from "@/lib/types";

const DOT: Record<PaintingStatus, string> = {
  available: "bg-available",
  reserved: "bg-reserved",
  sold: "bg-sold",
};

export function StatusBadge({ status, className = "" }: { status: PaintingStatus; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span aria-hidden className={`size-2 rounded-full ${DOT[status]}`} />
      {STATUS_LABEL[status]}
    </span>
  );
}
