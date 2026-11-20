"use server";

import { site } from "@/lib/site";

type Field = "name" | "email" | "message";

export type ContactState = {
  sent?: boolean;
  message?: string;
  errors?: Partial<Record<Field, string>>;
  /** What the visitor typed, so the form can be refilled after a validation error. */
  values?: Partial<Record<Field, string>>;
};

const text = (formData: FormData, name: string) => String(formData.get(name) ?? "").trim();

export async function sendContactMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Hidden "website" field: real people leave it empty, spam bots fill it in.
  if (text(formData, "website")) return { sent: true };

  const values = {
    name: text(formData, "name"),
    email: text(formData, "email"),
    message: text(formData, "message"),
  };

  const errors: ContactState["errors"] = {};
  if (!values.name) errors.name = "Please tell us your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = "Please enter a valid email address.";
  if (values.message.length < 5) errors.message = "Please write a short message.";
  if (values.name.length > 200 || values.email.length > 200 || values.message.length > 5000) {
    errors.message = "That message is too long.";
  }
  if (Object.keys(errors).length > 0) return { errors, values };

  // PLACEHOLDER: nothing is sent yet. Connect an email service here
  // (for example Resend or Postmark), or save the message to the database.

  return {
    sent: true,
    message: `Thanks, ${values.name}! This form is a placeholder for now, so your message wasn't actually sent. Please email ${site.email} instead.`,
  };
}
