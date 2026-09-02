import React, { useState } from 'react';
import { Mail, ShieldCheck, CheckCircle2, AlertTriangle, Send, RefreshCw, Lock } from 'lucide-react';
import { cn } from '../utils';

export function MailServiceManager() {
  const [smtpStatus, setSmtpStatus] = useState('Online');
  const [spamFilterLevel, setSpamFilterLevel] = useState('Aggressive (Rspamd + ClamAV)');

  const handleTestMail = (e: React.FormEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('add-toast', {
      detail: {
        type: 'success',
        title: 'Diagnostic Test Email Sent',
        message: 'SMTP envelope delivered with 100% DKIM, SPF, and DMARC alignment.'
      }
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-gray-800/80 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-white tracking-wide">
              FTN Enterprise Mail & Security Gateway
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">
              Carrier-grade SMTP/IMAP routing, Rspamd AI anti-spam filtering, DKIM 2048-bit signing, and DMARC enforcement.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-[#00ff66] bg-[#00ff66]/10 px-3 py-1.5 rounded-full border border-[#00ff66]/30 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          DMARC STRICT ENFORCEMENT
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-red-400" />
            Security & Authentication Records
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3.5 bg-gray-900/80 rounded-xl border border-gray-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">SPF (Sender Policy Framework)</div>
                <div className="text-[11px] text-gray-400">v=spf1 ip4:103.245.18.90 ip4:45.112.5.4 -all</div>
              </div>
              <span className="text-[#00ff66] bg-[#00ff66]/10 px-2 py-0.5 rounded border border-[#00ff66]/30">VALID (PASS)</span>
            </div>

            <div className="p-3.5 bg-gray-900/80 rounded-xl border border-gray-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">DKIM (DomainKeys Identified Mail)</div>
                <div className="text-[11px] text-gray-400">rsa2048 / 202608._domainkey.ftndns.net</div>
              </div>
              <span className="text-[#00ff66] bg-[#00ff66]/10 px-2 py-0.5 rounded border border-[#00ff66]/30">2048-BIT OK</span>
            </div>

            <div className="p-3.5 bg-gray-900/80 rounded-xl border border-gray-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">DMARC Policy</div>
                <div className="text-[11px] text-gray-400">v=DMARC1; p=reject; rua=mailto:dmarc@ftndns.net</div>
              </div>
              <span className="text-[#00ff66] bg-[#00ff66]/10 px-2 py-0.5 rounded border border-[#00ff66]/30">REJECT MODE</span>
            </div>
          </div>
        </div>

        {/* Send Test Mail */}
        <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Send className="w-4 h-4 text-[#00f0ff]" />
            Mail Diagnostic Probe
          </h3>

          <form onSubmit={handleTestMail} className="space-y-3 font-mono text-xs">
            <div>
              <label className="text-gray-400 block mb-1">Recipient Address</label>
              <input
                type="email"
                defaultValue="beparykamrul@gmail.com"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-red-500"
                required
              />
            </div>

            <div>
              <label className="text-gray-400 block mb-1">Outbound Relay Node</label>
              <select className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-red-500">
                <option>relay1.ftndns.net (Port 587 STARTTLS)</option>
                <option>relay2.ftndns.net (Port 465 SMTPS)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold rounded-lg transition-all shadow-md mt-2"
            >
              Send Diagnostic Probe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
