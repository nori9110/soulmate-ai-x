import openai from '../lib/openai';
import { Theme } from '../types/database.types';

export const generateSystemPrompt = (theme: Theme) => {
  return `あなたは${theme.name}のカウンセラーとして対話を行うアシスタントです。

役割：${theme.description}

以下の点に注意して応答してください：
1. ユーザーの感情や状況に配慮しながら、適切なアドバイスを提供してください
2. 応答は必ず日本語で行ってください
3. 専門用語を使用する場合は、わかりやすく説明を加えてください`;
};

export const generateChatResponse = async (
  messages: { role: 'user' | 'assistant'; content: string }[],
  theme: Theme
) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: generateSystemPrompt(theme),
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
