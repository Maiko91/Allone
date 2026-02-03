import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface AskRequest {
    query: string;
    categoryId?: number;
    listId?: number;
}

interface AskResponse {
    response: string;
}

export const askProductQuestion = async (request: AskRequest): Promise<string> => {
    const response = await axios.post<AskResponse>(`${API_URL}/api/ai/ask`, request);
    return response.data.response;
};
