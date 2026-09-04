import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Cpu, 
  HardDrive, 
  Terminal, 
  Filter, 
  Search, 
  Layers, 
  Zap, 
  ShieldAlert, 
  Activity, 
  RefreshCw, 
  FileCode, 
  ArrowRight, 
  Check, 
  Copy, 
  TrendingUp,
  AlertTriangle,
  Flame,
  Radio,
  Sparkles
} from 'lucide-react';
import { INITIAL_JOBS, INITIAL_JOB_METRICS } from '../data/jobJournalData';
import { JobExecutionRecord, JobStatus, JobCategory } from '../types/jobJournal';

export function FtnJobJournal() {
  const [jobs, setJobs] = useState<JobExecutionRecord[]>(INITIAL_JOBS);
  const [selectedJob, setSelectedJob] = useState<JobExecutionRecord | null>(INITIAL_JOBS[0]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [copiedArtifact, setCopiedArtifact] = useState<string | null>(null);

  // Live simulation ticker for running jobs
  useEffect(() => {
    const timer = setInterval(() => {
      setJobs(prevJobs =>
        prevJobs.map(job => {
          if (job.status === 'running') {
            const nextProgress = Math.min(100, job.progressPct + Math.floor(Math.random() * 4) + 1);
            const isFinished = nextProgress >= 100;
            return {
              ...job,
              progressPct: nextProgress,
              status: isFinished ? 'completed' : 'running',
              currentStepIndex: isFinished ? job.steps.length : Math.min(job.steps.length - 1, Math.floor((nextProgress / 100) * job.steps.length)),
              exitCode: isFinished ? 0 : undefined,
              finishedAt: isFinished ? new Date().toISOString() : undefined,
            };
          }
          return job;
        })
      );
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesCat = categoryFilter === 'all' || job.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const matchesSearch = 
      job.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.executorNode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesStatus && matchesSearch;
  });

  const handleRunNow = (jobId: string) => {
    setJobs(prev =>
      prev.map(j => {
        if (j.id === jobId) {
          return {
            ...j,
            status: 'running',
            progressPct: 10,
            startedAt: new Date().toISOString(),
            finishedAt: undefined,
            exitCode: undefined,
            steps: j.steps.map((s, idx) => ({
              ...s,
              status: idx === 0 ? 'running' : 'pending',
            })),
            logs: [
              `[${new Date().toLocaleTimeString()}] Autonomous executor re-triggered manually by operator.`,
              ...j.logs,
            ],
          };
        }
        return j;
      })
    );
  };

  const handleTogglePause = (jobId: string) => {
    setJobs(prev =>
      prev.map(j => {
        if (j.id === jobId) {
          const newStatus: JobStatus = j.status === 'running' ? 'paused' : 'running';
          return { ...j, status: newStatus };
        }
        return j;
      })
    );
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedArtifact(text);
    setTimeout(() => setCopiedArtifact(null), 2000);
  };

  const triggerAutonomousSweep = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setJobs(prev =>
        prev.map((j, idx) => {
          if (idx === 0 || idx === 3) {
            return {
              ...j,
              status: 'running',
              progressPct: 15,
              startedAt: new Date().toISOString(),
            };
          }
          return j;
        })
      );
      setIsRefreshing(false);
    }, 600);
  };

  const getStatusBadge = (status: JobStatus) => {
    switch (status) {
      case 'running':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping" />
            RUNNING
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            COMPLETED
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-red-500/10 text-red-400 border border-red-500/20">
            <XCircle className="w-3.5 h-3.5" />
            FAILED
          </span>
        );
      case 'paused':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Pause className="w-3.5 h-3.5" />
            PAUSED
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Clock className="w-3.5 h-3.5" />
            SCHEDULED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-gray-800 text-gray-400">
            {status.toUpperCase()}
          </span>
        );
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">CRITICAL</span>;
      case 'high':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">HIGH</span>;
      case 'medium':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">MEDIUM</span>;
      default:
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-400">LOW</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Executive Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-900/90 to-[#071322] border border-gray-800 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00ff66]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#00ff66] text-xs font-mono">
              <Zap className="w-3.5 h-3.5" />
              <span>FTN AUTONOMOUS ENGINE • REAL-TIME JOB JOURNAL</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
              Autonomous Job Execution Journal
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              Monitors the complete lifecycle, active step progress, container CPU/RAM footprint, and post-execution telemetry of autonomous BGP sweeps, DNS pre-warming, Kopia vault snapshots, and OLT optical sweeps.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={triggerAutonomousSweep}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00ff66] to-[#00f0ff] hover:brightness-110 text-gray-950 font-bold text-xs transition-all shadow-lg"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Trigger Autonomous Sweep</span>
            </button>
          </div>
        </div>

        {/* Real-time Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-800/60">
          <div className="bg-gray-950/40 rounded-xl p-3.5 border border-gray-800/40">
            <div className="text-[11px] text-gray-400 font-mono">TOTAL AUTONOMOUS JOBS</div>
            <div className="text-xl font-display font-bold text-white mt-0.5 flex items-center gap-2">
              <span>{jobs.length}</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono">Managed</span>
            </div>
          </div>
          <div className="bg-gray-950/40 rounded-xl p-3.5 border border-gray-800/40">
            <div className="text-[11px] text-gray-400 font-mono">ACTIVE RUNNING STAGES</div>
            <div className="text-xl font-display font-bold text-[#00f0ff] mt-0.5 flex items-center gap-2">
              <span>{jobs.filter(j => j.status === 'running').length}</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-[#00f0ff]/10 text-[#00f0ff] font-mono animate-pulse">Live</span>
            </div>
          </div>
          <div className="bg-gray-950/40 rounded-xl p-3.5 border border-gray-800/40">
            <div className="text-[11px] text-gray-400 font-mono">24H SUCCESS RATE</div>
            <div className="text-xl font-display font-bold text-emerald-400 mt-0.5 flex items-center gap-2">
              <span>96.4%</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="bg-gray-950/40 rounded-xl p-3.5 border border-gray-800/40">
            <div className="text-[11px] text-gray-400 font-mono">TOTAL EXECUTIONS (24H)</div>
            <div className="text-xl font-display font-bold text-white mt-0.5">
              1,420 runs
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> CATEGORY:
          </span>
          {['all', 'bgp-routing', 'dns-cache', 'backup-vault', 'olt-firmware', 'ai-anomaly', 'billing-recon'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                categoryFilter === cat
                  ? 'bg-[#00f0ff]/15 text-[#00f0ff] border border-[#00f0ff]/40'
                  : 'bg-gray-900/80 text-gray-400 hover:text-gray-200 border border-gray-800'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs font-mono text-gray-300 focus:outline-none focus:border-[#00f0ff]"
          >
            <option value="all">All Statuses</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="scheduled">Scheduled</option>
            <option value="paused">Paused</option>
          </select>

          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs, nodes, steps..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-900 border border-gray-800 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#00f0ff]"
            />
          </div>
        </div>
      </div>

      {/* Main Split-Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Job Cards List */}
        <div className="lg:col-span-6 space-y-3">
          {filteredJobs.map((job) => {
            const isSelected = selectedJob?.id === job.id;
            return (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={`cursor-pointer rounded-2xl p-4 border transition-all relative ${
                  isSelected
                    ? 'bg-gray-900/90 border-[#00f0ff]/60 shadow-[0_0_20px_rgba(0,240,255,0.12)] ring-1 ring-[#00f0ff]/30'
                    : 'bg-gray-900/40 hover:bg-gray-900/70 border-gray-800/80 hover:border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-300">
                        {job.id}
                      </span>
                      {getPriorityBadge(job.priority)}
                      <span className="text-[10px] font-mono text-gray-500">
                        Node: {job.executorNode.split(' ')[0]}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-white leading-snug">
                      {job.name}
                    </h3>
                  </div>
                  {getStatusBadge(job.status)}
                </div>

                <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                  {job.description}
                </p>

                {/* Progress Bar */}
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-gray-500">
                      Step {job.currentStepIndex + 1} of {job.steps.length}
                    </span>
                    <span className="text-[#00f0ff] font-bold">{job.progressPct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        job.status === 'failed'
                          ? 'bg-red-500'
                          : job.status === 'completed'
                          ? 'bg-emerald-500'
                          : 'bg-gradient-to-r from-[#00ff66] to-[#00f0ff]'
                      }`}
                      style={{ width: `${job.progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Footer specs */}
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-800/50 text-[11px] font-mono text-gray-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-gray-400" />
                      {job.cpuUsagePct}%
                    </span>
                    <span className="flex items-center gap-1">
                      <HardDrive className="w-3 h-3 text-gray-400" />
                      {job.memoryUsageMb} MB
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {job.status === 'running' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTogglePause(job.id);
                        }}
                        className="px-2 py-0.5 rounded bg-gray-800 hover:bg-gray-700 text-amber-400 text-[10px] border border-gray-700"
                      >
                        Pause
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRunNow(job.id);
                      }}
                      className="px-2.5 py-1 rounded bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] text-[10px] font-bold border border-[#00f0ff]/30 flex items-center gap-1"
                    >
                      <Play className="w-2.5 h-2.5" />
                      <span>Run Now</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Job Deep Inspector */}
        <div className="lg:col-span-6 space-y-4">
          {selectedJob ? (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6 shadow-2xl">
              {/* Drawer Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-mono">
                      {selectedJob.id}
                    </span>
                    {getPriorityBadge(selectedJob.priority)}
                    <span className="text-xs text-gray-500 font-mono">
                      Trigger: {selectedJob.triggerType.toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-lg font-display font-bold text-white mt-1">
                    {selectedJob.name}
                  </h2>
                </div>
                {getStatusBadge(selectedJob.status)}
              </div>

              {/* Execution Steps Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#00f0ff]" />
                  <span>Job Execution Pipeline Stages</span>
                </h4>
                <div className="space-y-2">
                  {selectedJob.steps.map((step, idx) => (
                    <div
                      key={step.id}
                      className="bg-gray-950 p-3 rounded-xl border border-gray-800/80 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center font-mono text-[10px] text-gray-400">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="font-semibold text-gray-200">{step.name}</div>
                          {step.logSummary && (
                            <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                              {step.logSummary}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        {step.status === 'completed' && (
                          <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            {step.durationMs}ms
                          </span>
                        )}
                        {step.status === 'running' && (
                          <span className="text-[#00f0ff] font-mono text-[11px] animate-pulse">
                            Processing...
                          </span>
                        )}
                        {step.status === 'failed' && (
                          <span className="text-red-400 font-mono text-[11px]">
                            Failed
                          </span>
                        )}
                        {step.status === 'pending' && (
                          <span className="text-gray-500 font-mono text-[11px]">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Telemetry Diff / Post-Execution Results */}
              {selectedJob.telemetryDiff && selectedJob.telemetryDiff.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Post-Execution Telemetry Impact</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedJob.telemetryDiff.map((t, idx) => (
                      <div key={idx} className="bg-gray-950 p-3 rounded-xl border border-gray-800 text-xs font-mono space-y-1">
                        <span className="text-gray-500 block text-[10px]">{t.metric}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 line-through">{t.before}</span>
                          <ArrowRight className="w-3 h-3 text-gray-600" />
                          <span className="text-emerald-400 font-bold">{t.after} {t.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Generated Artifacts */}
              {selectedJob.artifacts && selectedJob.artifacts.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-purple-400" />
                    <span>Cryptographic Execution Artifacts</span>
                  </h4>
                  <div className="space-y-2">
                    {selectedJob.artifacts.map((art) => (
                      <div key={art.name} className="bg-gray-950 p-3 rounded-xl border border-gray-800 flex items-center justify-between text-xs font-mono">
                        <div>
                          <div className="text-white font-semibold">{art.name}</div>
                          <div className="text-[10px] text-gray-500 truncate max-w-xs">
                            SHA256: {art.sha256}
                          </div>
                        </div>
                        <button
                          onClick={() => handleCopy(art.sha256)}
                          className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-[10px] flex items-center gap-1 border border-gray-700"
                        >
                          {copiedArtifact === art.sha256 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>Copy Hash</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Output Summary & Error Details */}
              {(selectedJob.outputSummary || selectedJob.errorDetails) && (
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-2">
                  <div className="text-xs font-mono text-gray-400 flex items-center justify-between">
                    <span>EXECUTION VERDICT</span>
                    <span className={`font-bold ${selectedJob.exitCode === 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      EXIT CODE: {selectedJob.exitCode !== undefined ? selectedJob.exitCode : 'IN PROGRESS'}
                    </span>
                  </div>
                  {selectedJob.outputSummary && (
                    <p className="text-xs text-gray-300 leading-relaxed font-sans">
                      {selectedJob.outputSummary}
                    </p>
                  )}
                  {selectedJob.errorDetails && (
                    <p className="text-xs text-red-400 bg-red-950/20 border border-red-900/40 p-2.5 rounded-lg font-mono">
                      {selectedJob.errorDetails}
                    </p>
                  )}
                </div>
              )}

              {/* Live Logs Console */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Real-time Standard Output & Audit Logs</span>
                  </span>
                  <span className="text-[10px] text-gray-500">{selectedJob.logs.length} entries</span>
                </div>
                <div className="bg-black/80 rounded-xl p-3 font-mono text-[11px] text-gray-300 h-40 overflow-y-auto space-y-1 border border-gray-800">
                  {selectedJob.logs.map((log, i) => (
                    <div key={i} className="leading-relaxed hover:bg-white/5 px-1 rounded">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center text-center p-6 border border-dashed border-gray-800 rounded-2xl text-gray-500">
              <Zap className="w-8 h-8 text-gray-600 mb-2" />
              <p className="text-xs font-mono">Select a job from the journal to view deep lifecycle telemetry and step logs.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
