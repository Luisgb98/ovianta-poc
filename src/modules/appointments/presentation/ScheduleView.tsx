'use client';

import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { addWeeks, subWeeks, parseISO, format, isSameMonth } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/atoms/icon';
import { Button } from '@/components/atoms/button';
import { useI18n } from '@/lib/i18n/context';
import { WeekGrid } from './WeekGrid';
import { DayView } from './DayView';
import { AgendaView } from './AgendaView';
import { MiniMonth } from './MiniMonth';
import { AppointmentBlockOverlay } from './AppointmentBlock';
import { AppointmentDialog } from './AppointmentDialog';
import { useAppointments } from './hooks/useAppointments';
import { weekDays, blockGeometry, pointToTime, DAY_START_HOUR, PX_PER_HOUR } from './lib/calendar';
import type { Appointment } from '../domain/appointment';

type CalendarView = 'week' | 'day' | 'agenda';

export function ScheduleView() {
  const { t } = useI18n();

  const [view, setView] = useState<CalendarView>('week');
  const [anchorDate, setAnchorDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [miniMonthAnchor, setMiniMonthAnchor] = useState(() => new Date());

  const [draggingAppt, setDraggingAppt] = useState<Appointment | null>(null);
  const [dialog, setDialog] = useState<{
    open: boolean;
    selectedAppt: Appointment | null;
    defaultSlot: string | undefined;
  }>({ open: false, selectedAppt: null, defaultSlot: undefined });

  const { appointments, loading, reschedule, cancel, create, handleConflictError } =
    useAppointments(anchorDate);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor)
  );

  function navigate(dir: -1 | 1) {
    if (view === 'week') {
      const next = dir === 1 ? addWeeks(anchorDate, 1) : subWeeks(anchorDate, 1);
      setAnchorDate(next);
    } else {
      const next = new Date(selectedDate);
      next.setDate(next.getDate() + dir);
      setSelectedDate(next);
      if (!isSameMonth(next, anchorDate)) setAnchorDate(next);
    }
  }

  function goToday() {
    const now = new Date();
    setAnchorDate(now);
    setSelectedDate(now);
    setMiniMonthAnchor(now);
  }

  function handleSelectDate(date: Date) {
    setSelectedDate(date);
    if (!isSameMonth(date, anchorDate)) setAnchorDate(date);
    setView('day');
  }

  const days = weekDays(anchorDate);

  function headerLabel(): string {
    if (view === 'week') {
      const start = days[0];
      const end = days[6];
      const startStr = format(start, isSameMonth(start, end) ? 'd' : 'd MMM');
      return `${startStr} – ${format(end, 'd MMM yyyy')}`;
    }
    return format(selectedDate, 'd MMMM yyyy');
  }

  function handleSlotClick(iso: string) {
    setDialog({ open: true, selectedAppt: null, defaultSlot: iso });
  }

  function handleAppointmentClick(appt: Appointment) {
    setDialog({ open: true, selectedAppt: appt, defaultSlot: undefined });
  }

  function onDragStart({ active }: DragStartEvent) {
    const appt = active.data.current?.appointment as Appointment;
    setDraggingAppt(appt ?? null);
  }

  async function onDragEnd({ active, over, delta }: DragEndEvent) {
    setDraggingAppt(null);
    if (!over || !active.data.current) return;

    const appt = active.data.current.appointment as Appointment;
    const dayKey = over.id as string;

    const geo = blockGeometry(appt, DAY_START_HOUR, PX_PER_HOUR);
    const newYPx = geo.top + delta.y;
    const dayDate = parseISO(`${dayKey}T00:00:00`);
    const newStart = pointToTime(Math.max(0, newYPx), dayDate, DAY_START_HOUR, PX_PER_HOUR, 15);

    if (newStart === appt.start) return;

    try {
      await reschedule({ id: appt.id, start: newStart });
      toast.success(t('schedule.rescheduled'));
    } catch (err) {
      handleConflictError(err);
    }
  }

  const draggingGeo = draggingAppt
    ? blockGeometry(draggingAppt, DAY_START_HOUR, PX_PER_HOUR)
    : null;

  return (
    <div className="flex gap-5">
      {/* Left sidebar — mini month */}
      <aside className="hidden flex-col gap-4 lg:flex">
        <MiniMonth
          anchor={miniMonthAnchor}
          selected={selectedDate}
          appointments={appointments}
          onSelect={handleSelectDate}
          onMonthChange={setMiniMonthAnchor}
        />
        <Button
          variant="default"
          className="w-full gap-1.5"
          onClick={() => setDialog({ open: true, selectedAppt: null, defaultSlot: undefined })}
        >
          <Icon name="plus" size={15} />
          {t('schedule.new')}
        </Button>
      </aside>

      {/* Main calendar area */}
      <div className="min-w-0 flex-1">
        {/* Toolbar */}
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="grid size-8 place-items-center rounded-md border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Icon name="chevronLeft" size={16} />
            </button>
            <button
              type="button"
              onClick={() => navigate(1)}
              className="grid size-8 place-items-center rounded-md border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Icon name="chevronRight" size={16} />
            </button>
            <button
              type="button"
              onClick={goToday}
              className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {t('schedule.today')}
            </button>
            <h2 className="ml-2 text-cta font-semibold capitalize">{headerLabel()}</h2>
          </div>

          <div className="flex items-center">
            {loading && (
              <span className="mr-3 size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            )}
            <div className="flex overflow-hidden rounded-md border border-border">
              {(['week', 'day', 'agenda'] as CalendarView[]).map(v => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  className={cn(
                    'px-3 py-1.5 text-xs font-medium transition-colors',
                    v !== 'week' && 'border-l border-border',
                    view === v
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  {t(`schedule.${v}` as const)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar views wrapped in DnD context */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          {view === 'week' && (
            <WeekGrid
              days={days}
              appointments={appointments}
              onSlotClick={handleSlotClick}
              onAppointmentClick={handleAppointmentClick}
            />
          )}
          {view === 'day' && (
            <DayView
              day={selectedDate}
              appointments={appointments}
              onSlotClick={handleSlotClick}
              onAppointmentClick={handleAppointmentClick}
            />
          )}
          {view === 'agenda' && (
            <AgendaView
              days={view === 'agenda' ? days : [selectedDate]}
              appointments={appointments}
              onAppointmentClick={handleAppointmentClick}
            />
          )}

          <DragOverlay dropAnimation={null}>
            {draggingAppt && draggingGeo && (
              <AppointmentBlockOverlay appointment={draggingAppt} geometry={draggingGeo} />
            )}
          </DragOverlay>
        </DndContext>
      </div>

      <AppointmentDialog
        key={dialog.open ? (dialog.selectedAppt?.id ?? 'new') : 'closed'}
        open={dialog.open}
        onOpenChange={open => setDialog(d => ({ ...d, open }))}
        appointment={dialog.selectedAppt}
        defaultDate={dialog.defaultSlot}
        onCreate={async input => {
          await create(input);
        }}
        onCancel={async id => {
          await cancel(id);
        }}
      />
    </div>
  );
}
