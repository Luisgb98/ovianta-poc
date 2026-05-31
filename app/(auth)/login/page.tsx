'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/atoms/icon';
import { useI18n } from '@/lib/i18n/context';
import { useAuth } from '@/lib/auth/context';

const DEMO_CODE = '482019';

export default function LoginPage() {
  const { t, lang } = useI18n();
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('ana.torres@ovianta.com');
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<'email' | 'code' | null>(null);
  const [active, setActive] = useState(0);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace('/');
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (step === 'code') {
      setTimeout(() => inputsRef.current[0]?.focus(), 80);
    }
  }, [step]);

  function submitEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('email');
      return;
    }
    setError(null);
    setStep('code');
  }

  function setDigit(i: number, val: string) {
    const v = val.replace(/\D/g, '').slice(-1);
    setDigits(prev => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
    if (v && i < 5) {
      inputsRef.current[i + 1]?.focus();
      setActive(i + 1);
    }
  }

  function onKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
      setActive(i - 1);
    }
    if (e.key === 'ArrowLeft' && i > 0) {
      inputsRef.current[i - 1]?.focus();
      setActive(i - 1);
    }
    if (e.key === 'ArrowRight' && i < 5) {
      inputsRef.current[i + 1]?.focus();
      setActive(i + 1);
    }
  }

  function onPaste(e: React.ClipboardEvent) {
    const txt = (e.clipboardData.getData('text') ?? '').replace(/\D/g, '').slice(0, 6);
    if (!txt) return;
    e.preventDefault();
    const next = ['', '', '', '', '', ''];
    for (let i = 0; i < txt.length; i++) next[i] = txt[i];
    setDigits(next);
    const focusIdx = Math.min(txt.length, 5);
    inputsRef.current[focusIdx]?.focus();
    setActive(focusIdx);
  }

  function verify(e: React.FormEvent) {
    e.preventDefault();
    const code = digits.join('');
    if (code.length < 6) return;
    if (code === DEMO_CODE) {
      setError(null);
      login(email);
      router.replace('/');
    } else {
      setError('code');
      setDigits(['', '', '', '', '', '']);
      inputsRef.current[0]?.focus();
      setActive(0);
    }
  }

  const codeComplete = digits.join('').length === 6;

  const asideQuote: Record<string, string> = {
    es: 'Gestiona pacientes, consultas y agenda en un único espacio claro y seguro.',
    en: 'Manage patients, consultations and scheduling in one clear, secure space.',
    it: 'Gestisci pazienti, consulti e agenda in un unico spazio chiaro e sicuro.',
    pt: 'Faça a gestão de pacientes, consultas e agenda num único espaço claro e seguro.',
  };

  if (isLoading) return null;

  return (
    <div className="auth-stage">
      <aside className="auth-aside">
        <svg
          className="deco"
          viewBox="0 0 400 600"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.4" fill="var(--primary)" opacity="0.18" />
            </pattern>
          </defs>
          <rect width="400" height="600" fill="url(#dots)" />
        </svg>
        <div className="brand-lg">
          <span className="brand-mark" style={{ width: 36, height: 36, fontSize: 19 }}>
            O
          </span>
          Ovianta
        </div>
        <div className="auth-quote">
          <h2>{t('app.tagline')}</h2>
          <p>{asideQuote[lang] ?? asideQuote.es}</p>
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--muted-foreground)' }}>
          © 2026 Ovianta Health
        </div>
      </aside>

      <main className="auth-main">
        <div className="auth-card">
          {step === 'email' ? (
            <form onSubmit={submitEmail}>
              <h1>{t('login.welcome')}</h1>
              <p className="sub">{t('login.subtitle')}</p>

              <div className="field">
                <label className="lbl" htmlFor="login-email">
                  {t('login.email')}
                </label>
                <div className="input-icon-wrap">
                  <Icon name="mail" size={16} />
                  <input
                    id="login-email"
                    className={`input ${error === 'email' ? 'err' : ''}`}
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={t('login.emailPlaceholder')}
                    autoComplete="email"
                  />
                </div>
                {error === 'email' && (
                  <span className="hint" style={{ color: 'var(--destructive)' }}>
                    {t('login.emailInvalid')}
                  </span>
                )}
              </div>

              <div style={{ height: 18 }} />

              <button type="submit" className="btn btn-primary btn-lg btn-block">
                {t('login.sendCode')}
                <Icon name="chevronRight" size={16} />
              </button>
            </form>
          ) : (
            <form onSubmit={verify}>
              <button
                type="button"
                className="link-btn"
                style={{ marginBottom: 18, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                onClick={() => {
                  setStep('email');
                  setError(null);
                }}
              >
                <Icon name="chevronLeft" size={15} /> {t('login.back')}
              </button>

              <h1>{t('login.codeTitle')}</h1>
              <p className="sub">
                {t('login.codeSubtitle')} <strong>{email}</strong>
              </p>

              <div className="otp-row" onPaste={onPaste}>
                {digits.map((d, i) => (
                  <div
                    key={i}
                    className={`otp-cell ${d ? 'filled' : ''} ${active === i ? 'active' : ''}`}
                    onClick={() => {
                      inputsRef.current[i]?.focus();
                      setActive(i);
                    }}
                  >
                    <input
                      ref={el => {
                        inputsRef.current[i] = el;
                      }}
                      className="otp-input-hidden"
                      inputMode="numeric"
                      maxLength={1}
                      value={d}
                      onChange={e => setDigit(i, e.target.value)}
                      onKeyDown={e => onKeyDown(i, e)}
                      onFocus={() => setActive(i)}
                      aria-label={`Digit ${i + 1}`}
                    />
                    <span style={{ pointerEvents: 'none' }}>{d}</span>
                  </div>
                ))}
              </div>

              {error === 'code' && (
                <p className="text-err" style={{ marginTop: 12 }}>
                  {t('login.invalid')}
                </p>
              )}

              <p className="hint" style={{ marginTop: 14 }}>
                {t('login.codeHint')}{' '}
                <button type="button" className="link-btn">
                  {t('login.resend')}
                </button>
              </p>

              <div style={{ height: 14 }} />

              <button
                type="submit"
                className="btn btn-primary btn-lg btn-block"
                disabled={!codeComplete}
              >
                <Icon name="check" size={16} />
                {t('login.verify')}
              </button>

              <div className="demo-hint">
                <Icon name="activity" size={15} />
                {t('login.demoHint').split('482019')[0]}
                <code>482019</code>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
