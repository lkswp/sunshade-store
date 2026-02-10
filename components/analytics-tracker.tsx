"use client"

import { useEffect } from "react"

export default function AnalyticsTracker() {
    useEffect(() => {
        // Track visit on mount
        const track = async () => {
            try {
                await fetch('/api/analytics', { method: 'POST' })
            } catch (e) {
                // ignore
            }
        }
        track()
    }, [])

    return null
}
