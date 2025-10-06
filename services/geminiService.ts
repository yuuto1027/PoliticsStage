

import { GoogleGenAI, Type } from "@google/genai";
// FIX: PublicOpinionPost is no longer used in this service, so it is removed.
import { LawEffect } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("APIキーが設定されていません。環境変数 'API_KEY' を設定してください。");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateLawEffect = async (lawName: string, lawDescription: string): Promise<LawEffect> => {
  const prompt = `
  あなたは政治シミュレーションゲームのAIです。以下の法案の内容を分析し、その法案が可決された場合にもたらされる効果をJSON形式で生成してください。
  法律名: ${lawName}
  説明: ${lawDescription}

  ゲーム内のリソースは以下の通りです:
  - treasury: 国庫
  - manpower: 人的資源
  - researchPoints: 研究ポイント
  - militaryPower: 軍事力
  - stability: 社会安定度

  国民は以下の派閥に分かれています:
  - 富裕層: 資産保持を好み、減税や経済的自由を支持する。
  - 中間層: 安定した生活を望み、教育や社会の安定を重視する。
  - 貧困層: 社会保障や福祉の充実を求める。
  - 資本家: 企業の利益を最優先し、規制緩和や法人税減税を支持する。
  - 労働者: 雇用の安定と労働者の権利を重視する。

  以下の項目を含むJSONオブジェクトを生成してください:
  - resourceChanges: 各リソースの変化量 (必須)
  - factionHappinessChanges: 各派閥の幸福度の変化量 (必須、上記の5派閥すべてについて記述)
  - effects: 法案による良い効果(buff)と悪い効果(debuff)の説明 (必須)
  - politicalSystemChange: 政治体制が変更される場合、'MONARCHY', 'REPUBLIC', 'SOCIALISM', 'DICTATORSHIP', 'DEMOCRACY', 'THEOCRACY', 'FEDERATION', 'EMPIRE' のいずれかを指定 (任意)
  - partyEffects: 特定の政党に影響を与える場合、その内容を配列で指定 (任意)
    - targetPartyName: 対象の政党名。プレイヤー政党の場合は "PLAYER", 全ての野党の場合は "ALL_OPPOSITION" も使用可能。
    - action: 'dissolve' (解散), 'confiscate_seats' (議席没収), 'grant_seats' (議席付与)
    - value: 'confiscate_seats' や 'grant_seats' の場合の議席数

  例:
  - 「王政復古」という法案なら "politicalSystemChange": "MONARCHY" を含める。
  - 「一党独裁法」なら "politicalSystemChange": "DICTATORSHIP", "partyEffects": [{ "targetPartyName": "ALL_OPPOSITION", "action": "dissolve" }] を含める。
  - 「民主化推進法」や「多党制導入」なら "politicalSystemChange": "DEMOCRACY" を含める。
  - 「ライバル政党禁止法」なら "partyEffects": [{ "targetPartyName": "特定の政党名", "action": "dissolve" }] を含める。
  - 「神権政治移行法」なら "politicalSystemChange": "THEOCRACY" を含める。
  - 「連邦制導入法」なら "politicalSystemChange": "FEDERATION" を含める。
  - 「帝政宣言法」なら "politicalSystemChange": "EMPIRE" を含める。

  出力はJSONオブジェクトのみとしてください。説明文は不要です。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            resourceChanges: {
              type: Type.OBJECT,
              properties: {
                treasury: { type: Type.NUMBER },
                manpower: { type: Type.NUMBER },
                researchPoints: { type: Type.NUMBER },
                militaryPower: { type: Type.NUMBER },
                // FIX: Added stability to the schema.
                stability: { type: Type.NUMBER },
              },
              // FIX: Added stability to the required properties.
              required: ["treasury", "manpower", "researchPoints", "militaryPower", "stability"],
            },
            factionHappinessChanges: {
              type: Type.OBJECT,
              properties: {
                '富裕層': { type: Type.NUMBER },
                '中間層': { type: Type.NUMBER },
                '貧困層': { type: Type.NUMBER },
                '資本家': { type: Type.NUMBER },
                '労働者': { type: Type.NUMBER },
              },
              required: ['富裕層', '中間層', '貧困層', '資本家', '労働者'],
            },
            effects: {
              type: Type.OBJECT,
              properties: {
                buff: { type: Type.ARRAY, items: { type: Type.STRING } },
                debuff: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["buff", "debuff"],
            },
            politicalSystemChange: {
              type: Type.STRING,
            },
            partyEffects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  targetPartyName: { type: Type.STRING },
                  action: { type: Type.STRING },
                  value: { type: Type.NUMBER },
                },
                required: ["targetPartyName", "action"],
              },
            },
          },
          required: ["resourceChanges", "factionHappinessChanges", "effects"],
        },
      },
    });
    
    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("法案効果の生成に失敗しました:", error);
    throw error;
  }
};
