import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldCheck,
  Lock,
  User,
  Users,
  Server,
  Globe,
  HardDrive,
  Smartphone,
  Radio,
  Phone,
  Search,
  DollarSign,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  Key,
  LogIn,
  LogOut,
  Laptop,
  Check,
  X,
  ArrowRight,
  Sparkles,
  Fingerprint,
  Layers,
  Network
} from 'lucide-react';
import { cn } from '../utils';
import { FtnRegisteredService, FtnIdentity, FtnAuthSessionResponse } from '../types';

interface FtnSharedAuthUiProps {
  onNavigateToService?: (serviceId: string) => void;
  onNavigateToBrandKit?: () => void;
}

export function FtnSharedAuthUi({ onNavigateToService, onNavigateToBrandKit }: FtnSharedAuthUiProps) {
  const [session, setSession] = useState<FtnIdentity | null>(null);
  const [provisionedIds, setProvisionedIds] = useState<string[]>([]);
  const [services, setServices] = useState<FtnRegisteredService[]>([]);
  const [activeCategory, setActiveCategory] = useState<'all' | 'family' | 'personal' | 'enterprise'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Unauthorized Registration Simulation state (to prove UX contract: No Public Self-Registration)
  const [isAttemptingRegister, setIsAttemptingRegister] = useState(false);
  const [unauthorizedEmail, setUnauthorizedEmail] = useState('');
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionDetails, setRejectionDetails] = useState<{ error: string; details: string } | null>(null);

  // Android / Flutter Mobile Client Status inspector
  const [flutterStatus, setFlutterStatus] = useState<any>(null);
  const [isPingingFlutter, setIsPingingFlutter] = useState(false);
  const [activeTab, setActiveTab] = useState<'services' | 'flutter-client' | 'security-policy'>('services');

  // Pre-provisioned user quick switcher for instant demonstration
  const PROVISIONED_ACCOUNTS = [
    {
      email: 'beparykamrul@gmail.com',
      label: 'Kamrul Bepary (Global Admin & Family Head)',
      role: 'Enterprise + Family + Personal',
    },
    {
      email: 'family.admin@ftn.network',
      label: 'FTN Family Guardian (Household Admin)',
      role: 'Family SafeGuard + Personal Vault',
    },
    {
      email: 'operator@ftn.mesh',
      label: 'NOC NetOps Operator (Carrier Engineer)',
      role: 'Enterprise NOC + SIEM + Accounting',
    },
  ];

  // 1. Authoritative Server Session Fetch (NO localStorage used!)
  const fetchSession = async () => {
    setIsLoadingSession(true);
    try {
      const res = await fetch('/api/v1/auth/session', {
        headers: { Accept: 'application/json' },
        credentials: 'include',
      });
      if (res.ok) {
        const data: FtnAuthSessionResponse = await res.json();
        if (data.authenticated && data.identity) {
          setSession(data.identity);
          setProvisionedIds(data.provisionedServiceIds || []);
        } else {
          setSession(null);
          setProvisionedIds([]);
        }
      }
    } catch (err) {
      console.error('Session fetch error:', err);
    } finally {
      setIsLoadingSession(false);
    }
  };

  // 2. Control Panel Service Registry API fetch
  const fetchServices = async () => {
    setIsLoadingServices(true);
    try {
      const res = await fetch('/api/v1/services/registry', {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        setServices(data.services || []);
      }
    } catch (err) {
      console.error('Service registry fetch error:', err);
    } finally {
      setIsLoadingServices(false);
    }
  };

  // 3. Flutter / Android mobile client endpoint fetch
  const pingFlutterEndpoint = async () => {
    setIsPingingFlutter(true);
    try {
      const res = await fetch('/api/v1/ftn/android/status', {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        setFlutterStatus(data);
      }
    } catch (err: any) {
      setFlutterStatus({ error: err.message });
    } finally {
      setIsPingingFlutter(false);
    }
  };

  useEffect(() => {
    fetchSession();
    fetchServices();
    pingFlutterEndpoint();
  }, []);

  // Server-authoritative Login
  const handleLoginAs = async (email: string) => {
    setActionMessage({ text: `Authenticating identity ${email} with FTN server...`, type: 'info' });
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        setActionMessage({ text: data.error || 'Authentication failed', type: 'error' });
      } else {
        setSession(data.identity);
        setProvisionedIds(data.provisionedServiceIds || []);
        setActionMessage({ text: `Signed in as ${data.identity.name}. All provisioned services unlocked.`, type: 'success' });
        setTimeout(() => setActionMessage(null), 4000);
      }
    } catch (err: any) {
      setActionMessage({ text: `Authentication error: ${err.message}`, type: 'error' });
    }
  };

  // Server-authoritative Logout
  const handleLogout = async () => {
    setActionMessage({ text: 'Terminating authoritative server session...', type: 'info' });
    try {
      await fetch('/api/v1/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setSession(null);
      setProvisionedIds([]);
      setActionMessage({ text: 'Session securely terminated across all FTN provisioned services.', type: 'info' });
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      setActionMessage({ text: err.message, type: 'error' });
    }
  };

  // Test unauthorized public self-registration (Strict UX Contract demonstration)
  const handleAttemptPublicRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unauthorizedEmail) return;

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: unauthorizedEmail }),
      });
      const data = await res.json();

      if (!res.ok && res.status === 403) {
        setRejectionDetails({
          error: data.error || 'Public self-registration disabled.',
          details: data.details || 'Accounts are provisioned strictly via the FTN Control Panel.',
        });
        setRejectionModalOpen(true);
      } else if (res.ok) {
        // Pre-provisioned user was entered
        setSession(data.identity);
        setProvisionedIds(data.provisionedServiceIds);
        setIsAttemptingRegister(false);
      }
    } catch (err: any) {
      setRejectionDetails({
        error: 'Registration Blocked',
        details: err.message,
      });
      setRejectionModalOpen(true);
    }
  };

  // Filter services by category and search
  const filteredServices = services.filter((svc) => {
    const matchesCat = activeCategory === 'all' || svc.category === activeCategory;
    const matchesSearch =
      svc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      svc.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      svc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Icon selector helper
  const renderServiceIcon = (iconName: string, isProvisioned: boolean) => {
    const className = cn('w-6 h-6', isProvisioned ? 'text-[#00ff66]' : 'text-gray-500');
    switch (iconName) {
      case 'Server':
        return <Server className={className} />;
      case 'ShieldCheck':
        return <ShieldCheck className={className} />;
      case 'HardDrive':
        return <HardDrive className={className} />;
      case 'Search':
        return <Search className={className} />;
      case 'DollarSign':
        return <DollarSign className={className} />;
      case 'Radio':
        return <Radio className={className} />;
      case 'Phone':
        return <Phone className={className} />;
      case 'Network':
        return <Network className={className} />;
      case 'Globe':
        return <Globe className={className} />;
      default:
        return <Layers className={className} />;
    }
  };

  return (
    <div id="ftn-shared-auth-surface" className="space-y-6">
      {/* Header Banner: UX Contract & One Identity Concept */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-gray-800 relative overflow-hidden bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950">
        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-[#00ff66]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -top-16 w-80 h-80 bg-[#00f0ff]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4 max-w-3xl">
            <button
              onClick={onNavigateToBrandKit}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-[#00ff66]/40 shadow-[0_0_20px_rgba(0,255,102,0.25)] flex-shrink-0 bg-[#0a1128] hover:scale-105 transition-transform group cursor-pointer relative"
              title="View FTN Brand Identity Kit"
            >
              <img 
                src="/ftn-logo.png" 
                alt="FTN Official Emblem" 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-[#00ff66] font-mono font-bold">
                BRAND
              </div>
            </button>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold uppercase tracking-wider bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/30 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> FTN Shared Authentication
                </span>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono uppercase tracking-wider bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 flex items-center gap-1.5">
                  <Fingerprint className="w-3.5 h-3.5" /> One Identity • Multi-Service
                </span>
                <button
                  onClick={onNavigateToBrandKit}
                  className="px-2.5 py-1 rounded-md text-[11px] font-mono uppercase tracking-wider bg-purple-500/10 text-purple-300 border border-purple-500/30 hover:bg-purple-500/20 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Official 3D Brand Kit
                </button>
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wide">
                FTN Shared Federation & Service Access Hub
              </h1>
              <p className="text-gray-400 text-sm leading-relaxed">
                Unified sovereign identity surface spanning <span className="text-gray-200 font-medium">Personal Sovereign</span>,{' '}
                <span className="text-gray-200 font-medium">Family Time Network (FTN)</span>, and{' '}
                <span className="text-gray-200 font-medium">Enterprise Carrier Core</span> services. Authentication state is
                authoritatively governed by secure server session cookies with zero localStorage persistence.
              </p>
            </div>
          </div>

          {/* Quick Active Identity Card */}
          <div className="w-full lg:w-auto flex-shrink-0">
            {session ? (
              <div className="p-4 rounded-xl bg-gray-900/90 border border-gray-700/80 shadow-xl flex items-center gap-4 min-w-[300px]">
                <div className="relative">
                  <img
                    src={session.avatar}
                    alt={session.name}
                    className="w-12 h-12 rounded-full border-2 border-[#00ff66] bg-gray-800"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#00ff66] rounded-full border-2 border-gray-950 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-gray-950 font-bold" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white truncate">{session.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#00f0ff]/10 text-[#00f0ff] font-mono font-medium">
                      SSO
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">{session.email}</p>
                  <div className="text-[10px] text-gray-400 font-mono flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66]" />
                    <span>{provisionedIds.length} Services Provisioned</span>
                  </div>
                </div>
                <button
                  id="btn-auth-logout"
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-gray-800 transition-colors"
                  title="Sign Out from All Services"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-gray-900/90 border border-amber-500/40 shadow-xl flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
                <div>
                  <div className="text-sm font-semibold text-white">Unauthenticated Session</div>
                  <div className="text-xs text-gray-400">Select a pre-provisioned identity below</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Global Action Message Banner */}
        {actionMessage && (
          <div
            className={cn(
              'mt-4 p-3 rounded-lg text-xs font-mono flex items-center justify-between transition-all',
              actionMessage.type === 'success' && 'bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/30',
              actionMessage.type === 'error' && 'bg-red-500/10 text-red-400 border border-red-500/30',
              actionMessage.type === 'info' && 'bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30'
            )}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>{actionMessage.text}</span>
            </div>
            <button onClick={() => setActionMessage(null)} className="text-gray-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            id="tab-provisioned-services"
            onClick={() => setActiveTab('services')}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2',
              activeTab === 'services'
                ? 'bg-gradient-to-r from-gray-800 to-gray-800/60 text-white border border-gray-700 shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/40'
            )}
          >
            <Layers className="w-4 h-4 text-[#00ff66]" />
            <span>Provisioned Services ({services.length})</span>
          </button>
          <button
            id="tab-flutter-client"
            onClick={() => setActiveTab('flutter-client')}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2',
              activeTab === 'flutter-client'
                ? 'bg-gradient-to-r from-gray-800 to-gray-800/60 text-white border border-gray-700 shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/40'
            )}
          >
            <Smartphone className="w-4 h-4 text-[#00f0ff]" />
            <span>Flutter & Android Client Bridge</span>
            {flutterStatus?.status && (
              <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-pulse" />
            )}
          </button>
          <button
            id="tab-security-policy"
            onClick={() => setActiveTab('security-policy')}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2',
              activeTab === 'security-policy'
                ? 'bg-gradient-to-r from-gray-800 to-gray-800/60 text-white border border-gray-700 shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/40'
            )}
          >
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Zero-Trust Contract & Policies</span>
          </button>
        </div>

        {/* Identity Quick Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-mono hidden sm:inline">Active Identity:</span>
          <div className="flex gap-1.5 bg-gray-950 p-1 rounded-lg border border-gray-800">
            {PROVISIONED_ACCOUNTS.map((acc) => {
              const isSelected = session?.email === acc.email;
              return (
                <button
                  key={acc.email}
                  onClick={() => handleLoginAs(acc.email)}
                  className={cn(
                    'px-2.5 py-1 text-xs rounded font-medium transition-all',
                    isSelected
                      ? 'bg-[#00ff66]/20 text-[#00ff66] border border-[#00ff66]/40 shadow-sm'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                  )}
                  title={acc.label}
                >
                  {acc.email.split('@')[0]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* TAB 1: PROVISIONED SERVICES MATRIX */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          {/* Identity & Scope Bar */}
          {session && (
            <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-800 border border-gray-700 text-[#00f0ff]">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-mono uppercase tracking-wider">
                    Sovereign Federation Identity
                  </div>
                  <div className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                    <span>{session.ssoIdentity}</span>
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-300 font-mono">
                      {session.role}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                <div className="text-gray-400">
                  <span className="text-gray-500">MFA: </span>
                  <span className="text-[#00ff66]">{session.mfaMethod}</span>
                </div>
                <div className="h-4 w-px bg-gray-800 hidden md:block" />
                <div className="text-gray-400">
                  <span className="text-gray-500">Family Scope: </span>
                  <span className="text-gray-300">{session.familyScope}</span>
                </div>
                <div className="h-4 w-px bg-gray-800 hidden md:block" />
                <div className="text-gray-400">
                  <span className="text-gray-500">Storage: </span>
                  <span className="text-[#00f0ff]">Server Secure Cookie (No localStorage)</span>
                </div>
              </div>
            </div>
          )}

          {/* Filters & Search Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 p-1 bg-gray-950/70 border border-gray-800 rounded-xl overflow-x-auto">
              {(
                [
                  { id: 'all', label: 'All Services' },
                  { id: 'family', label: 'Family Time Network' },
                  { id: 'personal', label: 'Personal Sovereign' },
                  { id: 'enterprise', label: 'Enterprise Core' },
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  id={`cat-filter-${cat.id}`}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    'px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all',
                    activeCategory === cat.id
                      ? 'bg-gray-800 text-white shadow-sm border border-gray-700'
                      : 'text-gray-400 hover:text-gray-200'
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                id="search-services-input"
                type="text"
                placeholder="Filter services or roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-950/60 border border-gray-800 text-gray-200 text-xs rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff]/40 font-mono placeholder:text-gray-600"
              />
            </div>
          </div>

          {/* Services Matrix (Responsive: 1 col on mobile, 2 col on tablet, 3 col on NOC desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredServices.map((service) => {
              const isProvisioned = provisionedIds.includes(service.id);
              return (
                <div
                  key={service.id}
                  id={`service-card-${service.id}`}
                  className={cn(
                    'glass-panel p-5 rounded-xl border transition-all duration-300 relative flex flex-col justify-between group',
                    isProvisioned
                      ? 'border-gray-800/80 hover:border-[#00ff66]/50 hover:shadow-[0_0_20px_rgba(0,255,102,0.08)] bg-gray-900/50'
                      : 'border-gray-900/80 bg-gray-950/40 opacity-75 hover:opacity-90'
                  )}
                >
                  <div>
                    {/* Top Row: Icon + Category Badge + Provision Status */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="p-2.5 rounded-xl bg-gray-950 border border-gray-800/80 group-hover:scale-105 transition-transform">
                        {renderServiceIcon(service.icon, isProvisioned)}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={cn(
                            'text-[10px] px-2 py-0.5 rounded font-mono font-semibold uppercase tracking-wider',
                            service.category === 'family' && 'bg-purple-500/10 text-purple-400 border border-purple-500/30',
                            service.category === 'personal' && 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
                            service.category === 'enterprise' && 'bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30'
                          )}
                        >
                          {service.categoryLabel}
                        </span>

                        {isProvisioned ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-[#00ff66] font-mono font-medium">
                            <CheckCircle2 className="w-3 h-3" /> Provisioned
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 font-mono">
                            <Lock className="w-3 h-3 text-amber-500/70" /> Unprovisioned
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title & Tagline */}
                    <h3 className="text-base font-semibold text-white group-hover:text-[#00ff66] transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-xs text-gray-400 font-mono mt-0.5 mb-2">
                      {service.tagline}
                    </p>
                    <p className="text-xs text-gray-400/90 leading-relaxed mb-4">
                      {service.description}
                    </p>
                  </div>

                  {/* Footer Meta & Launch Action */}
                  <div className="pt-4 border-t border-gray-800/60 space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#00ff66]" />
                        <span>{service.status}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400">{service.latencyMs}ms</span>
                        <span className="text-[#00f0ff]">{service.healthScore}% SLA</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] text-gray-400 font-mono truncate max-w-[140px]">
                        {service.accessTier}
                      </span>
                      {isProvisioned ? (
                        <button
                          id={`btn-launch-${service.id}`}
                          onClick={() => {
                            if (onNavigateToService) {
                              onNavigateToService(service.id);
                            } else {
                              setActionMessage({
                                text: `SSO Ticket issued for ${service.name}. Single-identity session active.`,
                                type: 'success',
                              });
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-[#00ff66]/20 border border-gray-700 hover:border-[#00ff66]/50 text-white hover:text-[#00ff66] text-xs font-semibold flex items-center gap-1.5 transition-all min-h-[36px]"
                        >
                          <span>Launch Service</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          disabled
                          className="px-3 py-1.5 rounded-lg bg-gray-950 border border-gray-800 text-gray-500 text-xs font-mono cursor-not-allowed flex items-center gap-1.5 min-h-[36px]"
                          title="This service is not provisioned for the currently authenticated identity."
                        >
                          <Lock className="w-3 h-3" />
                          <span>Restricted</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredServices.length === 0 && (
            <div className="p-12 text-center glass-panel rounded-2xl border border-gray-800 text-gray-400">
              <Search className="w-8 h-8 mx-auto text-gray-600 mb-2" />
              <p className="text-sm">No services matched "{searchQuery}" in the selected category.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FLUTTER & ANDROID CLIENT BRIDGE */}
      {activeTab === 'flutter-client' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Live Flutter Client Mockup */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-sm rounded-[36px] p-4 bg-gray-950 border-4 border-gray-800 shadow-2xl relative overflow-hidden">
                {/* Phone Speaker & Notch */}
                <div className="w-28 h-4 bg-gray-900 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-gray-950 mr-2" />
                  <div className="w-8 h-1 rounded-full bg-gray-800" />
                </div>

                {/* Flutter App Title Bar */}
                <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800 text-white min-h-[480px] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-[#00f0ff]" />
                        <span className="font-bold text-sm tracking-wide">FTN Enterprise Control</span>
                      </div>
                      <button
                        onClick={pingFlutterEndpoint}
                        className="p-1.5 rounded-lg bg-gray-800 text-gray-300 hover:text-white"
                        title="Reload Status from API"
                      >
                        <RefreshCw className={cn('w-4 h-4', isPingingFlutter && 'animate-spin text-[#00f0ff]')} />
                      </button>
                    </div>

                    {/* Backend Card from Flutter snippet */}
                    <div className="bg-gray-950/80 p-3.5 rounded-xl border border-gray-800 mb-4 flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-[#00ff66]">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-mono text-gray-400">Backend</div>
                        <div className="text-xs font-semibold text-white truncate">
                          {flutterStatus?.service ?? 'FTN'} - {flutterStatus?.status ?? 'Connecting...'}
                        </div>
                      </div>
                    </div>

                    <div className="text-xs font-bold text-gray-300 mb-2 flex items-center justify-between">
                      <span>Integrated Modules</span>
                      <span className="text-[10px] text-[#00f0ff] font-mono">
                        {flutterStatus?.tools?.length ?? 0} active
                      </span>
                    </div>

                    {/* Tools ListView */}
                    <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                      {flutterStatus?.tools?.map((tool: string, idx: number) => (
                        <div
                          key={idx}
                          className="bg-gray-950/60 p-2.5 rounded-lg border border-gray-800/80 flex items-center gap-2.5 text-xs text-gray-200"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-[#00ff66]" />
                          <span className="truncate">{tool}</span>
                        </div>
                      )) ?? (
                        <div className="text-center py-6 text-xs text-gray-500">No modules reported</div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-800 text-[10px] text-gray-500 font-mono text-center">
                    Endpoint: /api/v1/ftn/android/status
                  </div>
                </div>
              </div>
            </div>

            {/* Architecture Details & Live Code Bridge */}
            <div className="lg:col-span-7 space-y-4">
              <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-[#00f0ff]" />
                    Android / Flutter HTTP Endpoint Bridge
                  </h3>
                  <button
                    onClick={pingFlutterEndpoint}
                    className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-mono text-gray-300 flex items-center gap-1.5"
                  >
                    <RefreshCw className={cn('w-3.5 h-3.5', isPingingFlutter && 'animate-spin')} />
                    <span>Ping Endpoint</span>
                  </button>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed">
                  The Flutter enterprise client (<code className="text-[#00f0ff]">FTNEnterpriseApp</code>) connects to the authoritative
                  server endpoint <code className="text-[#00ff66]">/api/v1/ftn/android/status</code> to verify node health, active tunnel
                  transports, and backend security modules.
                </p>

                {/* Live JSON Response Preview */}
                <div>
                  <div className="text-xs font-mono text-gray-400 mb-1.5 flex items-center justify-between">
                    <span>Live JSON Response (/api/v1/ftn/android/status):</span>
                    <span className="text-[10px] text-[#00ff66]">HTTP 200 OK</span>
                  </div>
                  <pre className="p-4 rounded-xl bg-gray-950 border border-gray-800 text-[#00f0ff] font-mono text-xs overflow-x-auto max-h-72">
                    {JSON.stringify(flutterStatus, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ZERO-TRUST POLICY & NO SELF-REGISTRATION DEMONSTRATION */}
      {activeTab === 'security-policy' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Policy Enforcement Card */}
            <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">UX Contract Enforcement</h3>
                  <p className="text-xs text-gray-400 font-mono">No Public Service Self-Registration</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-gray-300 leading-relaxed">
                <div className="p-3 rounded-xl bg-gray-950/70 border border-gray-800 space-y-1">
                  <div className="font-semibold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff66]" /> 1. One Identity, Multiple Services
                  </div>
                  <p className="text-gray-400">
                    A single sovereign FTN DID federates access across Personal Vaults, Family SafeGuard, and Enterprise NOC.
                    No fragmented credentials.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-gray-950/70 border border-gray-800 space-y-1">
                  <div className="font-semibold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff66]" /> 2. Server-Authoritative Session Cookie
                  </div>
                  <p className="text-gray-400">
                    Tokens are never held in client-side <code className="text-amber-300">localStorage</code>. Sessions are
                    validated against cryptographic HttpOnly cookies managed strictly on the server.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-gray-950/70 border border-gray-800 space-y-1">
                  <div className="font-semibold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff66]" /> 3. Service Cards from Control Panel Registry
                  </div>
                  <p className="text-gray-400">
                    Services are rendered dynamically from <code className="text-[#00f0ff]">/api/v1/services/registry</code>,
                    reflecting the authoritative enterprise registry rather than static hardcoded views.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Registration Denial Simulator */}
            <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Test Self-Registration Lockdown</h3>
                  <p className="text-xs text-gray-400 font-mono">Simulate Public Registration Attempt</p>
                </div>
              </div>

              <p className="text-xs text-gray-400">
                To demonstrate adherence to the UX contract, test entering an arbitrary non-provisioned email below.
                The server will strictly enforce <code className="text-red-400">403 Forbidden: Public self-registration is disabled</code>.
              </p>

              <form onSubmit={handleAttemptPublicRegistration} className="space-y-3">
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">
                    Enter Unregistered / Public Email:
                  </label>
                  <input
                    type="email"
                    placeholder="guest.stranger@external-public.com"
                    value={unauthorizedEmail}
                    onChange={(e) => setUnauthorizedEmail(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 text-white text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 text-xs font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Attempt Public Registration (Expect 403 Denial)</span>
                </button>
              </form>

              <div className="p-3 rounded-xl bg-gray-950/50 border border-gray-800 text-[11px] text-gray-400 font-mono">
                Authorized Provisioned Accounts in Registry:
                <ul className="list-disc list-inside mt-1 text-gray-400 space-y-0.5">
                  <li><code className="text-[#00ff66]">beparykamrul@gmail.com</code> (Global Admin)</li>
                  <li><code className="text-[#00ff66]">family.admin@ftn.network</code> (Family Guardian)</li>
                  <li><code className="text-[#00ff66]">operator@ftn.mesh</code> (NOC Operator)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Strict Registration Denial (UX Contract proof) */}
      {rejectionModalOpen && rejectionDetails && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-red-500/50 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-red-500/20 text-red-400">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Registration Prohibited</h3>
                <span className="text-[11px] font-mono text-red-400 uppercase tracking-wide">
                  HTTP 403 Forbidden
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gray-950 border border-gray-800 text-xs text-gray-300 space-y-2">
              <div className="font-semibold text-red-400">{rejectionDetails.error}</div>
              <p className="text-gray-400 leading-relaxed">{rejectionDetails.details}</p>
            </div>

            <div className="text-[11px] text-gray-500 font-mono">
              UX Contract Enforced: No public service self-registration. All FTN services require organization provisioning.
            </div>

            <button
              onClick={() => {
                setRejectionModalOpen(false);
                setUnauthorizedEmail('');
              }}
              className="w-full py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold transition-colors"
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
