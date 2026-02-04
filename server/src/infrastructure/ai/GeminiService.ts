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
            // Log specific error details if available
        } catch (error) {
            console.error('Gemini API error:', error);
            throw new Error('Failed to get AI response');
        }
    }
}

