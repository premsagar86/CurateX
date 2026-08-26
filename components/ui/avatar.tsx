// Avatar — image with deterministic initials-fallback (§16.4): the same
// person always gets the same background tint, so returning users are
// visually recognizable even without a photo.
import { cn } from "@/lib/utils";

const TINTS = ["bg-primary", "bg-secondary", "bg-accent", "bg-info", "bg-success"];

function tintFor(name: string) {
  const hash = [...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return TINTS[hash % TINTS.length];
}

function initialsFor(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

export interface AvatarProps {
  name: string;
  image?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = { sm: "h-8 w-8 text-xs", md: "h-11 w-11 text-sm", lg: "h-16 w-16 text-lg" };

export function Avatar({ name, image, size = "md", className }: AvatarProps) {
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt={name} className={cn("rounded-full object-cover", SIZES[size], className)} />;
  }
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-semibold text-white",
        tintFor(name),
        SIZES[size],
        className
      )}
      aria-label={name}
    >
      {initialsFor(name)}
    </div>
  );
}
