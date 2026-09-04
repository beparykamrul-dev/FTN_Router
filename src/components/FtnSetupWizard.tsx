import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  ExternalLink,
  Shield,
  Key,
  Database,
  Network,
  Cpu,
  BrainCircuit,
  Terminal,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  ChevronRight,
  AlertTriangle,
  FileText,
  Lock,
  Server,
  Zap,
  Check,
  Copy,
  Info
} from 'lucide-react';
import { cn } from '../utils';

export interface SetupStep {
  id: string;
  phaseId: 'iam' | 'pki' | 'registry' | 'ztna' | 'telemetry';
  title: string;
  description: string;
  criticality: 'CRITICAL' | 'HIGH' | 'RECOMMENDED';
  estimatedMinutes: number;
  completed: boolean;
  targetTab: string;
  targetTabName: string;
  commandSnippet: string;
  validationCheck: string;
  docsUrl?: string;
}

export interface SetupPhase {
  id: 'iam' | 'pki' | 'registry' | 'ztna' | 'telemetry';
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  targetDashboard: string;
  dashboardName: string;
  steps: SetupStep[];
}

const INITIAL_PHASES: SetupPhase[] = [
  {
    id: 'iam',
    title: '1. Identity & Access Management (IAM)',
    subtitle: 'Zero Trust authentication, root administrative keyrings, and multi-tier RBAC policies.',
    icon: Key,
    color: '#f59e0b',
    targetDashboard: 'access-control',
    dashboardName: 'Access Control Matrix',
    steps: [
      {
        id: 'iam-01',
        phaseId: 'iam',
        title: 'Bootstrap Super Admin Credentials & Ed25519 Root Key',
        description: 'Initialize primary administrative identity, enforce hardware MFA (WebAuthn/FIDO2), and generate cryptographic identity seed.',
        criticality: 'CRITICAL',
        estimatedMinutes: 3,
        completed: true,
        targetTab: 'access-control',
        targetTabName: 'Access Control Matrix',
        commandSnippet: 'ftnctl iam bootstrap --role=superadmin --mfa=fido2 --key-type=ed25519',
        validationCheck: 'Verify active SuperAdmin session token with signature integrity'
      },
      {
        id: 'iam-02',
        phaseId: 'iam',
        title: 'Configure Tiered RBAC Policies (NOC, Auditor, Operator)',
        description: 'Define authorization boundaries for NOC engineers, security auditors, automated AI agents, and carrier subscriber support.',
        criticality: 'CRITICAL',
        estimatedMinutes: 5,
        completed: true,
        targetTab: 'access-control',
        targetTabName: 'RBAC Policy Engine',
        commandSnippet: 'ftnctl iam apply-roles --policy=/etc/ftn/rbac/carrier-matrix.yaml',
        validationCheck: 'Verify permissions isolation across 4 system security rings'
      },
      {
        id: 'iam-03',
        phaseId: 'iam',
        title: 'Establish SSO & OAuth2/OIDC Federation Bridge',
        description: 'Connect enterprise directory service (Active Directory / Keycloak / Google Workspace) for unified workforce authentication.',
        criticality: 'HIGH',
        estimatedMinutes: 8,
        completed: false,
        targetTab: 'shared-auth',
        targetTabName: 'Shared Auth Portal',
        commandSnippet: 'ftnctl sso configure-provider --oidc-issuer=https://auth.familytimenet.com',
        validationCheck: 'Simulate callback test with synthetic bearer assertion token'
      }
    ]
  },
  {
    id: 'pki',
    title: '2. Enterprise PKI & Mutual TLS (mTLS)',
    subtitle: 'Self-sovereign Root CA, automated certificate enrollment, and node key rotation.',
    icon: Lock,
    color: '#00f0ff',
    targetDashboard: 'pki-manager',
    dashboardName: 'Enterprise PKI Manager',
    steps: [
      {
        id: 'pki-01',
        phaseId: 'pki',
        title: 'Initialize FTN Sovereign Root CA & Intermediate Issuers',
        description: 'Generate 4096-bit RSA or Ed25519 root authority in encrypted HSM vault for signing all cluster and router identities.',
        criticality: 'CRITICAL',
        estimatedMinutes: 4,
        completed: true,
        targetTab: 'pki-manager',
        targetTabName: 'PKI Key Vault',
        commandSnippet: 'ftnctl pki init-ca --common-name="FTN Sovereign Root CA v3" --algo=ed25519',
        validationCheck: 'Inspect root CA public fingerprint and revocation endpoint'
      },
      {
        id: 'pki-02',
        phaseId: 'pki',
        title: 'Issue Wildcard SSL/TLS via ACME RFC 8555',
        description: 'Automate DNS-01 challenge issuance for *.familytimenet.com and edge carrier hostnames via PowerDNS integration.',
        criticality: 'HIGH',
        estimatedMinutes: 4,
        completed: false,
        targetTab: 'pki-manager',
        targetTabName: 'Certificate Manager',
        commandSnippet: 'ftnctl pki issue-wildcard --domain="*.familytimenet.com" --provider=powerdns',
        validationCheck: 'Verify OCSP stapling response on edge TLS terminator'
      },
      {
        id: 'pki-03',
        phaseId: 'pki',
        title: 'Distribute Client Certs for Router-to-Router mTLS',
        description: 'Install cryptographic device certificates on all MikroTik CHR edge nodes and BGP routing daemons.',
        criticality: 'CRITICAL',
        estimatedMinutes: 6,
        completed: false,
        targetTab: 'crypto-pki',
        targetTabName: 'Crypto PKI Node Sync',
        commandSnippet: 'ftnctl pki distribute-mtls --cluster=mesh-global --reload-daemons',
        validationCheck: 'Perform mTLS handshake verification across all 30 mesh servers'
      }
    ]
  },
  {
    id: 'registry',
    title: '3. Core Service Registry & Discovery',
    subtitle: 'Central service catalog, microservice health probes, and Anycast routing endpoints.',
    icon: Database,
    color: '#3b82f6',
    targetDashboard: 'service-registry',
    dashboardName: 'Service Registry',
    steps: [
      {
        id: 'reg-01',
        phaseId: 'registry',
        title: 'Register Core Network Services & Ingress Routes',
        description: 'Catalog primary carrier microservices: Core NOC, PowerDNS, WireGuard Mesh, Billing API, and NetFlow Engine.',
        criticality: 'CRITICAL',
        estimatedMinutes: 5,
        completed: true,
        targetTab: 'service-registry',
        targetTabName: 'Service Registry Catalog',
        commandSnippet: 'ftnctl registry sync --manifest=/etc/ftn/services.manifest.json',
        validationCheck: 'Verify all 12 core services respond with HTTP 200 or gRPC Serving'
      },
      {
        id: 'reg-02',
        phaseId: 'registry',
        title: 'Configure Liveness & Readiness Probes',
        description: 'Establish automated sub-second health probing with circuit breaker thresholding and auto-draining.',
        criticality: 'HIGH',
        estimatedMinutes: 4,
        completed: false,
        targetTab: 'service-registry',
        targetTabName: 'Health Probe Engine',
        commandSnippet: 'ftnctl registry probe-test --interval=5s --failure-threshold=3',
        validationCheck: 'Run synthetic container fault injection test'
      },
      {
        id: 'reg-03',
        phaseId: 'registry',
        title: 'Bind Endpoints to Global Anycast DNS Zones',
        description: 'Publish registered service endpoints to global Anycast BGP DNS nodes for zero-latency client routing.',
        criticality: 'HIGH',
        estimatedMinutes: 5,
        completed: false,
        targetTab: 'dns-platform',
        targetTabName: 'DNS Platform Mesh',
        commandSnippet: 'ftnctl dns bind-services --zone=familytimenet.com --anycast-asn=64512',
        validationCheck: 'Query authoritative name servers from 5 global continents'
      }
    ]
  },
  {
    id: 'ztna',
    title: '4. Zero Trust SD-WAN & WireGuard Mesh',
    subtitle: 'Kernel-level WireGuard tunneling, eBPF XDP firewalls, and multi-region overlay routing.',
    icon: Network,
    color: '#00ff66',
    targetDashboard: 'zerotrust-gateway',
    dashboardName: 'Zero Trust Gateway',
    steps: [
      {
        id: 'ztna-01',
        phaseId: 'ztna',
        title: 'Initialize WireGuard Kernel Overlays & ChaCha20 Keys',
        description: 'Spawn wg0 and wg-mesh virtual interfaces across core, edge, and cloud datacenters with anti-replay counters.',
        criticality: 'CRITICAL',
        estimatedMinutes: 6,
        completed: false,
        targetTab: 'zerotrust-gateway',
        targetTabName: 'ZTNA Tunnel Matrix',
        commandSnippet: 'ftnctl ztna init-mesh --cipher=chacha20poly1305 --keepalive=25',
        validationCheck: 'Confirm cryptographic tunnel handshake with latency < 35ms'
      },
      {
        id: 'ztna-02',
        phaseId: 'ztna',
        title: 'Arm eBPF XDP DDoS Shield & Stateful Packet Inspection',
        description: 'Load high-performance eBPF filters directly into network card driver hook for wire-speed attack mitigation.',
        criticality: 'CRITICAL',
        estimatedMinutes: 5,
        completed: false,
        targetTab: 'sdwan-controller',
        targetTabName: 'Autonomous SD-WAN',
        commandSnippet: 'ftnctl xdp load --program=/etc/ftn/ebpf/xdp_ddos_filter.o --mode=native',
        validationCheck: 'Verify packet drop rate under simulated 10M pps SYN flood'
      }
    ]
  },
  {
    id: 'telemetry',
    title: '5. AI Predictive Telemetry & Auto-Healing',
    subtitle: 'SiLK/YAF IPFIX collectors, anomaly detection models, and autonomous NOC remediation.',
    icon: BrainCircuit,
    color: '#a855f7',
    targetDashboard: 'incident-correlator',
    dashboardName: 'AI Incident Correlator',
    steps: [
      {
        id: 'tel-01',
        phaseId: 'telemetry',
        title: 'Connect SiLK / YAF NetFlow Exporters to Collector',
        description: 'Stream uncompressed IPFIX flows from edge routers into memory-mapped ring buffers for forensic analysis.',
        criticality: 'HIGH',
        estimatedMinutes: 5,
        completed: false,
        targetTab: 'netflow-collector',
        targetTabName: 'NetFlow & IPFIX Collector',
        commandSnippet: 'ftnctl netflow start-exporter --host=10.0.0.10:2055 --format=ipfix',
        validationCheck: 'Inspect live flow ingestion rate (> 50,000 flows/sec)'
      },
      {
        id: 'tel-02',
        phaseId: 'telemetry',
        title: 'Calibrate AI Anomaly Predictor & Healing Playbooks',
        description: 'Activate Gemini-powered network cognitive engine with pre-authorized runbooks for link failover and BGP route deflection.',
        criticality: 'RECOMMENDED',
        estimatedMinutes: 8,
        completed: false,
        targetTab: 'incident-correlator',
        targetTabName: 'AI Incident Correlator',
        commandSnippet: 'ftnctl ai calibrate-model --lookback=7d --confidence-threshold=0.92',
        validationCheck: 'Run dry-run simulation of route failover playbook'
      }
    ]
  }
];

export function FtnSetupWizard({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [phases, setPhases] = useState<SetupPhase[]>(() => {
    const saved = localStorage.getItem('ftn_setup_wizard_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_PHASES;
      }
    }
    return INITIAL_PHASES;
  });

  const [activePhaseId, setActivePhaseId] = useState<'iam' | 'pki' | 'registry' | 'ztna' | 'telemetry'>('iam');
  const [executingStepId, setExecutingStepId] = useState<string | null>(null);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    '[INIT] FTN Autonomous Grid Onboarding Session Bootstrapped.',
    '[READY] Connected to Master Cluster: ftn-core-01.mgmt.lan (10.0.0.1)',
    '[STATUS] IAM SuperAdmin bootstrapped. Awaiting administrator checklist completion.'
  ]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('ftn_setup_wizard_state', JSON.stringify(phases));
  }, [phases]);

  // Calculations
  const allSteps = phases.flatMap(p => p.steps);
  const completedSteps = allSteps.filter(s => s.completed);
  const progressPercent = Math.round((completedSteps.length / allSteps.length) * 100);
  const remainingTimeMinutes = allSteps
    .filter(s => !s.completed)
    .reduce((acc, s) => acc + s.estimatedMinutes, 0);

  const activePhase = phases.find(p => p.id === activePhaseId) || phases[0];

  const toggleStep = (stepId: string) => {
    setPhases(prev =>
      prev.map(phase => ({
        ...phase,
        steps: phase.steps.map(step => {
          if (step.id === stepId) {
            const nextCompleted = !step.completed;
            addLog(`[ACTION] Step "${step.title}" marked as ${nextCompleted ? 'COMPLETED' : 'PENDING'}.`);
            return { ...step, completed: nextCompleted };
          }
          return step;
        })
      }))
    );
  };

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setConsoleLogs(prev => [...prev.slice(-40), `[${timestamp}] ${msg}`]);
  };

  const handleSimulateExecution = (step: SetupStep) => {
    if (executingStepId) return;
    setExecutingStepId(step.id);
    addLog(`[EXEC] Dispatching: ${step.commandSnippet}`);

    window.dispatchEvent(
      new CustomEvent('add-toast', {
        detail: {
          type: 'info',
          title: `Executing: ${step.title}`,
          message: 'Running live initialization command and validation checks...'
        }
      })
    );

    setTimeout(() => {
      addLog(`[PASS] Validation check successful: "${step.validationCheck}"`);
      addLog(`[SUCCESS] Service configured and verified across cluster.`);

      setPhases(prev =>
        prev.map(phase => ({
          ...phase,
          steps: phase.steps.map(s => (s.id === step.id ? { ...s, completed: true } : s))
        }))
      );

      setExecutingStepId(null);

      window.dispatchEvent(
        new CustomEvent('add-toast', {
          detail: {
            type: 'success',
            title: `Initialized: ${step.title}`,
            message: 'All verification probes passed. Service is now operating cleanly.'
          }
        })
      );
    }, 2000);
  };

  const handleRunAllInPhase = (phase: SetupPhase) => {
    addLog(`[BATCH] Running automated provisioning for Phase: ${phase.title}`);
    window.dispatchEvent(
      new CustomEvent('add-toast', {
        detail: {
          type: 'info',
          title: `Batch Provisioning: ${phase.title}`,
          message: 'Applying configuration manifests across all phase requirements...'
        }
      })
    );

    setTimeout(() => {
      setPhases(prev =>
        prev.map(p =>
          p.id === phase.id
            ? { ...p, steps: p.steps.map(s => ({ ...s, completed: true })) }
            : p
        )
      );
      addLog(`[BATCH SUCCESS] All steps in ${phase.title} have been validated.`);
      window.dispatchEvent(
        new CustomEvent('add-toast', {
          detail: {
            type: 'success',
            title: `Phase Complete: ${phase.title}`,
            message: 'All critical parameters verified and synchronized.'
          }
        })
      );
    }, 1800);
  };

  const handleResetChecklist = () => {
    if (confirm('Are you sure you want to reset the setup wizard progress?')) {
      setPhases(INITIAL_PHASES);
      localStorage.removeItem('ftn_setup_wizard_state');
      addLog('[RESET] Setup checklist returned to default bootstrap state.');
    }
  };

  const handleCopyCommand = (cmd: string, id: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Deployment Progress Tracker */}
      <div className="bg-gradient-to-br from-[#091122] via-[#0b1730] to-[#080e1c] border border-gray-800/90 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-[#00ff66]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00f0ff] to-[#00ff66] flex items-center justify-center text-gray-950 shadow-[0_0_25px_rgba(0,240,255,0.4)]">
                <Sparkles className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-black text-white font-display tracking-tight flex items-center gap-3">
                  FTN ADMIN SETUP &amp; ONBOARDING WIZARD
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#00ff66]/15 text-[#00ff66] font-mono border border-[#00ff66]/30">
                    Carrier Deployment v3.8
                  </span>
                </h1>
                <p className="text-gray-300 font-mono text-xs lg:text-sm">
                  Interactive onboarding blueprint for new system administrators: configure IAM, sovereign PKI, service discovery, WireGuard ZTNA, and AI telemetry.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics Header Card */}
          <div className="flex flex-wrap items-center gap-4 bg-gray-950/80 border border-gray-800 rounded-2xl p-4">
            <div className="text-center px-2">
              <span className="text-[10px] text-gray-400 font-mono block uppercase">Progress</span>
              <span className="text-2xl font-black text-[#00ff66] font-mono">{progressPercent}%</span>
            </div>
            <div className="h-10 w-px bg-gray-800" />
            <div className="text-center px-2">
              <span className="text-[10px] text-gray-400 font-mono block uppercase">Steps Completed</span>
              <span className="text-2xl font-black text-white font-mono">
                {completedSteps.length} <span className="text-xs text-gray-500 font-normal">/ {allSteps.length}</span>
              </span>
            </div>
            <div className="h-10 w-px bg-gray-800" />
            <div className="text-center px-2">
              <span className="text-[10px] text-gray-400 font-mono block uppercase">Est. Time Remaining</span>
              <span className="text-2xl font-black text-[#00f0ff] font-mono">{remainingTimeMinutes}m</span>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6 pt-6 border-t border-gray-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-gray-300">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-pulse" />
              Active Deployment Phase: <strong className="text-white">{activePhase.title}</strong>
            </span>
            <span className="text-gray-400">{completedSteps.length} of {allSteps.length} Checklist Items Verified</span>
          </div>
          <div className="w-full h-3 rounded-full bg-gray-900 border border-gray-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#00f0ff] via-[#3b82f6] to-[#00ff66] transition-all duration-700 shadow-[0_0_12px_rgba(0,255,102,0.4)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Left Phase Navigation (4 cols) & Right Active Phase Checklist (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: PHASES TABS */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-gray-400">
              Deployment Phases
            </h2>
            <button
              onClick={handleResetChecklist}
              className="text-[10px] font-mono text-gray-500 hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Progress
            </button>
          </div>

          <div className="space-y-2">
            {phases.map((phase, idx) => {
              const Icon = phase.icon;
              const isSelected = activePhaseId === phase.id;
              const phaseCompleted = phase.steps.every(s => s.completed);
              const phaseDoneCount = phase.steps.filter(s => s.completed).length;

              return (
                <div
                  key={phase.id}
                  onClick={() => setActivePhaseId(phase.id)}
                  className={cn(
                    "p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group",
                    isSelected
                      ? "bg-[#0b1428] border-[#00f0ff]/50 shadow-[0_0_20px_rgba(0,240,255,0.15)] ring-1 ring-[#00f0ff]/30"
                      : "bg-[#080e1c] border-gray-800/80 hover:border-gray-700 hover:bg-[#091122]"
                  )}
                >
                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#00f0ff] to-[#00ff66]" />
                  )}

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 border"
                        style={{
                          backgroundColor: `${phase.color}15`,
                          borderColor: `${phase.color}40`,
                          color: phase.color
                        }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-white font-display group-hover:text-[#00f0ff] transition-colors">
                          {phase.title}
                        </h3>
                        <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5 font-sans">
                          {phase.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end flex-shrink-0">
                      {phaseCompleted ? (
                        <span className="p-1 rounded-full bg-emerald-500/20 text-[#00ff66]">
                          <CheckCircle2 className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700">
                          {phaseDoneCount}/{phase.steps.length}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Deep Link Card */}
          <div className="bg-[#091122] border border-gray-800 p-4 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-300 font-mono">
              <Layers className="w-4 h-4 text-[#00f0ff]" />
              <span>Corresponding Dashboard</span>
            </div>
            <p className="text-xs text-gray-400">
              Directly launch the live configuration console for this phase:
            </p>
            <button
              onClick={() => onNavigate(activePhase.targetDashboard)}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#00f0ff]/15 to-[#00ff66]/15 border border-[#00f0ff]/40 text-[#00f0ff] hover:text-white hover:border-[#00f0ff] flex items-center justify-between text-xs font-mono font-bold transition-all"
            >
              <span>Open {activePhase.dashboardName}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE PHASE STEP CHECKLIST */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#080e1c] border border-gray-800 rounded-3xl p-5 lg:p-6 space-y-6">
            {/* Active Phase Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800/80">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#00f0ff] font-bold">
                  CHECKLIST REQUIREMENTS
                </span>
                <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
                  {activePhase.title}
                </h2>
                <p className="text-xs text-gray-400 font-sans">
                  {activePhase.subtitle}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRunAllInPhase(activePhase)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#00ff66]/20 to-[#00f0ff]/20 border border-[#00ff66]/40 text-[#00ff66] hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Auto-Complete Phase</span>
                </button>
              </div>
            </div>

            {/* Checklist Items */}
            <div className="space-y-4">
              {activePhase.steps.map((step, idx) => {
                const isBusy = executingStepId === step.id;

                return (
                  <div
                    key={step.id}
                    className={cn(
                      "p-4 rounded-2xl border transition-all space-y-3",
                      step.completed
                        ? "bg-[#091522]/50 border-emerald-500/30 ring-1 ring-emerald-500/10"
                        : "bg-[#0a1122] border-gray-800 hover:border-gray-700"
                    )}
                  >
                    {/* Item Top Bar */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleStep(step.id)}
                          className={cn(
                            "w-6 h-6 rounded-lg border flex items-center justify-center transition-all mt-0.5 cursor-pointer flex-shrink-0",
                            step.completed
                              ? "bg-[#00ff66] border-[#00ff66] text-gray-950 shadow-[0_0_10px_rgba(0,255,102,0.4)]"
                              : "bg-gray-900 border-gray-700 text-transparent hover:border-gray-500"
                          )}
                          title={step.completed ? 'Mark as incomplete' : 'Mark as complete'}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-mono text-gray-500 font-bold">
                              STEP {idx + 1}
                            </span>
                            <span
                              className={cn(
                                "text-[9px] font-mono px-2 py-0.2 rounded font-bold uppercase",
                                step.criticality === 'CRITICAL'
                                  ? "bg-red-500/15 text-red-400 border border-red-500/30"
                                  : step.criticality === 'HIGH'
                                  ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                                  : "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                              )}
                            >
                              {step.criticality}
                            </span>
                            <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              ~{step.estimatedMinutes} min
                            </span>
                          </div>

                          <h4
                            className={cn(
                              "text-sm font-bold font-display transition-colors",
                              step.completed ? "text-white line-through decoration-emerald-500/50" : "text-white"
                            )}
                          >
                            {step.title}
                          </h4>
                          <p className="text-xs text-gray-300 leading-relaxed font-sans">
                            {step.description}
                          </p>
                        </div>
                      </div>

                      {/* Deep Link to Tab */}
                      <button
                        onClick={() => onNavigate(step.targetTab)}
                        className="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-[11px] font-mono flex items-center gap-1.5 flex-shrink-0 transition-colors border border-gray-700"
                        title={`Open ${step.targetTabName}`}
                      >
                        <span>Configure in {step.targetTabName}</span>
                        <ArrowRight className="w-3 h-3 text-[#00f0ff]" />
                      </button>
                    </div>

                    {/* Command Snippet & Verification */}
                    <div className="bg-black/80 rounded-xl p-3 border border-gray-800 space-y-2 text-xs font-mono">
                      <div className="flex items-center justify-between text-gray-400 text-[11px]">
                        <span className="flex items-center gap-1.5 text-gray-300">
                          <Terminal className="w-3.5 h-3.5 text-[#00f0ff]" />
                          CLI Provisioning Command:
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyCommand(step.commandSnippet, step.id)}
                            className="text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                          >
                            {copiedId === step.id ? (
                              <>
                                <Check className="w-3 h-3 text-[#00ff66]" />
                                <span className="text-[#00ff66]">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="bg-[#050914] p-2 rounded-lg border border-gray-800/80 text-[#00ff66] overflow-x-auto select-all">
                        <code>$ {step.commandSnippet}</code>
                      </div>

                      {/* Validation rule & Execute Button */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-gray-800/60 text-[11px]">
                        <span className="text-gray-400 flex items-center gap-1">
                          <Info className="w-3 h-3 text-amber-400 flex-shrink-0" />
                          <strong className="text-gray-300">Validation:</strong> {step.validationCheck}
                        </span>

                        <button
                          onClick={() => handleSimulateExecution(step)}
                          disabled={isBusy || step.completed}
                          className={cn(
                            "px-3 py-1 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all text-xs",
                            step.completed
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default"
                              : isBusy
                              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse"
                              : "bg-[#00f0ff] hover:bg-[#00d0df] text-gray-950 shadow-[0_0_12px_rgba(0,240,255,0.3)] cursor-pointer"
                          )}
                        >
                          <Zap className="w-3 h-3" />
                          {step.completed ? 'Verified & Active' : isBusy ? 'Executing Check...' : 'Run Live Verification'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Console / Deployment Audit Logs */}
          <div className="bg-black/90 border border-gray-800 rounded-2xl p-4 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-gray-400 pb-2 border-b border-gray-800 text-[11px]">
              <span className="flex items-center gap-2 text-white font-bold">
                <Terminal className="w-3.5 h-3.5 text-[#00ff66]" />
                SETUP WIZARD AUDIT TERMINAL &amp; LOGS
              </span>
              <button
                onClick={() => setConsoleLogs(['[CLEAR] Console logs cleared. Waiting for actions...'])}
                className="text-gray-500 hover:text-gray-300"
              >
                Clear
              </button>
            </div>
            <div className="max-h-36 overflow-y-auto space-y-1 text-gray-300 text-[11px] scrollbar-thin">
              {consoleLogs.map((log, i) => (
                <div key={i} className="leading-relaxed">
                  <span className={cn(
                    log.includes('[SUCCESS]') || log.includes('[PASS]') ? 'text-[#00ff66]' :
                    log.includes('[EXEC]') || log.includes('[ACTION]') ? 'text-[#00f0ff]' :
                    log.includes('[BATCH]') ? 'text-purple-400' :
                    'text-gray-400'
                  )}>
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
