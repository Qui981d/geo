"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLDivElement>(null);
    const [label, setLabel] = useState("");
    const [expanded, setExpanded] = useState(false);
    const pos = useRef({ x: 0, y: 0 });
    const target = useRef({ x: 0, y: 0 });

    useEffect(() => {
        // Skip on touch devices
        if (window.matchMedia("(pointer: coarse)").matches) return;

        const handleMove = (e: MouseEvent) => {
            target.current = { x: e.clientX, y: e.clientY };

            const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
            if (el) {
                const cursorLabel = el.closest("[data-cursor]")?.getAttribute("data-cursor") || "";
                setLabel(cursorLabel);
                setExpanded(!!cursorLabel);
            } else {
                setLabel("");
                setExpanded(false);
            }
        };

        let raf: number;
        const animate = () => {
            pos.current.x += (target.current.x - pos.current.x) * 0.15;
            pos.current.y += (target.current.y - pos.current.y) * 0.15;

            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate(${pos.current.x - (expanded ? 40 : 10)}px, ${pos.current.y - (expanded ? 40 : 10)}px)`;
            }
            if (labelRef.current) {
                labelRef.current.style.transform = `translate(${pos.current.x + 20}px, ${pos.current.y + 20}px)`;
            }
            raf = requestAnimationFrame(animate);
        };

        window.addEventListener("mousemove", handleMove);
        raf = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("mousemove", handleMove);
            cancelAnimationFrame(raf);
        };
    }, [expanded]);

    return (
        <>
            <div
                ref={cursorRef}
                className={`custom-cursor ${expanded ? "expanded" : ""}`}
            />
            {label && (
                <div ref={labelRef} className="custom-cursor-label">
                    {label}
                </div>
            )}
        </>
    );
}
