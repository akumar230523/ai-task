import { useParams, Navigate } from 'react-router-dom';
import { TASKS, APP_CONFIG } from '../lib/constants';
import type { AIProvider } from '../types/ai';
import type { TaskId } from '../types/tasks';

interface TaskDetailPageProps {
    provider: AIProvider;
}

const TaskDetailPage = ({ provider }: TaskDetailPageProps) => {
    const { taskId } = useParams<{ taskId: TaskId }>();

    // Find the task
    const task = TASKS.find(t => t.id === taskId);
    const TaskComponent = task?.component;

    // If task not found, redirect to tasks page
    if (!task || !TaskComponent) {
        return <Navigate to="/tasks" replace />;
    }

    return (
        <div className="min-h-screen">
            {/* Task Header */}
            <div className="mb-6 lg:mb-8">
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        {/* Task Icon & Title */}
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <task.icon
                                className="text-blue-400"
                                size={24}
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">
                                {task.name}
                            </h1>
                            <p className="text-sm sm:text-base text-gray-400 mt-0.5 sm:mt-1">
                                {task.description}
                            </p>
                        </div>

                        {/* Status Badges */}
                        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto flex-wrap">
                            <span className="px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap">
                                {provider.toUpperCase()}
                            </span>
                            <span className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap">
                                {APP_CONFIG.currency}{APP_CONFIG.taskPrice}/task
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Task Component */}
            <div className="bg-gray-800/30 overflow-hidden">
                <TaskComponent provider={provider} />
            </div>

            {/* Related Tasks */}
            <div className="mt-12 pt-8 border-t border-gray-800">
                <h2 className="text-xl font-bold text-white mb-4">Related Tools</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {TASKS
                        .filter(t => t.category === task.category && t.id !== task.id)
                        .slice(0, 3)
                        .map(relatedTask => (
                            <a
                                key={relatedTask.id}
                                href={`/tasks/${relatedTask.id}`}
                                className="block p-4 bg-gray-800/30 border border-gray-700 hover:border-blue-500 rounded-lg transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                        <relatedTask.icon className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-white">{relatedTask.name}</h3>
                                        <p className="text-xs text-gray-400 mt-1">{relatedTask.description}</p>
                                    </div>
                                </div>
                            </a>
                        ))}
                </div>
            </div>
        </div>
    );
}

export default TaskDetailPage;