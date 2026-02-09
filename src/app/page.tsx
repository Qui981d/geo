"use client";

import dynamic from "next/dynamic";

const GmbInteractive = dynamic(
  () => import("../components/sections/GmbInteractive"),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="relative">
      <GmbInteractive />
    </main>
  );
}
