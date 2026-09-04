import React, { useState } from 'react';
import { 
  Play, RotateCcw, CheckCircle2, AlertTriangle, Terminal, 
  Layers, Server, Activity, ShieldCheck, Clock, FileCode2, 
  GitBranch, Database, Cpu, ArrowRight, Pause, RefreshCw, 
  Sliders, Copy, Check
} from 'lucide-react';
import { cn } from '../utils';

interface AnsiblePlaybook {
  id: string;
  name: string;
  filename: string;
  category: string;
  targetHosts: string;
  description: string;
  lastRun: string;
  status: 'SUCCESS' | 'RUNNING' | 'FAILED' | 'READY';
  stages?: string[];
  stats: { ok: number; changed: number; unreachable: number; failed: number };
  code: string;
}

const PLAYBOOKS: AnsiblePlaybook[] = [
  {
    id: 'pb-canary-bgp',
    name: 'Canary Deployment: BGP EVPN & FRR Route Policy',
    filename: 'canary_bgp_evpn.yml',
    category: 'Canary Deployment',
    targetHosts: 'edge_routers:all',
    description: 'Progressive stage deployment (10% -> 25% -> 50% -> 100%) with automated SLA convergence check and instant rollback.',
    lastRun: '12 minutes ago',
    status: 'SUCCESS',
    stages: ['Stage 1: 10% Canary (Dhaka Edge)', 'Stage 2: 25% Regional (Singapore)', 'Stage 3: 50% Frankfurt', 'Stage 4: 100% Global Core'],
    stats: { ok: 38, changed: 4, unreachable: 0, failed: 0 },
    code: `- name: FTN Autonomous BGP EVPN Canary Rollout
  hosts: edge_routers
  serial: "25%"
  max_fail_percentage: 0
  tasks:
    - name: Pre-flight BGP Convergence SLA Check
      ansible.builtin.command: vtysh -c "show bgp summary"
      register: pre_check
      failed_when: "'Established' not in pre_check.stdout"

    - name: Template Candidate FRR Route Maps
      ansible.builtin.template:
        src: templates/frr_evpn.conf.j2
        dest: /etc/frr/frr.conf
      notify: Reload FRR Service

    - name: Validate Post-deployment Latency & Jitter SLA
      ansible.builtin.shell: |
        ping -c 5 -W 1 10.240.0.1 | awk -F'/' 'END{ print ($5 < 5.0) ? "PASS" : "FAIL" }'
      register: latency_test
      failed_when: "'PASS' not in latency_test.stdout"`
  },
  {
    id: 'pb-oom-tuning',
    name: 'Kernel Stability: OOM Killer Tuning & Panic Prevention',
    filename: 'kernel_oom_prevention.yml',
    category: 'Kernel Hardening',
    targetHosts: 'all_nodes',
    description: 'Enforces sysctl memory limits, vm.panic_on_oom=0, and protects routing daemons with oom_score_adj=-1000.',
    lastRun: '2 hours ago',
    status: 'SUCCESS',
    stats: { ok: 24, changed: 0, unreachable: 0, failed: 0 },
    code: `- name: Enforce OOM Killer & Kernel Panic Guard
  hosts: all_nodes
  tasks:
    - name: Configure sysctl memory resilience
      ansible.posix.sysctl:
        name: "{{ item.key }}"
        value: "{{ item.value }}"
        state: present
        reload: yes
      loop:
        - { key: "vm.panic_on_oom", value: "0" }
        - { key: "vm.oom_kill_allocating_task", value: "0" }
        - { key: "vm.overcommit_memory", value: "2" }
        - { key: "vm.overcommit_ratio", value: "80" }
        - { key: "kernel.panic", value: "10" }

    - name: Shield FRR & eBPF daemons from OOM killer
      ansible.builtin.shell: |
        for pid in $(pgrep -E 'frr|bgpd|zebra|openvpn'); do
          echo -1000 > /proc/$pid/oom_score_adj
        done`
  },
  {
    id: 'pb-netbox-sync',
    name: 'NetBox / Nautobot: Dynamic Inventory & IPAM Sync',
    filename: 'netbox_dynamic_sync.yml',
    category: 'Source of Truth',
    targetHosts: 'localhost',
    description: 'Synchronizes live subnets, VLAN allocations, and BGP peer addresses from NetBox DCIM to router FIB tables.',
    lastRun: '1 hour ago',
    status: 'SUCCESS',
    stats: { ok: 52, changed: 6, unreachable: 0, failed: 0 },
    code: `- name: NetBox GraphQL Source-of-Truth Ingestion
  hosts: localhost
  gather_facts: no
  tasks:
    - name: Fetch Active Prefixes from NetBox
      netbox.netbox.netbox_prefix_info:
        netbox_url: "https://netbox.local.ftndns.com"
        netbox_token: "{{ vault_netbox_token }}"
      register: netbox_prefixes

    - name: Synthesize eBPF Subnet Whitelist Maps
      ansible.builtin.template:
        src: templates/ebpf_ipam.map.j2
        dest: /etc/ftn/ipam_active.map`
  },
  {
    id: 'pb-pki-cert-rotation',
    name: 'PKI & ACME Certificate Automated Rotation',
    filename: 'pki_acme_rotation.yml',
    category: 'PKI Security',
    targetHosts: 'edge_proxies',
    description: 'Automates Go crypto/tls certificate validation and Akamai Edge DNS SAN synchronization with zero downtime.',
    lastRun: '5 hours ago',
    status: 'SUCCESS',
    stats: { ok: 16, changed: 2, unreachable: 0, failed: 0 },
    code: `- name: Rotate TLS 1.3 Certificates via ACME RFC 8555
  hosts: edge_proxies
  tasks:
    - name: Request Renewed SAN Certificate via Go ACME Poller
      ansible.builtin.command: /usr/local/bin/ftn-cert-manager --renew --provider akamai
      register: acme_result

    - name: Perform Hitless TLS Certificate Reload
      ansible.builtin.service:
        name: ftn-edge-proxy
        state: reloaded`
  }
];

export const FtnRouterAutomation = () => {
  const [playbooks, setPlaybooks] = useState<AnsiblePlaybook[]>(PLAYBOOKS);
  const [selectedPlaybook, setSelectedPlaybook] = useState<AnsiblePlaybook>(PLAYBOOKS[0]);
  const [currentCanaryStage, setCurrentCanaryStage] = useState<number>(4);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "[ANSIBLE-AWX] Job #48291 initialized using inventory 'NetBox-Dynamic-Prod'",
    "[PLAY] [Canary Deployment: BGP EVPN & FRR Route Policy] ***********************",
    "[TASK] [Pre-flight BGP Convergence SLA Check] *********************************",
    "ok: [dhk-core-01] => { 'result': 'BGP neighbor 103.145.10.1 Established' }",
    "ok: [sin-edge-01] => { 'result': 'BGP neighbor 103.145.20.1 Established' }",
    "[TASK] [Validate Post-deployment Latency & Jitter SLA] ***********************",
    "ok: [fra-edge-01] => { 'stdout': 'PASS (rtt avg 3.4ms, jitter 0.2ms)' }",
    "[PLAY RECAP] *****************************************************************",
    "edge_routers: ok=38   changed=4    unreachable=0    failed=0    rescued=0"
  ]);

  const handleRunPlaybook = (pb: AnsiblePlaybook) => {
    setIsRunning(true);
    setTerminalLogs(prev => [
      ...prev,
      `\n[ANSIBLE-AWX] === Executing Playbook: ${pb.filename} ===`,
      `[TARGETS] ${pb.targetHosts}`,
      `[PROGRESS] Dispatching tasks across FTN multi-server mesh via mTLS...`
    ]);

    setTimeout(() => {
      setTerminalLogs(prev => [
        ...prev,
        `[TASK] [Execute ${pb.name}] ***********************`,
        `changed: [dhk-core-01] => { 'msg': 'Configuration applied cleanly' }`,
        `changed: [sin-edge-01] => { 'msg': 'Configuration applied cleanly' }`,
        `[STATUS] All tasks verified. Exit code: 0 (OK)`
      ]);
      setIsRunning(false);
      window.dispatchEvent(new CustomEvent('add-toast', {
        detail: {
          type: 'success',
          title: 'Ansible Playbook Completed',
          message: `${pb.name} completed successfully across all targets.`
        }
      }));
    }, 1800);
  };

  const handleTriggerRollback = () => {
    window.dispatchEvent(new CustomEvent('add-toast', {
      detail: {
        type: 'critical',
        title: 'Emergency Rollback Initiated',
        message: 'Reverting candidate FRR config to snapshot #20260904-044210 across edge routers.'
      }
    }));
    setCurrentCanaryStage(1);
    setTerminalLogs(prev => [
      ...prev,
      `[ROLLBACK] Triggering emergency reversion to pre-canary snapshot...`,
      `[ROLLBACK] Re-pointing BGP EVPN Type-5 prefixes to standby gateway...`,
      `[ROLLBACK] Health verified: All 12 nodes restored to stable baseline.`
    ]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="glass-panel p-6 lg:p-8 rounded-3xl border border-gray-800 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00f0ff] to-[#00ff66] flex items-center justify-center text-gray-950 shadow-[0_0_20px_rgba(0,240,255,0.4)]">
                <GitBranch className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white font-display flex items-center gap-3">
                  Ansible / AWX & Canary Deployment Orchestrator
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#00ff66]/10 text-[#00ff66] font-mono border border-[#00ff66]/30">
                    AWX Core 2.16+
                  </span>
                </h1>
                <p className="text-gray-400 font-mono text-xs lg:text-sm mt-0.5">
                  Automated router playbook execution with progressive canary rollouts, NetBox source-of-truth sync, OOM kernel tuning, and 1-click rollback.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleTriggerRollback}
              className="px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-mono text-xs font-bold rounded-xl transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>1-Click Emergency Rollback</span>
            </button>

            <button
              onClick={() => handleRunPlaybook(selectedPlaybook)}
              disabled={isRunning}
              className="px-5 py-2.5 bg-gradient-to-r from-[#00f0ff] to-[#00ff66] hover:opacity-95 text-gray-950 font-mono text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <Play className={cn("w-3.5 h-3.5 fill-current", isRunning && "animate-spin")} />
              <span>{isRunning ? 'Executing...' : 'Run Selected Playbook'}</span>
            </button>
          </div>
        </div>

        {/* Canary Progress Tracker */}
        <div className="mt-6 pt-6 border-t border-gray-800/80">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-gray-400">ACTIVE CANARY PIPELINE: BGP EVPN FLEET ROLLOUT</span>
            <span className="text-[#00ff66] font-bold">100% PRODUCTION TRAFFIC VERIFIED</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {[
              { stage: 1, label: 'Stage 1: 10% Canary', target: 'Dhaka Core Lab', status: 'Completed', latency: '2.1ms' },
              { stage: 2, label: 'Stage 2: 25% Staging', target: 'Singapore Edge', status: 'Completed', latency: '14.2ms' },
              { stage: 3, label: 'Stage 3: 50% Regional', target: 'Frankfurt PoP', status: 'Completed', latency: '42.0ms' },
              { stage: 4, label: 'Stage 4: 100% Global', target: 'Global Anycast Grid', status: 'Completed', latency: '18.4ms' }
            ].map((step) => {
              const isActive = currentCanaryStage >= step.stage;
              return (
                <div
                  key={step.stage}
                  className={cn(
                    "p-3.5 rounded-2xl border transition-all font-mono",
                    isActive
                      ? "bg-gray-900/90 border-[#00ff66]/40 text-gray-200"
                      : "bg-gray-950/40 border-gray-800/50 text-gray-500"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-[#00f0ff]">{step.label}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff66]" />
                  </div>
                  <div className="text-xs font-bold text-white mb-0.5">{step.target}</div>
                  <div className="flex items-center justify-between text-[10px] text-gray-400">
                    <span>SLA: {step.latency}</span>
                    <span className="text-[#00ff66]">{step.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Playbook Catalog */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400 px-1">
            <span>AUTOMATION PLAYBOOKS ({playbooks.length})</span>
            <span>INVENTORY: NETBOX SYNCD</span>
          </div>

          <div className="space-y-2.5">
            {playbooks.map(pb => {
              const isSelected = selectedPlaybook.id === pb.id;
              return (
                <div
                  key={pb.id}
                  onClick={() => setSelectedPlaybook(pb)}
                  className={cn(
                    "p-4 rounded-2xl border transition-all cursor-pointer font-mono",
                    isSelected
                      ? "bg-gray-900 border-[#00f0ff]/60 shadow-[0_0_15px_rgba(0,240,255,0.15)] ring-1 ring-[#00f0ff]/30"
                      : "bg-gray-900/50 border-gray-800/80 hover:border-gray-700 hover:bg-gray-900/80"
                  )}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <span className="text-[9px] px-2 py-0.5 rounded bg-gray-800 text-gray-400 font-bold border border-gray-700 uppercase">
                        {pb.category}
                      </span>
                      <h3 className="text-sm font-bold text-white mt-1 font-display">{pb.name}</h3>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                      {pb.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed mb-3 line-clamp-2">
                    {pb.description}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-gray-500 pt-2 border-t border-gray-800">
                    <span>File: <strong className="text-gray-300">{pb.filename}</strong></span>
                    <span>Last run: {pb.lastRun}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Code & Execution Terminal */}
        <div className="lg:col-span-7 space-y-4">
          {/* YAML Playbook Code Viewer */}
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-gray-300">
                <FileCode2 className="w-4 h-4 text-[#00f0ff]" />
                <span className="font-bold">{selectedPlaybook.filename}</span>
                <span className="text-gray-500">({selectedPlaybook.targetHosts})</span>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  ok: {selectedPlaybook.stats.ok}
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  changed: {selectedPlaybook.stats.changed}
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
                  failed: {selectedPlaybook.stats.failed}
                </span>
              </div>
            </div>

            <pre className="text-[11px] font-mono bg-black/90 text-gray-300 p-4 rounded-2xl border border-gray-800/80 overflow-x-auto max-h-56 scrollbar-thin">
              <code>{selectedPlaybook.code}</code>
            </pre>
          </div>

          {/* Real-time Ansible Console Terminal */}
          <div className="bg-gray-950 border border-gray-800 rounded-3xl p-5 shadow-xl space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-gray-800">
              <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                <Terminal className="w-3.5 h-3.5 text-[#00ff66]" />
                <span>Ansible-AWX Live Execution Terminal</span>
              </div>
              <span className="text-[10px] font-mono text-gray-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-ping" />
                TTY CONNECTED (mTLS)
              </span>
            </div>

            <div className="bg-black/90 p-4 rounded-2xl border border-gray-850 font-mono text-xs text-gray-300 space-y-1 max-h-52 overflow-y-auto scrollbar-thin">
              {terminalLogs.map((line, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "leading-relaxed whitespace-pre-wrap",
                    line.includes("PASS") || line.includes("ok:") ? "text-emerald-400" :
                    line.includes("changed:") ? "text-blue-400" :
                    line.includes("failed:") || line.includes("ROLLBACK") ? "text-rose-400" :
                    line.includes("[PLAY]") || line.includes("[TASK]") ? "text-[#00f0ff] font-bold" :
                    "text-gray-400"
                  )}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
