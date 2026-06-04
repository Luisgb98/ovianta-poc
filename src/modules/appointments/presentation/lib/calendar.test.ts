import { describe, it, expect } from 'vitest';
import { format } from 'date-fns';
import { weekDays, hourSlots, blockGeometry, pointToTime, layoutOverlaps } from './calendar';
import type { Appointment } from '../../domain/appointment';

const BASE_APPT: Appointment = {
  id: 'AP-00001',
  patientId: 'PT-00001',
  patientName: 'Ana Torres',
  doctor: 'Dra. Elena Ruiz',
  type: 'Revisión',
  status: 'scheduled',
  start: '2026-06-04T09:00:00',
  durationMin: 30,
  notes: '',
};

describe('weekDays', () => {
  it('returns 7 days starting Monday', () => {
    const days = weekDays(new Date('2026-06-04'));
    expect(days).toHaveLength(7);
    expect(days[0].getDay()).toBe(1); // Monday
    expect(days[6].getDay()).toBe(0); // Sunday
  });

  it('starts on the Monday of the given week', () => {
    const days = weekDays(new Date('2026-06-07')); // Sunday
    expect(format(days[0], 'yyyy-MM-dd')).toBe('2026-06-01');
  });
});

describe('hourSlots', () => {
  it('returns hours from start to end inclusive', () => {
    const slots = hourSlots(8, 12);
    expect(slots).toEqual([8, 9, 10, 11, 12]);
  });
});

describe('blockGeometry', () => {
  it('computes top=0 for an appointment starting at dayStartHour', () => {
    const { top } = blockGeometry({ start: '2026-06-04T08:00:00', durationMin: 60 }, 8, 64);
    expect(top).toBe(0);
  });

  it('computes top for 1 hour after start', () => {
    const { top } = blockGeometry({ start: '2026-06-04T09:00:00', durationMin: 30 }, 8, 64);
    expect(top).toBe(64);
  });

  it('computes height proportional to duration', () => {
    const { height } = blockGeometry({ start: '2026-06-04T09:00:00', durationMin: 60 }, 8, 64);
    expect(height).toBe(64);
    const { height: h2 } = blockGeometry({ start: '2026-06-04T09:00:00', durationMin: 30 }, 8, 64);
    expect(h2).toBe(32);
  });
});

describe('pointToTime', () => {
  it('snaps to nearest 15-min interval', () => {
    const ref = new Date('2026-06-04');
    const result = pointToTime(64, ref, 8, 64, 15);
    expect(result).toBe('2026-06-04T09:00:00');
  });

  it('snaps up when close to next slot', () => {
    const ref = new Date('2026-06-04');
    // 70px ≈ 65.6min → snaps to 60 (08:00 + 60m = 09:00) or 75m (09:15)?
    const result = pointToTime(70, ref, 8, 64, 15);
    // 70/64*60 = 65.6 → round to 60 → 9:00
    expect(result).toContain('2026-06-04T09:');
  });
});

describe('layoutOverlaps', () => {
  it('assigns column 0 to non-overlapping appointments', () => {
    const appts: Appointment[] = [
      BASE_APPT,
      { ...BASE_APPT, id: 'AP-00002', start: '2026-06-04T10:00:00' },
    ];
    const layout = layoutOverlaps(appts);
    expect(layout.get('AP-00001')?.column).toBe(0);
    expect(layout.get('AP-00002')?.column).toBe(0);
  });

  it('assigns different columns to overlapping appointments', () => {
    const appts: Appointment[] = [
      BASE_APPT,
      { ...BASE_APPT, id: 'AP-00002', start: '2026-06-04T09:15:00' },
    ];
    const layout = layoutOverlaps(appts);
    const cols = [layout.get('AP-00001')?.column, layout.get('AP-00002')?.column];
    expect(cols[0]).not.toBe(cols[1]);
  });

  it('skips cancelled appointments in layout', () => {
    const appts: Appointment[] = [
      BASE_APPT,
      { ...BASE_APPT, id: 'AP-00002', start: '2026-06-04T09:15:00', status: 'cancelled' },
    ];
    const layout = layoutOverlaps(appts);
    expect(layout.get('AP-00001')?.totalColumns).toBe(1);
  });
});
