// Main Application Component
// =======================================================================

import { useState } from 'react';

import Header from './layout/Header';
import Footer from './layout/Footer';
import Sidebar from './layout/Sidebar';
import KioskMode from './layout/KioskMode';

import { TASKS, APP_CONFIG } from './lib/constants';
import type { AIProvider } from './types/ai';
import type { TaskId } from './types/tasks';

export default function App() {
    // State Management
    const [activeTask, setActiveTask] = useState<TaskId>('invoice');
    const [provider, setProvider] = useState<AIProvider>('edenai');
    const [kioskMode, setKioskMode] = useState(
        import.meta.env.VITE_KIOSK_MODE === 'true'
    );
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Get active task data
    const ActiveComponent = TASKS.find(t => t.id === activeTask)?.component;
    const activeTaskData = TASKS.find(t => t.id === activeTask);

    return (
        <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col ${kioskMode ? 'kiosk-mode' : ''}`}>

            {/* Kiosk Mode Security Overlay */}
            <KioskMode
                isEnabled={kioskMode}
                onExit={() => setKioskMode(false)}
            />

            {/* Main Container */}
            <div className={`flex flex-col flex-1 ${kioskMode ? 'pt-12' : ''}`}>

                {/* Header Navigation */}

                <Header
                    provider={provider}
                    onProviderChange={(p) => setProvider(p as AIProvider)}
                    kioskMode={kioskMode}
                    onToggleKiosk={() => setKioskMode(!kioskMode)}
                    onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    sidebarOpen={sidebarOpen}
                />

                {/* Content Area with Sidebar */}
                <div className="flex-1 flex flex-col relative">

                    {/* Sidebar Overlay - Shows when toggled */}
                    {!kioskMode && sidebarOpen && (
                        <Sidebar
                            tasks={TASKS}
                            activeTask={activeTask}
                            onTaskSelect={(taskId) => {
                                setActiveTask(taskId as TaskId);
                                setSidebarOpen(false);
                            }}
                            isOpen={sidebarOpen}
                            onClose={() => setSidebarOpen(false)}
                        />
                    )}

                    {/* Main Content Area */}
                    <main className="flex-1">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">

                            {/* Task Header Card */}
                            {activeTaskData && (
                                <div className="mb-6 lg:mb-8">
                                    <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">

                                            {/* Task Icon & Title */}
                                            <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-${activeTaskData.color}-100 rounded-xl flex items-center justify-center flex-shrink-0`}>
                                                <activeTaskData.icon
                                                    className={`text-${activeTaskData.color}-600`}
                                                    size={24}
                                                />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                                                    {activeTaskData.name}
                                                </h1>
                                                <p className="text-sm sm:text-base text-gray-600 mt-0.5 sm:mt-1">
                                                    {activeTaskData.description}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Category: {activeTaskData.category}
                                                </p>
                                            </div>

                                            {/* Status Badges */}
                                            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto flex-wrap">
                                                <span className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap">
                                                    {provider.toUpperCase()}
                                                </span>
                                                <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap">
                                                    {APP_CONFIG.currency}{APP_CONFIG.taskPrice}/task
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Active Task Component */}
                            {ActiveComponent && (
                                <ActiveComponent provider={provider} />
                            )}
                        </div>
                    </main>
                </div>

                {/* Footer */}
                <Footer provider={provider} kioskMode={kioskMode} />
            </div>
        </div>
    );
}