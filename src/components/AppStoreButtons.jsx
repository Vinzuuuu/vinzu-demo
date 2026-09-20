import { Apple } from "lucide-react";

function GooglePlayIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <polygon points="3,12 21,4 12,12" fill="#4285F4" />
      <polygon points="21,4 21,12 12,12" fill="#EA4335" />
      <polygon points="3,12 12,12 21,20" fill="#34A853" />
      <polygon points="12,12 21,12 21,20" fill="#FBBC04" />
    </svg>
  );
}

export default function AppStoreButtons({ className = "" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <a
        href="#"
        className="app-store-btn flex items-center gap-2 px-3 py-1.5 bg-white border border-black hover:opacity-80 transition-opacity"
      >
        <Apple className="w-6 h-6 text-black flex-shrink-0" />
        <span className="flex flex-col leading-tight text-left">
          <span className="text-[10px] text-black">Download on the</span>
          <span className="text-sm font-semibold text-black">App Store</span>
        </span>
      </a>
      <a
        href="#"
        className="app-store-btn flex items-center gap-2 px-3 py-1.5 bg-white border border-black hover:opacity-80 transition-opacity"
      >
        <GooglePlayIcon className="w-5 h-5 flex-shrink-0" />
        <span className="flex flex-col leading-tight text-left">
          <span className="text-[10px] text-gray-500">GET IT ON</span>
          <span className="text-sm font-semibold text-black">Google Play</span>
        </span>
      </a>
    </div>
  );
}
