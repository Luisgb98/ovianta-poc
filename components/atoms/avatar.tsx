import { cn } from '@/lib/utils';

export type AvatarTone = 'primary' | 'info' | 'warning';

const TONES: AvatarTone[] = ['primary', 'info', 'warning'];

const toneClass: Record<AvatarTone, string> = {
  primary: 'avatar-primary',
  info: 'avatar-info',
  warning: 'avatar-warning',
};

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getAvatarTone(id: string): AvatarTone {
  const sum = id.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return TONES[sum % TONES.length];
}

interface AvatarProps {
  initials: string;
  tone?: AvatarTone;
  size?: number;
}

export function PatientAvatar({ initials, tone = 'primary', size = 38 }: AvatarProps) {
  return (
    <div
      className={cn('avatar', toneClass[tone])}
      style={{ width: size, height: size, fontSize: size * 0.34 }}
    >
      {initials}
    </div>
  );
}
