export const AUTH_CONFIG = {
    // Session timeout in milliseconds (15 minutes)
    SESSION_TIMEOUT_MS: 15 * 60 * 1000,

    // Warning time before logout (2 minutes)
    WARNING_TIME_MS: 2 * 60 * 1000,

    // How often to check for timeout (30 seconds)
    CHECK_INTERVAL_MS: 30 * 1000,
} as const;

// Get timeout from environment or use defaults
export function getSessionTimeout(): number {
    if (typeof window === 'undefined') return AUTH_CONFIG.SESSION_TIMEOUT_MS;

    const envTimeout = process.env.NEXT_PUBLIC_SESSION_TIMEOUT_MINUTES;
    return envTimeout ? parseInt(envTimeout) * 60 * 1000 : AUTH_CONFIG.SESSION_TIMEOUT_MS;
}

export function getWarningTime(): number {
    if (typeof window === 'undefined') return AUTH_CONFIG.WARNING_TIME_MS;

    const envWarning = process.env.NEXT_PUBLIC_WARNING_MINUTES;
    return envWarning ? parseInt(envWarning) * 60 * 1000 : AUTH_CONFIG.WARNING_TIME_MS;
}
