"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

type Props = {
  children: ReactNode;
  pendingLabel: string;
  className?: string;
  disabled?: boolean;
  title?: string;
  /** Ask "Are you sure?" before submitting. */
  confirmMessage?: string;
};

/** Submit button that shows a pending label while its form's server action runs. */
export function SubmitButton({ children, pendingLabel, className, disabled, title, confirmMessage }: Props) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      title={title}
      className={className}
      onClick={(event) => {
        if (confirmMessage && !window.confirm(confirmMessage)) event.preventDefault();
      }}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
