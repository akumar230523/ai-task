export type AIProvider = 'edenai' | 'openrouter' | 'gemini';

export interface AIResponse {
    content: string;
    usage?: {
        tokens: number;
        cost: number;
    };
    provider: AIProvider;
}

export interface TaskRequest {
    prompt: string;
    provider: AIProvider;
    taskType: string;
}