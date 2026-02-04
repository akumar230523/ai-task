import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Grid, List, ChevronRight, X } from 'lucide-react';
import { TASKS, APP_CONFIG } from '../lib/constants';
import type { TaskId } from '../types/tasks';

const TasksPage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Get all unique categories
    const categories = Array.from(new Set(TASKS.map(task => task.category)));

    // Filter tasks based on search term and category
    const filteredTasks = useMemo(() => {
        return TASKS.filter(task => {
            const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.category.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory = !selectedCategory || task.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, selectedCategory]);

    const handleTaskClick = (taskId: TaskId) => {
        navigate(`/tasks/${taskId}`);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
    };

    return (
        <div className="min-h-screen">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                    All AI Tools
                </h1>
                <p className="text-gray-400">
                    Browse and search through our complete collection of {TASKS.length} AI-powered professional tools
                </p>
            </div>

            {/* Search and Filter Bar */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search Input */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search tasks by name, description, or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-10 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>

                    {/* Category Filter */}
                    <div className="relative">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full md:w-48 px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors appearance-none cursor-pointer"
                        >
                            <option value="">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category} className="bg-gray-800">
                                    {category}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <Filter size={18} className="text-gray-400" />
                        </div>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex bg-gray-800 border border-gray-700 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`px-3 py-2 rounded-md transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-300'}`}
                        >
                            <Grid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-2 rounded-md transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-300'}`}
                        >
                            <List size={18} />
                        </button>
                    </div>
                </div>

                {/* Active Filters */}
                {(searchTerm || selectedCategory) && (
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-sm text-gray-400">Active filters:</span>
                        {searchTerm && (
                            <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm">
                                Search: "{searchTerm}"
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="hover:text-blue-300"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}
                        {selectedCategory && (
                            <div className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm">
                                Category: {selectedCategory}
                                <button
                                    onClick={() => setSelectedCategory('')}
                                    className="hover:text-purple-300"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}
                        <button
                            onClick={clearFilters}
                            className="text-sm text-gray-400 hover:text-gray-300 ml-2"
                        >
                            Clear all
                        </button>
                    </div>
                )}
            </div>

            {/* Results Count */}
            <div className="mb-6 flex items-center justify-between">
                <div className="text-gray-400">
                    Showing <span className="text-white font-medium">{filteredTasks.length}</span> of {TASKS.length} tools
                </div>
                <div className="text-gray-400">
                    <span className="text-white font-medium">{APP_CONFIG.currency}{APP_CONFIG.taskPrice}</span> per task
                </div>
            </div>

            {/* Tasks Grid/List */}
            {filteredTasks.length > 0 ? (
                viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTasks.map((task) => {
                            const IconComponent = task.icon;
                            return (
                                <div
                                    key={task.id}
                                    onClick={() => handleTaskClick(task.id)}
                                    className="group bg-gray-800/50 border border-gray-700 hover:border-blue-500 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:scale-105"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <IconComponent className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-white mb-1">{task.name}</h3>
                                            <p className="text-sm text-gray-400">{task.description}</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transform group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500">{task.category}</span>
                                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-medium">
                                            ₹99/task
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-gray-800/30 border border-gray-700 rounded-xl overflow-hidden">
                        {filteredTasks.map((task, index) => {
                            const IconComponent = task.icon;
                            return (
                                <div
                                    key={task.id}
                                    onClick={() => handleTaskClick(task.id)}
                                    className={`flex items-center gap-4 p-4 cursor-pointer transition-colors hover:bg-gray-800/50 ${index !== filteredTasks.length - 1 ? 'border-b border-gray-700' : ''}`}
                                >
                                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                        <IconComponent className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-white truncate">{task.name}</h3>
                                        <p className="text-sm text-gray-400 truncate">{task.description}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs text-gray-500 whitespace-nowrap">{task.category}</span>
                                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-medium whitespace-nowrap">
                                            ₹99/task
                                        </span>
                                        <ChevronRight className="w-4 h-4 text-gray-500" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )
            ) : (
                <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                        <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No tasks found</h3>
                    <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria</p>
                    <button
                        onClick={clearFilters}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white rounded-lg transition-colors"
                    >
                        Clear all filters
                    </button>
                </div>
            )}

            {/* Categories Summary */}
            <div className="mt-12 pt-8 border-t border-gray-800">
                <h2 className="text-xl font-bold text-white mb-4">Browse by Category</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {categories.map((category) => {
                        const categoryTasks = TASKS.filter(t => t.category === category);
                        return (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`text-left p-4 rounded-lg border transition-colors cursor-pointer ${selectedCategory === category ? 'bg-blue-500/10 border-blue-500/30' : 'bg-gray-800/30 border-gray-700 hover:border-gray-600'}`}
                            >
                                <div className="font-medium text-white mb-1">{category}</div>
                                <div className="text-sm text-gray-400">{categoryTasks.length} tool{categoryTasks.length !== 1 ? 's' : ''}</div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default TasksPage;