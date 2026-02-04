// Application Constants and Task Registry
// =======================================================================

import {
    FileText,
    Scale,
    Mic,
    Mail,
    MessageSquare,
    Calculator,
    Receipt,
    FileEdit,
    Building2,
    Sofa,
    Construction,
    Code,
    BarChart3,
    Palette,
    Smartphone,
    TrendingUp,
    PenTool,
    GraduationCap,
    FileUser,
    Users,
    Briefcase,
    Rocket,
    DollarSign,
    Home,
    Plane,
    Heart,
    Search,
    ClipboardList
} from 'lucide-react';

import type { TaskDefinition } from '../types/tasks';

// Import task components
import InvoiceTask from '../tasks/InvoiceTask';
import LegalTask from '../tasks/LegalTask';
import VoiceTask from '../tasks/VoiceTask';
import EmailTask from '../tasks/EmailTask';
import TranslateTask from '../tasks/TranslateTask';
import AccountingTask from '../tasks/AccountingTask';
import TaxationTask from '../tasks/TaxationTask';
import EditingTask from '../tasks/EditingTask';
import ArchitectureTask from '../tasks/ArchitectureTask';
import InteriorDesignTask from '../tasks/InteriorDesignTask';
import CivilEngineeringTask from '../tasks/CivilEngineeringTask';
import CodingTask from '../tasks/CodingTask';
import DataAnalysisTask from '../tasks/DataAnalysisTask';
import GraphicDesignTask from '../tasks/GraphicDesignTask';
import UIUXDesignTask from '../tasks/UIUXDesignTask';
import DigitalMarketingTask from '../tasks/DigitalMarketingTask';
import ContentWritingTask from '../tasks/ContentWritingTask';
import EducationTask from '../tasks/EducationTask';
import ResumeTask from '../tasks/ResumeTask';
import HRTask from '../tasks/HRTask';
import BusinessConsultingTask from '../tasks/BusinessConsultingTask';
import StartupAdvisoryTask from '../tasks/StartupAdvisoryTask';
import FinanceTask from '../tasks/FinanceTask';
import RealEstateTask from '../tasks/RealEstateTask';
import ImmigrationTask from '../tasks/ImmigrationTask';
import HealthcareTask from '../tasks/HealthcareTask';
import ResearchTask from '../tasks/ResearchTask';
import ProjectManagementTask from '../tasks/ProjectManagementTask';

// Theme Configuration
export const THEME = {
    primary: '#3b82f6',    // Blue-500
    secondary: '#8b5cf6',   // Violet-500
    accent: '#10b981',      // Emerald-500
    background: '#0f172a',  // Gray-900
    card: '#1e293b',        // Gray-800
    border: '#334155',      // Gray-700
    text: {
        primary: '#f8fafc',  // Gray-50
        secondary: '#cbd5e1', // Gray-300
        muted: '#94a3b8'     // Gray-400
    }
};

// Application Settings
export const APP_CONFIG = {
    name: 'AI Task Platform',
    version: '1.0.0',
    taskPrice: 99,
    currency: '₹',
    kioskPIN: '1234'
};

// AI Providers
export const AI_PROVIDERS = [
    { id: 'edenai', name: 'Eden AI', description: 'Multi-model aggregator' },
    { id: 'openrouter', name: 'OpenRouter', description: 'Access to 100+ models' },
    { id: 'gemini', name: 'Google Gemini', description: 'Google\'s AI model' }
];

// All Available Tasks (28 Total)
export const TASKS: TaskDefinition[] = [
    // Business & Finance (7 tasks)
    {
        id: 'invoice',
        name: 'Invoice Generator',
        icon: FileText,
        description: 'Create professional invoices instantly',
        category: 'Business & Finance',
        component: InvoiceTask
    },
    {
        id: 'accounting',
        name: 'Accounting & Bookkeeping',
        icon: Calculator,
        description: 'Financial records and bookkeeping',
        category: 'Business & Finance',
        component: AccountingTask
    },
    {
        id: 'taxation',
        name: 'Tax Planning',
        icon: Receipt,
        description: 'Tax planning and filing assistance',
        category: 'Business & Finance',
        component: TaxationTask
    },
    {
        id: 'business-consulting',
        name: 'Business Consulting',
        icon: Briefcase,
        description: 'Strategic business advice',
        category: 'Business & Finance',
        component: BusinessConsultingTask
    },
    {
        id: 'startup-advisory',
        name: 'Startup Advisory',
        icon: Rocket,
        description: 'Startup strategy and planning',
        category: 'Business & Finance',
        component: StartupAdvisoryTask
    },
    {
        id: 'finance',
        name: 'Finance & Investment',
        icon: DollarSign,
        description: 'Investment analysis and planning',
        category: 'Business & Finance',
        component: FinanceTask
    },
    {
        id: 'real-estate',
        name: 'Real Estate Docs',
        icon: Home,
        description: 'Real estate documentation',
        category: 'Business & Finance',
        component: RealEstateTask
    },

    // Legal & Compliance (2 tasks)
    {
        id: 'legal',
        name: 'Legal Drafter',
        icon: Scale,
        description: 'Draft legal documents and contracts',
        category: 'Legal & Compliance',
        component: LegalTask
    },
    {
        id: 'immigration',
        name: 'Immigration & Visa',
        icon: Plane,
        description: 'Immigration documentation assistance',
        category: 'Legal & Compliance',
        component: ImmigrationTask
    },

    // Design & Creative (4 tasks)
    {
        id: 'architecture',
        name: 'Architecture Design',
        icon: Building2,
        description: 'Architectural planning and design',
        category: 'Design & Creative',
        component: ArchitectureTask
    },
    {
        id: 'interior-design',
        name: 'Interior Design',
        icon: Sofa,
        description: 'Interior design concepts',
        category: 'Design & Creative',
        component: InteriorDesignTask
    },
    {
        id: 'graphic-design',
        name: 'Graphic Design',
        icon: Palette,
        description: 'Visual design concepts',
        category: 'Design & Creative',
        component: GraphicDesignTask
    },
    {
        id: 'uiux-design',
        name: 'UI/UX Design',
        icon: Smartphone,
        description: 'User interface and experience design',
        category: 'Design & Creative',
        component: UIUXDesignTask
    },

    // Technology (4 tasks)
    {
        id: 'coding',
        name: 'Software Development',
        icon: Code,
        description: 'Code generation and debugging',
        category: 'Technology',
        component: CodingTask
    },
    {
        id: 'data-analysis',
        name: 'Data Analysis',
        icon: BarChart3,
        description: 'Data insights and visualization',
        category: 'Technology',
        component: DataAnalysisTask
    },
    {
        id: 'project-management',
        name: 'Project Management',
        icon: ClipboardList,
        description: 'Project planning and tracking',
        category: 'Technology',
        component: ProjectManagementTask
    },
    {
        id: 'research',
        name: 'Research & Analytics',
        icon: Search,
        description: 'Research and data analysis',
        category: 'Technology',
        component: ResearchTask
    },

    // Content & Communication (5 tasks)
    {
        id: 'email',
        name: 'Email Writer',
        icon: Mail,
        description: 'Professional email composition',
        category: 'Content & Communication',
        component: EmailTask
    },
    {
        id: 'content-writing',
        name: 'Content Writing',
        icon: PenTool,
        description: 'Blog posts and articles',
        category: 'Content & Communication',
        component: ContentWritingTask
    },
    {
        id: 'editing',
        name: 'Editing & Proofreading',
        icon: FileEdit,
        description: 'Content editing and correction',
        category: 'Content & Communication',
        component: EditingTask
    },
    {
        id: 'translate',
        name: 'Language Translator',
        icon: MessageSquare,
        description: 'Translate between languages',
        category: 'Content & Communication',
        component: TranslateTask
    },
    {
        id: 'digital-marketing',
        name: 'Digital Marketing',
        icon: TrendingUp,
        description: 'Marketing strategy and content',
        category: 'Content & Communication',
        component: DigitalMarketingTask
    },

    // Professional Services (5 tasks)
    {
        id: 'education',
        name: 'Education & Tutoring',
        icon: GraduationCap,
        description: 'Educational content creation',
        category: 'Professional Services',
        component: EducationTask
    },
    {
        id: 'resume',
        name: 'Resume Builder',
        icon: FileUser,
        description: 'Professional resume creation',
        category: 'Professional Services',
        component: ResumeTask
    },
    {
        id: 'hr',
        name: 'HR & Recruitment',
        icon: Users,
        description: 'HR documentation and recruitment',
        category: 'Professional Services',
        component: HRTask
    },
    {
        id: 'healthcare',
        name: 'Healthcare Admin',
        icon: Heart,
        description: 'Healthcare documentation',
        category: 'Professional Services',
        component: HealthcareTask
    },
    {
        id: 'voice',
        name: 'Voice Transcription',
        icon: Mic,
        description: 'Audio to text transcription',
        category: 'Professional Services',
        component: VoiceTask
    },

    // Engineering (1 task)
    {
        id: 'civil-engineering',
        name: 'Civil Engineering',
        icon: Construction,
        description: 'Civil engineering documentation',
        category: 'Engineering',
        component: CivilEngineeringTask
    }
];

// Get tasks by category
export const getTasksByCategory = (category: string) => {
    return TASKS.filter(task => task.category === category);
};

// Get all categories
export const getCategories = () => {
    return Array.from(new Set(TASKS.map(task => task.category)));
};