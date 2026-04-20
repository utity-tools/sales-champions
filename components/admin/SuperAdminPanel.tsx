'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useDashboardStore } from '@/store/dashboardStore';
import { BADGE_DEFS, ROLES, COLORS, fmt } from '@/lib/data';
import type { Rep, SalesData } from '@/types';

type AdminTab = 'overview' | 'reps' | 'sales' | 'targets' | 'badges' | 'log';

interface LogEntry { ts: string; msg: string; type: 'info' | 'success' | 'danger'; }

function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>{title}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div style={{ background: 'var(--card2)', borderRadius: 8, padding: '12px 16px', textAlign: 'center', border: `1px solid ${color}33` }}>
      <div className="num" style={{ fontSize: 22, color, marginBottom: 2 }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.3 }}>{label}</div>
    </div>
  );
}

const TABS: { k: AdminTab; label: string; icon: string }[] = [
  { k: 'overview', label: 'Resumen',     icon: '📊' },
  { k: 'reps',     label: 'Comerciales', icon: '👥' },
  { k: 'sales',    label: 'Ventas',      icon: '💰' },
  { k: 'targets',  label: 'Objetivos',   icon: '🎯' },
  { k: 'badges',   label: 'Badges',      icon: '🏅' },
  { k: 'log',      label: 'Registro',    icon: '📋' },
];

export function SuperAdminPanel() {
  const { reps, salesData, targets, badges, updateRep, addRep, updateSalesData, updateTargets, toggleBadge } = useDashboardStore();
  const [tab, setTab] = useState<AdminTab>('overview');
  const [log, setLog] = useState<LogEntry[]>([]);
  const [toast, setToast] = useState('');
  const [editingRep, setEditingRep] = useState<Rep | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };
  const addLog = (msg: string, type: LogEntry['type'] = 'info') => {
    const ts = new Date().toLocaleTimeString('es-ES');
    setLog((prev) => [{ ts, msg, type }, ...prev].slice(0, 50));
  };

  const handleSaveRep = (rep: Rep) => {
    updateRep(rep.id, rep); setEditingRep(null);
    addLog(`✏️ Actualizado: ${rep.name}`, 'success'); showToast(`"${rep.name}" actualizado`);
  };
  const handleToggleActive = (rep: Rep) => {
    updateRep(rep.id, { active: !rep.active });
    const action = rep.active ? 'desactivado' : 'activado';
    addLog(`🔄 ${rep.name} ${action}`, 'info'); showToast(`${rep.name} ${action}`);
  };
  const handleAddRep = () => {
    const id = Math.max(...reps.map((r) => r.id)) + 1;
    const newRep: Rep = { id, name: 'Nuevo Comercial', avatar: 'NC', color: COLORS[id % COLORS.length], role: 'AE', email: `nuevo${id}@empresa.com`, active: true };
    addRep(newRep); addLog(`➕ Nuevo: ${newRep.name}`, 'success'); showToast('Nuevo comercial añadido');
  };
  const handleSaveSales = (repId: number, field: keyof SalesData, value: number) => {
    updateSalesData(repId, { [field]: value });
    const rep = reps.find((r) => r.id === repId);
    addLog(`💰 ${String(field)} de ${rep?.name}: ${value}`, 'success');
  };

  const totalSales = salesData.reduce((a, d) => a + d.month, 0);
  const totalDeals = salesData.reduce((a, d) => a + d.deals, 0);
  const avgTicket = totalDeals > 0 ? Math.round(totalSales / totalDeals) : 0;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* ── TOP NAV ── */}
      <nav style={{ background: '#0b1929', borderBottom: '1px solid var(--border)', padding: '0 16px', height: 52, display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: 2, background: 'linear-gradient(90deg,#b44fff,#ff3d8b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', whiteSpace: 'nowrap' }}>
          SUPER ADMIN
        </div>
        <div style={{ fontSize: 9, letterSpacing: 2, color: 'var(--muted)', borderLeft: '1px solid var(--border)', paddingLeft: 10, textTransform: 'uppercase', display: 'none' }} className="nav-hide-mobile">
          Panel de Control
        </div>
        <div style={{ flex: 1 }} />
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#06101e', border: '1px solid var(--border)', borderRadius: 7, color: 'var(--muted)', fontSize: 11, textDecoration: 'none', padding: '5px 10px', whiteSpace: 'nowrap' }}>
          ← Dashboard
        </Link>
      </nav>

      {/* ── LAYOUT ── */}
      <div className="admin-layout">
        {/* Sidebar / Tab Bar */}
        <aside className="admin-sidebar">
          {TABS.map((t) => (
            <button key={t.k} onClick={() => setTab(t.k)} className={`admin-sidebar-btn ${tab === t.k ? 'active' : ''}`}>
              <span className="admin-sidebar-icon">{t.icon}</span>
              <span className="admin-sidebar-label">{t.label}</span>
            </button>
          ))}
        </aside>

        {/* Main content */}
        <main className="admin-main">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >

              {/* ── OVERVIEW ── */}
              {tab === 'overview' && (
                <div>
                  <SectionHeader title="Resumen Global" sub="Vista de todos los datos del equipo" />
                  <div className="admin-stat-grid">
                    <StatBox label="Ventas totales (mes)" value={fmt(totalSales)} color="#00e5ff" />
                    <StatBox label="Deals cerrados (mes)" value={totalDeals} color="#00ff9d" />
                    <StatBox label="Ticket medio" value={`${avgTicket}€`} color="#ffd600" />
                    <StatBox label="Comerciales activos" value={reps.filter((r) => r.active).length} color="#b44fff" />
                  </div>
                  <div style={{ background: 'var(--card)', borderRadius: 12, border: '1px solid var(--border)', padding: 16, overflowX: 'auto' }}>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Rendimiento por comercial</div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 520 }}>
                      <thead>
                        <tr>
                          {['Comercial', 'Semana', 'Mes', 'Deals', 'Ticket', 'Conv.', 'Racha'].map((h) => (
                            <th key={h} style={{ fontSize: 10, color: 'var(--muted)', padding: '0 8px 10px', textAlign: 'left', borderBottom: '1px solid var(--border)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {reps.map((rep, i) => {
                          const d = salesData[i];
                          if (!d) return null;
                          return (
                            <tr key={rep.id}>
                              <td style={{ padding: '8px', borderBottom: '1px solid #0e2038' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: `${rep.color}22`, border: `1.5px solid ${rep.color}88`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: rep.color, flexShrink: 0 }}>{rep.avatar}</div>
                                  <span style={{ fontSize: 11, whiteSpace: 'nowrap' }}>{rep.name}</span>
                                  {!rep.active && <span style={{ fontSize: 9, color: '#ff3d8b', border: '1px solid #ff3d8b44', borderRadius: 3, padding: '1px 4px' }}>OFF</span>}
                                </div>
                              </td>
                              <td style={{ padding: '8px', borderBottom: '1px solid #0e2038' }}><span className="num" style={{ color: rep.color }}>{fmt(d.week)}</span></td>
                              <td style={{ padding: '8px', borderBottom: '1px solid #0e2038' }}><span className="num" style={{ color: rep.color }}>{fmt(d.month)}</span></td>
                              <td style={{ padding: '8px', borderBottom: '1px solid #0e2038' }}><span className="num" style={{ color: '#00ff9d' }}>{d.deals}</span></td>
                              <td style={{ padding: '8px', borderBottom: '1px solid #0e2038' }}><span className="num" style={{ color: '#ffd600' }}>{d.avgT}€</span></td>
                              <td style={{ padding: '8px', borderBottom: '1px solid #0e2038' }}><span className="num" style={{ color: '#b44fff' }}>{d.conv}%</span></td>
                              <td style={{ padding: '8px', borderBottom: '1px solid #0e2038' }}><span style={{ color: '#ff6b35', fontWeight: 700 }}>🔥{d.streak}d</span></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── REPS ── */}
              {tab === 'reps' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
                    <SectionHeader title="Comerciales" sub="Gestiona los usuarios del equipo" />
                    <button className="btn btn-success" onClick={handleAddRep}>+ Añadir</button>
                  </div>
                  <div style={{ display: 'grid', gap: 10 }}>
                    {reps.map((rep) => (
                      <div key={rep.id} style={{ background: 'var(--card)', borderRadius: 10, border: '1px solid var(--border)', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                        <div style={{ width: 38, height: 38, borderRadius: '50%', background: `${rep.color}22`, border: `2px solid ${rep.color}88`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: rep.color, flexShrink: 0 }}>{rep.avatar}</div>
                        {editingRep?.id === rep.id ? (
                          <RepEditForm rep={editingRep} onChange={setEditingRep} onSave={handleSaveRep} onCancel={() => setEditingRep(null)} />
                        ) : (
                          <>
                            <div style={{ flex: 1, minWidth: 120 }}>
                              <div style={{ fontSize: 13, fontWeight: 700 }}>{rep.name}</div>
                              <div style={{ fontSize: 11, color: 'var(--muted)' }}>{rep.role} · {rep.email}</div>
                            </div>
                            <span style={{ fontSize: 11, color: rep.active ? '#00ff9d' : '#ff3d8b', border: `1px solid ${rep.active ? '#00ff9d44' : '#ff3d8b44'}`, borderRadius: 4, padding: '2px 8px', whiteSpace: 'nowrap' }}>
                              {rep.active ? 'Activo' : 'Inactivo'}
                            </span>
                            <button className="btn btn-ghost" onClick={() => setEditingRep(rep)} style={{ fontSize: 11 }}>✏️</button>
                            <button className="btn btn-danger" style={{ fontSize: 11 }} onClick={() => handleToggleActive(rep)}>
                              {rep.active ? 'Desactivar' : 'Activar'}
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── SALES ── */}
              {tab === 'sales' && (
                <div>
                  <SectionHeader title="Datos de Ventas" sub="Edita los datos de ventas por comercial" />
                  <div style={{ background: 'var(--card)', borderRadius: 12, border: '1px solid var(--border)', padding: 16, overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
                      <thead>
                        <tr>
                          {['Comercial', 'Semana (€)', 'Mes (€)', 'Trim. (€)', 'Año (€)', 'Deals', 'Ticket', 'Conv %', 'Nuevos', 'Racha'].map((h) => (
                            <th key={h} style={{ fontSize: 10, color: 'var(--muted)', padding: '0 6px 10px', textAlign: 'left', borderBottom: '1px solid var(--border)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {reps.map((rep, i) => {
                          const d = salesData[i];
                          if (!d) return null;
                          const fields: Array<keyof SalesData> = ['week', 'month', 'quarter', 'year', 'deals', 'avgT', 'conv', 'newCli', 'streak'];
                          return (
                            <tr key={rep.id}>
                              <td style={{ padding: '6px', borderBottom: '1px solid #0e2038' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: `${rep.color}22`, border: `1.5px solid ${rep.color}66`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 800, color: rep.color, flexShrink: 0 }}>{rep.avatar}</div>
                                  <span style={{ fontSize: 11, whiteSpace: 'nowrap' }}>{rep.name}</span>
                                </div>
                              </td>
                              {fields.map((key) => (
                                <td key={key} style={{ padding: '4px 6px', borderBottom: '1px solid #0e2038' }}>
                                  <input type="number" defaultValue={d[key] as number}
                                    onBlur={(e) => handleSaveSales(rep.id, key, Number(e.target.value))}
                                    style={{ width: 72, fontSize: 12, padding: '3px 6px', background: '#112444', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text)', fontFamily: 'inherit' }}
                                  />
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── TARGETS ── */}
              {tab === 'targets' && (
                <div>
                  <SectionHeader title="Objetivos" sub="Configura los targets del equipo" />
                  <div className="admin-targets-grid">
                    {([
                      { key: 'weekly',     label: 'Objetivo Semanal (€)',    color: '#00e5ff' },
                      { key: 'monthly',    label: 'Objetivo Mensual (€)',     color: '#00ff9d' },
                      { key: 'quarterly',  label: 'Objetivo Trimestral (€)',  color: '#ffd600' },
                      { key: 'yearly',     label: 'Objetivo Anual (€)',       color: '#ff6b35' },
                      { key: 'dealTarget', label: 'Deals objetivo/mes',       color: '#b44fff' },
                      { key: 'convTarget', label: 'Conversión objetivo (%)',  color: '#ff3d8b' },
                    ] as const).map(({ key, label, color }) => (
                      <div key={key} style={{ background: 'var(--card)', borderRadius: 10, border: `1px solid ${color}33`, padding: 14 }}>
                        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>{label}</div>
                        <input type="number" defaultValue={targets[key]}
                          onBlur={(e) => { updateTargets({ [key]: Number(e.target.value) }); addLog(`🎯 ${label} → ${e.target.value}`, 'success'); showToast(`${label} actualizado`); }}
                          style={{ width: '100%', fontSize: 18, padding: '8px 10px', color, background: '#112444', border: `1px solid ${color}33`, borderRadius: 6 }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── BADGES ── */}
              {tab === 'badges' && (
                <div>
                  <SectionHeader title="Badges" sub="Asigna o retira logros a cada comercial" />
                  <div style={{ display: 'grid', gap: 10 }}>
                    {reps.map((rep, repIdx) => (
                      <div key={rep.id} style={{ background: 'var(--card)', borderRadius: 10, border: '1px solid var(--border)', padding: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                          <div style={{ width: 30, height: 30, borderRadius: '50%', background: `${rep.color}22`, border: `2px solid ${rep.color}88`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: rep.color, flexShrink: 0 }}>{rep.avatar}</div>
                          <div style={{ fontSize: 13, fontWeight: 700 }}>{rep.name}</div>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {BADGE_DEFS.map((b) => {
                            const earned = (badges[repIdx] ?? []).includes(b.id);
                            return (
                              <button key={b.id} onClick={() => {
                                toggleBadge(repIdx, b.id);
                                addLog(`🏅 "${b.label}" ${earned ? 'retirado' : 'asignado'} a ${rep.name}`, 'info');
                                showToast(`Badge "${b.label}" ${earned ? 'retirado' : 'asignado'}`);
                              }} style={{
                                display: 'flex', alignItems: 'center', gap: 5,
                                padding: '5px 10px', borderRadius: 7,
                                background: earned ? `${b.color}22` : 'var(--card2)',
                                border: `1px solid ${earned ? b.color + '66' : 'var(--border)'}`,
                                color: earned ? b.color : 'var(--muted)',
                                fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s',
                              }}>
                                {b.icon} {b.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── LOG ── */}
              {tab === 'log' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
                    <SectionHeader title="Registro de Acciones" sub="Historial de cambios en el panel" />
                    <button className="btn btn-ghost" onClick={() => setLog([])}>Limpiar</button>
                  </div>
                  {log.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--muted)', padding: 40, background: 'var(--card)', borderRadius: 10, border: '1px solid var(--border)' }}>
                      No hay acciones registradas todavía
                    </div>
                  ) : (
                    <div style={{ background: 'var(--card)', borderRadius: 10, border: '1px solid var(--border)', overflow: 'hidden' }}>
                      {log.map((entry, i) => (
                        <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 14px', borderBottom: i < log.length - 1 ? '1px solid #0e2038' : 'none', alignItems: 'flex-start' }}>
                          <span className="mono" style={{ fontSize: 10, color: 'var(--muted)', flexShrink: 0, marginTop: 2 }}>{entry.ts}</span>
                          <span style={{ fontSize: 13, color: entry.type === 'success' ? '#00ff9d' : entry.type === 'danger' ? '#ff3d8b' : 'var(--text)' }}>{entry.msg}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            style={{ position: 'fixed', bottom: 24, right: 16, background: 'var(--card)', border: '1px solid #00ff9d66', borderRadius: 10, padding: '12px 18px', color: '#00ff9d', fontSize: 13, zIndex: 9999, boxShadow: '0 4px 20px #00000088', maxWidth: 'calc(100vw - 32px)' }}
          >
            ✓ {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RepEditForm({ rep, onChange, onSave, onCancel }: { rep: Rep; onChange: (r: Rep) => void; onSave: (r: Rep) => void; onCancel: () => void }) {
  return (
    <div style={{ display: 'flex', gap: 8, flex: 1, flexWrap: 'wrap', alignItems: 'center' }}>
      <input value={rep.name} onChange={(e) => onChange({ ...rep, name: e.target.value })} placeholder="Nombre" style={{ width: 140, fontSize: 12 }} />
      <input value={rep.avatar} onChange={(e) => onChange({ ...rep, avatar: e.target.value })} placeholder="Avatar" style={{ width: 52, fontSize: 12 }} />
      <input value={rep.email} onChange={(e) => onChange({ ...rep, email: e.target.value })} placeholder="Email" style={{ width: 180, fontSize: 12 }} />
      <select value={rep.role} onChange={(e) => onChange({ ...rep, role: e.target.value })} style={{ fontSize: 12 }}>
        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
      </select>
      <select value={rep.color} onChange={(e) => onChange({ ...rep, color: e.target.value })} style={{ fontSize: 12 }}>
        {COLORS.map((c) => <option key={c} value={c} style={{ color: c }}>{c}</option>)}
      </select>
      <button className="btn btn-success" onClick={() => onSave(rep)}>Guardar</button>
      <button className="btn btn-ghost" onClick={onCancel}>✕</button>
    </div>
  );
}
