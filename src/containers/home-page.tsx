"use client";

import EditorWrapper from "@/components/editor-wrapper";

export default function HomePage() {
  // AuthGuard removed - protected layout already handles authentication
  return (
    <main className="px-4 md:px-8 py-6">
      <EditorWrapper />
    </main>
  );
}
