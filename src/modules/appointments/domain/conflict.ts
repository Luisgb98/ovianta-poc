import { areIntervalsOverlapping, addMinutes, parseISO } from 'date-fns';
import type { Appointment } from './appointment';

interface Candidate {
  id?: string;
  doctor: string;
  start: string;
  durationMin: number;
  status?: string;
}

export function hasConflict(
  existing: Appointment[],
  candidate: Candidate,
  ignoreId?: string
): boolean {
  const candidateStart = parseISO(candidate.start);
  const candidateEnd = addMinutes(candidateStart, candidate.durationMin);

  return existing.some(appt => {
    if (appt.status === 'cancelled') return false;
    if (appt.doctor !== candidate.doctor) return false;
    if (appt.id === ignoreId) return false;
    if (candidate.id && appt.id === candidate.id) return false;

    const apptStart = parseISO(appt.start);
    const apptEnd = addMinutes(apptStart, appt.durationMin);

    return areIntervalsOverlapping(
      { start: candidateStart, end: candidateEnd },
      { start: apptStart, end: apptEnd }
    );
  });
}
