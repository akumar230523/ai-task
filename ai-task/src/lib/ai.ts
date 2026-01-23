// AI Provider Integration with Multi-Provider Support
// =======================================================================

import type { AIProvider, AIResponse } from '../types/ai';

interface APIKeyConfig {
    edenai: string;
    openrouter: string;
    gemini: string;
}

// Get API keys from environment variables
const getAPIKeys = (): APIKeyConfig => {
    return {
        edenai: import.meta.env.VITE_EDEN_AI_API_KEY || '',
        openrouter: import.meta.env.VITE_OPENROUTER_API_KEY || '',
        gemini: import.meta.env.VITE_GOOGLE_GEMINI_API_KEY || '',
    };
};

// Calculate cost based on provider and token count
const calculateCost = (provider: AIProvider, tokens: number): number => {
    const prices: Record<AIProvider, number> = {
        edenai: 0.025,
        openrouter: 0.03,
        gemini: 0.02,
    };
    const tokenCost = (tokens / 1000) * prices[provider];
    return Math.max(0.99, tokenCost * 82); // Convert to INR
};

// Eden AI API call
const callEdenAI = async (prompt: string): Promise<AIResponse> => {
    const apiKey = getAPIKeys().edenai;
    if (!apiKey) {
        throw new Error('Eden AI API key not configured');
    }

    try {
        const response = await fetch('https://api.edenai.run/v2/text/generation', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                providers: 'openai',
                text: prompt,
                temperature: 0.7,
                max_tokens: 1000,
            }),
        });

        if (!response.ok) {
            throw new Error(`Eden AI API error: ${response.statusText}`);
        }

        const data = await response.json();
        const content = data.openai?.generated_text || 'No response generated.';
        const tokens = data.openai?.cost?.num_tokens || 1000;
        const cost = calculateCost('edenai', tokens);

        return {
            content,
            usage: { tokens, cost },
            provider: 'edenai',
        };
    } catch (error) {
        console.error('Eden AI error:', error);
        throw error;
    }
};

// OpenRouter API call
const callOpenRouter = async (prompt: string): Promise<AIResponse> => {
    const apiKey = getAPIKeys().openrouter;
    if (!apiKey) {
        throw new Error('OpenRouter API key not configured');
    }

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.origin,
            },
            body: JSON.stringify({
                model: 'openai/gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 1000,
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            throw new Error(`OpenRouter API error: ${response.statusText}`);
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content || 'No response generated.';
        const tokens = data.usage?.total_tokens || 1000;
        const cost = calculateCost('openrouter', tokens);

        return {
            content,
            usage: { tokens, cost },
            provider: 'openrouter',
        };
    } catch (error) {
        console.error('OpenRouter error:', error);
        throw error;
    }
};

// Google Gemini API call
const callGemini = async (prompt: string): Promise<AIResponse> => {
    const apiKey = getAPIKeys().gemini;
    if (!apiKey) {
        throw new Error('Gemini API key not configured');
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 1000,
                    },
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.statusText}`);
        }

        const data = await response.json();
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
        const tokens = Math.round(content.split(/\s+/).length * 1.3);
        const cost = calculateCost('gemini', tokens);

        return {
            content,
            usage: { tokens, cost },
            provider: 'gemini',
        };
    } catch (error) {
        console.error('Gemini error:', error);
        throw error;
    }
};

// Main AI call function with provider routing
export const callAI = async (prompt: string, provider: AIProvider): Promise<string> => {
    console.log(`Calling ${provider} with prompt:`, prompt.substring(0, 100) + '...');

    try {
        let response: AIResponse;

        switch (provider) {
            case 'edenai':
                response = await callEdenAI(prompt);
                break;
            case 'openrouter':
                response = await callOpenRouter(prompt);
                break;
            case 'gemini':
                response = await callGemini(prompt);
                break;
            default:
                throw new Error(`Unsupported provider: ${provider}`);
        }

        return response.content;
    } catch (error) {
        // Fallback to mock if API fails
        console.warn('API call failed, using mock response:', error);
        return callAIMock(prompt, provider);
    }
};

// Mock fallback for development/testing
export const callAIMock = (prompt: string, provider: AIProvider): string => {
    const responses: Record<AIProvider, string> = {
        edenai: `[Eden AI Response]\n\n${prompt.substring(0, 150)}...\n\nThis is a simulated response. Configure VITE_EDEN_AI_API_KEY in .env to use the real API.`,
        openrouter: `[OpenRouter Response]\n\n${prompt.substring(0, 150)}...\n\nThis is a simulated response. Configure VITE_OPENROUTER_API_KEY in .env to use the real API.`,
        gemini: `[Google Gemini Response]\n\n${prompt.substring(0, 150)}...\n\nThis is a simulated response. Configure VITE_GOOGLE_GEMINI_API_KEY in .env to use the real API.`,
    };

    return responses[provider];
};