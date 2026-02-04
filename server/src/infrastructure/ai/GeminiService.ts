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
        this.model = genAI.getGenerativeModel({
            model: 'gemini-1.5-pro',
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
        } catch (error) {
            console.error('Gemini API error:', error);
            throw new Error('Failed to get AI response');
        }
    }
}
