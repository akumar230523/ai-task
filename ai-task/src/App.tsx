// Main Application Component
// =======================================================================

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Sidebar from './layout/Sidebar';
import KioskMode from './layout/KioskMode';
import HomePage from './pages/HomePage';
import TasksPage from './pages/TasksPage';
import TaskDetailPage from './pages/TaskDetailPage';
import { TASKS } from './lib/constants';
import type { AIProvider } from './types/ai';
// import type { TaskId } from './types/tasks';

export default function App() {
    const [provider, setProvider] = useState<AIProvider>('edenai');
    const [kioskMode, setKioskMode] = useState(
        import.meta.env.VITE_KIOSK_MODE === 'true'
    );
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <Router>
            <div className={`min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex flex-col ${kioskMode ? 'kiosk-mode' : ''}`}>

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
                                activeTask={''}
                                onTaskSelect={() => {
                                    setSidebarOpen(false);
                                }}
                                isOpen={sidebarOpen}
                                onClose={() => setSidebarOpen(false)}
                            />
                        )}

                        {/* Main Content Area */}
                        <main className="flex-1">
                            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
                                <Routes>
                                    <Route path="/" element={<HomePage provider={provider} />} />
                                    <Route path="/tasks" element={<TasksPage />} />
                                    <Route path="/tasks/:taskId" element={<TaskDetailPage provider={provider} />} />
                                    <Route path="*" element={<Navigate to="/" replace />} />
                                </Routes>
                            </div>
                        </main>
                    </div>

                    {/* Footer */}
                    <Footer provider={provider} kioskMode={kioskMode} />
                </div>
            </div>
        </Router>
    );
}