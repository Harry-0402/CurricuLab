import { Icons } from './Icons';
import { Button } from './Button';
import Link from 'next/link';

interface RestrictedAccessProps {
    title?: string;
    description?: string;
    buttonText?: string;
    callbackUrl?: string;
}

export function RestrictedAccess({
    title = "Restricted Access",
    description = "Sign in to access this feature and more within the CurricuLab ecosystem.",
    buttonText = "LOG IN TO VIEW",
    callbackUrl = "/"
}: RestrictedAccessProps) {
    const loginUrl = `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;

    return (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-24 h-24 bg-blue-50 rounded-[32px] flex items-center justify-center mb-8 relative">
                <div className="absolute inset-0 bg-blue-100/50 rounded-[32px] blur-xl -z-10 animate-pulse" />
                <Icons.Lock size={40} className="text-blue-500" />
            </div>

            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-4">
                {title}
            </h2>
            
            <p className="max-w-md text-gray-500 font-medium leading-relaxed mb-10">
                {description}
            </p>

            <Link href={loginUrl}>
                <Button className="h-14 px-10 rounded-2xl bg-[#0f172a] hover:bg-black text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/10 transition-all hover:scale-[1.02] active:scale-[0.98]">
                    {buttonText}
                </Button>
            </Link>
        </div>
    );
}
