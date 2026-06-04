import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ApiPatientRepository } from './api-patient-repository';
import type { Patient } from '../domain/patient';

const PATIENT: Patient = {
  id: 'PT-001',
  name: 'Ana Torres',
  age: 34,
  email: 'ana@test.com',
  phone: '+34 600 000 001',
  since: '2021-01-01',
  lastVisit: '2026-05-01',
  status: 'completed',
  history: [],
};

function mockFetch(body: unknown, status = 200) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  });
}

describe('ApiPatientRepository', () => {
  let repo: ApiPatientRepository;

  beforeEach(() => {
    repo = new ApiPatientRepository();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('findAll', () => {
    it('fetches /api/patients without query', async () => {
      const fetch = mockFetch({ data: [PATIENT] });
      vi.stubGlobal('fetch', fetch);

      const result = await repo.findAll();

      expect(fetch).toHaveBeenCalledWith('/api/patients');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('PT-001');
    });

    it('appends encoded query param when provided', async () => {
      const fetch = mockFetch({ data: [] });
      vi.stubGlobal('fetch', fetch);

      await repo.findAll('ana torres');

      expect(fetch).toHaveBeenCalledWith('/api/patients?q=ana%20torres');
    });
  });

  describe('findById', () => {
    it('returns the patient on success', async () => {
      vi.stubGlobal('fetch', mockFetch({ data: PATIENT }));

      const result = await repo.findById('PT-001');

      expect(result).toEqual(PATIENT);
    });

    it('returns null on 404', async () => {
      vi.stubGlobal('fetch', mockFetch({}, 404));

      const result = await repo.findById('PT-999');

      expect(result).toBeNull();
    });

    it('encodes the id in the URL', async () => {
      const fetch = mockFetch({ data: PATIENT });
      vi.stubGlobal('fetch', fetch);

      await repo.findById('PT-001/extra');

      expect(fetch).toHaveBeenCalledWith('/api/patients/PT-001%2Fextra');
    });
  });

  describe('create', () => {
    it('POSTs patient data and returns the created patient', async () => {
      const fetch = mockFetch({ data: PATIENT });
      vi.stubGlobal('fetch', fetch);

      const { id: _id, ...data } = PATIENT;
      const result = await repo.create(data);

      expect(fetch).toHaveBeenCalledWith(
        '/api/patients',
        expect.objectContaining({ method: 'POST', body: JSON.stringify(data) })
      );
      expect(result).toEqual(PATIENT);
    });

    it('throws when response is not ok', async () => {
      vi.stubGlobal('fetch', mockFetch({ error: 'Duplicate email' }, 400));

      const { id: _id, ...data } = PATIENT;
      await expect(repo.create(data)).rejects.toThrow('Duplicate email');
    });
  });

  describe('update', () => {
    it('PATCHes and returns the updated patient', async () => {
      const fetch = mockFetch({ data: { ...PATIENT, name: 'Ana García' } });
      vi.stubGlobal('fetch', fetch);

      const result = await repo.update('PT-001', { name: 'Ana García' });

      expect(fetch).toHaveBeenCalledWith(
        '/api/patients/PT-001',
        expect.objectContaining({ method: 'PATCH' })
      );
      expect(result?.name).toBe('Ana García');
    });

    it('returns null on 404', async () => {
      vi.stubGlobal('fetch', mockFetch({}, 404));

      const result = await repo.update('PT-999', { name: 'Ghost' });

      expect(result).toBeNull();
    });

    it('throws when response is not ok (non-404)', async () => {
      vi.stubGlobal('fetch', mockFetch({ error: 'Validation failed' }, 400));

      await expect(repo.update('PT-001', { age: -1 })).rejects.toThrow('Validation failed');
    });
  });

  describe('delete', () => {
    it('returns true when deletion succeeds', async () => {
      vi.stubGlobal('fetch', mockFetch({}, 200));

      const result = await repo.delete('PT-001');

      expect(result).toBe(true);
    });

    it('returns false when deletion fails', async () => {
      vi.stubGlobal('fetch', mockFetch({}, 404));

      const result = await repo.delete('PT-999');

      expect(result).toBe(false);
    });

    it('sends DELETE request to the correct URL', async () => {
      const fetch = mockFetch({}, 200);
      vi.stubGlobal('fetch', fetch);

      await repo.delete('PT-001');

      expect(fetch).toHaveBeenCalledWith('/api/patients/PT-001', { method: 'DELETE' });
    });
  });
});
