"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function AnalyticsTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const hasTrackedView = useRef(false);

    // Helper to get or create Session ID
    const getSessionId = () => {
        let sid = sessionStorage.getItem("analytics_session_id");
        if (!sid) {
            sid = uuidv4();
            sessionStorage.setItem("analytics_session_id", sid);
        }
        return sid;
    };

    const trackEvent = async (type: "view" | "click" | "convert", target?: string) => {
        try {
            const sessionId = getSessionId();
            await fetch("/api/analytics", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    eventType: type,
                    path: window.location.pathname,
                    target,
                    sessionId,
                    referrer: document.referrer
                }),
            });
        } catch (err) {
            console.error("Failed to track event", err);
        }
    };

    // Track Page Views
    useEffect(() => {
        // Small delay to ensure route change is complete and avoid double firing in strict mode
        const timeout = setTimeout(() => {
            trackEvent("view");
        }, 100);

        return () => clearTimeout(timeout);
    }, [pathname, searchParams]);

    // Track Clicks
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Track clicks on buttons or links only to reduce noise
            const clickable = target.closest("button, a");

            if (clickable) {
                let label = clickable.innerText || clickable.getAttribute("aria-label") || (clickable as HTMLAnchorElement).href || "Unknown Element";
                // Truncate if too long
                if (label.length > 50) label = label.substring(0, 50) + "...";

                trackEvent("click", label);
            }
        };

        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, []);

    return null;
}
