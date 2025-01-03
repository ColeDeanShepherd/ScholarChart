import OpenAI from 'openai';
import { getOpenAIKey as getOpenAIAPIKey } from './config';

export async function runOpenAITest() {
  const client = new OpenAI({
    apiKey: getOpenAIAPIKey(), // This is the default and can be omitted
    dangerouslyAllowBrowser: true
  });

  const chatCompletion = await client.chat.completions.create({
    messages: [{ role: 'user', content: 'Say this is a test' }],
    model: 'gpt-4o',
  });

  console.log(chatCompletion.choices[0].message.content);
}