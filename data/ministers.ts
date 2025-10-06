import { Minister, MinisterPosition } from '../types';
import { v4 as uuidv4 } from 'uuid';

const lastNames: string[] = [
    // Original 30
    '佐藤', '鈴木', '高橋', '田中', '渡辺', '伊藤', '山本', '中村', '小林', '加藤',
    '吉田', '山田', '佐々木', '松本', '井上', '木村', '林', '斎藤', '清水', '山崎',
    '森', '池田', '橋本', '阿部', '石川', '山口', '中島', '前田', '藤田', '岡田',
    // New 60
    '後藤', '長谷川', '石井', '村上', '近藤', '坂本', '遠藤', '青木', '藤井', '西村',
    '福田', '太田', '三浦', '藤原', '岡本', '松田', '中川', '中野', '原田', '小川',
    '田村', '竹内', '金子', '和田', '中山', '石田', '上田', '森田', '原', '柴田',
    '宮崎', '杉山', '大塚', '野口', '小野', '竹中', '桜井', '横山', '渡部', '高田',
    '大西', '菅原', '飯田', '久保', '増田', '小島', '西田', '千葉', '岩崎', '野村',
    '谷口', '今井', '河野', '平野', '丸山', '高野', '杉本', '大野', '菊地', '宮本'
];

const firstNames: string[] = [
    // Original 30
    '健', '誠', '亮', '徹', '潤', '彰', '聡', '裕樹', '翔', '拓也',
    '陽菜', '美咲', '愛', '恵', '智子', '香織', '楓', '葵', '凛', '圭',
    '翼', '泉', '司', '忍', '光', '玲', '樹', '隼', '渚', '暁',
    // New 60
    '大輔', '和也', '学', '直樹', '哲也', '浩', '雄大', '昇', '龍', '幹',
    '沙織', '彩', '優子', '直美', '未来', '詩織', '杏', '桜', '遥', '純',
    '蓮', '陸', '空', '海', '蒼', '悠', '翔太', '颯', '昴', ' Zenith',
    '隆', '義弘', '幸助', '英二', '俊彦', '克己', '信吾', '雅彦', '竜也', '洋平',
    '由美', '久美子', '真由美', '亜紀', '里奈', '千尋', '美穂', '結衣', '玲奈', '茜',
    '晶', '薫', '望', 'はじめ', '真琴', '千歳', '瑞希', '遥斗', '湊', '陽向'
];


const positions: MinisterPosition[] = ['財務大臣', '国防大臣', '外務大臣', '内務大臣', '科学技術大臣'];

type EffectRange = [number, number];
interface MinisterEffectTemplate {
    ideology: string;
    resource?: {
        treasury?: EffectRange;
        stability?: EffectRange;
        manpower?: EffectRange;
        researchPoints?: EffectRange;
        militaryPower?: EffectRange;
    };
    country?: {
        corruption?: EffectRange;
    };
    factionHappiness?: {
        [key: string]: EffectRange;
    };
}

const ministerTemplates: Record<MinisterPosition, { ideologies: string[], effects: MinisterEffectTemplate[] }> = {
    '財務大臣': {
        ideologies: ['新自由主義', '保守主義', '中道保守'],
        effects: [
            { ideology: '新自由主義', resource: { treasury: [450, 750] }, factionHappiness: { '貧困層': [-3, -1], '資本家': [1, 2] } },
            { ideology: '保守主義', resource: { treasury: [250, 450], stability: [1, 2] } },
            { ideology: '中道保守', resource: { treasury: [300, 550] }, country: { corruption: [1, 2] } },
        ]
    },
    '国防大臣': {
        ideologies: ['国粋主義', '保守主義', '共和主義'],
        effects: [
            { ideology: '国粋主義', resource: { militaryPower: [70, 100], stability: [-3, -1] } },
            { ideology: '保守主義', resource: { militaryPower: [40, 60], manpower: [80, 120] } },
            { ideology: '共和主義', resource: { militaryPower: [30, 50], treasury: [-400, -200] } },
        ]
    },
    '外務大臣': {
        ideologies: ['リベラリズム', '社会民主主義', '平和主義'],
        effects: [
            { ideology: 'リベラリズム', resource: { researchPoints: [5, 15], stability: [-2, 0] } },
            { ideology: '社会民主主義', resource: { manpower: [50, 100], treasury: [-400, -200] } },
            { ideology: '平和主義', resource: { stability: [1, 3], militaryPower: [-30, -15] } },
        ]
    },
    '内務大臣': {
        ideologies: ['伝統保守', 'ポピュリズム', '中道'],
        effects: [
            { ideology: '伝統保守', resource: { stability: [2, 4], researchPoints: [-15, -5] } },
            { ideology: 'ポピュリズム', country: { corruption: [1, 3] }, factionHappiness: { '富裕層': [1,2], '中間層': [1,2], '貧困層': [1,2], '資本家': [1,2], '労働者': [1,2] } },
            { ideology: '中道', resource: { stability: [1, 2] } },
        ]
    },
    '科学技術大臣': {
        ideologies: ['技術主義', '進歩主義', 'リバタリアニズム'],
        effects: [
            { ideology: '技術主義', resource: { researchPoints: [25, 40], treasury: [-1000, -600] } },
            { ideology: '進歩主義', resource: { researchPoints: [15, 25], stability: [-2, 0] } },
            { ideology: 'リバタリアニズム', resource: { researchPoints: [10, 20] }, factionHappiness: { '労働者': [-2, -1] } },
        ]
    },
};

const resourceLabels: Record<string, string> = {
    treasury: '国庫',
    stability: '社会安定',
    manpower: '人的資源',
    researchPoints: '研究P',
    militaryPower: '軍事力',
    corruption: '腐敗度',
};

const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomInRange = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

export const generateMinisterCandidates = (count: number, existingMinisters: Minister[]): Minister[] => {
    const candidates: Minister[] = [];
    const usedNames = new Set<string>(existingMinisters.map(m => `${m.lastName} ${m.firstName}`));
    const availablePositions = positions.filter(p => !existingMinisters.some(em => em.position === p));

    for (let i = 0; i < count; i++) {
        let fullName: string, firstName: string, lastName: string;
        do {
            firstName = getRandomItem(firstNames);
            lastName = getRandomItem(lastNames);
            fullName = `${lastName} ${firstName}`;
        } while (usedNames.has(fullName));
        usedNames.add(fullName);

        const position = availablePositions.length > i ? availablePositions[i] : getRandomItem(positions);
        const template = ministerTemplates[position];
        const effectTemplate = getRandomItem(template.effects);
        
        const finalResourceChanges: Record<string, number> = {};
        const finalCountryModifiers: Record<string, number> = {};
        const finalFactionHappinessChanges: Record<string, number> = {};
        const buffs: string[] = [];
        const debuffs: string[] = [];
        const buffKeys = ['treasury', 'stability', 'manpower', 'researchPoints', 'militaryPower'];

        // Process resource changes
        if (effectTemplate.resource) {
            for (const key in effectTemplate.resource) {
                const range = (effectTemplate.resource as any)[key];
                const value = getRandomInRange(range[0], range[1]);
                if (value === 0) continue;
                finalResourceChanges[key] = value;
                const label = resourceLabels[key] || key;
                const desc = `${label} ${value > 0 ? '+' : ''}${value}/ターン`;
                if ((buffKeys.includes(key) && value > 0) || (!buffKeys.includes(key) && value < 0)) {
                    buffs.push(desc);
                } else {
                    debuffs.push(desc);
                }
            }
        }
        
        // Process country modifiers
        if (effectTemplate.country) {
            for (const key in effectTemplate.country) {
                const range = (effectTemplate.country as any)[key];
                const value = getRandomInRange(range[0], range[1]);
                if (value === 0) continue;
                finalCountryModifiers[key] = value;
                const label = resourceLabels[key] || key;
                const desc = `${label} ${value > 0 ? '+' : ''}${value}/ターン`;
                if (key === 'corruption' && value > 0) { // Higher corruption is a debuff
                    debuffs.push(desc);
                } else {
                    buffs.push(desc);
                }
            }
        }

        // Process faction happiness changes
        if (effectTemplate.factionHappiness) {
            for (const key in effectTemplate.factionHappiness) {
                const range = (effectTemplate.factionHappiness as any)[key];
                const value = getRandomInRange(range[0], range[1]);
                if (value === 0) continue;
                finalFactionHappinessChanges[key] = value;
                const desc = `${key}幸福度 ${value > 0 ? '+' : ''}${value}%/ターン`;
                if (value > 0) {
                    buffs.push(desc);
                } else {
                    debuffs.push(desc);
                }
            }
        }
        
        const minister: Minister = {
            id: uuidv4(),
            firstName,
            lastName,
            position,
            ideology: effectTemplate.ideology,
            buffs,
            debuffs,
            effects: {
                resourceChanges: finalResourceChanges,
                countryModifiers: finalCountryModifiers,
                factionHappinessChanges: finalFactionHappinessChanges,
            },
        };
        candidates.push(minister);
    }
    return candidates;
};

// Simple UUID generator if uuid library is not available
// This is a placeholder, a proper library should be used
declare global {
    interface Window {
        uuid: {
            v4: () => string;
        }
    }
}
const uuid = {
    v4: () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
};

const v4 = uuid.v4;