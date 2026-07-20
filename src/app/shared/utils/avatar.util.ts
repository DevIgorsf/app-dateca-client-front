const AVATAR_COLORS = [
  '#7C4DFF', '#2979FF', '#FF4081', '#00BFA5',
  '#FF6D00', '#43A047', '#D81B60', '#00897B',
];

export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

export function getAvatarColor(index: number): string {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}
