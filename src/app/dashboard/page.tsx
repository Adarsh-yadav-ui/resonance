"use client";

import AudioUploadButton from "@/components/fileUpload";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <AudioUploadButton />
    </main>
  );
}
