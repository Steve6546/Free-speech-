import axios from 'axios';

// TODO: Replace <KEY> with your actual Google AI API key. 
// Consider using environment variables for API keys in a real application.
const API_KEY = '<KEY>'; 
const ENDPOINT = 'https://api.generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText';

export interface StorySetup {
  title: string;
  style: string;
  setting: string;
}

export async function generateStoryStub(setup: StorySetup): Promise<string> {
  const prompt = `اكتب ملخص قصة بعنوان "${setup.title}" بأسلوب ${setup.style} في بيئة ${setup.setting}.`;

  try {
    const response = await axios.post(
      `${ENDPOINT}?key=${API_KEY}`,
      {
        prompt: {
          text: prompt,
        },
        temperature: 0.7,
        maxOutputTokens: 512,
      }
    );

    if (response.data && response.data.candidates && response.data.candidates.length > 0 && response.data.candidates[0].output) {
      return response.data.candidates[0].output as string;
    } else {
      console.error('No output found in Google AI response:', response.data);
      throw new Error('No output found in Google AI response');
    }
  } catch (error) {
    console.error('Error calling Google AI API:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('Google AI API Error Response:', error.response.data);
      throw new Error(`Google AI API Error: ${error.response.status} ${error.response.data?.error?.message || 'Unknown error'}`);
    }
    throw new Error('Failed to generate story stub from Google AI.');
  }
}
