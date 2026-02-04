import { useNavigate } from 'react-router-dom';
import { Sparkles, Zap, Shield, TrendingUp, Users, ArrowRight, MessageSquare, FileText, Cpu, Terminal, Palette, ChevronRight, Calculator, Scale, MessageSquareText, Construction, GraduationCap } from 'lucide-react';
import { TASKS, THEME } from '../lib/constants';
import type { AIProvider } from '../types/ai';
import type { TaskId } from '../types/tasks';

interface HomePageProps {
    provider: AIProvider;
}

const HomePage = ({ provider }: HomePageProps) => {
    const navigate = useNavigate();

    const popularTasks = TASKS.filter(t =>
        ['invoice', 'resume', 'legal', 'coding', 'content-writing', 'email'].includes(t.id)
    );

    // Category icons mapping
    const categoryIcons = {
        'Business & Finance': Calculator,
        'Legal & Compliance': Scale,
        'Design & Creative': Palette,
        'Technology': Cpu,
        'Content & Communication': MessageSquareText,
        'Professional Services': GraduationCap,
        'Engineering': Construction
    };

    const benefits = [
        {
            icon: Zap,
            title: "Lightning Fast",
            description: "Generate professional documents in seconds"
        },
        {
            icon: Shield,
            title: "Secure & Private",
            description: "Your data is encrypted and never stored"
        },
        {
            icon: TrendingUp,
            title: "Cost Effective",
            description: "Only ₹99 per task - no subscriptions"
        },
        {
            icon: Users,
            title: "Expert Quality",
            description: "Created by industry professionals"
        }
    ];

    const categories = Array.from(new Set(TASKS.map(task => task.category)));

    // Count tools per category
    const getToolsCount = (category: string) => {
        return TASKS.filter(task => task.category === category).length;
    };

    const handleTaskSelect = (taskId: TaskId) => {
        navigate(`/tasks/${taskId}`);
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl" />

                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-sm font-medium mb-6">
                            <Sparkles className="w-4 h-4" />
                            Powered by {provider.toUpperCase()}
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            AI-Powered
                            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Professional Tasks
                            </span>
                        </h1>

                        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                            Generate professional documents, code, designs, and more with our AI-powered platform.
                            28 specialized tools for every professional need.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate('/tasks')}
                                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-white font-medium rounded-lg transition-all cursor-pointer duration-200 hover:scale-105 active:scale-95"
                                style={{ backgroundColor: THEME.primary }}
                            >
                                <Zap className="w-5 h-5" />
                                Start Creating Free
                                <ArrowRight className="w-5 h-5" />
                            </button>

                            <button
                                onClick={() => navigate('/tasks')}
                                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-medium rounded-lg transition-all cursor-pointer duration-200"
                            >
                                <Terminal className="w-5 h-5" />
                                Explore All Tools
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Tasks */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-white mb-4 mt-8">
                        Most Popular Tools
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Start with our most commonly used AI tools trusted by professionals
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {popularTasks.map((task) => {
                        const IconComponent = task.icon;
                        return (
                            <button
                                key={task.id}
                                onClick={() => handleTaskSelect(task.id)}
                                className="group bg-gray-800/50 border border-gray-700 hover:border-blue-500 rounded-xl p-6 text-left transition-all cursor-pointer duration-200 hover:scale-105 active:scale-95"
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
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Categories */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Browse by Category
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Explore tools organized by professional domains
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {categories.map((category) => {
                        const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || FileText;
                        const toolsCount = getToolsCount(category);

                        return (
                            <button
                                key={category}
                                onClick={() => navigate('/tasks')}
                                className="group bg-gray-800/50 border border-gray-700 hover:border-blue-500 rounded-xl p-5 transition-all cursor-pointer duration-200 hover:scale-105"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                        <IconComponent className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div className="text-left flex-1">
                                        <h3 className="font-semibold text-white mb-1">{category}</h3>
                                        <p className="text-xs text-gray-400">{toolsCount} tool{toolsCount !== 1 ? 's' : ''}</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transform group-hover:translate-x-1 transition-all" />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Benefits */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {benefits.map((benefit) => (
                        <div key={benefit.title} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                                <benefit.icon className="w-6 h-6 text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                            <p className="text-gray-400">{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                <div className="bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 border border-blue-500/30 rounded-2xl p-8 md:p-12 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to Boost Your Productivity?
                    </h2>
                    <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                        Join thousands of professionals who are saving time and money with our AI-powered platform
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/tasks')}
                            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-white font-medium rounded-lg transition-all cursor-pointer duration-200 hover:scale-105"
                            style={{ backgroundColor: THEME.primary }}
                        >
                            <Zap className="w-5 h-5" />
                            Start Creating Now
                        </button>
                        <button
                            onClick={() => navigate('/tasks')}
                            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-medium rounded-lg transition-all cursor-pointer duration-200"
                        >
                            <MessageSquare className="w-5 h-5" />
                            View All Tools
                        </button>
                    </div>
                    <p className="text-sm text-gray-400 mt-6">
                        No credit card required • First task free for new users
                    </p>
                </div>
            </div>
        </div>
    );
}

export default HomePage;