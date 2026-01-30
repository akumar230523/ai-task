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

// Application Settings
export const APP_CONFIG = {
    name: 'AI Task Platform',
    version: '1.0.0',
    taskPrice: 99,
    currency: '₹',
    kioskPIN: '1234'
};

// All Available Tasks (28 Total)
export const TASKS: TaskDefinition[] = [
    // Business & Finance (7 tasks)
    {
        id: 'invoice',
        name: 'Invoice Generator',
        icon: FileText,
        color: 'blue',
        description: 'Create professional invoices instantly',
        category: 'Business & Finance',
        component: InvoiceTask
    },
    {
        id: 'accounting',
        name: 'Accounting & Bookkeeping',
        icon: Calculator,
        color: 'emerald',
        description: 'Financial records and bookkeeping',
        category: 'Business & Finance',
        component: AccountingTask
    },
    {
        id: 'taxation',
        name: 'Tax Planning',
        icon: Receipt,
        color: 'amber',
        description: 'Tax planning and filing assistance',
        category: 'Business & Finance',
        component: TaxationTask
    },
    {
        id: 'business-consulting',
        name: 'Business Consulting',
        icon: Briefcase,
        color: 'slate',
        description: 'Strategic business advice',
        category: 'Business & Finance',
        component: BusinessConsultingTask
    },
    {
        id: 'startup-advisory',
        name: 'Startup Advisory',
        icon: Rocket,
        color: 'violet',
        description: 'Startup strategy and planning',
        category: 'Business & Finance',
        component: StartupAdvisoryTask
    },
    {
        id: 'finance',
        name: 'Finance & Investment',
        icon: DollarSign,
        color: 'green',
        description: 'Investment analysis and planning',
        category: 'Business & Finance',
        component: FinanceTask
    },
    {
        id: 'real-estate',
        name: 'Real Estate Docs',
        icon: Home,
        color: 'teal',
        description: 'Real estate documentation',
        category: 'Business & Finance',
        component: RealEstateTask
    },

    // Legal & Compliance (2 tasks)
    {
        id: 'legal',
        name: 'Legal Drafter',
        icon: Scale,
        color: 'purple',
        description: 'Draft legal documents and contracts',
        category: 'Legal & Compliance',
        component: LegalTask
    },
    {
        id: 'immigration',
        name: 'Immigration & Visa',
        icon: Plane,
        color: 'sky',
        description: 'Immigration documentation assistance',
        category: 'Legal & Compliance',
        component: ImmigrationTask
    },

    // Design & Creative (4 tasks)
    {
        id: 'architecture',
        name: 'Architecture Design',
        icon: Building2,
        color: 'stone',
        description: 'Architectural planning and design',
        category: 'Design & Creative',
        component: ArchitectureTask
    },
    {
        id: 'interior-design',
        name: 'Interior Design',
        icon: Sofa,
        color: 'rose',
        description: 'Interior design concepts',
        category: 'Design & Creative',
        component: InteriorDesignTask
    },
    {
        id: 'graphic-design',
        name: 'Graphic Design',
        icon: Palette,
        color: 'pink',
        description: 'Visual design concepts',
        category: 'Design & Creative',
        component: GraphicDesignTask
    },
    {
        id: 'uiux-design',
        name: 'UI/UX Design',
        icon: Smartphone,
        color: 'indigo',
        description: 'User interface and experience design',
        category: 'Design & Creative',
        component: UIUXDesignTask
    },

    // Technology (4 tasks)
    {
        id: 'coding',
        name: 'Software Development',
        icon: Code,
        color: 'cyan',
        description: 'Code generation and debugging',
        category: 'Technology',
        component: CodingTask
    },
    {
        id: 'data-analysis',
        name: 'Data Analysis',
        icon: BarChart3,
        color: 'blue',
        description: 'Data insights and visualization',
        category: 'Technology',
        component: DataAnalysisTask
    },
    {
        id: 'project-management',
        name: 'Project Management',
        icon: ClipboardList,
        color: 'orange',
        description: 'Project planning and tracking',
        category: 'Technology',
        component: ProjectManagementTask
    },
    {
        id: 'research',
        name: 'Research & Analytics',
        icon: Search,
        color: 'fuchsia',
        description: 'Research and data analysis',
        category: 'Technology',
        component: ResearchTask
    },

    // Content & Communication (5 tasks)
    {
        id: 'email',
        name: 'Email Writer',
        icon: Mail,
        color: 'orange',
        description: 'Professional email composition',
        category: 'Content & Communication',
        component: EmailTask
    },
    {
        id: 'content-writing',
        name: 'Content Writing',
        icon: PenTool,
        color: 'yellow',
        description: 'Blog posts and articles',
        category: 'Content & Communication',
        component: ContentWritingTask
    },
    {
        id: 'editing',
        name: 'Editing & Proofreading',
        icon: FileEdit,
        color: 'red',
        description: 'Content editing and correction',
        category: 'Content & Communication',
        component: EditingTask
    },
    {
        id: 'translate',
        name: 'Language Translator',
        icon: MessageSquare,
        color: 'indigo',
        description: 'Translate between languages',
        category: 'Content & Communication',
        component: TranslateTask
    },
    {
        id: 'digital-marketing',
        name: 'Digital Marketing',
        icon: TrendingUp,
        color: 'lime',
        description: 'Marketing strategy and content',
        category: 'Content & Communication',
        component: DigitalMarketingTask
    },

    // Professional Services (5 tasks)
    {
        id: 'education',
        name: 'Education & Tutoring',
        icon: GraduationCap,
        color: 'blue',
        description: 'Educational content creation',
        category: 'Professional Services',
        component: EducationTask
    },
    {
        id: 'resume',
        name: 'Resume Builder',
        icon: FileUser,
        color: 'gray',
        description: 'Professional resume creation',
        category: 'Professional Services',
        component: ResumeTask
    },
    {
        id: 'hr',
        name: 'HR & Recruitment',
        icon: Users,
        color: 'purple',
        description: 'HR documentation and recruitment',
        category: 'Professional Services',
        component: HRTask
    },
    {
        id: 'healthcare',
        name: 'Healthcare Admin',
        icon: Heart,
        color: 'red',
        description: 'Healthcare documentation',
        category: 'Professional Services',
        component: HealthcareTask
    },
    {
        id: 'voice',
        name: 'Voice Transcription',
        icon: Mic,
        color: 'green',
        description: 'Audio to text transcription',
        category: 'Professional Services',
        component: VoiceTask
    },

    // Engineering (1 task)
    {
        id: 'civil-engineering',
        name: 'Civil Engineering',
        icon: Construction,
        color: 'orange',
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