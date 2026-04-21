'use client';

import { useActionState } from 'react';
import { signIn, type AuthState } from '@/app/actions/auth';

const initialState: AuthState = {};

export default function LoginPage() {
  const [state, action, pending] = useActionState(signIn, initialState);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 380,
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: '36px 32px',
        boxShadow: '0 0 60px #00e5ff0a',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            fontSize: 22, fontWeight: 900, letterSpacing: 3,
            background: 'linear-gradient(90deg,#00e5ff,#00ff9d)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: 6,
          }}>
            SALES ARENA
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: 1 }}>
            ACCESO AL DASHBOARD
          </div>
        </div>

        {/* Form */}
        <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label htmlFor="email" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: 0.5, textTransform: 'uppercase' }}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="tu@empresa.com"
              style={{
                background: '#06101e',
                border: '1px solid var(--border)',
                borderRadius: 8,
                color: 'var(--text)',
                fontSize: 14,
                padding: '10px 14px',
                fontFamily: 'inherit',
                outline: 'none',
                transition: 'border-color .2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#00e5ff66')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label htmlFor="password" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: 0.5, textTransform: 'uppercase' }}>
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              style={{
                background: '#06101e',
                border: '1px solid var(--border)',
                borderRadius: 8,
                color: 'var(--text)',
                fontSize: 14,
                padding: '10px 14px',
                fontFamily: 'inherit',
                outline: 'none',
                transition: 'border-color .2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#00e5ff66')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>

          {/* Error */}
          {state.error && (
            <div style={{
              background: '#ff3d8b11',
              border: '1px solid #ff3d8b44',
              borderRadius: 8,
              padding: '9px 12px',
              fontSize: 13,
              color: '#ff3d8b',
            }}>
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={pending}
            style={{
              marginTop: 6,
              background: pending ? '#112444' : 'linear-gradient(135deg, #00e5ff22, #00ff9d22)',
              border: '1px solid #00e5ff44',
              borderRadius: 9,
              color: pending ? 'var(--muted)' : '#00e5ff',
              fontSize: 14,
              fontWeight: 700,
              fontFamily: 'inherit',
              padding: '11px',
              cursor: pending ? 'not-allowed' : 'pointer',
              letterSpacing: 1,
              transition: 'all .2s',
            }}
          >
            {pending ? 'Accediendo...' : 'Entrar →'}
          </button>
        </form>
      </div>
    </div>
  );
}
