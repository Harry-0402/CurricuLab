'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';

const STORAGE_KEY = 'curriculab_last_visit';
const AUTH_PATHS = ['/login', '/unauthorized', '/auth'];

export function LastVisitManager() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const hasRedirected = useRef(false);

    // Track current visit
    useEffect(() => {
        // Don't track auth-related paths
        if (AUTH_PATHS.some(path => pathname.startsWith(path))) return;

        const fullPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
        localStorage.setItem(STORAGE_KEY, fullPath);
    }, [pathname, searchParams]);

    // Handle initial redirect for logged-in users arriving at the root
    useEffect(() => {
        const checkSessionAndRedirect = async () => {
            if (hasRedirected.current) return;
            if (pathname !== '/') return;

            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const lastVisit = localStorage.getItem(STORAGE_KEY);
            if (lastVisit && lastVisit !== '/') {
                hasRedirected.current = true;
                router.push(lastVisit);
            }
        };

        checkSessionAndRedirect();
    }, [pathname, router]);

    return null;
}
