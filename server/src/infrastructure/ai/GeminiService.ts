import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import type { Product } from '../../domain/entities/Product';

export class GeminiService {
    private model;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY environment variable is not set');
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        // DEBUG: List available models
        // Note: The SDK doesn't expose listModels directly on GoogleGenerativeAI instance easily in all versions, 
        // but let's try to just log that we are initializing.
        // Actually, we can use a simple fetch to check models if the SDK fails, but let's stick to simple debugging first.

        // In 2026, old models (1.0, 1.5) are deprecated. Using gemini-2.5-flash.
        this.model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            safetySettings: [
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
                },
            ],
        });
    }

    async askProductQuestion(query: string, products: Product[]): Promise<string> {
        const systemPrompt = `You are a helpful product recommendation expert for an e-commerce platform called "allOne" that specializes in Top 10 product rankings.

Your role:
- Answer user questions about product recommendations in a friendly, concise manner
- Always recommend products from the provided catalog when relevant
- Consider budget, features, and user preferences
- Format responses in markdown with bullet points
- Respond in the same language as the user's question (Spanish or English)
- Be honest if no products match the criteria

Available products:
${JSON.stringify(products.map(p => ({
            title: p.title,
            price: p.price,
            description: p.description,
            rating: p.rating,
            amazonUrl: p.amazonUrl
        })), null, 2)}`;

        const fullPrompt = `${systemPrompt}\n\nUser question: ${query}`;

        try {
            const result = await this.model.generateContent(fullPrompt);
            const response = await result.response;
            return response.text();
        } catch (error: any) {
            console.error('Gemini API error:', error);

            // Check for specific error types
            const errorMessage = error?.message || '';
            const statusCode = error?.status || error?.statusCode || 0;

            // Rate limiting
            if (statusCode === 429 || errorMessage.includes('429') || errorMessage.toLowerCase().includes('rate limit') || errorMessage.toLowerCase().includes('quota')) {
                throw new Error('RATE_LIMIT: Too many requests. Please wait a moment and try again.');
            }

            // Model not found or deprecated
            if (statusCode === 404 || errorMessage.includes('404') || errorMessage.toLowerCase().includes('not found')) {
                throw new Error('MODEL_ERROR: AI model temporarily unavailable. Please try again later.');
            }

            // Safety block
            if (errorMessage.toLowerCase().includes('safety') || errorMessage.toLowerCase().includes('blocked')) {
                throw new Error('SAFETY_BLOCK: Request was blocked for safety reasons. Please rephrase your question.');
            }

            // Network/timeout errors
            if (errorMessage.toLowerCase().includes('timeout') || errorMessage.toLowerCase().includes('network') || errorMessage.toLowerCase().includes('econnrefused')) {
                throw new Error('NETWORK_ERROR: Connection issue. Please check your internet and try again.');
            }

            // Generic fallback
            throw new Error('API_ERROR: Failed to get AI response. Please try again in a few seconds.');
        }
    }
}
