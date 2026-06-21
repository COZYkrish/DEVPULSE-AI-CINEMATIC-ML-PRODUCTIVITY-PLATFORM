import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Database, Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Papa from 'papaparse';
import PageTransition from '@/components/animations/PageTransition';

interface DataRow {
  hours_coding: number;
  coffee_intake_mg: number;
  distractions: number;
  sleep_hours: number;
  commits: number;
  bugs_reported: number;
  ai_usage_hours: number;
  cognitive_load: number;
  task_success: number;
  [key: string]: number;
}

function RevealSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

export default function DataExplorerPage() {
  const [data, setData] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string>('hours_coding');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [filterSuccess, setFilterSuccess] = useState<'all' | '1' | '0'>('all');
  const [page, setPage] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    fetch('/ai_dev_productivity.csv')
      .then((r) => r.text())
      .then((csv) => {
        const result = Papa.parse<DataRow>(csv, { header: true, dynamicTyping: true, skipEmptyLines: true });
        setData(result.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns = ['hours_coding', 'coffee_intake_mg', 'distractions', 'sleep_hours', 'commits', 'bugs_reported', 'ai_usage_hours', 'cognitive_load', 'task_success'];
  
  const filtered = useMemo(() => {
    let d = [...data];
    if (filterSuccess !== 'all') d = d.filter((r) => r.task_success === parseInt(filterSuccess));
    if (search) {
      const s = parseFloat(search);
      if (!isNaN(s)) d = d.filter((r) => Object.values(r).some((v) => typeof v === 'number' && Math.abs(v - s) < 0.5));
    }
    d.sort((a, b) => sortDir === 'asc' ? (a[sortKey] ?? 0) - (b[sortKey] ?? 0) : (b[sortKey] ?? 0) - (a[sortKey] ?? 0));
    return d;
  }, [data, search, sortKey, sortDir, filterSuccess]);

  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  const stats = useMemo(() => {
    if (data.length === 0) return null;
    const stats: Record<string, { mean: string; min: string; max: string; std: string }> = {};
    columns.forEach((col) => {
      const vals = data.map((r) => r[col]).filter((v) => typeof v === 'number') as number[];
      const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
      const min = Math.min(...vals);
      const max = Math.max(...vals);
      const std = Math.sqrt(vals.reduce((s, v) => s + (v - mean) ** 2, 0) / vals.length);
      stats[col] = { mean: mean.toFixed(2), min: min.toFixed(2), max: max.toFixed(2), std: std.toFixed(2) };
    });
    return stats;
  }, [data]);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
    setPage(0);
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-32 overflow-hidden">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
              style={{ background: 'linear-gradient(135deg, rgba(0,229,255,0.2), rgba(34,211,238,0.2))', border: '1px solid rgba(0,229,255,0.2)' }}>
              <Database className="w-7 h-7" style={{ color: '#00E5FF' }} />
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#F1F5F9' }}>
              Data Explorer
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-sm mt-2" style={{ color: '#94A3B8' }}>
              Explore the developer productivity dataset
            </motion.p>
          </div>

          {/* Stats Row */}
          {stats && (
            <RevealSection className="mb-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {Object.entries(stats).slice(0, 5).map(([key, s]) => (
                  <div key={key} className="glass rounded-xl p-3 text-center">
                    <div className="text-[10px] mb-1" style={{ color: '#64748B', fontFamily: 'JetBrains Mono' }}>{key.replace(/_/g, ' ')}</div>
                    <div className="text-lg font-bold" style={{ fontFamily: 'JetBrains Mono', color: '#00E5FF' }}>{s.mean}</div>
                    <div className="text-[9px]" style={{ color: '#64748B' }}>min: {s.min} · max: {s.max}</div>
                  </div>
                ))}
              </div>
            </RevealSection>
          )}

          {/* Controls */}
          <RevealSection className="mb-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#64748B' }} />
                <input
                  type="text" placeholder="Search values..." value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-transparent outline-none"
                  style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#F1F5F9', fontFamily: 'Inter' }}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" style={{ color: '#64748B' }} />
                {(['all', '1', '0'] as const).map((f) => (
                  <button key={f} onClick={() => { setFilterSuccess(f); setPage(0); }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: filterSuccess === f ? 'rgba(0,229,255,0.15)' : 'rgba(255,255,255,0.05)',
                      color: filterSuccess === f ? '#00E5FF' : '#94A3B8',
                      border: `1px solid ${filterSuccess === f ? 'rgba(0,229,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
                    }}>
                    {f === 'all' ? 'All' : f === '1' ? 'Success' : 'Failure'}
                  </button>
                ))}
              </div>
              <span className="text-xs" style={{ color: '#64748B', fontFamily: 'JetBrains Mono' }}>
                {filtered.length} records
              </span>
            </div>
          </RevealSection>

          {/* Table */}
          <RevealSection>
            <div className="glass rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
              {loading ? (
                <div className="p-12 text-center">
                  <div className="w-8 h-8 rounded-full border-2 border-transparent animate-spin mx-auto" style={{ borderTopColor: '#00E5FF' }} />
                  <p className="text-xs mt-3" style={{ color: '#64748B' }}>Loading dataset...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <th className="px-3 py-3 text-left" style={{ color: '#64748B' }}>#</th>
                        {columns.map((col) => (
                          <th key={col} className="px-3 py-3 text-left cursor-pointer hover:text-[#00E5FF] transition-colors"
                            style={{ color: sortKey === col ? '#00E5FF' : '#94A3B8', fontFamily: 'Inter' }}
                            onClick={() => handleSort(col)}>
                            <span className="flex items-center gap-1">
                              {col.replace(/_/g, ' ')}
                              {sortKey === col && <ArrowUpDown className="w-3 h-3" />}
                            </span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paged.map((row, i) => (
                        <tr key={i} className="hover:bg-[rgba(255,255,255,0.03)] transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td className="px-3 py-2.5" style={{ color: '#64748B', fontFamily: 'JetBrains Mono' }}>{page * pageSize + i + 1}</td>
                          {columns.map((col) => (
                            <td key={col} className="px-3 py-2.5" style={{
                              fontFamily: 'JetBrains Mono',
                              color: col === 'task_success' ? (row[col] === 1 ? '#10B981' : '#EF4444') : '#F1F5F9',
                            }}>
                              {col === 'task_success' ? (row[col] === 1 ? '✓' : '✗') : row[col]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-all disabled:opacity-30"
                    style={{ color: '#94A3B8', background: 'rgba(255,255,255,0.05)' }}>
                    <ChevronLeft className="w-3.5 h-3.5" /> Prev
                  </button>
                  <span className="text-xs" style={{ color: '#64748B', fontFamily: 'JetBrains Mono' }}>
                    Page {page + 1} of {totalPages}
                  </span>
                  <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-all disabled:opacity-30"
                    style={{ color: '#94A3B8', background: 'rgba(255,255,255,0.05)' }}>
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </RevealSection>
        </div>
      </div>
    </PageTransition>
  );
}
