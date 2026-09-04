import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Sliders, 
  Play, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Search, 
  Filter, 
  Plus, 
  ArrowRight, 
  Cpu, 
  Activity, 
  Key, 
  Sparkles, 
  Globe, 
  RefreshCw,
  Terminal,
  Zap
} from 'lucide-react';
import { INITIAL_POLICIES } from '../data/policyEngineData';
import { 
  NetworkPolicyRule, 
  PolicyAction, 
  PolicyProtocol, 
  PolicySimulationRequest, 
  PolicySimulationResult 
} from '../types/policyEngine';

export function FtnPolicyEngine() {
  const [policies, setPolicies] = useState<NetworkPolicyRule[]>(INITIAL_POLICIES);
  const [selectedPolicy, setSelectedPolicy] = useState<NetworkPolicyRule | null>(INITIAL_POLICIES[0]);
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Interactive Simulator State
  const [simSourceIp, setSimSourceIp] = useState<string>('10.100.1.5');
  const [simSourceZone, setSimSourceZone] = useState<string>('MGMT_CORE');
  const [simUserRole, setSimUserRole] = useState<string>('Super Admin');
  const [simDestHost, setSimDestHost] = useState<string>('admin.familytimenet.com');
  const [simDestPort, setSimDestPort] = useState<number>(8443);
  const [simProtocol, setSimProtocol] = useState<PolicyProtocol>('HTTPS');
  const [simHasMtls, setSimHasMtls] = useState<boolean>(true);
  const [simThreatScore, setSimThreatScore] = useState<number>(5);
  const [simResult, setSimResult] = useState<PolicySimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // New Policy Modal
  const [showNewModal, setShowNewModal] = useState<boolean>(false);
  const [newRuleName, setNewRuleName] = useState<string>('');
  const [newRuleDesc, setNewRuleDesc] = useState<string>('');
  const [newPriority, setNewPriority] = useState<number>(25);
  const [newAction, setNewAction] = useState<PolicyAction>('permit');
  const [newDestService, setNewDestService] = useState<string>('api.familytimenet.com');
  const [newDestPort, setNewDestPort] = useState<string>('443');
  const [newIamRole, setNewIamRole] = useState<string>('Engineer');

  const filteredPolicies = policies.filter(pol => {
    const matchesAction = actionFilter === 'all' || pol.action === actionFilter;
    const matchesSearch = 
      pol.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pol.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pol.destination.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      pol.source.iamRoles.some(r => r.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesAction && matchesSearch;
  });

  const handleToggleRule = (id: string) => {
    setPolicies(prev =>
      prev.map(p => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      // Evaluate rules sorted by priority
      const sorted = [...policies].sort((a, b) => a.priority - b.priority);
      const evalSteps: PolicySimulationResult['evaluationSteps'] = [];
      let matchedRule: NetworkPolicyRule | null = null;

      for (const rule of sorted) {
        if (!rule.enabled) {
          evalSteps.push({
            ruleNumber: rule.ruleNumber,
            ruleName: rule.name,
            priority: rule.priority,
            matched: false,
            reason: 'Rule disabled by operator',
          });
          continue;
        }

        // Check source zone / roles
        const roleMatches = rule.source.iamRoles.includes(simUserRole) || rule.source.iamRoles.includes('Public');
        const mTLSMatches = !rule.conditions.requireMtls || simHasMtls;
        const threatMatches = rule.conditions.maxThreatScore === undefined || simThreatScore <= rule.conditions.maxThreatScore;
        const serviceMatches = rule.destination.services.includes('*') || rule.destination.services.includes(simDestHost);

        if (roleMatches && mTLSMatches && threatMatches && serviceMatches) {
          matchedRule = rule;
          evalSteps.push({
            ruleNumber: rule.ruleNumber,
            ruleName: rule.name,
            priority: rule.priority,
            matched: true,
            reason: `Matched criteria: Role '${simUserRole}', Service '${simDestHost}', Threat Score ${simThreatScore} <= limit.`,
          });
          break;
        } else {
          evalSteps.push({
            ruleNumber: rule.ruleNumber,
            ruleName: rule.name,
            priority: rule.priority,
            matched: false,
            reason: !roleMatches 
              ? `IAM Role '${simUserRole}' not in allowed list [${rule.source.iamRoles.join(', ')}]`
              : !mTLSMatches 
              ? 'Failed mTLS client certificate verification requirement'
              : !threatMatches 
              ? `Threat score ${simThreatScore} exceeded threshold`
              : `Destination host '${simDestHost}' did not match rule target`,
          });
        }
      }

      const verdict = matchedRule ? matchedRule.action : 'deny';
      const allowed = verdict === 'permit' || verdict === 'rate_limit';

      setSimResult({
        allowed,
        verdict,
        matchedRuleId: matchedRule?.id,
        matchedRuleName: matchedRule?.name,
        evaluationSteps: evalSteps,
        appliedEnforcementLayer: matchedRule ? matchedRule.enforcementLayer : 'Linux Conntrack Drop',
        latencyMicroseconds: 14 + Math.floor(Math.random() * 8),
      });
      setIsSimulating(false);
    }, 400);
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName) return;

    const created: NetworkPolicyRule = {
      id: `pol-rule-${Date.now()}`,
      ruleNumber: Math.floor(newPriority),
      name: newRuleName,
      description: newRuleDesc || 'Custom network policy defined in Control Plane.',
      priority: newPriority,
      enabled: true,
      source: {
        zone: 'MGMT_CORE',
        iamRoles: [newIamRole],
      },
      destination: {
        zone: 'CONTROL_PLANE',
        services: [newDestService],
        ports: newDestPort,
        protocol: 'HTTPS',
      },
      conditions: {
        requireMtls: true,
        minTlsVersion: '1.3',
      },
      action: newAction,
      enforcementLayer: 'eBPF/XDP Kernel',
      hitCount: 0,
      version: 1,
      updatedBy: 'Kamrul Bepary',
      updatedAt: new Date().toISOString(),
    };

    const updated = [created, ...policies].sort((a, b) => a.priority - b.priority);
    setPolicies(updated);
    setSelectedPolicy(created);
    setShowNewModal(false);
    setNewRuleName('');
    setNewRuleDesc('');
  };

  const getActionBadge = (action: PolicyAction) => {
    switch (action) {
      case 'permit':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">PERMIT</span>;
      case 'rate_limit':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/20">RATE LIMIT</span>;
      case 'deny':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">DENY</span>;
      case 'divert_honeypot':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">DIVERT HONEYPOT</span>;
      default:
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-400">{action.toUpperCase()}</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Executive Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-900/90 to-[#071322] border border-gray-800 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00f0ff]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] text-xs font-mono">
              <Shield className="w-3.5 h-3.5" />
              <span>FTN ZERO-TRUST POLICY ENGINE • IAM/RBAC INTEGRATION</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
              Network-Wide Access Policy Engine
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              Enforces sub-microsecond eBPF/XDP and Envoy mesh access rules bound directly to FTN IAM & RBAC roles. Controls service-to-service isolation, mTLS enforcement, and automated honeypot diversions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNewModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00ff66] to-[#00f0ff] hover:brightness-110 text-gray-950 font-bold text-xs transition-all shadow-lg"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Access Policy</span>
            </button>
          </div>
        </div>

        {/* Global Policy Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-800/60">
          <div className="bg-gray-950/40 rounded-xl p-3.5 border border-gray-800/40">
            <div className="text-[11px] text-gray-400 font-mono">ACTIVE POLICY RULES</div>
            <div className="text-xl font-display font-bold text-white mt-0.5 flex items-center gap-2">
              <span>{policies.filter(p => p.enabled).length} Rules</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">Enforced</span>
            </div>
          </div>
          <div className="bg-gray-950/40 rounded-xl p-3.5 border border-gray-800/40">
            <div className="text-[11px] text-gray-400 font-mono">KERNEL ENFORCEMENT</div>
            <div className="text-xl font-display font-bold text-[#00f0ff] mt-0.5 flex items-center gap-2">
              <span>eBPF / XDP</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-[#00f0ff]/10 text-[#00f0ff] font-mono">0.01ms</span>
            </div>
          </div>
          <div className="bg-gray-950/40 rounded-xl p-3.5 border border-gray-800/40">
            <div className="text-[11px] text-gray-400 font-mono">IAM ROLE TIERS</div>
            <div className="text-xl font-display font-bold text-white mt-0.5 flex items-center gap-2">
              <span>8 Tiers</span>
              <span className="text-xs text-gray-400 font-normal">SuperAdmin to Public</span>
            </div>
          </div>
          <div className="bg-gray-950/40 rounded-xl p-3.5 border border-gray-800/40">
            <div className="text-[11px] text-gray-400 font-mono">24H ENFORCED PACKETS</div>
            <div className="text-xl font-display font-bold text-emerald-400 mt-0.5">
              5.2M Evaluated
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Policy Simulator Drawer */}
      <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#00f0ff]" />
            <h3 className="text-sm font-bold text-white">
              Dry-Run Policy Evaluation Simulator
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-300">
              Deterministic eBPF Pipeline
            </span>
          </div>
          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#00f0ff] hover:bg-[#00f0ff]/90 text-gray-950 font-bold text-xs transition-all shadow"
          >
            <Play className={`w-3 h-3 fill-current ${isSimulating ? 'animate-spin' : ''}`} />
            <span>Simulate Evaluation</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          <div>
            <label className="text-gray-400 block mb-1 text-[11px]">USER IAM ROLE</label>
            <select
              value={simUserRole}
              onChange={(e) => setSimUserRole(e.target.value)}
              className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00f0ff]"
            >
              <option value="Super Admin">Super Admin</option>
              <option value="NOC">NOC</option>
              <option value="Engineer">Engineer</option>
              <option value="Employee">Employee</option>
              <option value="Customer">Customer</option>
              <option value="Public">Public (Unauthenticated)</option>
            </select>
          </div>

          <div>
            <label className="text-gray-400 block mb-1 text-[11px]">TARGET SERVICE</label>
            <select
              value={simDestHost}
              onChange={(e) => setSimDestHost(e.target.value)}
              className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00f0ff]"
            >
              <option value="admin.familytimenet.com">admin.familytimenet.com</option>
              <option value="ai.familytimenet.com">ai.familytimenet.com</option>
              <option value="olt.familytimenet.com">olt.familytimenet.com</option>
              <option value="dns.familytimenet.com">dns.familytimenet.com</option>
              <option value="connect.familytimenet.com">connect.familytimenet.com</option>
              <option value="api.familytimenet.com">api.familytimenet.com</option>
            </select>
          </div>

          <div>
            <label className="text-gray-400 block mb-1 text-[11px]">mTLS CLIENT CERT</label>
            <button
              onClick={() => setSimHasMtls(!simHasMtls)}
              className={`w-full py-2 px-3 rounded-xl border text-left transition-all ${
                simHasMtls 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                  : 'bg-red-500/10 border-red-500/30 text-red-300'
              }`}
            >
              {simHasMtls ? '✓ mTLS Verified (Present)' : '✕ Missing mTLS Cert'}
            </button>
          </div>

          <div>
            <label className="text-gray-400 block mb-1 text-[11px]">THREAT INTEL SCORE (0-100)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={simThreatScore}
              onChange={(e) => setSimThreatScore(parseInt(e.target.value, 10))}
              className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00f0ff]"
            />
          </div>
        </div>

        {/* Simulation Output Card */}
        {simResult && (
          <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">SIMULATION VERDICT:</span>
                <span className={`font-bold px-2 py-0.5 rounded text-xs ${
                  simResult.allowed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {simResult.verdict.toUpperCase()}
                </span>
                <span className="text-gray-500">
                  (Latency: {simResult.latencyMicroseconds} µs)
                </span>
              </div>
              <span className="text-gray-400 text-[11px]">
                Enforced by: <span className="text-[#00f0ff]">{simResult.appliedEnforcementLayer}</span>
              </span>
            </div>

            <div className="space-y-1 text-[11px]">
              <div className="text-gray-400 font-semibold mb-1">EVALUATION PIPELINE STEPS:</div>
              {simResult.evaluationSteps.map((step, idx) => (
                <div key={idx} className={`p-1.5 rounded flex items-center justify-between ${step.matched ? 'bg-emerald-950/30 text-emerald-300' : 'bg-black/30 text-gray-500'}`}>
                  <span>#{step.ruleNumber} {step.ruleName}</span>
                  <span>{step.reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> ACTION:
          </span>
          {['all', 'permit', 'rate_limit', 'deny', 'divert_honeypot'].map((act) => (
            <button
              key={act}
              onClick={() => setActionFilter(act)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                actionFilter === act
                  ? 'bg-[#00f0ff]/15 text-[#00f0ff] border border-[#00f0ff]/40'
                  : 'bg-gray-900/80 text-gray-400 hover:text-gray-200 border border-gray-800'
              }`}
            >
              {act === 'all' ? 'All Actions' : act.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rules, services, roles..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-900 border border-gray-800 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#00f0ff]"
          />
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Rules List */}
        <div className="lg:col-span-6 space-y-3">
          {filteredPolicies.map((policy) => {
            const isSelected = selectedPolicy?.id === policy.id;
            return (
              <div
                key={policy.id}
                onClick={() => setSelectedPolicy(policy)}
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
                        PRIORITY #{policy.priority}
                      </span>
                      {getActionBadge(policy.action)}
                      <span className="text-[10px] font-mono text-gray-500">
                        {policy.enforcementLayer}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-white leading-snug">
                      {policy.name}
                    </h3>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleRule(policy.id);
                    }}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all border ${
                      policy.enabled
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-gray-800 text-gray-500 border-gray-700'
                    }`}
                  >
                    {policy.enabled ? 'ACTIVE' : 'DISABLED'}
                  </button>
                </div>

                <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                  {policy.description}
                </p>

                {/* Target Services & Roles */}
                <div className="flex flex-wrap items-center justify-between mt-3 pt-2.5 border-t border-gray-800/50 text-[11px] font-mono text-gray-400 gap-2">
                  <div className="flex items-center gap-1 text-[#00f0ff]">
                    <span>Target: {policy.destination.services.join(', ')}</span>
                  </div>
                  <div className="text-gray-400">
                    Roles: {policy.source.iamRoles.join(', ')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Policy Deep Inspector */}
        <div className="lg:col-span-6 space-y-4">
          {selectedPolicy ? (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6 shadow-2xl">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-mono">
                      RULE #{selectedPolicy.ruleNumber} • PRIORITY {selectedPolicy.priority}
                    </span>
                    {getActionBadge(selectedPolicy.action)}
                  </div>
                  <h2 className="text-lg font-display font-bold text-white mt-1">
                    {selectedPolicy.name}
                  </h2>
                </div>
                <div className="text-right font-mono text-xs text-gray-400">
                  <span>Hits: {selectedPolicy.hitCount.toLocaleString()}</span>
                </div>
              </div>

              {/* Source & Destination Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-gray-950 p-3 rounded-xl border border-gray-800 space-y-1">
                  <span className="text-gray-500 text-[10px] block">SOURCE IDENTITY (IAM/RBAC)</span>
                  <div className="text-white font-semibold">Zone: {selectedPolicy.source.zone}</div>
                  <div className="text-gray-400">
                    Roles: <span className="text-[#00f0ff]">{selectedPolicy.source.iamRoles.join(', ')}</span>
                  </div>
                  {selectedPolicy.source.cidr && (
                    <div className="text-gray-500 text-[10px]">CIDR: {selectedPolicy.source.cidr}</div>
                  )}
                </div>

                <div className="bg-gray-950 p-3 rounded-xl border border-gray-800 space-y-1">
                  <span className="text-gray-500 text-[10px] block">DESTINATION SERVICE</span>
                  <div className="text-white font-semibold">Zone: {selectedPolicy.destination.zone}</div>
                  <div className="text-emerald-400 truncate">
                    {selectedPolicy.destination.services.join(', ')}
                  </div>
                  <div className="text-gray-500 text-[10px]">
                    Ports: {selectedPolicy.destination.ports} ({selectedPolicy.destination.protocol})
                  </div>
                </div>
              </div>

              {/* Enforcement Layer & Conditions */}
              <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-2 text-xs font-mono">
                <div className="text-gray-400 font-semibold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-[#00f0ff]" />
                    <span>ENFORCEMENT CONDITIONS & LAYER</span>
                  </span>
                  <span className="text-[#00ff66]">{selectedPolicy.enforcementLayer}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-gray-300 pt-1 text-[11px]">
                  <div><span className="text-gray-500">Require mTLS:</span> {selectedPolicy.conditions.requireMtls ? 'Yes (Strict)' : 'No'}</div>
                  <div><span className="text-gray-500">Min TLS Version:</span> {selectedPolicy.conditions.minTlsVersion || '1.3'}</div>
                  <div><span className="text-gray-500">Max Threat Score:</span> {selectedPolicy.conditions.maxThreatScore ?? 'Any'}</div>
                  <div><span className="text-gray-500">FIDO2 MFA:</span> {selectedPolicy.conditions.requireFido2Mfa ? 'Required' : 'Optional'}</div>
                  {selectedPolicy.rateLimit && (
                    <div className="col-span-2 text-amber-400">
                      Rate Limit: {selectedPolicy.rateLimit.requestsPerSecond} req/sec (Burst: {selectedPolicy.rateLimit.burst})
                    </div>
                  )}
                </div>
              </div>

              {/* Metadata footer */}
              <div className="text-[11px] font-mono text-gray-500 flex items-center justify-between pt-2 border-t border-gray-800/60">
                <span>Version {selectedPolicy.version} • Author: {selectedPolicy.updatedBy}</span>
                <span>Last Modified: {new Date(selectedPolicy.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center text-center p-6 border border-dashed border-gray-800 rounded-2xl text-gray-500">
              <Shield className="w-8 h-8 text-gray-600 mb-2" />
              <p className="text-xs font-mono">Select an access policy to inspect enforcement layers, IAM mappings, and kernel rate-limits.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Policy Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateRule} className="bg-gray-900 border border-gray-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#00f0ff]" />
                <span>Create Network Access Policy</span>
              </h3>
              <button type="button" onClick={() => setShowNewModal(false)} className="text-gray-500 hover:text-gray-300 text-sm">✕</button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-gray-400 mb-1">POLICY RULE NAME</label>
                <input
                  type="text"
                  required
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  placeholder="e.g. Partner API B2B Rate-Limiting Policy"
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">PRIORITY (1-100)</label>
                  <input
                    type="number"
                    value={newPriority}
                    onChange={(e) => setNewPriority(parseInt(e.target.value, 10))}
                    className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00f0ff]"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">ACTION</label>
                  <select
                    value={newAction}
                    onChange={(e) => setNewAction(e.target.value as any)}
                    className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00f0ff]"
                  >
                    <option value="permit">PERMIT</option>
                    <option value="rate_limit">RATE LIMIT</option>
                    <option value="deny">DENY</option>
                    <option value="divert_honeypot">DIVERT HONEYPOT</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">IAM ROLE</label>
                  <select
                    value={newIamRole}
                    onChange={(e) => setNewIamRole(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00f0ff]"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="NOC">NOC</option>
                    <option value="Engineer">Engineer</option>
                    <option value="Employee">Employee</option>
                    <option value="Customer">Customer</option>
                    <option value="Public">Public</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">DESTINATION SERVICE</label>
                  <input
                    type="text"
                    value={newDestService}
                    onChange={(e) => setNewDestService(e.target.value)}
                    placeholder="api.familytimenet.com"
                    className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00f0ff]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00ff66] to-[#00f0ff] hover:brightness-110 text-gray-950 font-bold text-xs transition-all shadow-lg mt-2"
              >
                Compile & Enforce Policy to Kernel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
