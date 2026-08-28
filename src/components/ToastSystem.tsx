import React, { createContext, useContext, useState, useEffect } from 'react';
import { AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

interface Toast {
  id: number;
  type: 'critical' | 'success' | 'info';
  title: string;
  message: string;
}

export function ToastSystem() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    // Listen for custom dispatch events for global toasts
    const handleCustomToast = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { type, title, message } = customEvent.detail;
      setToasts(prev => [...prev, {
        id: Date.now() + Math.random(),
        type,
        title,
        message,
      }]);
    };

    window.addEventListener('add-toast', handleCustomToast);

    // Simulate SLA drops and auto-heals occasionally
    const alertTimeout = setTimeout(() => {
      const id1 = Date.now();
      setToasts(prev => [...prev, {
        id: id1,
        type: 'critical',
        title: 'SLA Deviation Alert',
        message: 'FTN Core latency spiked to 65ms. Uptime dropping below 99.99% benchmark.',
      }]);

      // Auto-healing kicks in
      setTimeout(() => {
        setToasts(prev => [...prev, {
          id: Date.now() + 1,
          type: 'success',
          title: 'AI Auto-Healing Triggered',
          message: 'BGP EVPN rerouted via Anycast. SLA restored to 99.999%.',
        }]);
      }, 4000);

    }, 12000);

    return () => {
      clearTimeout(alertTimeout);
      window.removeEventListener('add-toast', handleCustomToast);
    };
  }, []);

  // Auto-remove toasts
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts(prev => prev.slice(1));
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {toasts.map(toast => (
        <div key={toast.id} className={`animate-in slide-in-from-right-8 fade-in duration-300 w-80 glass-panel border rounded-lg p-4 shadow-2xl flex gap-3 items-start ${
          toast.type === 'critical' ? 'border-red-500/50 bg-red-500/10' :
          toast.type === 'success' ? 'border-[#00ff66]/50 bg-[#00ff66]/10' :
          'border-[#00f0ff]/50 bg-[#00f0ff]/10'
        }`}>
          {toast.type === 'critical' && <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />}
          {toast.type === 'success' && <ShieldCheck className="w-5 h-5 text-[#00ff66] flex-shrink-0" />}
          {toast.type === 'info' && <Zap className="w-5 h-5 text-[#00f0ff] flex-shrink-0" />}
          <div>
            <h4 className={`font-semibold text-sm ${
              toast.type === 'critical' ? 'text-red-400' :
              toast.type === 'success' ? 'text-[#00ff66]' :
              'text-[#00f0ff]'
            }`}>{toast.title}</h4>
            <p className="text-xs text-gray-300 mt-1">{toast.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
