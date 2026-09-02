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
import { CommandPalette } from './components/CommandPalette';
import { HealthTicker } from './components/HealthTicker';

function App() {
  const [activeTab, setActiveTab] = useState('mystack');
  const [isLightMode, setIsLightMode] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

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

  const renderContent = () => {
    switch (activeTab) {
      case 'mystack': return <MegaStackMatrix />;
      case 'core-router': return <MikroTikManager />;
      case 'dns': return <DnsManager />;
      case 'ddns': return <DdnsManager />;
      case 'domain': return <DomainManager />;
      case 'hosting': return <HostingManager />;
      case 'global': return <GlobalGridManager />;
      case 'mail': return <MailServiceManager />;
      case 'ftn-dns': return <FtnDnsArchitecture />;
      case 'android': return <OmniBuilder />;
      case 'dashboard': return <SmartNocDashboard />;
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
        />
        <HealthTicker />
        
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
