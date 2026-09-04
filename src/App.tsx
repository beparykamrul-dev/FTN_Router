import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { SmartNocDashboard } from './components/SmartNocDashboard';
import { GisFiberTopology } from './components/GisFiberTopology';
import { MikroTikManager } from './components/MikroTikManager';
import { OltManager } from './components/OltManager';
import { AiAssistant } from './components/AiAssistant';
import { SubscriberBilling } from './components/SubscriberBilling';
import { CompilerPipelineView } from './components/CompilerPipelineView';
import { MicroservicesMatrix } from './components/MicroservicesMatrix';
import { ApiGatewayMesh } from './components/ApiGatewayMesh';
import { OmniBuilder } from './components/OmniBuilder';
import { GlobalEdgePeering } from './components/GlobalEdgePeering';
import { DnsManager } from './components/DnsManager';
import { CryptoPkiManager } from './components/CryptoPkiManager';
import { ConfigBackupManager } from './components/ConfigBackupManager';
import { EdgeTrafficSimulator } from './components/EdgeTrafficSimulator';
import { HardwareLifecycleManager } from './components/HardwareLifecycleManager';
import { DeviceDriverManager } from './components/DeviceDriverManager';
import { ToastSystem } from './components/ToastSystem';
import { DdnsManager } from './components/DdnsManager';
import { DomainManager } from './components/DomainManager';
import { HostingManager } from './components/HostingManager';
import { MailServiceManager } from './components/MailServiceManager';
import { GlobalGridManager } from './components/GlobalGridManager';
import { MegaStackMatrix } from './components/MegaStackMatrix';
import { FtnDnsArchitecture } from './components/FtnDnsArchitecture';
import { AiCallCenter } from './components/AiCallCenter';
import { AiBillingGateway } from './components/AiBillingGateway';
import { AiNetworkAgent } from './components/AiNetworkAgent';
import { AiAccountingSystem } from './components/AiAccountingSystem';
import { KismetWirelessInspector } from './components/KismetWirelessInspector';
import { KopiaBackupManager } from './components/KopiaBackupManager';
import { OpenSearchAnalytics } from './components/OpenSearchAnalytics';
import { FtnSharedAuthUi } from './components/FtnSharedAuthUi';
import { FtnBrandKit } from './components/FtnBrandKit';
import { CdnEdgeManager } from './components/CdnEdgeManager';
import { FtnSdWanController } from './components/FtnSdWanController';
import { FtnServiceArchitecture } from './components/FtnServiceArchitecture';
import { FtnJobJournal } from './components/FtnJobJournal';
import { FtnIpamManager } from './components/FtnIpamManager';
import { FtnPolicyEngine } from './components/FtnPolicyEngine';
import { FtnAccessControlMatrix } from './components/FtnAccessControlMatrix';
import { FtnTelemetryDashboard } from './components/FtnTelemetryDashboard';
import { FtnRouterAutomation } from './components/FtnRouterAutomation';
import { FtnSmartDnsManager } from './components/FtnSmartDnsManager';
import { FtnAiPredictiveNoc } from './components/FtnAiPredictiveNoc';
import { FtnProvisioningWizard } from './components/FtnProvisioningWizard';
import { FtnBgpTrafficVisualizer } from './components/FtnBgpTrafficVisualizer';
import { FtnProtocolSelector } from './components/FtnProtocolSelector';
import { FtnTunnelHealthWidget } from './components/FtnTunnelHealthWidget';
import { FtnAiDynamicProxy } from './components/FtnAiDynamicProxy';
import { FtnDynamicVpnMesh } from './components/FtnDynamicVpnMesh';
import { FtnServiceRegistry } from './components/FtnServiceRegistry';
import { FtnStatusPage } from './components/FtnStatusPage';
import { FtnMultiServerMesh } from './components/FtnMultiServerMesh';
import { FtnScalingController } from './components/FtnScalingController';
import { FtnResourceDashboard } from './components/FtnResourceDashboard';
import { FtnSmartAlertEngine } from './components/FtnSmartAlertEngine';
import { FtnGlobalMonitoringHub } from './components/FtnGlobalMonitoringHub';
import { FtnMigrationJournal } from './components/FtnMigrationJournal';
import { FtnAiAnomalyPredictor } from './components/FtnAiAnomalyPredictor';
import { FtnGlobalNetworkHeatmap } from './components/FtnGlobalNetworkHeatmap';
import { FtnSmartGridOptimizer } from './components/FtnSmartGridOptimizer';
import { FtnEcosystemGlossary } from './components/FtnEcosystemGlossary';
import { FtnAiIncidentCorrelator } from './components/FtnAiIncidentCorrelator';
import { FtnZeroTrustGateway } from './components/FtnZeroTrustGateway';
import { FtnNetFlowCollector } from './components/FtnNetFlowCollector';
import { FtnPkiManager } from './components/FtnPkiManager';
import { FtnCoreControlPlane } from './components/FtnCoreControlPlane';
import { FtnSetupWizard } from './components/FtnSetupWizard';
import { FtnEcosystemVisualizer } from './components/FtnEcosystemVisualizer';
import { CommandPalette } from './components/CommandPalette';
import { HealthTicker } from './components/HealthTicker';
import { useServiceHealth } from './hooks/useServiceHealth.js';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLightMode, setIsLightMode] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const healthServices = useServiceHealth();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('theme-light');
    } else {
      document.body.classList.remove('theme-light');
    }
  }, [isLightMode]);

  const handleServiceNavigation = (serviceId: string) => {
    switch (serviceId) {
      case 'ftn-core-noc':
        setActiveTab('core-router');
        break;
      case 'ftn-opensearch-siem':
        setActiveTab('opensearch');
        break;
      case 'ftn-personal-vault':
        setActiveTab('kopia');
        break;
      case 'ftn-kismet-rf':
        setActiveTab('kismet');
        break;
      case 'ftn-ai-accounting':
        setActiveTab('ai-accounting');
        break;
      case 'ftn-wireguard-mesh':
        setActiveTab('android');
        break;
      case 'ftn-family-safeguard':
        setActiveTab('dns');
        break;
      case 'ftn-family-voip':
        setActiveTab('ai-call-center');
        break;
      case 'ftn-web3-evm':
        setActiveTab('global');
        break;
      default:
        setActiveTab('dashboard');
        break;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'incident-correlator': return <FtnAiIncidentCorrelator />;
      case 'zerotrust-gateway': return <FtnZeroTrustGateway />;
      case 'netflow-collector': return <FtnNetFlowCollector />;
      case 'pki-manager': return <FtnPkiManager />;
      case 'multi-server': return <FtnMultiServerMesh />;
      case 'scaling-controller': return <FtnScalingController />;
      case 'resource-dashboard': return <FtnResourceDashboard />;
      case 'smart-alert-engine': return <FtnSmartAlertEngine />;
      case 'global-monitoring-hub': return <FtnGlobalMonitoringHub />;
      case 'migration-journal': return <FtnMigrationJournal />;
      case 'anomaly-predictor': return <FtnAiAnomalyPredictor />;
      case 'network-heatmap': return <FtnGlobalNetworkHeatmap />;
      case 'smart-grid-optimizer': return <FtnSmartGridOptimizer onNavigateToJournal={() => setActiveTab('migration-journal')} />;
      case 'setup-wizard': return <FtnSetupWizard onNavigate={setActiveTab} />;
      case 'ecosystem-visualizer': return <FtnEcosystemVisualizer onNavigate={setActiveTab} />;
      case 'ecosystem-glossary': return <FtnEcosystemGlossary onNavigate={setActiveTab} />;
      case 'service-registry': return <FtnServiceRegistry />;
      case 'status-page': return <FtnStatusPage />;
      case 'architecture': return <FtnServiceArchitecture />;
      case 'job-journal': return <FtnJobJournal />;
      case 'access-control': return <FtnAccessControlMatrix />;
      case 'telemetry': return <FtnTelemetryDashboard />;
      case 'automation': return <FtnRouterAutomation />;
      case 'smart-dns': return <FtnSmartDnsManager />;
      case 'ai-noc': return <FtnAiPredictiveNoc />;
      case 'provisioning': return <FtnProvisioningWizard />;
      case 'bgp-visualizer': return <FtnBgpTrafficVisualizer />;
      case 'protocol-selector': return <FtnProtocolSelector />;
      case 'tunnel-health': return <FtnTunnelHealthWidget />;
      case 'ai-proxy': return <FtnAiDynamicProxy />;
      case 'vpn-mesh': return <FtnDynamicVpnMesh />;
      case 'ipam-manager': return <FtnIpamManager />;
      case 'policy-engine': return <FtnPolicyEngine />;
      case 'cdn-edge': return <CdnEdgeManager />;
      case 'sdwan-controller': return <FtnSdWanController />;
      case 'branding': return <FtnBrandKit />;
      case 'shared-auth': return (
        <FtnSharedAuthUi 
          onNavigateToService={handleServiceNavigation} 
          onNavigateToBrandKit={() => setActiveTab('branding')}
        />
      );
      case 'mystack': return <MegaStackMatrix />;
      case 'kismet': return <KismetWirelessInspector />;
      case 'kopia': return <KopiaBackupManager />;
      case 'opensearch': return <OpenSearchAnalytics />;
      case 'core-router': return <MikroTikManager />;
      case 'dns': return <DnsManager />;
      case 'ddns': return <DdnsManager />;
      case 'domain': return <DomainManager />;
      case 'hosting': return <HostingManager />;
      case 'global': return <GlobalGridManager />;
      case 'mail': return <MailServiceManager />;
      case 'ftn-dns': return <FtnDnsArchitecture />;
      case 'ai-accounting': return <AiAccountingSystem />;
      case 'ai-call-center': return <AiCallCenter />;
      case 'ai-billing': return <AiBillingGateway />;
      case 'ai-network-agent': return <AiNetworkAgent />;
      case 'android': return <OmniBuilder />;
      case 'dashboard':
      case 'control-plane': return <FtnCoreControlPlane onNavigate={setActiveTab} />;
      case 'network-map': return <FtnGlobalNetworkHeatmap />;
      case 'routers': return <MikroTikManager />;
      case 'clients': return <SubscriberBilling />;
      case 'ftnvpn': return <FtnDynamicVpnMesh />;
      case 'monitoring': return <FtnGlobalMonitoringHub />;
      case 'firmware': return <CompilerPipelineView />;
      case 'alerts': return <FtnSmartAlertEngine />;
      case 'dns-platform': return <FtnDnsArchitecture />;
      case 'servers': return <FtnMultiServerMesh />;
      case 'reports': return <FtnTelemetryDashboard />;
      case 'ai-intelligence': return <FtnAiPredictiveNoc />;
      case 'settings': return <FtnPolicyEngine />;
      case 'audit-logs': return <FtnMigrationJournal />;
      case 'smart-noc': return <SmartNocDashboard />;
      case 'mesh': return <ApiGatewayMesh />;
      case 'crypto-pki': return <CryptoPkiManager />;
      case 'backup': return <ConfigBackupManager />;
      case 'simulator': return <EdgeTrafficSimulator />;
      case 'lifecycle': return <HardwareLifecycleManager />;
      case 'drivers': return <DeviceDriverManager />;
      case 'peering': return <GlobalEdgePeering />;
      case 'topology': return <GisFiberTopology />;
      case 'olt': return <OltManager />;
      case 'subscribers': return <SubscriberBilling />;
      case 'ai': return <AiAssistant />;
      case 'microservices': return <MicroservicesMatrix />;
      case 'compiler': return <CompilerPipelineView />;
      default: return <MegaStackMatrix />;
    }
  };

  return (
    <div className={`flex h-screen bg-[#05070a] overflow-hidden text-gray-100 font-sans selection:bg-[#00f0ff]/30 ${isLightMode ? 'theme-light' : ''} relative`}>
      {/* FTN Watermark */}
      <div className="absolute inset-0 pointer-events-none animate-subtle-pulse flex items-center justify-center overflow-hidden">
        <span className="font-display font-black text-[30vw] select-none text-white whitespace-nowrap">FTN</span>
      </div>
      
      {/* Background gradients managed in index.css */}
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
        onNavigate={setActiveTab} 
      />
      <ToastSystem />
      
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <Navbar 
          isLightMode={isLightMode} 
          toggleTheme={() => setIsLightMode(!isLightMode)} 
          openCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenSharedAuth={() => setActiveTab('shared-auth')}
          onOpenBrandKit={() => setActiveTab('branding')}
        />
        <HealthTicker onNavigate={setActiveTab} />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
