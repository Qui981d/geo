"use client";

import { useEffect, useState } from "react";

const blobs = [
    { color: "rgba(66, 133, 244, 0.08)", size: 600, x: 10, y: 5, delay: 0 },
    { color: "rgba(168, 199, 250, 0.1)", size: 500, x: 70, y: 20, delay: 2 },
    { color: "rgba(245, 184, 0, 0.06)", size: 450, x: 30, y: 60, delay: 4 },
    { color: "rgba(66, 133, 244, 0.05)", size: 550, x: 80, y: 70, delay: 1 },
    { color: "rgba(168, 199, 250, 0.07)", size: 400, x: 50, y: 40, delay: 3 },
];

export default function AnimatedBlobs() {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div
            className="fixed inset-0 overflow-hidden pointer-events-none"
            style={{ zIndex: 0 }}
        >
            {blobs.map((blob, i) => (
                <div
                    key={i}
                    style={{
                        position: "absolute",
                        left: `${blob.x}%`,
                        top: `${blob.y}%`,
                        width: blob.size,
                        height: blob.size,
                        background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
                        borderRadius: "50%",
                        filter: "blur(80px)",
                        animation: `blob-drift ${18 + i * 4}s ease-in-out infinite`,
                        animationDelay: `${blob.delay}s`,
                        transform: `translateY(${scrollY * (i % 2 === 0 ? 0.15 : -0.1)}px)`,
                    }}
                />
            ))}
        </div>
    );
}
