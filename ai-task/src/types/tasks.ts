// Task Type Definitions and Registry
// =======================================================================

import { type LucideIcon } from "lucide-react";
import { type AIProvider } from "./ai";

export type TaskId =
    | 'invoice'
    | 'legal'
    | 'voice'
    | 'email'
    | 'translate'
    | 'accounting'
    | 'taxation'
    | 'editing'
    | 'architecture'
    | 'interior-design'
    | 'civil-engineering'
    | 'coding'
    | 'data-analysis'
    | 'graphic-design'
    | 'uiux-design'
    | 'digital-marketing'
    | 'content-writing'
    | 'education'
    | 'resume'
    | 'hr'
    | 'business-consulting'
    | 'startup-advisory'
    | 'finance'
    | 'real-estate'
    | 'immigration'
    | 'healthcare'
    | 'research'
    | 'project-management';

export type TaskCategory =
    | 'Business & Finance'
    | 'Legal & Compliance'
    | 'Design & Creative'
    | 'Technology'
    | 'Content & Communication'
    | 'Professional Services'
    | 'Engineering';

export interface TaskDefinition {
    id: TaskId;
    name: string;
    icon: LucideIcon;
    description: string;
    category: TaskCategory;
    component: React.ComponentType<{ provider: AIProvider }>;
}

export interface TaskFormData {
    [key: string]: string | number | boolean;
}

export interface TaskResult {
    content: string;
    timestamp: Date;
    provider: string;
    taskType: string;
}
