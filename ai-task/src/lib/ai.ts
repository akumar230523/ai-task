// AI Library with Latest Gemini Models (2025/2026)
// =======================================================================

import type { AIProvider } from '../types/ai';

// Get API keys from environment variables
const getAPIKeys = () => {
    const keys = {
        edenai: import.meta.env.VITE_EDEN_AI_API_KEY || '',
        openrouter: import.meta.env.VITE_OPENROUTER_API_KEY || '',
        gemini: import.meta.env.VITE_GOOGLE_GEMINI_API_KEY || '',
    };

    console.log('🔑 API Keys Status:', {
        edenai: keys.edenai ? '✅ SET' : '❌ NOT SET',
        openrouter: keys.openrouter ? '✅ SET' : '❌ NOT SET',
        gemini: keys.gemini ? '✅ SET' : '❌ NOT SET'
    });

    return keys;
};

// Google Gemini API call - Updated for 2026
const callGemini = async (prompt: string): Promise<string | null> => {
    const apiKey = getAPIKeys().gemini;

    if (!apiKey) {
        console.error('❌ Gemini API key not configured');
        return null;
    }

    // Models to try (updated for 2026)
    const modelsToTry = [
        'gemini-2.0-flash-exp',      // Gemini 2.0 Flash (Latest experimental)
        'gemini-1.5-flash-8b',       // Gemini 1.5 Flash 8B (Fast)
        'gemini-1.5-flash',          // Gemini 1.5 Flash
        'gemini-1.5-pro',            // Gemini 1.5 Pro
        'gemini-pro',                // Legacy Gemini Pro
    ];

    console.log('📡 Starting Gemini API calls...');
    console.log('🔑 Using API Key:', apiKey.substring(0, 20) + '...');

    // Try each model
    for (const modelName of modelsToTry) {
        try {
            // Use v1beta API endpoint
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

            console.log(`🔄 Trying: ${modelName}`);

            const requestBody = {
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 2048,
                }
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.warn(`⚠️ ${modelName} failed (${response.status})`);

                try {
                    const errorJson = JSON.parse(errorText);
                    if (errorJson.error?.message) {
                        console.warn(`   → ${errorJson.error.message}`);
                    }
                } catch (e) {
                    // Ignore parse errors
                }

                continue; 
            }

            const data = await response.json();
            const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (content) {
                console.log(`✅ SUCCESS with ${modelName}!`);
                console.log(`📏 Response: ${content.length} characters`);
                return content;
            }

            console.warn(`⚠️ ${modelName} returned no content`);

        } catch (error) {
            console.warn(`⚠️ ${modelName} error:`, error instanceof Error ? error.message : 'Unknown error');
            continue;
        }
    }

    // All models failed
    console.error('❌ All Gemini models failed');
    console.error('💡 Please check:');
    console.error('   1. Your API key is valid');
    console.error('   2. Generate a new key at: https://aistudio.google.com/app/apikey');
    console.error('   3. Enable Generative Language API in Google Cloud Console');

    return null;
};

// OpenRouter API call
const callOpenRouter = async (prompt: string): Promise<string | null> => {
    const apiKey = getAPIKeys().openrouter;

    if (!apiKey) {
        console.error('❌ OpenRouter API key not configured');
        return null;
    }

    console.log('📡 Calling OpenRouter API...');

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
            console.error('❌ OpenRouter Error:', response.status, errorText);
            return null;
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;

        if (content) {
            console.log('✅ OpenRouter Success!');
            return content;
        }

        console.error('❌ No content in OpenRouter response');
        return null;

    } catch (error) {
        console.error('❌ OpenRouter Network Error:', error);
        return null;
    }
};

// Eden AI API call
const callEdenAI = async (prompt: string): Promise<string | null> => {
    const apiKey = getAPIKeys().edenai;

    if (!apiKey) {
        console.error('❌ Eden AI API key not configured');
        return null;
    }

    console.log('📡 Calling Eden AI...');

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
            console.error('❌ Eden AI Error:', response.status, errorText);
            return null;
        }

        const data = await response.json();
        const content = data.openai?.generated_text || data.openai?.message || data.results?.[0]?.generated_text;

        if (content) {
            console.log('✅ Eden AI Success!');
            return content;
        }

        console.error('❌ No content in Eden AI response');
        return null;

    } catch (error) {
        console.error('❌ Eden AI Network Error:', error);
        return null;
    }
};

// Main AI call function
export const callAI = async (prompt: string, provider: AIProvider): Promise<string> => {
    console.log(`\n🚀 ===== AI REQUEST START =====`);
    console.log(`Provider: ${provider.toUpperCase()}`);
    console.log(`Prompt: ${prompt.substring(0, 100)}...`);
    console.log(`==============================\n`);

    let response: string | null = null;

    try {
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
            default:
                console.error(`❌ Unsupported provider: ${provider}`);
                return getErrorMessage(provider);
        }

        if (response) {
            console.log(`\n✅ ===== SUCCESS =====`);
            console.log(`Provider: ${provider.toUpperCase()}`);
            console.log(`Response Length: ${response.length}`);
            console.log(`====================\n`);
            return response;
        }

        console.error(`\n❌ ===== FAILED =====`);
        console.error(`Provider: ${provider.toUpperCase()}`);
        console.error(`===================\n`);

        return getErrorMessage(provider);

    } catch (error) {
        console.error(`\n❌ ===== ERROR =====`);
        console.error(`Provider: ${provider.toUpperCase()}`);
        console.error(`Error:`, error);
        console.error(`==================\n`);

        return getErrorMessage(provider);
    }
};

// Error message helper
const getErrorMessage = (provider: AIProvider): string => {
    if (provider === 'gemini') {
        return `⚠️ GEMINI API KEY ISSUE

Your Gemini API key is not working. Please:

1. 🔑 Generate a NEW API key:
   → Visit: https://aistudio.google.com/app/apikey
   → Click "Create API key"
   → Copy the new key

2. 📝 Update your .env file:
   VITE_GOOGLE_GEMINI_API_KEY=your_new_key_here

3. 🔄 Restart your development server

4. ✅ Enable the Generative Language API:
   → Go to Google Cloud Console
   → Enable "Generative Language API"

OR try a different AI provider from the dropdown above!`;
    }

    return `⚠️ AI SERVICE NOT AVAILABLE

The ${provider.toUpperCase()} service is currently unavailable.

Please try:
1. Check your API key configuration
2. Select a different AI provider
3. Check the console for detailed errors
4. Wait a moment and try again

Contact support if the problem persists.`;
};