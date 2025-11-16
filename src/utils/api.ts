import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
});

export const sendContactMessage = async (formData: any) => {
  try {
    const response = await apiClient.post('/contact', formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getGeminiResponse = async (messages: any[]) => {
  if (!messages || messages.length === 0) {
    return;
  }
  const lastMessage = messages[messages.length - 1];
  try {
    const response = await apiClient.post('/getGeminiResponse', { message: lastMessage.content });
    return response.data;
  } catch (error) {
    console.error("Error sending message to chatbot:", error);
    throw error;
  }
};
