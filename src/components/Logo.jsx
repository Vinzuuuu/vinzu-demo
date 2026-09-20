import { Link } from "react-router-dom";

export default function Logo({ size = "md", light = false }) {
  const badgeSize = size === "lg" ? "w-11 h-11 text-2xl" : size === "sm" ? "w-7 h-7 text-base" : "w-9 h-9 text-xl";
  const textSize = size === "lg" ? "text-2xl" : size === "sm" ? "text-lg" : "text-xl";
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <div className={`${badgeSize} bg-primary text-primary-foreground font-extrabold flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
        V
      </div>
      <span className={`${textSize} font-extrabold tracking-tight ${light ? "text-foreground" : "text-primary"}`}>
        Vinzu
      </span>
    </Link>
  );
}
