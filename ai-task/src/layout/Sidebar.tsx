// Sidebar
// =======================================================================

import { X, Zap } from 'lucide-react';

interface Task {
    id: string;
    name: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    color: string;
    description: string;
}

interface SidebarProps {
    tasks: Task[];
    activeTask: string;
    onTaskSelect: (taskId: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({
    tasks,
    activeTask,
    onTaskSelect,
    isOpen,
    onClose
}: SidebarProps) {

    return (
        <aside
            className={`
        fixed top-0 left-0 bottom-0 z-40
        w-80 sm:w-96 max-w-[90vw]
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        bg-white shadow-2xl
        flex flex-col
      `}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow">
                        AI
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-900 text-lg">AI Tasks</h2>
                        <p className="text-xs text-gray-600">Choose your task</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                    aria-label="Close sidebar"
                >
                    <X size={22} className="text-gray-600" />
                </button>
            </div>

            {/* Tasks List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-4 text-sm font-medium text-gray-700">
                    <Zap size={18} className="text-yellow-500" />
                    <span>All Tasks</span>
                    <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-2.5 py-1 rounded-full font-bold">
                        {tasks.length}
                    </span>
                </div>

                <div className="space-y-2.5">
                    {tasks.map(task => {
                        const Icon = task.icon;
                        const isActive = activeTask === task.id;

                        return (
                            <button
                                key={task.id}
                                onClick={() => onTaskSelect(task.id)}
                                className={`
                  group flex items-center gap-3 w-full p-4 rounded-xl 
                  transition-all duration-200 border-2
                  ${isActive
                                        ? `bg-gradient-to-r from-${task.color}-50 to-${task.color}-100 border-${task.color}-300 shadow-md`
                                        : 'hover:bg-gray-50 border-transparent hover:border-gray-200'
                                    }
                `}
                            >
                                {/* Icon */}
                                <div className={`
                  p-2.5 rounded-lg flex-shrink-0
                  transition-all group-hover:scale-110
                  ${isActive
                                        ? `bg-${task.color}-200 shadow-sm`
                                        : 'bg-gray-100 group-hover:bg-gray-200'
                                    }
                `}>
                                    <Icon
                                        size={22}
                                        className={isActive ? `text-${task.color}-700` : 'text-gray-600'}
                                    />
                                </div>

                                {/* Task Info */}
                                <div className="flex-1 text-left min-w-0">
                                    <div className={`
                    font-semibold text-sm sm:text-base truncate
                    ${isActive ? 'text-gray-900' : 'text-gray-700'}
                  `}>
                                        {task.name}
                                    </div>
                                    <div className="text-xs text-gray-500 truncate mt-0.5">
                                        {task.description}
                                    </div>
                                </div>

                                {/* Active Indicator */}
                                {isActive && (
                                    <div className={`w-2 h-2 rounded-full bg-${task.color}-600 flex-shrink-0 animate-pulse`} />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
}