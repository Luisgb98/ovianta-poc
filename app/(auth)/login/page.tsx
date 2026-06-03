'use client';

import { useReducer, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms/button';
import { Icon } from '@/components/atoms/icon';
import { useI18n } from '@/lib/i18n/context';
import { useAuth } from '@/lib/auth/context';

const DEMO_CODE = process.env.NEXT_PUBLIC_DEMO_OTP ?? '';
const DIGIT_KEYS = ['d0', 'd1', 'd2', 'd3', 'd4', 'd5'] as const;
const EMPTY_DIGITS = ['', '', '', '', '', ''];

type Step = 'email' | 'code';
type ErrorField = 'email' | 'code' | null;

type State = {
  step: Step;
  email: string;
  digits: string[];
  error: ErrorField;
  active: number;
};

type Action =
  | { type: 'SET_EMAIL'; email: string }
  | { type: 'SUBMIT_EMAIL' }
  | { type: 'SET_DIGIT'; index: number; value: string }
  | { type: 'SET_ACTIVE'; index: number }
  | { type: 'PASTE'; digits: string[]; active: number }
  | { type: 'SET_ERROR'; error: ErrorField }
  | { type: 'RESET_CODE' }
  | { type: 'BACK' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_EMAIL':
      return { ...state, email: action.email };
    case 'SUBMIT_EMAIL':
      return { ...state, step: 'code', error: null };
    case 'SET_DIGIT': {
      const digits = [...state.digits];
      digits[action.index] = action.value;
      return {
        ...state,
        digits,
        active: action.value && action.index < 5 ? action.index + 1 : state.active,
      };
    }
    case 'SET_ACTIVE':
      return { ...state, active: action.index };
    case 'PASTE':
      return { ...state, digits: action.digits, active: action.active };
    case 'SET_ERROR':
      return { ...state, error: action.error };
    case 'RESET_CODE':
      return { ...state, digits: [...EMPTY_DIGITS], error: 'code', active: 0 };
    case 'BACK':
      return { ...state, step: 'email', error: null };
    default:
      return state;
  }
}

const initialState: State = {
  step: 'email',
  email: '',
  digits: [...EMPTY_DIGITS],
  error: null,
  active: 0,
};

export default function LoginPage() {
  const { t } = useI18n();
  const { login } = useAuth();
  const router = useRouter();
  const [{ step, email, digits, error, active }, dispatch] = useReducer(reducer, initialState);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  function submitEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      dispatch({ type: 'SET_ERROR', error: 'email' });
      return;
    }
    dispatch({ type: 'SUBMIT_EMAIL' });
    setTimeout(() => inputsRef.current[0]?.focus(), 80);
  }

  function setDigit(i: number, val: string) {
    const v = val.replace(/\D/g, '').slice(-1);
    dispatch({ type: 'SET_DIGIT', index: i, value: v });
    if (v && i < 5) inputsRef.current[i + 1]?.focus();
  }

  function onKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
      dispatch({ type: 'SET_ACTIVE', index: i - 1 });
    }
    if (e.key === 'ArrowLeft' && i > 0) {
      inputsRef.current[i - 1]?.focus();
      dispatch({ type: 'SET_ACTIVE', index: i - 1 });
    }
    if (e.key === 'ArrowRight' && i < 5) {
      inputsRef.current[i + 1]?.focus();
      dispatch({ type: 'SET_ACTIVE', index: i + 1 });
    }
  }

  function onPaste(e: React.ClipboardEvent) {
    const txt = (e.clipboardData.getData('text') ?? '').replace(/\D/g, '').slice(0, 6);
    if (!txt) return;
    e.preventDefault();
    const next = [...EMPTY_DIGITS];
    for (let i = 0; i < txt.length; i++) next[i] = txt[i];
    const focusIdx = Math.min(txt.length, 5);
    dispatch({ type: 'PASTE', digits: next, active: focusIdx });
    inputsRef.current[focusIdx]?.focus();
  }

  function verify(e: React.FormEvent) {
    e.preventDefault();
    const code = digits.join('');
    if (code.length < 6) return;
    if (code === DEMO_CODE) {
      login(email);
      router.replace('/');
    } else {
      dispatch({ type: 'RESET_CODE' });
      inputsRef.current[0]?.focus();
    }
  }

  const codeComplete = digits.join('').length === 6;

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
          <p>{t('login.asideQuote')}</p>
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
                    onChange={e => dispatch({ type: 'SET_EMAIL', email: e.target.value })}
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

              <Button type="submit" size="lg" className="h-[46px] w-full text-[15px]">
                {t('login.sendCode')}
                <Icon name="chevronRight" size={16} />
              </Button>
            </form>
          ) : (
            <form onSubmit={verify}>
              <Button
                type="button"
                variant="link"
                size="sm"
                className="mb-[18px] inline-flex h-auto items-center gap-1 p-0"
                onClick={() => dispatch({ type: 'BACK' })}
              >
                <Icon name="chevronLeft" size={15} /> {t('login.back')}
              </Button>

              <h1>{t('login.codeTitle')}</h1>
              <p className="sub">
                {t('login.codeSubtitle')} <strong>{email}</strong>
              </p>

              <div className="otp-row" onPaste={onPaste}>
                {digits.map((d, i) => (
                  <div
                    key={DIGIT_KEYS[i]}
                    className={`otp-cell ${d ? 'filled' : ''} ${active === i ? 'active' : ''}`}
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
                      onFocus={() => dispatch({ type: 'SET_ACTIVE', index: i })}
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
                <Button type="button" variant="link" size="sm" className="h-auto p-0">
                  {t('login.resend')}
                </Button>
              </p>

              <div style={{ height: 14 }} />

              <Button
                type="submit"
                size="lg"
                className="h-[46px] w-full text-[15px]"
                disabled={!codeComplete}
              >
                <Icon name="check" size={16} />
                {t('login.verify')}
              </Button>

              {DEMO_CODE && (
                <div className="demo-hint">
                  <Icon name="activity" size={15} />
                  {t('login.demoHint')} <code>{DEMO_CODE}</code>
                </div>
              )}
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
