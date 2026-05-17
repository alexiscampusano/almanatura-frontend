export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function getAvatarColor(name: string): string {
  const colors = [
    "bg-rose-600",
    "bg-amber-600",
    "bg-emerald-600",
    "bg-sky-600",
    "bg-violet-600",
    "bg-fuchsia-600",
    "bg-teal-600",
    "bg-orange-600",
  ];
  let hash = 0;
  for (const char of name) {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}
