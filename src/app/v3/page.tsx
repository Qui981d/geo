"use client";

import dynamic from "next/dynamic";

const DigitalStore = dynamic(
    () => import("../../components/sections/DigitalStore"),
    { ssr: false }
);

export default function V3Page() {
    return <DigitalStore />;
}
