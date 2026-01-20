// Main application 
// =======================================================================

import { useState } from 'react';
import { FileText, Scale, Mic, Mail, MessageSquare, FileSearch } from 'lucide-react';

import Header from './layout/Header';
import Footer from './layout/Footer';
import { KioskMode } from './layout/KioskMode';

import type { AIProvider } from './types/ai';

import InvoiceTask from './components/InvoiceFlow';
import LegalTask from './components/LegalTask';
import VoiceTask from './components/VoiceTask';
import EmailTask from './components/EmailTask';
import SummaryTask from './components/SummaryTask';
import TranslateTask from './components/TranslateTask';

export default function App() {

  const [activeTask, setActiveTask] = useState<'invoice' | 'legal' | 'voice' | 'email' | 'summary' | 'translate'>('invoice');
  const [provider, setProvider] = useState<AIProvider>('openai');
  const [kioskMode, setKioskMode] = useState(false);

  const tasks = [
    { id: 'invoice' as const, name: 'Invoice', icon: FileText, component: InvoiceTask },
    { id: 'legal' as const, name: 'Legal', icon: Scale, component: LegalTask },
    { id: 'voice' as const, name: 'Voice', icon: Mic, component: VoiceTask },
    { id: 'email' as const, name: 'Email', icon: Mail, component: EmailTask },
    { id: 'summary' as const, name: 'Summary', icon: FileSearch, component: SummaryTask },
    { id: 'translate' as const, name: 'Translate', icon: MessageSquare, component: TranslateTask },
  ];

  const ActiveComponent = tasks.find(t => t.id === activeTask)?.component;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 ${kioskMode ? 'kiosk-mode' : ''}`}>
      {/* Kiosk Mode Overlay */}
      <KioskMode isEnabled={kioskMode} onExit={() => setKioskMode(false)} />

      {/* Add padding for kiosk mode top bar */}
      <div className={kioskMode ? 'pt-12' : ''}>
        {/* Header */}
        <Header
          provider={provider}
          onProviderChange={(p) => setProvider(p as AIProvider)}
          kioskMode={kioskMode}
          onToggleKiosk={() => setKioskMode(!kioskMode)}
        />
        {/* Main Content */}
        <main className="container mx-auto px-4 py-6">
          {/* Task Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {tasks.map(task => {
              const Icon = task.icon;
              return (
                <button
                  key={task.id}
                  onClick={() => setActiveTask(task.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition ${activeTask === task.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border'
                    } ${kioskMode ? 'min-h-16 text-lg' : ''}`}
                >
                  <Icon size={kioskMode ? 24 : 18} />
                  {task.name}
                </button>
              );
            })}
          </div>
          {ActiveComponent && <ActiveComponent provider={provider} />}  {/* Active Task */}
        </main>
        {/* Footer */}
        <Footer provider={provider} kioskMode={kioskMode} />
      </div>
    </div>
  );
  
}