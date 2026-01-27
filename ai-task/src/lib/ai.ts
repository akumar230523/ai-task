// AI Library
// =======================================================================

import type { AIProvider } from '../types/ai';

// Get API keys from environment variables
const getAPIKeys = () => {
    const keys = {
        edenai: import.meta.env.VITE_EDEN_AI_API_KEY || '',
        openrouter: import.meta.env.VITE_OPENROUTER_API_KEY || '',
        gemini: import.meta.env.VITE_GOOGLE_GEMINI_API_KEY || '',
    };

    console.log('API Keys Status:', {
        edenai: keys.edenai ? 'SET' : 'NOT SET',
        openrouter: keys.openrouter ? 'SET' : 'NOT SET',
        gemini: keys.gemini ? 'SET' : 'NOT SET'
    });

    return keys;
};

// Google Gemini API call
const callGemini = async (prompt: string): Promise<string | null> => {
    const apiKey = getAPIKeys().gemini;

    if (!apiKey) {
        console.warn('! Gemini API key not configured');
        return null;
    }

    console.log('Calling Gemini API...');

    const modelsToTry = [ 'gemini-2.0-flash-exp', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro' ];

    for (const modelName of modelsToTry) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 2048,
                    }
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.warn(`${modelName} failed (${response.status})`);
                
                try {
                    const errorJson = JSON.parse(errorText);
                    if (errorJson.error?.message) {
                        console.warn(`→ ${errorJson.error.message.substring(0, 100)}`);
                    }
                } catch (e) {
                    // Ignore parse errors
                }
                continue;
            }

            const data = await response.json();
            const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (content) {
                console.log(`Gemini Success with ${modelName}!`);
                return content;
            }
        } catch (error) {
            console.warn(`${modelName} error:`, error instanceof Error ? error.message : 'Unknown');
            continue;
        }
    }

    return null;
};

// OpenRouter API call
const callOpenRouter = async (prompt: string): Promise<string | null> => {
    const apiKey = getAPIKeys().openrouter;

    if (!apiKey) {
        console.warn('! OpenRouter API key not configured');
        return null;
    }

    console.log('Calling OpenRouter API...');

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.origin,
                'X-Title': 'AI Task Platform',
            },
            body: JSON.stringify({
                model: 'openai/gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 2000,
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.warn('OpenRouter failed:', response.status);
            console.warn('Error:', errorText.substring(0, 200));
            return null;
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;

        if (content) {
            console.log('OpenRouter Success!');
            return content;
        }

        return null;
    } catch (error) {
        console.warn('OpenRouter error:', error instanceof Error ? error.message : 'Unknown');
        return null;
    }
};

// Eden AI API call
const callEdenAI = async (prompt: string): Promise<string | null> => {
    const apiKey = getAPIKeys().edenai;

    if (!apiKey) {
        console.warn('! Eden AI API key not configured');
        return null;
    }

    console.log('Calling Eden AI...');

    try {
        const response = await fetch('https://api.edenai.run/v2/text/chat', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                providers: 'openai',
                text: prompt,
                chatbot_global_action: 'You are a helpful AI assistant.',
                previous_history: [],
                temperature: 0.7,
                max_tokens: 2000,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.warn('Eden AI failed:', response.status);
            console.warn('Error:', errorText.substring(0, 200));
            return null;
        }

        const data = await response.json();
        const content = data.openai?.generated_text || data.openai?.message || data.results?.[0]?.generated_text;

        if (content) {
            console.log('Eden AI Success!');
            return content;
        }

        return null;
    } catch (error) {
        console.warn('Eden AI error:', error instanceof Error ? error.message : 'Unknown');
        return null;
    }
};

// Get error message when AI is not available
const getErrorMessage = (provider: AIProvider): string => {
    return `
    AI Service Not Available

    The ${provider.toUpperCase()} service is currently unavailable.

    Please try:
    1. Switch to another AI provider from the dropdown menu
    2. Check your internet connection
    3. Verify your API key is configured correctly
    4. Try again in a few moments

    If the issue persists, contact support.
    `;
};

// Main AI call function - Only AI response or error message
export const callAI = async (prompt: string, provider: AIProvider): Promise<string> => {
    console.log(`\n===== AI REQUEST =====`);
    console.log(`Provider: ${provider.toUpperCase()}`);
    console.log(`=========================\n`);

    let response: string | null = null;

    try {
        // Call the selected provider only
        switch (provider) {
            case 'gemini':
                response = await callGemini(prompt);
                break;
            case 'openrouter':
                response = await callOpenRouter(prompt);
                break;
            case 'edenai':
                response = await callEdenAI(prompt);
                break;
        }

        // Return AI response if successful
        if (response) {
            console.log(`SUCCESS with ${provider.toUpperCase()}!`);
            console.log(`Response length: ${response.length} characters\n`);
            return response;
        }

        // Return error message if AI failed
        console.log(`${provider.toUpperCase()} failed\n`);
        return getErrorMessage(provider);

    } catch (error) {
        console.error('❌ Error:', error);
        return getErrorMessage(provider);
    }
};