'use client';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import type { Appointment, AppointmentStatus } from '../domain/appointment';
import type { BlockGeometry } from './lib/calendar';

const STATUS_STYLES: Record<AppointmentStatus, string> = {
  scheduled: [
    'border-[color-mix(in_oklch,var(--primary)_40%,transparent)]',
    'bg-[color-mix(in_oklch,var(--primary)_18%,transparent)]',
    'text-primary',
  ].join(' '),
  completed: [
    'border-[color-mix(in_oklch,var(--success)_38%,transparent)]',
    'bg-[color-mix(in_oklch,var(--success)_20%,transparent)]',
    'text-[color-mix(in_oklch,var(--success)_78%,black)]',
    'dark:text-success',
  ].join(' '),
  cancelled: [
    'border-[color-mix(in_oklch,var(--destructive)_28%,transparent)]',
    'bg-[color-mix(in_oklch,var(--destructive)_10%,transparent)]',
    'text-destructive opacity-60',
  ].join(' '),
  'no-show': [
    'border-[color-mix(in_oklch,var(--warning)_40%,transparent)]',
    'bg-[color-mix(in_oklch,var(--warning)_20%,transparent)]',
    'text-[color-mix(in_oklch,var(--warning)_62%,var(--foreground))]',
    'dark:text-warning',
  ].join(' '),
};

interface Props {
  appointment: Appointment;
  geometry: BlockGeometry;
  column: number;
  totalColumns: number;
  hasConflict?: boolean;
  onClick?: (appt: Appointment) => void;
  isDragOverlay?: boolean;
}

export function AppointmentBlock({
  appointment,
  geometry,
  column,
  totalColumns,
  hasConflict = false,
  onClick,
  isDragOverlay = false,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: appointment.id,
    data: { appointment },
    disabled: isDragOverlay || appointment.status === 'cancelled',
  });

  const style = {
    position: 'absolute' as const,
    top: geometry.top,
    height: Math.max(geometry.height - 2, 18),
    left: `calc(${(column / totalColumns) * 100}% + 2px)`,
    width: `calc(${(1 / totalColumns) * 100}% - 4px)`,
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 50 : 10,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={e => {
        e.stopPropagation();
        onClick?.(appointment);
      }}
      className={cn(
        'overflow-hidden rounded border px-1.5 py-0.5 text-[10.5px] leading-tight font-medium',
        'cursor-grab select-none active:cursor-grabbing',
        'transition-shadow duration-150',
        STATUS_STYLES[appointment.status],
        hasConflict && 'ring-2 ring-destructive ring-offset-1',
        appointment.status !== 'cancelled' && 'hover:shadow-sm'
      )}
    >
      <div className="truncate font-semibold">{appointment.patientName}</div>
      {geometry.height >= 36 && <div className="truncate opacity-75">{appointment.type}</div>}
      {geometry.height >= 52 && <div className="truncate opacity-60">{appointment.doctor}</div>}
    </div>
  );
}

export function AppointmentBlockOverlay({
  appointment,
  geometry,
}: {
  appointment: Appointment;
  geometry: BlockGeometry;
}) {
  return (
    <div
      style={{ width: 160, height: Math.max(geometry.height - 2, 18) }}
      className={cn(
        'overflow-hidden rounded border px-1.5 py-0.5 text-[10.5px] leading-tight font-medium shadow-lg',
        'rotate-1 cursor-grabbing select-none',
        STATUS_STYLES[appointment.status]
      )}
    >
      <div className="truncate font-semibold">{appointment.patientName}</div>
      <div className="truncate opacity-75">{appointment.type}</div>
    </div>
  );
}
