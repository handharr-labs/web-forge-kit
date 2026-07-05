interface ColorDotProps {
  color: string;
  size?: 'sm' | 'md';
}

export function ColorDot({ color, size = 'sm' }: ColorDotProps) {
  const sizeClass = size === 'md' ? 'w-4 h-4' : 'w-3 h-3';
  return (
    <span
      className={`${sizeClass} rounded-full flex-shrink-0`}
      style={{ backgroundColor: color }}
    />
  );
}
