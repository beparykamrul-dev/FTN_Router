import React, { useState } from 'react';
import {
  FileJson,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Play,
  Settings,
  RefreshCw,
  Code,
  Shield,
  FileCode2,
  ListChecks
} from 'lucide-react';
import { cn } from '../utils';

export function FtnConfigValidator() {
  const [configType, setConfigType] = useState<'JSON' | 'YAML'>('YAML');
  const [configContent, setConfigContent] = useState(
    'apiVersion: ftn.network/v1\nkind: ServiceMesh\nmetadata:\n  name: core-dns-router\n  region: us-east\nspec:\n  replicas: 3\n  encryption: "tls1.2" # Policy violation: requires tls1.3\n  firewall:\n    allow: ["10.0.0.0/8"]\n    drop: ["0.0.0.0/0"]\n  resources:\n    memory: "512Mi"\n    cpu: "2"'
  );
  const [isValidating, setIsValidating] = useState(false);
  const [validationResults, setValidationResults] = useState<{
    status: 'IDLE' | 'PASS' | 'FAIL';
    errors: string[];
    warnings: string[];
  }>({ status: 'IDLE', errors: [], warnings: [] });

  const handleValidate = () => {
    setIsValidating(true);
    setValidationResults({ status: 'IDLE', errors: [], warnings: [] });

    setTimeout(() => {
      const errors = [];
      const warnings = [];

      // Simulated Validation Logic
      if (configContent.includes('tls1.2')) {
        errors.push('ZeroTrust Policy Violation: Minimum allowed encryption is TLS 1.3.');
      }
      if (!configContent.includes('healthCheck')) {
        warnings.push('Reliability: Missing liveness/readiness probe configurations.');
      }
      if (configContent.includes('0.0.0.0/0') && configContent.includes('allow:')) {
         if (configContent.match(/allow:.*"0\.0\.0\.0\/0"/)) {
            errors.push('Security Alert: Allowing 0.0.0.0/0 ingress is strictly prohibited in core zone.');
         }
      }

      setValidationResults({
        status: errors.length > 0 ? 'FAIL' : 'PASS',
        errors,
        warnings
      });
      setIsValidating(false);

      window.dispatchEvent(
        new CustomEvent('add-toast', {
          detail: {
            type: errors.length > 0 ? 'error' : 'success',
            title: errors.length > 0 ? 'Validation Failed' : 'Config Passed',
            message: errors.length > 0 ? `Found ${errors.length} critical policy violations.` : 'Configuration is compliant and ready for deployment.'
          }
        })
      );
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-[#091122] via-[#0b1730] to-[#080e1c] border border-gray-800/90 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00f0ff] to-blue-600 flex items-center justify-center text-gray-950 shadow-[0_0_25px_rgba(0,240,255,0.4)]">
              <FileJson className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white font-display tracking-tight flex items-center gap-3">
                FTN CONFIGURATION VALIDATOR
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#00f0ff]/20 text-[#00f0ff] font-mono border border-[#00f0ff]/40">
                  Pre-Flight Checks
                </span>
              </h1>
              <p className="text-gray-400 font-mono text-sm mt-1">
                Syntax linting and policy enforcement for JSON/YAML service definitions before grid deployment.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-1 flex items-center">
              <button
                onClick={() => setConfigType('YAML')}
                className={cn("px-4 py-1.5 rounded-lg text-xs font-bold font-mono transition-all", configType === 'YAML' ? "bg-gray-800 text-white" : "text-gray-500 hover:text-gray-300")}
              >
                YAML
              </button>
              <button
                onClick={() => setConfigType('JSON')}
                className={cn("px-4 py-1.5 rounded-lg text-xs font-bold font-mono transition-all", configType === 'JSON' ? "bg-gray-800 text-white" : "text-gray-500 hover:text-gray-300")}
              >
                JSON
              </button>
            </div>
            <button
              onClick={handleValidate}
              disabled={isValidating}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00f0ff] to-blue-500 text-gray-950 font-bold font-mono text-xs flex items-center gap-2 hover:brightness-110 transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] disabled:opacity-50"
            >
              <RefreshCw className={cn("w-4 h-4", isValidating && "animate-spin")} />
              {isValidating ? 'Validating...' : 'Run Pre-Flight Check'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#080e1c] border border-gray-800 rounded-2xl overflow-hidden flex flex-col">
          <div className="bg-gray-900/50 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
             <div className="flex items-center gap-2 text-gray-300 font-mono text-sm">
                <FileCode2 className="w-4 h-4 text-[#00f0ff]" />
                <span>service-definition.{configType.toLowerCase()}</span>
             </div>
             <button className="text-gray-500 hover:text-white transition-colors">
                <Settings className="w-4 h-4" />
             </button>
          </div>
          <textarea
            value={configContent}
            onChange={(e) => setConfigContent(e.target.value)}
            className="w-full flex-1 bg-transparent p-4 font-mono text-sm text-gray-300 focus:outline-none resize-none min-h-[400px]"
            spellCheck={false}
          />
        </div>

        <div className="bg-[#080e1c] border border-gray-800 rounded-2xl flex flex-col">
          <div className="bg-gray-900/50 border-b border-gray-800 px-4 py-3 flex items-center gap-2 text-gray-300 font-mono text-sm">
             <ListChecks className="w-4 h-4 text-purple-400" />
             <span>Validation Results</span>
          </div>
          <div className="p-6 flex-1 flex flex-col">
             {validationResults.status === 'IDLE' ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500 space-y-4">
                   <Shield className="w-12 h-12 text-gray-700" />
                   <p className="font-mono text-sm">Ready to scan against 142 enterprise policies.</p>
                </div>
             ) : (
                <div className="space-y-6 animate-in fade-in">
                   <div className={cn(
                      "p-4 rounded-xl border flex items-center gap-4",
                      validationResults.status === 'PASS' 
                         ? "bg-emerald-500/10 border-emerald-500/30 text-[#00ff66]" 
                         : "bg-red-500/10 border-red-500/30 text-red-400"
                   )}>
                      {validationResults.status === 'PASS' ? (
                         <CheckCircle2 className="w-8 h-8" />
                      ) : (
                         <XCircle className="w-8 h-8" />
                      )}
                      <div>
                         <h3 className="font-bold font-display text-lg">
                            {validationResults.status === 'PASS' ? 'Passed Validation' : 'Validation Failed'}
                         </h3>
                         <p className="font-mono text-xs opacity-80">
                            {validationResults.errors.length} Critical Errors &bull; {validationResults.warnings.length} Warnings
                         </p>
                      </div>
                   </div>

                   {validationResults.errors.length > 0 && (
                      <div className="space-y-3">
                         <h4 className="text-gray-400 font-mono text-xs uppercase tracking-wider flex items-center gap-2">
                            <XCircle className="w-3.5 h-3.5 text-red-400" /> Critical Violations
                         </h4>
                         {validationResults.errors.map((err, i) => (
                            <div key={i} className="bg-red-950/20 border border-red-900/50 p-3 rounded-lg text-red-300 font-mono text-xs">
                               {err}
                            </div>
                         ))}
                      </div>
                   )}

                   {validationResults.warnings.length > 0 && (
                      <div className="space-y-3">
                         <h4 className="text-gray-400 font-mono text-xs uppercase tracking-wider flex items-center gap-2">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Optimization Warnings
                         </h4>
                         {validationResults.warnings.map((warn, i) => (
                            <div key={i} className="bg-amber-950/20 border border-amber-900/50 p-3 rounded-lg text-amber-300 font-mono text-xs">
                               {warn}
                            </div>
                         ))}
                      </div>
                   )}
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
