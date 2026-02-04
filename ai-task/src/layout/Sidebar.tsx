import { Link } from 'react-router-dom';
import type { TaskDefinition } from '../types/tasks';

interface SidebarProps {
    tasks: TaskDefinition[];
    activeTask: string;
    onTaskSelect: (taskId: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar = ({ tasks, isOpen, onClose }: SidebarProps) => {
    if (!isOpen) return null;

    const categories = Array.from(new Set(tasks.map(task => task.category)));

    return (
        <div className="fixed inset-0 z-40">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* RIGHT SIDEBAR (no scrolling here) */}
            <div className="absolute right-0 top-0 bottom-0 w-80 bg-gray-900 border-l border-gray-800">
                
                {/* SCROLL CONTAINER */}
                <div className="h-full overflow-y-auto p-6">
                    <div className="flex items-center justify-between mb-6 mt-12">
                        <h2 className="pr-2 w-full text-end text-base text-white">
                            All Tasks
                        </h2>
                    </div>

                    <div className="space-y-6">
                        {categories.map(category => {
                            const categoryTasks = tasks.filter(t => t.category === category);

                            return (
                                <div key={category}>
                                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                        {category} ({categoryTasks.length})
                                    </h3>
                                    <div className="space-y-1">
                                        {categoryTasks.map(task => {
                                            const IconComponent = task.icon;
                                            return (
                                                <Link
                                                    key={task.id}
                                                    to={`/tasks/${task.id}`}
                                                    onClick={onClose}
                                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                                        <IconComponent className="w-4 h-4 text-blue-400" />
                                                    </div>
                                                    <span className="text-sm font-medium">
                                                        {task.name}
                                                    </span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-800">
                        <Link
                            to="/tasks"
                            onClick={onClose}
                            className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                        >
                            View All Tasks
                        </Link>
                    </div>
                </div>
            </div>
            
        </div>
    );
}

export default Sidebar;