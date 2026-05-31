'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Icon } from '@/components/atoms/icon';
import { PatientAvatar } from '@/components/atoms/avatar';
import { StatusBadge } from '@/components/atoms/status-badge';
import { useI18n } from '@/lib/i18n/context';
import { usePatientRepository } from '@/lib/container';
import { fmtDate, fmtDateLong } from '@/lib/i18n/translations';

export default function PatientDetailPage() {
  const { t, lang } = useI18n();
  const repo = usePatientRepository();
  const router = useRouter();
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';

  const patient = repo.findById(id);

  const [tab, setTab] = useState<'history' | 'data'>('history');
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(patient?.name ?? '');
  const [age, setAge] = useState(String(patient?.age ?? ''));
  const [ageErr, setAgeErr] = useState('');

  useEffect(() => {
    if (patient) {
      setName(patient.name);
      setAge(String(patient.age));
      setEditing(false);
    }
  }, [id, patient?.id]);

  if (!patient) {
    return (
      <div className="content-inner">
        <div className="page-head">
          <p className="pdesc">Paciente no encontrado.</p>
          <button className="btn btn-outline" onClick={() => router.push('/pacientes')}>
            <Icon name="chevronLeft" size={16} />
            {t('detail.back')}
          </button>
        </div>
      </div>
    );
  }

  function save() {
    const n = parseInt(age, 10);
    if (!name.trim()) return;
    if (isNaN(n) || n < 0 || n > 130) {
      setAgeErr(t('detail.ageInvalid'));
      return;
    }
    setAgeErr('');
    repo.update(patient!.id, { name: name.trim(), age: n });
    toast.success(t('detail.saved'));
    setEditing(false);
  }

  function cancel() {
    setName(patient!.name);
    setAge(String(patient!.age));
    setAgeErr('');
    setEditing(false);
  }

  return (
    <div className="content-inner">
      <div className="page-head">
        <div className="crumbs">
          <button
            className="link-btn"
            onClick={() => router.push('/pacientes')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
          >
            <Icon name="chevronLeft" size={15} /> {t('detail.back')}
          </button>
          <span>/</span>
          <span style={{ color: 'var(--foreground)' }}>{patient.name}</span>
        </div>

        <div className="page-head-row">
          <h1>{patient.name}</h1>
          {!editing ? (
            <button className="btn btn-outline" onClick={() => setEditing(true)}>
              <Icon name="edit" size={16} />
              {t('detail.edit')}
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost" onClick={cancel}>
                {t('detail.cancel')}
              </button>
              <button className="btn btn-primary" onClick={save}>
                <Icon name="check" size={16} />
                {t('detail.save')}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="detail-grid">
        {/* Left column: avatar + info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card detail-hero">
            <PatientAvatar initials={patient.initials} tone={patient.tone} size={72} />
            {!editing ? (
              <>
                <div className="name">{patient.name}</div>
                <div className="id">{patient.id}</div>
                <div style={{ marginTop: 10 }}>
                  <StatusBadge status={patient.status} t={t} />
                </div>
              </>
            ) : (
              <div
                style={{
                  width: '100%',
                  marginTop: 14,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <div className="field">
                  <label className="lbl" htmlFor="ed-name">
                    {t('detail.name')}
                  </label>
                  <input
                    id="ed-name"
                    className="input"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label className="lbl" htmlFor="ed-age">
                    {t('detail.age')}
                  </label>
                  <input
                    id="ed-age"
                    className={`input ${ageErr ? 'err' : ''}`}
                    type="number"
                    min={0}
                    max={130}
                    value={age}
                    onChange={e => setAge(e.target.value)}
                  />
                  {ageErr && (
                    <span className="hint" style={{ color: 'var(--destructive)' }}>
                      {ageErr}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <div className="list-card-head">
              <h3>{t('detail.info')}</h3>
            </div>
            <div className="info-list">
              <div className="info-row">
                <span className="k">{t('detail.age')}</span>
                <span className="v tabular">
                  {patient.age} {t('patients.years')}
                </span>
              </div>
              <div className="info-row">
                <span className="k">{t('detail.id')}</span>
                <span className="v" style={{ fontFamily: 'var(--font-mono)' }}>
                  {patient.id}
                </span>
              </div>
              <div className="info-row">
                <span className="k">{t('detail.email')}</span>
                <span className="v">{patient.email}</span>
              </div>
              <div className="info-row">
                <span className="k">{t('detail.phone')}</span>
                <span className="v tabular">{patient.phone}</span>
              </div>
              <div className="info-row">
                <span className="k">{t('detail.since')}</span>
                <span className="v">{fmtDate(patient.since, lang)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: tabs + history */}
        <div>
          <div className="tabs">
            <button
              className={`tab ${tab === 'history' ? 'on' : ''}`}
              onClick={() => setTab('history')}
            >
              {t('detail.tab.history')}
            </button>
            <button className={`tab ${tab === 'data' ? 'on' : ''}`} onClick={() => setTab('data')}>
              {t('detail.tab.data')}
            </button>
          </div>

          {tab === 'history' ? (
            <div className="card" style={{ padding: '20px 20px 8px' }}>
              <p className="pdesc" style={{ margin: '0 0 18px' }}>
                <strong style={{ color: 'var(--foreground)' }}>{patient.history.length}</strong>{' '}
                {t('detail.totalConsultas')}
              </p>
              <div className="timeline">
                {patient.history.map((c, i) => (
                  <div className="tl-item" key={i}>
                    <div className="tl-rail">
                      <span className={`tl-dot ${c.status}`} />
                      <span className="tl-line" />
                    </div>
                    <div className="card tl-body">
                      <div className="tl-top">
                        <div>
                          <div className="tl-type">{c.type}</div>
                          <div className="tl-meta">
                            {t('detail.with')} {c.doctor}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <StatusBadge status={c.status} t={t} />
                          <span className="tl-date">{fmtDate(c.date, lang)}</span>
                        </div>
                      </div>
                      <p className="tl-note">{c.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="info-list">
                <div className="info-row" style={{ borderTop: 0 }}>
                  <span className="k">{t('detail.name')}</span>
                  <span className="v">{patient.name}</span>
                </div>
                <div className="info-row">
                  <span className="k">{t('detail.age')}</span>
                  <span className="v tabular">{patient.age}</span>
                </div>
                <div className="info-row">
                  <span className="k">{t('detail.email')}</span>
                  <span className="v">{patient.email}</span>
                </div>
                <div className="info-row">
                  <span className="k">{t('detail.phone')}</span>
                  <span className="v tabular">{patient.phone}</span>
                </div>
                <div className="info-row">
                  <span className="k">{t('detail.id')}</span>
                  <span className="v" style={{ fontFamily: 'var(--font-mono)' }}>
                    {patient.id}
                  </span>
                </div>
                <div className="info-row">
                  <span className="k">{t('detail.since')}</span>
                  <span className="v">{fmtDateLong(patient.since, lang)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
