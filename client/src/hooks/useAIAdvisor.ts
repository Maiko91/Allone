import { useState } from 'react';
import { askProductQuestion } from '../services/aiService';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export function useAIAdvisor() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const askQuestion = async (query: string) => {
        if (!query.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: query,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setLoading(true);
        setError(null);

        // Retry logic with exponential backoff
        const maxRetries = 3;
        let lastError: Error | null = null;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const response = await askProductQuestion({ query });

                const assistantMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: response,
                    timestamp: new Date()
                };

                setMessages(prev => [...prev, assistantMessage]);
                setLoading(false);
                return; // Success, exit the function
            } catch (err: any) {
                lastError = err;
                console.error(`AI Advisor error (attempt ${attempt}/${maxRetries}):`, err);

                // Don't retry on certain errors
                const errorMsg = err?.response?.data?.error || err?.message || '';
                if (errorMsg.includes('SAFETY_BLOCK') || errorMsg.includes('RATE_LIMIT')) {
                    break; // No point retrying these
                }

                // Wait before retrying (exponential backoff: 1s, 2s, 4s)
                if (attempt < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
                }
            }
        }

        // All retries failed
        const errorMessage = lastError?.message?.includes('RATE_LIMIT')
            ? 'Demasiadas peticiones. Espera un momento e intenta de nuevo.'
            : lastError?.message?.includes('SAFETY_BLOCK')
                ? 'La pregunta fue bloqueada por seguridad. Intenta reformularla.'
                : 'Error al obtener respuesta. El servidor puede estar ocupado, intenta de nuevo en unos segundos.';

        setError(errorMessage);
        setLoading(false);
    };

    const clearMessages = () => {
        setMessages([]);
        setError(null);
    };

    return {
        messages,
        loading,
        error,
        askQuestion,
        clearMessages
    };
}
