// Main Application Component
// =======================================================================

import { useState } from 'react';
import { FileText, Scale, Mic, Mail, FileSearch, MessageSquare, Menu } from 'lucide-react';

import Header from './layout/Header';
import Footer from './layout/Footer';
import Sidebar from './layout/Sidebar';
import KioskMode from './layout/KioskMode';

import InvoiceTask from './components/InvoiceTask';
import LegalTask from './components/LegalTask';
import VoiceTask from './components/VoiceTask';
import EmailTask from './components/EmailTask';
import SummaryTask from './components/SummaryTask';
import TranslateTask from './components/TranslateTask';

import type { AIProvider } from './types/ai';

export default function App() {
  const [activeTask, setActiveTask] = useState<'invoice' | 'legal' | 'voice' | 'email' | 'summary' | 'translate'>('invoice');
  const [provider, setProvider] = useState<AIProvider>('edenai');

  const [kioskMode, setKioskMode] = useState(import.meta.env.VITE_KIOSK_MODE === 'true');

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tasks = [
    {
      id: 'invoice' as const,
      name: 'Invoice Generator',
      icon: FileText,
      color: 'blue',
      description: 'Create professional invoices',
      component: InvoiceTask
    },
    {
      id: 'legal' as const,
      name: 'Legal Drafter',
      icon: Scale,
      color: 'purple',
      description: 'Draft legal documents',
      component: LegalTask
    },
    {
      id: 'voice' as const,
      name: 'Voice Transcription',
      icon: Mic,
      color: 'green',
      description: 'Transcribe audio to text',
      component: VoiceTask
    },
    {
      id: 'email' as const,
      name: 'Email Writer',
      icon: Mail,
      color: 'orange',
      description: 'Write professional emails',
      component: EmailTask
    },
    {
      id: 'summary' as const,
      name: 'Content Summarizer',
      icon: FileSearch,
      color: 'pink',
      description: 'Summarize long content',
      component: SummaryTask
    },
    {
      id: 'translate' as const,
      name: 'Language Translator',
      icon: MessageSquare,
      color: 'indigo',
      description: 'Translate between languages',
      component: TranslateTask
    },
  ];

  const ActiveComponent = tasks.find(t => t.id === activeTask)?.component;
  const activeTaskData = tasks.find(t => t.id === activeTask);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col ${kioskMode ? 'kiosk-mode' : ''}`}>
      {/* Kiosk Mode Overlay */}
      <KioskMode isEnabled={kioskMode} onExit={() => setKioskMode(false)} />

      {/* Main Container */}
      <div className={`flex flex-col flex-1 ${kioskMode ? 'pt-12' : ''}`}>
        {/* Header */}
        <Header
          provider={provider}
          onProviderChange={(p) => setProvider(p as AIProvider)}
          kioskMode={kioskMode}
          onToggleKiosk={() => setKioskMode(!kioskMode)}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Content Area with Sidebar Overlay */}
        <div className="flex-1 flex flex-col relative">
          {/* Sidebar Overlay - Shows on all screens when toggled */}

          {!kioskMode && sidebarOpen && (
            <Sidebar
              tasks={tasks}
              activeTask={activeTask}
              onTaskSelect={(taskId) => {
                setActiveTask(taskId as typeof activeTask);
                setSidebarOpen(false);
              }}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <main className="flex-1">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">

              {/* Tasks Menu Button */}
              {!kioskMode && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="mb-4 flex items-center gap-2 px-4 py-2.5 bg-white rounded-lg shadow-sm border hover:bg-gray-50 transition-colors hover:shadow-md"
                >
                  <Menu size={20} className="text-gray-600" />
                  <span className="font-medium text-gray-700">All Tasks</span>
                  <span className="ml-2 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                    {tasks.length}
                  </span>
                </button>
              )}

              {/* Task Header Card - Responsive */}
              {activeTaskData && (
                <div className="mb-6 lg:mb-8">
                  <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {/* Icon & Title */}
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-${activeTaskData.color}-100 rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <activeTaskData.icon className={`text-${activeTaskData.color}-600`} size={24} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                          {activeTaskData.name}
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600 mt-0.5 sm:mt-1">
                          {activeTaskData.description}
                        </p>
                      </div>

                      {/* Badges */}
                      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto flex-wrap">
                        <span className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap">
                          {provider.toUpperCase()}
                        </span>
                        <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap">
                          ₹99/task
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Active Task Component */}
              {ActiveComponent && <ActiveComponent provider={provider} />}
            </div>
          </main>
        </div>

        {/* Footer - Full Width */}
        <Footer provider={provider} kioskMode={kioskMode} />
      </div>
    </div>
  );
}
