"use client";

import dynamic from "next/dynamic";

const EmailComposer = dynamic(() => import("./partials/email-composer"), {
  ssr: false,
  loading: () => (
    <p className="text-sm text-muted-foreground">Loading editor…</p>
  ),
});

export default function EditorWrapper() {
  return <EmailComposer />;
}
