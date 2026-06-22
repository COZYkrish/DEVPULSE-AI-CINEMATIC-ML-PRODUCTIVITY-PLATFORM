import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Database, Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Papa from 'papaparse';
import PageTransition from '@/components/animations/PageTransition';
import Waves from '@/components/animations/Waves';

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
      if (vals.length === 0) return;
      const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
      const min = Math.min(...vals);
      const max = Math.max(...vals);
      const std = Math.sqrt(vals.reduce((s, v) => s + (v - mean) ** 2, 0) / vals.length);
      stats[col] = { mean: mean.toFixed(2), min: min.toFixed(2), max: max.toFixed(2), std: std.toFixed(2) };
    });
    return stats;
  }, [data, columns]);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
    setPage(0);
  };

  return (
    <PageTransition>
      <div className="relative min-h-screen pt-24 pb-32 overflow-hidden bg-black text-white">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen">
          <Waves
            lineColor="rgba(255, 255, 255, 0.15)"
            backgroundColor="transparent"
            waveSpeedX={0.02}
            waveSpeedY={0.01}
            waveAmpX={40}
            waveAmpY={20}
            friction={0.9}
            tension={0.01}
            maxCursorMove={120}
            xGap={12}
            yGap={36}
          />
        </div>
        <div className="vignette-overlay relative z-0 pointer-events-none" />
        <div className="noise-overlay relative z-0 pointer-events-none" />
        <div className="film-lines relative z-0 pointer-events-none" />

        <div className="container relative z-10">
          {/* Header */}
          <div className="text-center mb-12 border-b border-white/20 pb-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}
              className="inline-flex items-center justify-center w-14 h-14 border border-white/20 bg-white/5 mb-6">
              <Database className="w-6 h-6 text-white" />
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl font-light uppercase tracking-widest" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Data Explorer
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-[10px] uppercase tracking-widest mt-4" style={{ color: '#888888', fontFamily: 'JetBrains Mono' }}>
              Explore the developer productivity dataset
            </motion.p>
          </div>

          {/* Stats Row */}
          {stats && (
            <RevealSection className="mb-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-white/20 border border-white/20">
                {Object.entries(stats).slice(0, 5).map(([key, s]) => (
                  <div key={key} className="bg-black p-4 text-center hover:bg-white/5 transition-colors">
                    <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: '#888888', fontFamily: 'JetBrains Mono' }}>{key.replace(/_/g, ' ')}</div>
                    <div className="text-2xl font-light mb-1" style={{ fontFamily: 'JetBrains Mono', color: '#FFFFFF' }}>{s.mean}</div>
                    <div className="text-[9px] uppercase tracking-widest" style={{ color: '#555555', fontFamily: 'JetBrains Mono' }}>min: {s.min} · max: {s.max}</div>
                  </div>
                ))}
              </div>
            </RevealSection>
          )}

          {/* Controls */}
          <RevealSection className="mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#888888' }} />
                <input
                  type="text" placeholder="SEARCH VALUES..." value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                  className="w-full pl-12 pr-4 py-3 text-[10px] uppercase tracking-widest bg-black/60 outline-none placeholder-gray-600 transition-colors focus:bg-black"
                  style={{ border: '1px solid rgba(255,255,255,0.2)', color: '#FFFFFF', fontFamily: 'JetBrains Mono' }}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 mr-2" style={{ color: '#888888' }} />
                {(['all', '1', '0'] as const).map((f) => (
                  <button key={f} onClick={() => { setFilterSuccess(f); setPage(0); }}
                    className="px-4 py-2 text-[10px] uppercase tracking-widest transition-colors font-bold"
                    style={{
                      background: filterSuccess === f ? '#FFFFFF' : 'rgba(0,0,0,0.6)',
                      color: filterSuccess === f ? '#000000' : '#888888',
                      border: `1px solid rgba(255,255,255,0.2)`,
                      fontFamily: 'JetBrains Mono'
                    }}>
                    {f === 'all' ? 'All' : f === '1' ? 'Success' : 'Failure'}
                  </button>
                ))}
              </div>
              <span className="text-[10px] uppercase tracking-widest border border-white/20 bg-black/60 px-4 py-2" style={{ color: '#888888', fontFamily: 'JetBrains Mono' }}>
                {filtered.length} RECORDS
              </span>
            </div>
          </RevealSection>

          {/* Table */}
          <RevealSection>
            <div className="border border-white/20 bg-black/60 overflow-hidden relative">
              <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
              {loading ? (
                <div className="p-12 text-center relative z-10">
                  <div className="w-8 h-8 border border-white/20 animate-spin mx-auto bg-white/5" />
                  <p className="text-[10px] uppercase tracking-widest mt-4" style={{ color: '#888888', fontFamily: 'JetBrains Mono' }}>Loading dataset...</p>
                </div>
              ) : (
                <div className="overflow-x-auto relative z-10">
                  <table className="w-full text-[10px]">
                    <thead>
                      <tr className="bg-white/5" style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                        <th className="px-4 py-4 text-left" style={{ color: '#888888', fontFamily: 'JetBrains Mono' }}>#</th>
                        {columns.map((col) => (
                          <th key={col} className="px-4 py-4 text-left cursor-pointer hover:text-white transition-colors uppercase tracking-widest"
                            style={{ color: sortKey === col ? '#FFFFFF' : '#888888', fontFamily: 'JetBrains Mono' }}
                            onClick={() => handleSort(col)}>
                            <span className="flex items-center gap-2">
                              {col.replace(/_/g, ' ')}
                              {sortKey === col && <ArrowUpDown className="w-3 h-3" />}
                            </span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paged.map((row, i) => (
                        <tr key={i} className="hover:bg-white/5 transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                          <td className="px-4 py-3" style={{ color: '#555555', fontFamily: 'JetBrains Mono' }}>{page * pageSize + i + 1}</td>
                          {columns.map((col) => (
                            <td key={col} className="px-4 py-3" style={{
                              fontFamily: 'JetBrains Mono',
                              color: col === 'task_success' ? (row[col] === 1 ? '#FFFFFF' : '#555555') : '#AAAAAA',
                              fontWeight: col === 'task_success' ? 'bold' : 'normal'
                            }}>
                              {col === 'task_success' ? (row[col] === 1 ? 'SUCCESS' : 'FAILURE') : row[col]}
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
                <div className="flex items-center justify-between px-6 py-4 relative z-10" style={{ borderTop: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.6)' }}>
                  <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}
                    className="flex items-center gap-2 px-4 py-2 border border-white/20 text-[10px] uppercase tracking-widest transition-colors hover:bg-white/10 disabled:opacity-30"
                    style={{ color: '#FFFFFF', fontFamily: 'JetBrains Mono' }}>
                    <ChevronLeft className="w-3.5 h-3.5" /> Prev
                  </button>
                  <span className="text-[10px] uppercase tracking-widest" style={{ color: '#888888', fontFamily: 'JetBrains Mono' }}>
                    Page {page + 1} of {totalPages}
                  </span>
                  <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}
                    className="flex items-center gap-2 px-4 py-2 border border-white/20 text-[10px] uppercase tracking-widest transition-colors hover:bg-white/10 disabled:opacity-30"
                    style={{ color: '#FFFFFF', fontFamily: 'JetBrains Mono' }}>
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
