// AI Provider Type Definitions
// =======================================================================

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

export interface ProviderConfig {
    id: AIProvider;
    name: string;
    description: string;
    models?: string[];
    endpoint?: string;
}

export const PROVIDERS: ProviderConfig[] = [
    {
        id: 'edenai',
        name: 'Eden AI',
        description: 'Multi-model aggregator with unified API',
        endpoint: 'https://api.edenai.run/v2/text/chat'
    },
    {
        id: 'openrouter',
        name: 'OpenRouter',
        description: 'Access to 100+ AI models',
        models: ['openai/gpt-3.5-turbo', 'openai/gpt-4'],
        endpoint: 'https://openrouter.ai/api/v1/chat/completions'
    },
    {
        id: 'gemini',
        name: 'Google Gemini',
        description: 'Google\'s advanced AI model',
        models: ['gemini-2.0-flash-exp', 'gemini-1.5-flash', 'gemini-1.5-pro'],
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/models'
    }
];