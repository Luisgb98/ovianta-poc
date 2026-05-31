import type { AvatarTone } from '@/src/modules/patients/domain/patient';
import { cn } from '@/lib/utils';

interface AvatarProps {
  initials: string;
  tone?: AvatarTone;
  size?: number;
}

const toneClass: Record<AvatarTone, string> = {
  primary: 'avatar-primary',
  info: 'avatar-info',
  warning: 'avatar-warning',
};

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
