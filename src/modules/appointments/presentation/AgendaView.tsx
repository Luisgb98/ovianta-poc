'use client';

import { isSameDay, parseISO, isToday, format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/atoms/icon';
import { useI18n } from '@/lib/i18n/context';
import type { Appointment } from '../domain/appointment';
import type { TranslationKey } from '@/lib/i18n/translations';

const STATUS_LABELS: Record<string, TranslationKey> = {
  scheduled: 'status.scheduled',
  completed: 'status.completed',
  cancelled: 'status.cancelled',
  'no-show': 'status.no-show',
};

const STATUS_DOT: Record<string, string> = {
  scheduled: 'bg-primary',
  completed: 'bg-success',
  cancelled: 'bg-destructive opacity-50',
  'no-show': 'bg-warning',
};

interface Props {
  days: Date[];
  appointments: Appointment[];
  onAppointmentClick: (appt: Appointment) => void;
}

export function AgendaView({ days, appointments, onAppointmentClick }: Props) {
  const { t, lang } = useI18n();

  const grouped = days.reduce<Array<{ day: Date; appts: Appointment[] }>>((acc, day) => {
    const appts = appointments
      .filter(a => isSameDay(parseISO(a.start), day))
      .sort((a, b) => a.start.localeCompare(b.start));
    if (appts.length > 0) acc.push({ day, appts });
    return acc;
  }, []);

  if (grouped.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
        <Icon name="calendar" size={40} strokeWidth={1.2} />
        <p className="text-body-sm">{t('schedule.noAppointments')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {grouped.map(({ day, appts }) => {
        const today = isToday(day);
        const dayLabel = day.toLocaleDateString(
          lang === 'es' ? 'es-ES' : lang === 'it' ? 'it-IT' : lang === 'pt' ? 'pt-PT' : 'en-US',
          { weekday: 'long', day: 'numeric', month: 'long' }
        );

        return (
          <div key={format(day, 'yyyy-MM-dd')}>
            <div
              className={cn(
                'mb-2 text-xs font-semibold tracking-wide uppercase',
                today ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {today && (
                <span className="mr-1.5 inline-block size-1.5 rounded-full bg-primary align-middle" />
              )}
              {dayLabel}
            </div>
            <Card className="gap-0 overflow-hidden p-0">
              {appts.map((appt, idx) => {
                const time = format(parseISO(appt.start), 'HH:mm');
                const endMin = appt.durationMin;

                return (
                  <button
                    key={appt.id}
                    type="button"
                    onClick={() => onAppointmentClick(appt)}
                    className={cn(
                      'group flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60',
                      idx > 0 && 'border-t border-border'
                    )}
                  >
                    <div className="flex w-14 shrink-0 flex-col items-end">
                      <span className="text-body-xs font-semibold text-foreground tabular-nums">
                        {time}
                      </span>
                      <span className="text-2xs text-muted-foreground">{endMin} min</span>
                    </div>

                    <span
                      className={cn('mt-1.5 size-2 shrink-0 rounded-full', STATUS_DOT[appt.status])}
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-body-xs font-semibold">
                          {appt.patientName}
                        </span>
                        <span className="text-2xs text-muted-foreground">{appt.type}</span>
                      </div>
                      <div className="flex items-center gap-1 text-2xs text-muted-foreground">
                        <Icon name="stethoscope" size={10} />
                        <span className="truncate">{appt.doctor}</span>
                      </div>
                    </div>

                    <span
                      className={cn(
                        'shrink-0 text-2xs font-medium',
                        appt.status === 'cancelled' ? 'text-destructive' : 'text-muted-foreground'
                      )}
                    >
                      {t(STATUS_LABELS[appt.status] ?? 'status.scheduled')}
                    </span>
                  </button>
                );
              })}
            </Card>
          </div>
        );
      })}
    </div>
  );
}
