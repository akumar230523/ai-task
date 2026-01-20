import type { AIProvider } from '../types/ai';

export const callAI = async (prompt: string, provider: AIProvider): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1500));

    return `
[${provider.toUpperCase()} RESPONSE]

${prompt}

-----------------------
This is a simulated AI response.
Replace this with real API integration.
`;
};
