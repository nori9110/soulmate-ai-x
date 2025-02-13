import openai from '../lib/openai';
import { Theme, Approach } from '../types/database.types';

export const generateSystemPrompt = (theme: Theme, approach: Approach) => {
  return `あなたは${theme.name}のカウンセラーとして、${approach.name}で対話を行うアシスタントです。

役割：${theme.description}
アプローチ方法：${approach.description}

以下の点に注意して応答してください：
1. 常に指定されたアプローチ方法に従って対話を進めてください
2. ユーザーの感情や状況に配慮しながら、適切なアドバイスを提供してください
3. 応答は必ず日本語で行ってください
4. 専門用語を使用する場合は、わかりやすく説明を加えてください`;
};

export const generateChatResponse = async (
  messages: { role: 'user' | 'assistant'; content: string }[],
  theme: Theme,
  approach: Approach
) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: generateSystemPrompt(theme, approach),
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    throw new Error('チャットレスポンスの生成中にエラーが発生しました。');
  }
};
