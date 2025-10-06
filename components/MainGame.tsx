
import React, { useState, useCallback, useMemo } from 'react';
import { GameState, LawEffect, GameEvent, GameEventChoice, GameStatus, Budget, BudgetItem, Party, VoteResult, PartyVote, NewsArticle, Minister } from '../types';
import Header from './Header';
import Footer from './Footer';
import ParliamentChart from './ParliamentChart';
import ProposeLawModal from './ProposeLawModal';
import VoteOnBillModal from './VoteOnBillModal';
import VotingProgressModal from './VotingProgressModal';
import VoteResultModal from './VoteResultModal';
import EventModal from './EventModal';
import DonationMinigameModal from './DonationMinigameModal';
import HireMinisterModal from './HireMinisterModal';
import MinisterGachaAnimationModal from './MinisterGachaAnimationModal';
import SpeechMinigameModal from './SpeechMinigameModal';
import { domesticEvents, internationalEvents, protestEvent, oppositionBills, coupEvent, warEvent, scandalEvent, corruptionProtestEvent } from '../data/events';
import { generateMinisterCandidates } from '../data/ministers';
// FIX: Changed to a default import for playSound.
import playSound from '../services/audioService';

interface MainGameProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState | null>>;
  oppositionPartyPresets: Omit<Party, 'seats' | 'isPlayer' | 'support' | 'relation'>[];
}

const LAW_PROPOSAL_COST = 20;
const CRITICIZE_COST = 10;
const DIPLOMACY_COST = 15;
const COALITION_REQUEST_COST = 30;
const BUDGET_EXECUTION_COST = 20;
const DONATION_REQUEST_COST = 5;
const FUND_CONVERSION_COST = 500;
const FUND_CONVERSION_GAIN = 10;
const HIRE_MINISTER_COST = 25;
const DISMISS_MINISTER_COST = 10;
// Internal Affairs Costs
const ANTI_CORRUPTION_COST_POWER = 30;
const ANTI_CORRUPTION_COST_TREASURY = 5000;
const PROMOTE_RESEARCH_COST_POWER = 15;
const PROMOTE_RESEARCH_COST_TREASURY = 3000;
const PROPAGANDA_COST_POWER = 20;
const PROPAGANDA_COST_TREASURY = 2000;
const INFRA_INVESTMENT_COST_POWER = 25;
const INFRA_INVESTMENT_COST_TREASURY = 8000;
const HEALTHCARE_REFORM_COST_POWER = 25;
const HEALTHCARE_REFORM_COST_TREASURY = 7000;
const DISASTER_DRILL_COST_POWER = 15;
const DISASTER_DRILL_COST_TREASURY = 2500;
const CULTURAL_FESTIVAL_COST_POWER = 20;
const CULTURAL_FESTIVAL_COST_TREASURY = 4000;
// Opposition Activity Costs
const CRITICIZE_GOVERNMENT_COST = 10;
const COUNTER_PLAN_COST = 15;
const RALLY_SUPPORTERS_COST = 20;


type WarTactic = 'offensive' | 'defensive' | 'guerrilla' | 'supply_raid';

// 各イデオロギーの法案評価における重み付け
const ideologyWeights: { [key: string]: { [key: string]: number } } = {
  // 保守・右派
  '保守主義': { treasury: 0.3, stability: 0.8, manpower: 0.2, researchPoints: 0.1, proTradition: 1.0, antiChange: 0.5, militaryPower: 0.4 },
  '伝統保守': { treasury: 0.2, stability: 1.0, manpower: 0.1, researchPoints: 0.0, proTradition: 1.2, antiChange: 0.8, militaryPower: 0.3 },
  '中道保守': { treasury: 0.4, stability: 0.7, manpower: 0.2, researchPoints: 0.2, proTradition: 0.5, antiChange: 0.2, militaryPower: 0.3 },
  '国粋主義': { treasury: -0.2, stability: 0.9, manpower: 1.2, researchPoints: 0.1, proMilitary: 1.5, antiGlobal: 1.0, militaryPower: 1.2 },

  // リベラル・左派
  'リベラリズム': { treasury: 0.1, stability: -0.2, manpower: 0.6, researchPoints: 0.5, proEquality: 0.8, proFreedom: 1.0, militaryPower: -0.3 },
  '社会主義': { treasury: -0.5, stability: 0.3, manpower: 0.8, researchPoints: 0.2, proEquality: 1.2, proRegulation: 1.0, militaryPower: -0.5 },
  '社会民主主義': { treasury: -0.3, stability: 0.5, manpower: 0.7, researchPoints: 0.3, proEquality: 1.0, proWelfare: 1.2, militaryPower: -0.4 },
  '中道左派': { treasury: 0.0, stability: 0.2, manpower: 0.5, researchPoints: 0.4, proEquality: 0.6, proWelfare: 0.8, militaryPower: -0.2 },
  '進歩主義': { treasury: 0.0, stability: -0.3, manpower: 0.4, researchPoints: 0.8, proChange: 1.2, proEquality: 0.9, militaryPower: -0.1 },
  '平等主義': { treasury: -0.2, stability: 0.1, manpower: 0.6, researchPoints: 0.1, proEquality: 1.5, proWelfare: 0.7, militaryPower: -0.6 },
  '社会自由主義': { treasury: 0.2, stability: 0.0, manpower: 0.5, researchPoints: 0.4, proFreedom: 0.8, proWelfare: 1.0, militaryPower: -0.2 },
  
  // 経済思想
  '新自由主義': { treasury: 1.2, stability: -0.4, manpower: -0.2, researchPoints: 0.3, proMarket: 1.5, antiRegulation: 1.0, militaryPower: 0.2 },
  'リバタリアニズム': { treasury: 1.0, stability: -0.5, manpower: -0.3, researchPoints: 0.1, proFreedom: 1.5, antiRegulation: 1.2, militaryPower: -0.1 },

  // その他
  '環境主義': { treasury: -0.1, stability: 0.6, manpower: 0.1, researchPoints: 0.7, proEnvironment: 1.5, militaryPower: -0.8 },
  '平和主義': { treasury: 0.1, stability: 0.8, manpower: -0.5, researchPoints: 0.1, antiMilitary: 1.5, militaryPower: -1.5 },
  '技術主義': { treasury: 0.2, stability: -0.1, manpower: 0.1, researchPoints: 1.5, proTech: 1.2, militaryPower: 0.6 },
  '地域主義': { treasury: 0.3, stability: 0.5, manpower: 0.2, researchPoints: 0.0, proLocal: 1.5, militaryPower: 0.1 },
  'ポピュリズム': { treasury: 0.1, stability: 0.4, manpower: 0.4, researchPoints: -0.2, proPublicOpinion: 1.5, militaryPower: 0.2 },
  '農本主義': { treasury: -0.2, stability: 0.6, manpower: 0.5, researchPoints: -0.1, proAgriculture: 1.5, militaryPower: 0.0 },
  '都市主義': { treasury: 0.3, stability: 0.2, manpower: 0.3, researchPoints: 0.5, proUrban: 1.5, militaryPower: 0.1 },
  '反グローバリズム': { treasury: 0.2, stability: 0.5, manpower: 0.4, researchPoints: -0.3, antiGlobal: 1.5, militaryPower: 0.3 },
  '急進主義': { treasury: -0.3, stability: -0.8, manpower: 0.3, researchPoints: 0.3, proChange: 1.5, antiEstablishment: 1.0, militaryPower: -0.2 },
  '共和主義': { treasury: 0.4, stability: 0.6, manpower: 0.2, researchPoints: 0.1, proRepublic: 1.5, antiMonarchy: 1.0, militaryPower: 0.3 },
  
  // プレイヤー政党など特殊なケース
  '中道': { treasury: 0.5, stability: 0.5, manpower: 0.5, researchPoints: 0.5, militaryPower: 0.5 },
};

const ideologyGroups: Record<string, string[]> = {
  conservative: ['保守主義', '伝統保守', '中道保守', '国粋主義', '共和主義', '農本主義', '反グローバリズム'],
  liberal_left: ['リベラリズム', '社会主義', '社会民主主義', '中道左派', '進歩主義', '平等主義', '社会自由主義', '平和主義', '環境主義'],
  economic_right: ['新自由主義', 'リバタリアニズム'],
  technocratic: ['技術主義', '都市主義'],
  populist: ['ポピュリズム', '地域主義'],
  radical: ['急進主義'],
  centrist: ['中道'],
};


const ideologyToGroup: Record<string, string> = {};
Object.keys(ideologyGroups).forEach(group => {
  ideologyGroups[group].forEach(ideology => {
    ideologyToGroup[ideology] = group;
  });
});

// 法案のテキストからテーマを抽出するヒューリスティック関数
const extractThemes = (lawEffect: LawEffect, lawDescription: string): { [key: string]: boolean } => {
    const text = lawDescription + ' ' + lawEffect.effects.buff.join(' ') + ' ' + lawEffect.effects.debuff.join(' ');
    const lowerText = text.toLowerCase();

    return {
        proTradition: /伝統|家族|文化|歴史/.test(lowerText),
        antiChange: /維持|現状/.test(lowerText),
        proChange: /改革|革新|新時代|変革/.test(lowerText),
        proMilitary: /軍|国防|防衛|軍備/.test(lowerText),
        antiMilitary: /平和|軍縮|非武装/.test(lowerText),
        proEquality: /平等|格差是正|公正/.test(lowerText),
        proFreedom: /自由|規制緩和|自己責任/.test(lowerText),
        proWelfare: /福祉|社会保障|セーフティネット/.test(lowerText),
        proMarket: /市場原理|民営化|競争/.test(lowerText),
        proRegulation: /規制強化|監視/.test(lowerText),
        antiRegulation: /規制緩和|自由化/.test(lowerText),
        proEnvironment: /環境|エコ|自然|再生可能/.test(lowerText),
        proTech: /技術|科学|デジタル|研究/.test(lowerText),
        proLocal: /地方分権|地域/.test(lowerText),
        antiGlobal: /移民規制|反グローバリズム|保護主義/.test(lowerText),
        proPublicOpinion: /国民|市民|世論/.test(lowerText),
        proAgriculture: /農業|食料自給/.test(lowerText),
        proUrban: /都市開発|インフラ/.test(lowerText),
        proRepublic: /共和/.test(lowerText),
        antiMonarchy: /王政/.test(lowerText),
        antiEstablishment: /既得権益|腐敗/.test(lowerText),
    };
};


const decideVoteByIdeology = (ideology: string, lawEffect: LawEffect, lawDescription: string): 'approve' | 'oppose' => {
    const weights = ideologyWeights[ideology] || ideologyWeights['中道保守']; // 見つからない場合は中道保守をデフォルトとする
    let score = 0;

    // 1. リソース変化によるスコア
    const { treasury, stability, manpower, researchPoints, militaryPower } = lawEffect.resourceChanges;
    // リソース変化を-10から+10の範囲に正規化してスコアを計算
    score += (treasury / 1000) * (weights['treasury'] || 0);
    score += (stability / 5) * (weights['stability'] || 0);
    score += (manpower / 200) * (weights['manpower'] || 0);
    score += (researchPoints / 50) * (weights['researchPoints'] || 0);
    score += (militaryPower / 100) * (weights['militaryPower'] || 0);

    // 2. キーワードに基づくテーマスコア
    const themes = extractThemes(lawEffect, lawDescription);
    for (const theme in themes) {
        if (themes[theme] && weights[theme]) {
            score += weights[theme];
        }
    }
    
    // 3. 政治体制の変更によるスコア
    if (lawEffect.politicalSystemChange) {
        if (lawEffect.politicalSystemChange === 'MONARCHY') {
            score += (weights['proTradition'] || 0) * 2;
            score -= (weights['proRepublic'] || 0) * 3;
        }
        if (lawEffect.politicalSystemChange === 'REPUBLIC') {
            score += (weights['proRepublic'] || 0) * 2;
            score -= (weights['proTradition'] || 0) * 3;
        }
        if (lawEffect.politicalSystemChange === 'DICTATORSHIP') {
            score -= 5; // ほとんどのイデオロギーは独裁に反対する
        }
    }

    // 4. 政党への効果によるスコア（AIは自身への攻撃を嫌う）
    if (lawEffect.partyEffects) {
        lawEffect.partyEffects.forEach(effect => {
            if (effect.action === 'dissolve' || effect.action === 'confiscate_seats') {
                // 自分たちが対象であれば強く反対する
                if (effect.targetPartyName === "ALL_OPPOSITION") { // TODO: もっと賢くする
                    score -= 10;
                }
            }
        });
    }

    // 5. ランダム要素を追加
    score += (Math.random() - 0.5) * 2; // -1から+1のランダムな値を加算

    // 最終スコアに基づいて決定
    return score > 0 ? 'approve' : 'oppose';
};

const newsOutlets = {
    conservative: ['国民日報', '保守論壇', '国家タイムズ', '伝統ジャーナル', 'ジパング・ポスト', '経世新聞', '新時代報知'],
    liberal: ['改革派ジャーナル', 'リベラル・ポスト', '市民の声', '未来ニュース', 'アサヒ・クロニクル', 'みらい新聞', 'ザ・プログレス'],
    neutral: ['中立タイムズ', '経済通信', '事実報道', 'ジオ・ポリティクス・レビュー', '公共放送', '国際ニュースネットワーク', 'データジャーナル'],
};

const generateNewsArticle = (lawName: string, isPassed: boolean): NewsArticle => {
    const random = Math.random();
    const leaning: ('conservative' | 'liberal' | 'neutral') = random < 0.4 ? 'conservative' : (random < 0.8 ? 'liberal' : 'neutral');
    
    const outlets = newsOutlets[leaning];
    const outletName = outlets[Math.floor(Math.random() * outlets.length)];

    let headline = '';
    let body = '';
    
    const templates = {
        passed: {
            liberal: [
                { h: `「${lawName}」可決！多様性と平等のための歴史的勝利`, b: `長年の議論の末、ついに「${lawName}」が可決された。これは我が国がより公正で進歩的な社会へと踏み出す、記念碑的な一歩となるだろう。` },
                { h: `【速報】「${lawName}」成立、市民の声が政治を動かす`, b: `本日成立した「${lawName}」は、多くの市民団体がその必要性を訴えてきたものだ。粘り強い運動が実を結んだ形となり、今後の社会変革への期待が高まる。` },
                { h: `新時代へ、「${lawName}」がついに実現`, b: `本日可決された「${lawName}」は、旧態依然としたシステムからの脱却を象徴している。反対派の抵抗を乗り越え、ついに我々の社会は新たなステージに進む。`},
                { h: `歓喜の声！「${lawName}」成立で未来への扉が開く`, b: `議会は本日、画期的な「${lawName}」を可決した。これにより、長年置き去りにされてきた課題の解決に向け、社会は大きく前진する。`},
                { h: `歴史が動いた日：「${lawName}」可決に市民社会が祝福`, b: `「${lawName}」の成立は、民意が政治に反映された証しだ。多くの専門家も、この決定がもたらすポジティブな影響に期待を寄せている。`},
                { h: `歴史的法案「${lawName}」ついに成立、社会正義へ大一歩`, b: `長きにわたる市民運動と議員たちの努力が実を結び、「${lawName}」が可決された。これにより、よりインクルーシ브で公正な社会の実現が期待される。`},
                { h: `「${lawName}」成立は国民の勝利！新しい時代の幕開け`, b: `本日可決された「${lawName}」は、まさに国民の声が政治を動かした結果だ。この歴史的な決定を、我々は新しい時代の始まりとして歓迎したい。`},
            ],
            conservative: [
                { h: `【懸念】「${lawName}」が強行採決、国家の根幹が揺らぐ`, b: `本日可決された「${lawName}」は、我が国の伝統と秩序を破壊しかねない危険な法案である。政府の拙速な判断に、多くの国民が不安を抱いている。` },
                { h: `「${lawName}」成立、左派の暴走に専門家から警鐘`, b: `専門家は、今回成立した「${lawName}」が経済や社会に与える負の影響は計り知れないと指摘。短期的な理想論が、国家の長期的な利益を損なう結果とならなければ良いが。` },
                { h: `悪法「${lawName}」成立、国に暗雲`, b: `議会は本日、国民の声を無視して「${lawName}」を可決した。これにより、社会の混乱と道徳の崩壊が加速することは避けられないだろう。`},
                { h: `国論を二分した「${lawName}」成立、将来に禍根を残す可能性`, b: `議会は数の力で「${lawName}」を押し通した。この決定が国家の伝統や経済に与える悪影響を、我々は注視し続けなければならない。`},
                { h: `拙速な判断、「${lawName}」可決に国民から不安の声`, b: `十分な議論が尽くされないまま「${lawName}」が成立したことに、多くの国民が戸惑いと不安を隠せない。政府は丁寧な説明責任を果たすべきだ。`},
                { h: `「${lawName}」成立、理想論が現実を破壊する`, b: `理想ばかりを追い求めた「${lawName}」の成立は、我が国の安定と繁栄を脅かすものだ。現実を無視した政策のツケは、いずれ国民が払うことになる。`},
                { h: `議会は民意を無視、「${lawName}」強行採決に強い憤り`, b: `多くの国民が反対の声を上げていたにもかかわらず、「${lawName}」は数の論理で強行採決された。これは民主主義の危機であり、断じて容認できない。`},
            ],
            neutral: [
                { h: `「${lawName}」成立、賛否両論の中での船出`, b: `「${lawName}」が本日、国会で可決された。経済界からは期待の声が上がる一方、市民団体からは反対の声も根強く、新法の運用は慎重な舵取りが求められる。` },
                { h: `国会、「${lawName}」を可決`, b: `本日、国会は「${lawName}」を賛成多数で可決した。これにより、関連する分野での政策が大きく転換されることになる。具体的な影響については、今後の動向を注視する必要がある。` },
                { h: `「${lawName}」が可決、今後の影響は`, b: `賛成、反対の意見が拮抗する中、「${lawName}」は可決された。政府は今後、法案がもたらす変化について国民への丁寧な説明が求められる。`},
                { h: `「${lawName}」が議会を通過、新制度がスタート`, b: `本日、国会で「${lawName}」が可決、成立した。これにより、関連する分野で新たな制度が導入される。政府は円滑な施行に向け、準備を急ぐ方針だ。`},
                { h: `議論を呼んだ「${lawName}」が成立、影響は未知数`, b: `賛否両論があった「${lawName}」だが、最終的に議会は可決を選択した。この法案が社会にどのような変化をもたらすか、専門家の間でも意見が分かれている。`},
                { h: `「${lawName}」可決、政府は影響評価に全力`, b: `本日成立した「${lawName}」について、政府は今後、社会や経済に与える影響を慎重に評価し、必要な対策を講じていくと発表した。`},
            ]
        },
        failed: {
            liberal: [
                { h: `【悲報】「${lawName}」否決、時代に逆行する議会`, b: `改革への大きな期待が寄せられていた「${lawName}」は、本日、保守派の頑なな抵抗により否決された。議会の旧態依然とした体質が改めて露呈した形だ。` },
                { h: `「${lawName}」否決、改革への道は遠く`, b: `多くの国民が待ち望んだ「${lawName}」は、残念ながら否決された。社会が抱える問題の解決は、またも先送りされることになった。` },
                { h: `議会の良識は死んだのか、「${lawName}」が否決される`, b: `未来への投資とも言える「${lawName}」が、一部の既得権益層の反対によって葬り去られた。この国の民主主義は機能しているのだろうか。`},
                { h: `落胆広がる、「${lawName}」否決は改革への裏切り`, b: `社会をより良くするための一歩となるはずだった「${lawName}」は、頑迷な反対勢力によって葬られた。国民の期待は無残にも裏切られた。`},
                { h: `議会の怠慢、「${lawName}」否決で問題解決は先送り`, b: `進歩を拒む議会の決定により、「${lawName}」は否決された。これにより、多くの国民が抱える問題の解決がまたもや遠のいた。`},
                { h: `希望は打ち砕かれた。「${lawName}」否決に市民ら抗議`, b: `改革を求める声を無視した議会の決定に、市民団体からは怒りと失望の声が上がっている。法案の否決を受け、各地で抗議活動が行われる見込みだ。`},
            ],
            conservative: [
                { h: `【朗報】「${lawName}」否決！国民の良識が国家を守った`, b: `国論を二分した「${lawName}」は、本日否決された。これは、過激な変革から我が国の伝統と安定を守る、賢明な判断であったと言えよう。` },
                { h: `危険法案「${lawName}」を阻止、野党の奮闘実る`, b: `国の将来を危うくする「${lawName}」が否決された。一部野党による粘り強い反対が、無謀な法案の成立を阻止したと評価する声も上がっている。` },
                { h: `「${lawName}」否決、国家の危機を回避`, b: `左派勢力が推し進めた危険な法案「${lawName}」は、良識ある議員たちの反対により否決された。国民は胸をなでおろしていることだろう。`},
                { h: `良識の勝利！「${lawName}」否決で国家の混乱を回避`, b: `国を誤った方向へ導きかねなかった危険な法案「${lawName}」が否決されたことは、議会に残された良識の証しである。`},
                { h: `「${lawName}」を阻止、健全な議論の末の賢明な判断`, b: `活発な議論の末、議会は「${lawName}」を否決した。これは、拙速な改革よりも安定を重視する国民の意思が反映された結果と言えよう。`},
                { h: `暴走を食い止めた！「${lawName}」否決は議会の功績`, b: `国を危険に晒す「${lawName}」が否決された。これは、国民生活と国家の秩序を守るという議会の責務が果たされた結果である。`},
            ],
            neutral: [
                { h: `「${lawName}」は否決、議論は振り出しに`, b: `注目されていた「${lawName}」は、与野党の合意形成に至らず、否決という結果に終わった。関連する課題の解決は、今後の大きな政治的課題として残ることになる。` },
                { h: `「${lawName}」、賛成届かず否決`, b: `国会で審議されていた「${lawName}」は、本日行われた採決で賛成が過半数に届かず、否決された。法案を推進してきた与党にとって、大きな痛手となる可能性がある。` },
                { h: `「${lawName}」の採決、合意形成ならず`, b: `国会は本日、「${lawName}」を否決した。政府と野党の間の溝は深く、今後の国会運営にも影響を与えそうだ。`},
                { h: `「${lawName}」、合意形成に至らず廃案に`, b: `国会で審議が続いていた「${lawName}」は、与野党間の溝が埋まらず、採決の結果、否決され廃案となった。`},
                { h: `重要法案「${lawName}」、今国会での成立見送り`, b: `「${lawName}」は、成立に必要な賛成票を確保できず、否決された。法案の支持者にとっては残念な結果となったが、反対派は胸をなでおろしている。`},
                { h: `「${lawName}」採決、わずかな差で否決される`, b: `大接戦となった「${lawName}」の採決は、最終的にわずかな差で否決された。法案を巡る国論の分裂が改めて浮き彫りになった。`},
            ]
        }
    };
    
    const relevantTemplates = isPassed ? templates.passed[leaning] : templates.failed[leaning];
    const selectedTemplate = relevantTemplates[Math.floor(Math.random() * relevantTemplates.length)];
    
    headline = selectedTemplate.h;
    body = selectedTemplate.b;
    
    return { outletName, politicalLeaning: leaning, headline, body };
};

const budgetEffects: {
  [key in keyof Budget]: {
    [key in BudgetItem]: {
      treasury: number;
      factionHappinessChanges: { [key: string]: number };
      researchPointsModifier?: number;
      militaryPowerModifier?: number;
      manpowerModifier?: number;
      militaryFrustration: number;
    };
  };
} = {
    tax: {
        low: { treasury: -1500, factionHappinessChanges: { '富裕層': 4, '中間層': 2, '貧困層': 1, '資本家': 5, '労働者': 1 }, militaryFrustration: 0 },
        normal: { treasury: 0, factionHappinessChanges: { '富裕層': 0, '中間層': 0, '貧困層': 0, '資本家': 0, '労働者': 0 }, militaryFrustration: 0 },
        high: { treasury: 2000, factionHappinessChanges: { '富裕層': -6, '中間層': -4, '貧困層': -2, '資本家': -7, '労働者': -3 }, militaryFrustration: 0 },
    },
    education: {
        low: { treasury: 800, factionHappinessChanges: { '富裕層': 1, '中間層': -3, '貧困層': -2, '資本家': 0, '労働者': -1 }, researchPointsModifier: -5, militaryFrustration: 0 },
        normal: { treasury: 0, factionHappinessChanges: { '富裕層': 0, '中間層': 0, '貧困層': 0, '資本家': 0, '労働者': 0 }, militaryFrustration: 0 },
        high: { treasury: -1500, factionHappinessChanges: { '富裕層': -1, '中間層': 4, '貧困層': 2, '資本家': 1, '労働者': 2 }, researchPointsModifier: 10, militaryFrustration: 0 },
    },
    welfare: {
        low: { treasury: 1000, factionHappinessChanges: { '富裕層': 2, '中間層': -2, '貧困層': -8, '資本家': 1, '労働者': -6 }, manpowerModifier: -50, militaryFrustration: 0 },
        normal: { treasury: 0, factionHappinessChanges: { '富裕層': 0, '中間層': 0, '貧困層': 0, '資本家': 0, '労働者': 0 }, militaryFrustration: 0 },
        high: { treasury: -2500, factionHappinessChanges: { '富裕層': -4, '中間層': 3, '貧困層': 10, '資本家': -2, '労働者': 8 }, manpowerModifier: 80, militaryFrustration: 0 },
    },
    defense: {
        low: { treasury: 1200, factionHappinessChanges: {}, militaryPowerModifier: -20, militaryFrustration: 2 },
        normal: { treasury: 0, factionHappinessChanges: {}, militaryFrustration: 0 },
        high: { treasury: -3000, factionHappinessChanges: { '富裕層': 1, '中間層': 1, '貧困層': 0, '資本家': 2, '労働者': 1 }, militaryPowerModifier: 30, militaryFrustration: -2 },
    },
};

const resourceLabels: Record<string, string> = {
    treasury: '国庫',
    stability: '社会安定',
    manpower: '人的資源',
    researchPoints: '研究P',
    militaryPower: '軍事力',
    militaryFrustration: '軍部の不満',
    researchPointsModifier: '研究P/ターン',
    manpowerModifier: '人的資源/ターン',
    militaryPowerModifier: '軍事力/ターン',
};

const budgetItemLabels: Record<keyof Budget, string> = {
    tax: '税率',
    education: '教育予算',
    welfare: '社会保障',
    defense: '国防予算',
};


// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

const MainGame: React.FC<MainGameProps> = ({ gameState, setGameState, oppositionPartyPresets }) => {
  const [activeTab, setActiveTab] = useState(gameState.playerStatus === 'ruling' ? 'law' : 'opposition_activity');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDonationMinigameOpen, setIsDonationMinigameOpen] = useState(false);
  const [canProposeLaw, setCanProposeLaw] = useState(true);
  const [isVotingInProgress, setIsVotingInProgress] = useState(false);
  const [tempBudget, setTempBudget] = useState<Budget>(gameState.budget);
  const [diplomacyTarget, setDiplomacyTarget] = useState<Party | null>(null);
  const [isHireMinisterModalOpen, setIsHireMinisterModalOpen] = useState(false);
  const [isGachaAnimationOpen, setIsGachaAnimationOpen] = useState(false);
  const [ministerCandidates, setMinisterCandidates] = useState<Minister[]>([]);
  const [isSpeechMinigameOpen, setIsSpeechMinigameOpen] = useState(false);

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const checkForRebellion = (currentState: GameState | null): GameState | null => {
    if (!currentState) return null;
    const overallStability = currentState.country.factions.reduce((acc, f) => acc + f.happiness * f.populationShare, 0) / 100;

    if (overallStability <= 15 && currentState.status !== GameStatus.CivilWar && currentState.civilWarState === null) {
        playSound('failure');
        const newLogs = [...currentState.logs, '[反乱勃発] 国民の不満が頂点に達し、各地で反乱が発生。内戦状態に突入した！'];
        const rebelStrength = Math.round(currentState.country.militaryPower * (0.6 + Math.random() * 0.4));
        
        return {
            ...currentState,
            status: GameStatus.CivilWar,
            civilWarState: {
                rebelStrength: rebelStrength,
                warProgress: 0,
                rebelSupplyDebuffTurns: 0,
            },
            logs: newLogs,
            activeEvent: null,
            billToVoteOn: null,
        };
    }
    return currentState;
  };

  const handleCivilWarTurn = useCallback(async (tactic: WarTactic) => {
    playSound('action');

    setGameState(prev => {
        if (!prev || !prev.civilWarState) return prev;
        
        const newLogs: string[] = [];
        let newCountry = { ...prev.country };
        let newPlayerStats = { ...prev.playerStats };
        let { warProgress, rebelStrength, rebelSupplyDebuffTurns } = prev.civilWarState;

        // 1. コスト支払い & 作戦実行
        switch (tactic) {
            case 'offensive':
                if (newPlayerStats.politicalPower < 10) return prev;
                newPlayerStats.politicalPower -= 10;
                newLogs.push('[作戦: 総攻撃] 全軍に前進を命令した！');
                break;
            case 'defensive':
                newLogs.push('[作戦: 防衛重視] 戦線を維持し、敵の消耗を待つ。');
                break;
            case 'guerrilla':
                if (newCountry.treasury < 2000) return prev;
                newCountry.treasury -= 2000;
                newCountry.factions = newCountry.factions.map(f => ({ ...f, happiness: Math.max(0, f.happiness - 2) }));
                newLogs.push('[作戦: ゲリラ戦] 敵後方を攪乱し、直接打撃を与える！');
                break;
            case 'supply_raid':
                if (newPlayerStats.politicalPower < 20) return prev;
                newPlayerStats.politicalPower -= 20;
                newLogs.push('[作戦: 兵站攻撃] 敵の補給路を断つべく、特殊部隊を派遣した。');
                break;
        }

        // 2. 戦闘前の補正
        let playerPower = newCountry.militaryPower;
        let rebelPower = rebelStrength;
        if (rebelSupplyDebuffTurns > 0) {
            rebelPower *= 0.7; // 兵站攻撃成功時、敵の戦力30%減
            newLogs.push('[兵站攻撃成功] 反乱軍の補給線が混乱し、戦闘力が低下している！');
        }

        // 3. 戦闘計算
        let progressChange = 0;
        let playerCasualties = 0;
        let rebelCasualties = 0;
        const powerRatio = playerPower / (playerPower + rebelPower);

        switch (tactic) {
            case 'offensive':
                progressChange = Math.round((powerRatio - 0.4) * 40 + (Math.random() - 0.5) * 15);
                playerCasualties = Math.round(playerPower * (0.08 + Math.random() * 0.07));
                rebelCasualties = Math.round(rebelPower * (0.10 + Math.random() * 0.05));
                break;
            case 'defensive':
                progressChange = Math.round((powerRatio - 0.5) * 20 + (Math.random() - 0.5) * 10);
                playerCasualties = Math.round(playerPower * (0.04 + Math.random() * 0.04));
                rebelCasualties = Math.round(rebelPower * (0.07 + Math.random() * 0.06));
                break;
            case 'guerrilla':
                progressChange = Math.round((Math.random() - 0.5) * 10);
                playerCasualties = Math.round(playerPower * (0.06 + Math.random() * 0.04));
                const guerrillaDamage = Math.round(rebelStrength * (0.05 + Math.random() * 0.05));
                rebelCasualties = guerrillaDamage;
                newLogs.push(`[ゲリラ戦成功] 反乱軍に奇襲をかけ、${guerrillaDamage.toLocaleString()}の損害を与えた！`);
                break;
            case 'supply_raid':
                const raidSuccess = Math.random() < 0.7; // 70% success
                if (raidSuccess) {
                    rebelSupplyDebuffTurns = 3; // 3ターン持続 (今ターン含む)
                    newLogs.push('[兵站攻撃成功] 敵の補給路の破壊に成功！効果は数ターン持続する。');
                } else {
                    newLogs.push('[兵站攻撃失敗] 敵の補給路は破壊できなかった...');
                }
                playerCasualties = Math.round(playerPower * (0.02 + Math.random() * 0.02));
                break;
        }

        // 4. 結果反映
        const newWarProgress = Math.max(-100, Math.min(100, warProgress + progressChange));
        const newMilitaryPower = Math.max(0, newCountry.militaryPower - playerCasualties);
        const newRebelStrength = Math.max(0, rebelStrength - rebelCasualties);
        const newManpower = newCountry.manpower - Math.round((playerCasualties + rebelCasualties) / 2);
        
        newLogs.push(`[戦況報告] 戦線は${progressChange >= 0 ? '前進' : '後退'}。政府軍損害: ${playerCasualties.toLocaleString()}, 反乱軍損害: ${rebelCasualties.toLocaleString()}`);

        if (newWarProgress >= 100) {
            playSound('success');
            alert("内戦に勝利しました！国家の統一が回復されました。");
            return {
                ...prev,
                status: GameStatus.Playing,
                turn: prev.turn + 1,
                country: { ...newCountry, militaryPower: newMilitaryPower, manpower: newManpower, factions: newCountry.factions.map(f => ({ ...f, happiness: Math.min(100, f.happiness + 20) })) },
                civilWarState: null,
                playerStats: newPlayerStats,
                logs: [...prev.logs, ...newLogs, "[内戦終結] 反乱軍を鎮圧し、内戦に勝利した。"],
            };
        }

        if (newWarProgress <= -100 || newMilitaryPower <= 0) {
            playSound('failure');
            alert("内戦に敗北しました...新政権が樹立され、あなたは政治の舞台から追放されました。");
            setGameState(null); // Game Over
            return null;
        }

        return {
            ...prev,
            turn: prev.turn + 1,
            country: { ...newCountry, militaryPower: newMilitaryPower, manpower: newManpower },
            playerStats: newPlayerStats,
            civilWarState: { 
                warProgress: newWarProgress, 
                rebelStrength: newRebelStrength,
                rebelSupplyDebuffTurns: Math.max(0, rebelSupplyDebuffTurns - 1)
            },
            logs: [...prev.logs, ...newLogs],
        };
    });
  }, [setGameState]);

    const handleWarTurn = useCallback(async (tactic: WarTactic) => {
    playSound('action');

    setGameState(prev => {
        if (!prev || !prev.warState) return prev;
        
        const newLogs: string[] = [];
        let newCountry = { ...prev.country };
        let newPlayerStats = { ...prev.playerStats };
        let { warProgress, enemyStrength, enemySupplyDebuffTurns } = prev.warState;

        // 1. コスト支払い & 作戦実行
        switch (tactic) {
            case 'offensive':
                if (newPlayerStats.politicalPower < 10) return prev;
                newPlayerStats.politicalPower -= 10;
                newLogs.push('[作戦: 総攻撃] 全軍に前進を命令した！');
                break;
            case 'defensive':
                newLogs.push('[作戦: 防衛重視] 戦線を維持し、敵の消耗を待つ。');
                break;
            case 'guerrilla':
                if (newCountry.treasury < 2000) return prev;
                newCountry.treasury -= 2000;
                newCountry.factions = newCountry.factions.map(f => ({ ...f, happiness: Math.max(0, f.happiness - 2) }));
                newLogs.push('[作戦: ゲリラ戦] 敵後方を攪乱し、直接打撃を与える！');
                break;
            case 'supply_raid':
                if (newPlayerStats.politicalPower < 20) return prev;
                newPlayerStats.politicalPower -= 20;
                newLogs.push('[作戦: 兵站攻撃] 敵の補給路を断つべく、特殊部隊を派遣した。');
                break;
        }

        // 2. 戦闘前の補正
        let playerPower = newCountry.militaryPower;
        let enemyPower = enemyStrength;
        if (enemySupplyDebuffTurns > 0) {
            enemyPower *= 0.7; // 兵站攻撃成功時、敵の戦力30%減
            newLogs.push('[兵站攻撃成功] 敵国の補給線が混乱し、戦闘力が低下している！');
        }

        // 3. 戦闘計算
        let progressChange = 0;
        let playerCasualties = 0;
        let enemyCasualties = 0;
        const powerRatio = playerPower / (playerPower + enemyPower);

        switch (tactic) {
            case 'offensive':
                progressChange = Math.round((powerRatio - 0.4) * 40 + (Math.random() - 0.5) * 15);
                playerCasualties = Math.round(playerPower * (0.08 + Math.random() * 0.07));
                enemyCasualties = Math.round(enemyPower * (0.10 + Math.random() * 0.05));
                break;
            case 'defensive':
                progressChange = Math.round((powerRatio - 0.5) * 20 + (Math.random() - 0.5) * 10);
                playerCasualties = Math.round(playerPower * (0.04 + Math.random() * 0.04));
                enemyCasualties = Math.round(enemyPower * (0.07 + Math.random() * 0.06));
                break;
            case 'guerrilla':
                progressChange = Math.round((Math.random() - 0.5) * 10);
                playerCasualties = Math.round(playerPower * (0.06 + Math.random() * 0.04));
                const guerrillaDamage = Math.round(enemyStrength * (0.05 + Math.random() * 0.05));
                enemyCasualties = guerrillaDamage;
                newLogs.push(`[ゲリラ戦成功] 敵国軍に奇襲をかけ、${guerrillaDamage.toLocaleString()}の損害を与えた！`);
                break;
            case 'supply_raid':
                const raidSuccess = Math.random() < 0.7; // 70% success
                if (raidSuccess) {
                    enemySupplyDebuffTurns = 3; // 3ターン持続 (今ターン含む)
                    newLogs.push('[兵站攻撃成功] 敵の補給路の破壊に成功！効果は数ターン持続する。');
                } else {
                    newLogs.push('[兵站攻撃失敗] 敵の補給路は破壊できなかった...');
                }
                playerCasualties = Math.round(playerPower * (0.02 + Math.random() * 0.02));
                break;
        }

        // 4. 結果反映
        const newWarProgress = Math.max(-100, Math.min(100, warProgress + progressChange));
        const newMilitaryPower = Math.max(0, newCountry.militaryPower - playerCasualties);
        const newEnemyStrength = Math.max(0, enemyStrength - enemyCasualties);
        const newManpower = newCountry.manpower - Math.round((playerCasualties + enemyCasualties) / 2);
        
        newLogs.push(`[戦況報告] 戦線は${progressChange >= 0 ? '前進' : '後退'}。自国軍損害: ${playerCasualties.toLocaleString()}, 敵国軍損害: ${enemyCasualties.toLocaleString()}`);

        if (newWarProgress >= 100) {
            playSound('success');
            const reparations = 10000;
            const newParties = prev.parties.map(p => p.isPlayer ? { ...p, support: Math.min(100, p.support + 5) } : p);
            alert("戦争に勝利しました！多額の賠償金を獲得し、国家の威信は高まりました。");
            return {
                ...prev,
                status: GameStatus.Playing,
                turn: prev.turn + 1,
                country: { ...newCountry, militaryPower: newMilitaryPower, manpower: newManpower, factions: newCountry.factions.map(f => ({ ...f, happiness: Math.min(100, f.happiness + 10) })), treasury: newCountry.treasury + reparations },
                warState: null,
                playerStats: newPlayerStats,
                parties: newParties,
                logs: [...prev.logs, ...newLogs, `[戦争終結] 敵国に勝利した！賠償金 ${reparations.toLocaleString()} を獲得。`],
            };
        }

        if (newWarProgress <= -100 || newMilitaryPower <= 0) {
            playSound('failure');
            const reparations = -5000;
            const newParties = prev.parties.map(p => p.isPlayer ? { ...p, support: Math.max(0, p.support - 15) } : p);
            alert("戦争に敗北しました...莫大な賠償金を支払い、国家は疲弊しました。");
            return {
                 ...prev,
                status: GameStatus.Playing,
                turn: prev.turn + 1,
                country: { ...newCountry, militaryPower: newMilitaryPower, manpower: newManpower, factions: newCountry.factions.map(f => ({...f, happiness: Math.max(0, f.happiness - 20)})), treasury: newCountry.treasury + reparations },
                warState: null,
                playerStats: newPlayerStats,
                parties: newParties,
                logs: [...prev.logs, ...newLogs, `[戦争終結] 敵国に敗北した...賠償金 ${Math.abs(reparations).toLocaleString()} を支払った。`],
            };
        }

        return {
            ...prev,
            turn: prev.turn + 1,
            country: { ...newCountry, militaryPower: newMilitaryPower, manpower: newManpower },
            playerStats: newPlayerStats,
            warState: { 
                warProgress: newWarProgress, 
                enemyStrength: newEnemyStrength,
                enemySupplyDebuffTurns: Math.max(0, enemySupplyDebuffTurns - 1)
            },
            logs: [...prev.logs, ...newLogs],
        };
    });
  }, [setGameState]);

  const handleNextTurn = useCallback(async () => {
    playSound('next_turn');
    setGameState(prev => {
        if (!prev || prev.activeEvent || prev.billToVoteOn || prev.voteResult || prev.status === GameStatus.CivilWar || prev.status === GameStatus.War) return prev;

        let newLogs: string[] = [`ターン${prev.turn + 1}が始まりました。`];
        let billToVoteOn: GameState['billToVoteOn'] = prev.billToVoteOn;
        let activeEvent: GameState['activeEvent'] = null;
        let newCountry = { ...prev.country };
        let newMilitaryFrustration = prev.militaryFrustration;
        let newOppositionCoalitions = [...prev.oppositionCoalitions];
        
        // Apply budget effects
        let budgetLog = ['[予算執行]'];
        (Object.keys(prev.budget) as Array<keyof Budget>).forEach(key => {
            const level = prev.budget[key];
            const effect = budgetEffects[key][level];
            newCountry.treasury += effect.treasury;

            const factionChanges = effect.factionHappinessChanges;
            if (factionChanges) {
                newCountry.factions = newCountry.factions.map(f => {
                    const change = factionChanges[f.name] || 0;
                    return { ...f, happiness: Math.max(0, Math.min(100, f.happiness + change)) };
                });
            }
            
            if (effect.researchPointsModifier) newCountry.researchPoints += effect.researchPointsModifier;
            if (effect.manpowerModifier) newCountry.manpower += effect.manpowerModifier;
            if (effect.militaryPowerModifier) newCountry.militaryPower += effect.militaryPowerModifier;
            if (effect.militaryFrustration) newMilitaryFrustration += effect.militaryFrustration;
        });

        // Apply minister effects
        if (prev.ministers.length > 0) {
            newLogs.push('[大臣効果]');
            prev.ministers.forEach(minister => {
                let ministerEffectLog: string[] = [];
// FIX: Use Object.entries for type-safe iteration over minister effects to prevent indexing errors.
                Object.entries(minister.effects.resourceChanges).forEach(([key, value]) => {
                    if (value) {
                         (newCountry[key as keyof typeof newCountry] as number) += value;
                        ministerEffectLog.push(`${resourceLabels[key] || key} ${value > 0 ? '+' : ''}${value}`);
                    }
                });
// FIX: Use Object.entries for type-safe iteration over minister effects to prevent indexing errors.
                 Object.entries(minister.effects.countryModifiers).forEach(([key, value]) => {
                    if (value) {
                        (newCountry[key as keyof typeof newCountry] as number) += value;
                        ministerEffectLog.push(`${resourceLabels[key] || key} ${value > 0 ? '+' : ''}${value}`);
                    }
                });
                if (minister.effects.factionHappinessChanges) {
                    newCountry.factions = newCountry.factions.map(faction => {
                        const change = minister.effects.factionHappinessChanges![faction.name] || 0;
                        if (change !== 0) {
                            return { ...faction, happiness: Math.max(0, Math.min(100, faction.happiness + change)) };
                        }
                        return faction;
                    });
                }
                if(ministerEffectLog.length > 0){
                     newLogs.push(`- ${minister.lastName} ${minister.position}: ${ministerEffectLog.join(', ')}`);
                }
            });
        }

        // Apply corruption effects
        const corruptionDrain = Math.floor(newCountry.corruption * newCountry.corruption * 5);
        if (corruptionDrain > 0) {
            newCountry.treasury -= corruptionDrain;
            newLogs.push(`[腐敗] 汚職により国庫から ${corruptionDrain.toLocaleString()} が不自然に流出した。`);
        }

        // Treasury deficit effect
        if (newCountry.treasury < 0) {
            const stabilityPenalty = 1 + Math.floor(Math.abs(newCountry.treasury) / 10000); // Penalty increases with debt
            newCountry.stability = Math.max(0, newCountry.stability - stabilityPenalty);
            newLogs.push(`[財政危機] 国庫が赤字のため、社会安定度が ${stabilityPenalty} 低下しました。`);
        }

        newMilitaryFrustration = Math.max(0, Math.min(20, newMilitaryFrustration));
        
        // Diplomatic Pacts Countdown
        const expiredPacts = prev.diplomaticPacts.filter(p => p.turnsRemaining === 1);
        expiredPacts.forEach(pact => {
            newLogs.push(`[外交] ${pact.partyName}との協力関係が期限切れとなった。`);
        });
        const newPacts = prev.diplomaticPacts.map(p => ({ ...p, turnsRemaining: p.turnsRemaining - 1 })).filter(p => p.turnsRemaining > 0);


        const politicalPowerRecovery = 5;
        const newPlayerStats = {
            ...prev.playerStats,
            politicalPower: prev.playerStats.politicalPower + politicalPowerRecovery,
        };
        newLogs.push(`政治力が${politicalPowerRecovery}回復しました。`);
        
        const playerParty = prev.parties.find(p => p.isPlayer);

        if (playerParty && playerParty.support <= 0 && prev.playerStatus === 'ruling') {
            playSound('failure');
            const oppositionParties = prev.parties.filter(p => !p.isPlayer);
// FIX: Corrected object creation to conform to the Party type to avoid type errors.
            const newRulingParty = oppositionParties.length > 0 ? oppositionParties.sort((a,b) => b.support - a.support)[0] : {partyName: '臨時政府', ideology: '中道', seats: 0, support: 0, relation: 0};

            newLogs.push(`[政権交代] ${playerParty.partyName}への支持が失われ、政権が崩壊しました。`);
            newLogs.push(`${newRulingParty.partyName}が新たな政権与党となりました。`);
            newLogs.push(`あなたは野党として活動を続けることになります。`);
            setActiveTab('opposition_activity');
            return {
                ...prev,
                turn: prev.turn + 1,
                playerStats: newPlayerStats,
                playerStatus: 'opposition',
                logs: [...prev.logs, ...newLogs],
            };
        }

        // Support rate and relation natural change
        const overallHappiness = newCountry.factions.reduce((acc, f) => acc + f.happiness * f.populationShare, 0) / 100;
        const updatedParties = prev.parties.map(p => {
            let supportChange = -0.3; // Base decay
            let relationChange = -0.5; // Base relation decay

            if (p.isPlayer) {
                const stabilityFactor = (overallHappiness - 50) / 100; // -0.5 to 0.5
                supportChange += (Math.random() * 0.4 - 0.1) + stabilityFactor * 0.5;
            } else {
                supportChange += Math.random() * 0.8 - 0.2; // -0.5 to +0.6
                if(prev.playerCoalition.includes(p.partyName)){
                    relationChange = 0.5; // Relation increases with coalition partners
                }
            }
            
            const newSupport = Math.max(0, Math.min(100, p.support + supportChange));
            const newRelation = Math.max(0, Math.min(100, p.relation + relationChange));

            return { ...p, support: newSupport, relation: newRelation };
        });

        // Opposition Coalition Formation Logic
        if (Math.random() < 0.15 && prev.playerStatus === 'ruling') {
            const unalignedParties = updatedParties.filter(p => !p.isPlayer && !newOppositionCoalitions.some(c => c.members.includes(p.partyName)));
            if (unalignedParties.length >= 2) {
                const initiator = unalignedParties[Math.floor(Math.random() * unalignedParties.length)];
                const initiatorGroup = ideologyToGroup[initiator.ideology] || 'other';
                
                const potentialPartners = unalignedParties.filter(p => {
                    if (p.partyName === initiator.partyName) return false;
                    const targetGroup = ideologyToGroup[p.ideology] || 'other';
                    return initiatorGroup !== 'other' && targetGroup === initiatorGroup;
                });

                if (potentialPartners.length > 0) {
                    const partner = potentialPartners[Math.floor(Math.random() * potentialPartners.length)];
                    const coalitionName = `${initiatorGroup}連合`;
                    const existingCoalition = newOppositionCoalitions.find(c => c.name === coalitionName);
                    
                    if (existingCoalition) {
                        if(!existingCoalition.members.includes(initiator.partyName)) existingCoalition.members.push(initiator.partyName);
                        if(!existingCoalition.members.includes(partner.partyName)) existingCoalition.members.push(partner.partyName);
                    } else {
                        newOppositionCoalitions.push({ name: coalitionName, members: [initiator.partyName, partner.partyName] });
                    }
                    newLogs.push(`[野党] ${initiator.partyName}と${partner.partyName}が連携し、「${coalitionName}」を結成した！`);
                }
            }
        }
        
        if(prev.playerStatus === 'ruling') {
            // Event Trigger Logic
            const overallStability = newCountry.factions.reduce((acc, f) => acc + f.happiness * f.populationShare, 0) / 100;

            if (newCountry.corruption > 40 && Math.random() < (newCountry.corruption - 40) / 50) {
                playSound('failure');
                newLogs.push('[反乱勃発] 深刻な腐敗に国民の怒りが爆発！各地で反乱が発生し、内戦状態に突入した！');
                const rebelStrength = Math.round(newCountry.militaryPower * (0.5 + newCountry.corruption / 100));
                return {
                     ...prev,
                    turn: prev.turn + 1,
                    country: { ...newCountry, corruption: Math.floor(newCountry.corruption / 2) },
                    playerStats: newPlayerStats,
                    parties: updatedParties,
                    logs: [...prev.logs, ...newLogs],
                    activeEvent: null,
                    billToVoteOn: null,
                    militaryFrustration: newMilitaryFrustration,
                    diplomaticPacts: newPacts,
                    oppositionCoalitions: newOppositionCoalitions,
                    status: GameStatus.CivilWar,
                    civilWarState: {
                        rebelStrength: rebelStrength,
                        warProgress: 0,
                        rebelSupplyDebuffTurns: 0,
                    },
                };
            } else if (newCountry.corruption > 15 && Math.random() < (newCountry.corruption - 15) / 50) {
                activeEvent = corruptionProtestEvent;
            } else if (overallStability < 40 && newMilitaryFrustration > 8 && prev.playerStatus === 'ruling' && Math.random() < 0.3) {
                activeEvent = {...coupEvent, description: `国家の安定性が著しく低下し、軍部の不満が頂点に達しました。${coupEvent.description}`};
            } else if (playerParty && playerParty.support < 20 && Math.random() < 0.2) {
                activeEvent = protestEvent;
            } else if (overallStability < 50 && Math.random() < 0.02) {
                 activeEvent = warEvent;
            } else if (Math.random() < 0.25) {
                const allEvents = [...domesticEvents, ...internationalEvents];
                activeEvent = allEvents[Math.floor(Math.random() * allEvents.length)];
            }

            if (activeEvent) {
                 newLogs.push(`[イベント] ${activeEvent.title}`);
                 playSound('event');
            }

            if (!billToVoteOn && !activeEvent && prev.playerStatus === 'ruling' && Math.random() < 0.3) {
                const oppositionParties = updatedParties.filter(p => !p.isPlayer);
                if (oppositionParties.length > 0) {
                    const proposingParty = oppositionParties[Math.floor(Math.random() * oppositionParties.length)];
                    const randomBill = oppositionBills[Math.floor(Math.random() * oppositionBills.length)];

                    playSound('event');
                    billToVoteOn = {
                        proposerPartyName: proposingParty.partyName,
                        lawName: randomBill.lawName,
                        lawDescription: randomBill.lawDescription,
                        lawEffect: randomBill.lawEffect,
                    };
                    newLogs.push(`[緊急動議] ${proposingParty.partyName}が「${randomBill.lawName}」を提出しました。`);
                }
            }
        }
        
        const newState = {
            ...prev,
            turn: prev.turn + 1,
            country: newCountry,
            playerStats: newPlayerStats,
            parties: updatedParties,
            logs: [...prev.logs, ...newLogs],
            activeEvent: activeEvent,
            billToVoteOn: billToVoteOn,
            militaryFrustration: newMilitaryFrustration,
            diplomaticPacts: newPacts,
            oppositionCoalitions: newOppositionCoalitions,
        };
        return checkForRebellion(newState);
    });
    setCanProposeLaw(true);
  }, [setGameState]);

  const handleStartVoteProcessing = useCallback(async (
      lawName: string, 
      lawDescription: string, 
      lawEffect: LawEffect, 
      proposerPartyName: string,
      playerVote?: 'approve' | 'oppose'
  ) => {
    setIsVotingInProgress(true);
    await delay(1000);

    try {
        let approveVotes = 0;
        let opposeVotes = 0;
        const partyVotes: PartyVote[] = [];
        const playerPartyName = gameState.parties.find(p => p.isPlayer)?.partyName;
        const playerParty = gameState.parties.find(p => p.isPlayer);

        for (const party of gameState.parties) {
            let vote: 'approve' | 'oppose';
            const pact = gameState.diplomaticPacts.find(p => p.partyName === party.partyName);
            const isInPlayerCoalition = gameState.playerCoalition.includes(party.partyName);
            const oppositionCoalition = gameState.oppositionCoalitions.find(c => c.members.includes(party.partyName));

            if (party.isPlayer) {
                if (gameState.playerStatus === 'opposition') {
                    vote = 'oppose';
                } else {
                     vote = playerVote || 'approve';
                }
            } else if (pact && proposerPartyName === playerPartyName) {
                vote = Math.random() < 0.85 ? 'approve' : 'oppose';
            } else if (isInPlayerCoalition && proposerPartyName === playerPartyName) {
                 vote = Math.random() < 0.95 ? 'approve' : 'oppose'; // Coalition partners are very likely to approve
            } else if (oppositionCoalition) {
                // Vote with their coalition
                const firstMemberVote = partyVotes.find(v => v.partyName === oppositionCoalition.members[0])?.vote;
                if (firstMemberVote && Math.random() < 0.8) {
                    vote = firstMemberVote;
                } else {
                    vote = decideVoteByIdeology(party.ideology, lawEffect, lawDescription);
                }
            } else {
                vote = decideVoteByIdeology(party.ideology, lawEffect, lawDescription);
            }
            
            partyVotes.push({ partyName: party.partyName, vote, seats: party.seats });

            if (vote === 'approve') {
                approveVotes += party.seats;
            } else {
                opposeVotes += party.seats;
            }
        }

        const totalSeats = gameState.parties.reduce((sum, p) => sum + p.seats, 0);
        const majority = totalSeats / 2;
        const isPassed = approveVotes > majority;
        playSound(isPassed ? 'success' : 'failure');

        const voteResult: VoteResult = {
            isPassed,
            lawName,
            approveVotes,
            opposeVotes,
            partyVotes,
            lawEffect,
            proposerPartyName,
        };

        setGameState(prev => {
            if (!prev) return null;
            
            let newParties = [...prev.parties];
            // Update relations based on vote
            if (proposerPartyName === playerParty?.partyName) {
                newParties = newParties.map(p => {
                    if (p.isPlayer) return p;
                    const theirVote = partyVotes.find(v => v.partyName === p.partyName)?.vote;
                    if (theirVote === 'approve') {
                        return { ...p, relation: Math.min(100, p.relation + 3) };
                    } else if (theirVote === 'oppose') {
                        return { ...p, relation: Math.max(0, p.relation - 3) };
                    }
                    return p;
                });
            }


            return {
                ...prev,
                billToVoteOn: null,
                voteResult: voteResult,
                parties: newParties,
            };
        });
    } finally {
        setIsVotingInProgress(false);
    }
  }, [gameState, setGameState]);

  const handleConfirmVoteResult = useCallback(() => {
    setGameState(prev => {
        if (!prev || !prev.voteResult) return null;
        
        const currentState = prev;
        const { isPassed, lawName, lawEffect, proposerPartyName } = currentState.voteResult;

        const newLogs: string[] = [
            `[法案審議] ${lawName}`,
            ...currentState.voteResult.partyVotes.map(pv => `- ${pv.partyName} は${pv.vote === 'approve' ? '賛成' : '反対'}しました。`),
            isPassed
                ? `[可決] ${lawName}は賛成多数 (${currentState.voteResult.approveVotes}対${currentState.voteResult.opposeVotes}) で可決されました。`
                : `[否決] ${lawName}は反対多数 (${currentState.voteResult.opposeVotes}対${currentState.voteResult.approveVotes}) で否決されました。`
        ];

        let newCountry = { ...currentState.country };
        let newParties = [...currentState.parties];
        
        if (isPassed) {
            newCountry = {
                ...newCountry,
                treasury: newCountry.treasury + lawEffect.resourceChanges.treasury,
                manpower: newCountry.manpower + lawEffect.resourceChanges.manpower,
                researchPoints: newCountry.researchPoints + lawEffect.resourceChanges.researchPoints,
                militaryPower: newCountry.militaryPower + lawEffect.resourceChanges.militaryPower,
                stability: newCountry.stability + (lawEffect.resourceChanges.stability || 0),
                factions: newCountry.factions.map(f => ({
                    ...f,
                    happiness: Math.min(100, Math.max(0, f.happiness + (lawEffect.factionHappinessChanges[f.name] || 0)))
                }))
            };

            if (lawEffect.politicalSystemChange) {
                const baseCountryName = currentState.country.name.split(' ')[0];
                let countrySuffix = '';
                 switch (lawEffect.politicalSystemChange) {
                    case 'MONARCHY': countrySuffix = '君主国'; break;
                    case 'REPUBLIC': countrySuffix = '共和国'; break;
                    case 'SOCIALISM': countrySuffix = '社会主義共和国'; break;
                    case 'DICTATORSHIP': countrySuffix = '独裁政権'; break;
                    case 'DEMOCRACY': countrySuffix = '民主主義国'; break;
                    case 'THEOCRACY': countrySuffix = '神聖国'; break;
                    case 'FEDERATION': countrySuffix = '連邦'; break;
                    case 'EMPIRE': countrySuffix = '帝国'; break;
                    default: break;
                }
                if (countrySuffix) {
                    newCountry.name = `${baseCountryName} ${countrySuffix}`;
                    newLogs.push(`[政治体制] 国家は「${countrySuffix}」へ移行した。`);
                }
            }

            if (lawEffect.partyEffects) {
                let affectedParties = new Set<string>();
                lawEffect.partyEffects.forEach(effect => {
                    let targets: Party[] = [];
                    if (effect.targetPartyName === "ALL_OPPOSITION") {
                        targets = newParties.filter(p => !p.isPlayer);
                    } else if (effect.targetPartyName === "PLAYER") {
                        const player = newParties.find(p => p.isPlayer);
                        if (player) targets.push(player);
                    } else {
                        const targetParty = newParties.find(p => p.partyName === effect.targetPartyName);
                        if (targetParty) targets.push(targetParty);
                    }
                    
                    targets.forEach(t => affectedParties.add(t.partyName));

                    switch (effect.action) {
                        case 'dissolve':
                            newParties = newParties.filter(p => !affectedParties.has(p.partyName));
                            newLogs.push(`[政治] ${Array.from(affectedParties).join(', ')} が解散させられた！`);
                            break;
                        case 'confiscate_seats':
                        case 'grant_seats':
                            const value = effect.value || 0;
                            let totalSeatsChange = 0;
                            newParties = newParties.map(p => {
                                if (affectedParties.has(p.partyName)) {
                                    const change = effect.action === 'grant_seats' ? value : -value;
                                    const originalSeats = p.seats;
                                    p.seats = Math.max(0, p.seats + change);
                                    totalSeatsChange += p.seats - originalSeats;
                                }
                                return p;
                            });

                            // Redistribute seats to maintain total of 100
                            if (totalSeatsChange !== 0) {
                                const partiesToAdjust = newParties.filter(p => !affectedParties.has(p.partyName));
                                let seatsToDistribute = -totalSeatsChange;

                                // Proportional redistribution
                                const totalSeatsOfAdjustable = partiesToAdjust.reduce((sum, p) => sum + p.seats, 0);
                                if (totalSeatsOfAdjustable > 0) {
                                    partiesToAdjust.forEach(p => {
                                        const share = p.seats / totalSeatsOfAdjustable;
                                        const adjustment = Math.round(share * seatsToDistribute);
                                        p.seats += adjustment;
                                        seatsToDistribute -= adjustment;
                                    });
                                }
                                // Distribute any remainder
                                if (seatsToDistribute !== 0 && partiesToAdjust.length > 0) {
                                     partiesToAdjust[0].seats += seatsToDistribute;
                                }
                            }
                            
                            newLogs.push(`[議会] ${Array.from(affectedParties).join(', ')} の議席が変動した。`);
                            break;
                    }
                });

                // Ensure total seats is 100 after all effects
                let finalTotalSeats = newParties.reduce((sum, p) => sum + p.seats, 0);
                if (finalTotalSeats !== 100 && newParties.length > 0) {
                    const diff = 100 - finalTotalSeats;
                    const partyToAdjust = newParties.find(p => p.isPlayer) || newParties[0];
                    partyToAdjust.seats = Math.max(0, partyToAdjust.seats + diff);
                }
            }
        }

        const playerParty = newParties.find(p => p.isPlayer);
        if (proposerPartyName === playerParty?.partyName && isPassed) {
            const supportGain = 2 + Math.floor(Math.random() * 4);
            if(playerParty) playerParty.support = Math.min(100, playerParty.support + supportGain);
            newLogs.push(`[与党] 法案「${lawName}」の可決により、${playerParty?.partyName}の支持率が${supportGain}%上昇しました。`);
        }
        
        const newNewsArticles = [
            generateNewsArticle(lawName, isPassed),
            ...currentState.newsArticles.slice(0, 5)
        ];

        const newState: GameState = {
            ...currentState,
            country: newCountry,
            parties: newParties,
            logs: [...currentState.logs, ...newLogs],
            newsArticles: newNewsArticles,
            voteResult: null,
        };

        if (isPassed && lawEffect.politicalSystemChange === 'DEMOCRACY') {
            const baseCountryName = currentState.country.name.split(' ')[0];
            newLogs.push(`[民主化] 「${lawName}」の可決により、多党制民主主義へ移行します！`);
            const newPartiesCount = 3 + Math.floor(Math.random() * 3);
            const shuffledPresets = shuffleArray(oppositionPartyPresets);
            const newOppositionParties = shuffledPresets.slice(0, newPartiesCount).map(p => ({ ...p, seats: 0, support: 15 + Math.random() * 10, relation: 50 }));

            const playerParty = newState.parties.find(p => p.isPlayer);
            if(playerParty) playerParty.support = 40;

            const allNewParties = playerParty ? [playerParty, ...newOppositionParties] : [...newOppositionParties];
            
            newLogs.push(`${newOppositionParties.map(p => p.partyName).join(', ')}が新たに結党されました。`);
            newLogs.push('新たな政治体制を確立するため、即時総選挙が開始されます！');

            return {
                ...newState,
                country: { ...newState.country, name: `${baseCountryName} 民主主義国` },
                parties: allNewParties,
                status: GameStatus.Election,
                electionState: { campaignTurn: 1 },
            };
        } else {
            return checkForRebellion(newState);
        }
    });
  }, [setGameState, oppositionPartyPresets]);
  
  const handleEventChoice = useCallback((choice: GameEventChoice) => {
    playSound('click');
    setGameState(prev => {
      if (!prev || !prev.activeEvent) return prev;

      let newCountry = { ...prev.country };
      let newPlayerStats = { ...prev.playerStats };
      let newParties = [...prev.parties];
      let newLogs = [...prev.logs, `[イベント: ${prev.activeEvent.title}] 「${choice.text}」を選択した。`];

      // Apply effects
      for (const key in choice.effects.resourceChanges) {
          const resKey = key as keyof typeof choice.effects.resourceChanges;
          (newCountry[resKey] as number) += choice.effects.resourceChanges[resKey]!;
      }
      if (choice.effects.factionHappinessChanges) {
          newCountry.factions = newCountry.factions.map(f => ({
              ...f,
              happiness: Math.min(100, Math.max(0, f.happiness + (choice.effects.factionHappinessChanges![f.name] || 0)))
          }));
      }
      for (const key in choice.effects.playerStatChanges) {
          const statKey = key as keyof typeof choice.effects.playerStatChanges;
          (newPlayerStats[statKey] as number) += choice.effects.playerStatChanges[statKey]!;
      }
      newParties = newParties.map(p => {
        if (p.isPlayer) {
          return { ...p, support: Math.min(100, Math.max(0, p.support + choice.effects.playerSupportChange)) };
        }
        return p;
      });

      // Special event logic for Coup d'état
      if (prev.activeEvent.id === 'coup_attempt') {
        const baseCountryName = prev.country.name.split(' ')[0];
        if (choice.text.includes('軍事政権')) {
            newCountry.name = `${baseCountryName} 軍事政権`;
            newLogs.push('[政治体制] 軍事政権が樹立された。平和主義政党は強制的に解散させられた。');
            newParties = newParties.filter(p => p.ideology !== '平和主義');
        } else if (choice.text.includes('抵抗')) {
            newLogs.push('[内戦勃発] クーデターへの抵抗を決意。国家は内戦状態に突入した！');
            const rebelStrength = Math.round(newCountry.militaryPower * (0.8 + Math.random() * 0.4));
            return {
                ...prev,
                status: GameStatus.CivilWar,
                civilWarState: {
                    rebelStrength: rebelStrength,
                    warProgress: 0,
                    rebelSupplyDebuffTurns: 0,
                },
                country: newCountry,
                playerStats: newPlayerStats,
                parties: newParties,
                logs: newLogs,
                activeEvent: null,
            }
        }
      }
      // Special event logic for War
      if (prev.activeEvent.id === 'border_war' && choice.text.includes('戦う')) {
          newLogs.push('[戦争勃発] 隣国との全面戦争に突入した！');
          const enemyStrength = Math.round(newCountry.militaryPower * (0.9 + Math.random() * 0.4));
           return {
                ...prev,
                status: GameStatus.War,
                warState: {
                    enemyStrength: enemyStrength,
                    warProgress: 0,
                    enemySupplyDebuffTurns: 0,
                },
                country: newCountry,
                playerStats: newPlayerStats,
                parties: newParties,
                logs: newLogs,
                activeEvent: null,
            }
      }

      const newState = {
        ...prev,
        country: newCountry,
        playerStats: newPlayerStats,
        parties: newParties,
        logs: newLogs,
        activeEvent: null,
      };

      return checkForRebellion(newState);
    });
  }, [setGameState]);

  const handleBudgetChange = (item: keyof Budget, value: BudgetItem) => {
    playSound('click');
    setTempBudget(prev => ({ ...prev, [item]: value }));
  };

  const handleExecuteBudget = () => {
    if (gameState.playerStats.politicalPower < BUDGET_EXECUTION_COST) {
        alert('政治力が足りません！');
        return;
    }
    playSound('action');
    setGameState(prev => {
        if (!prev) return null;
        return {
            ...prev,
            budget: tempBudget,
            playerStats: {
                ...prev.playerStats,
                politicalPower: prev.playerStats.politicalPower - BUDGET_EXECUTION_COST
            },
            logs: [...prev.logs, '[予算] 新しい予算案が承認されました。']
        };
    });
  };
  
  const handleDiplomacy = (party: Party) => {
     if (gameState.playerStats.politicalPower < DIPLOMACY_COST) {
        alert('政治力が足りません！');
        return;
    }
    playSound('action');
    setGameState(prev => {
        if (!prev) return null;
        
        const success = Math.random() < 0.6; // 60% success
        let newLogs = [...prev.logs];
        let newParties = [...prev.parties];
        
        if (success) {
            newParties = newParties.map(p => {
                if (p.isPlayer) {
                    return {...p, support: Math.min(100, p.support + 1.0) };
                }
                if (p.partyName === party.partyName) {
                    return {...p, support: Math.min(100, p.support + 1.5), relation: Math.min(100, p.relation + 5) };
                }
                return p;
            });
            newLogs.push(`[外交] ${party.partyName}と共同声明を発表。互いの支持率と友好度が上昇した。`);
            playSound('success');
        } else {
             newParties = newParties.map(p => {
                if (p.partyName === party.partyName) {
                    return {...p, relation: Math.max(0, p.relation - 3) };
                }
                return p;
            });
            newLogs.push(`[外交] ${party.partyName}との協議は物別れに終わった。`);
            playSound('failure');
        }

        return {
            ...prev,
            parties: newParties,
            logs: newLogs,
            playerStats: {
                ...prev.playerStats,
                politicalPower: prev.playerStats.politicalPower - DIPLOMACY_COST
            }
        }
    });
    setDiplomacyTarget(null);
  }

  const handleCoalitionRequest = (party: Party) => {
    if (gameState.playerStats.politicalPower < COALITION_REQUEST_COST) {
        alert('政治力が足りません！');
        return;
    }
    if(gameState.playerCoalition.includes(party.partyName)) {
        alert(`${party.partyName}は既に連立政権に参加しています。`);
        return;
    }

    playSound('action');
    setGameState(prev => {
        if (!prev) return null;
        
        const playerParty = prev.parties.find(p => p.isPlayer);
        if (!playerParty) return prev;

        const playerGroup = ideologyToGroup[playerParty.ideology] || 'other';
        const targetGroup = ideologyToGroup[party.ideology] || 'other';

        let successChance = 0.3 + (party.relation / 100) * 0.5; // Base 30%, relation adds up to 50%

        if (playerGroup === targetGroup) {
            successChance += 0.2; // +20% for same group
        } else if (
            (playerGroup === 'conservative' && targetGroup === 'liberal_left') || (playerGroup === 'liberal_left' && targetGroup === 'conservative')
        ) {
            successChance -= 0.3; // -30% for opposing groups
        }

        const success = Math.random() < successChance;
        let newLogs = [...prev.logs];
        let newParties = [...prev.parties];
        let newPlayerCoalition = [...prev.playerCoalition];
        
        if (success) {
            newLogs.push(`[政権] ${party.partyName}が連立政権への参加に合意した！`);
            newPlayerCoalition.push(party.partyName);
            newParties = newParties.map(p => p.partyName === party.partyName ? {...p, relation: Math.min(100, p.relation + 20)} : p);
            playSound('success');
        } else {
            newLogs.push(`[政権] ${party.partyName}との連立交渉は決裂した。`);
            newParties = newParties.map(p => p.partyName === party.partyName ? {...p, relation: Math.max(0, p.relation - 10)} : p);
            playSound('failure');
        }

        return {
            ...prev,
            logs: newLogs,
            parties: newParties,
            playerCoalition: newPlayerCoalition,
            playerStats: {
                ...prev.playerStats,
                politicalPower: prev.playerStats.politicalPower - COALITION_REQUEST_COST
            }
        }
    });
  };
  
  const handleDonationRequest = () => {
    if (gameState.playerStats.politicalPower < DONATION_REQUEST_COST) {
        alert('政治力が足りません！');
        return;
    }
    playSound('action');
    setIsDonationMinigameOpen(true);
  };
  
  const handleDonationResult = (amount: number) => {
    setIsDonationMinigameOpen(false);
    setGameState(prev => {
        if (!prev) return null;

        const politicalPower = prev.playerStats.politicalPower - DONATION_REQUEST_COST;

        if (amount === 0) {
            playSound('failure');
            return {
                ...prev,
                playerStats: { ...prev.playerStats, politicalPower },
                logs: [...prev.logs, '[資金] 企業との献金交渉は決裂した...']
            };
        }
        
        const scandalChance = 0.05 + (amount / 40000); // 献金額が多いほどリスク増
        if (Math.random() < scandalChance) {
            playSound('failure');
            return {
                ...prev,
                activeEvent: scandalEvent,
                logs: [...prev.logs, '[スキャンダル] 企業献金の交渉が裏目に出た...'],
                playerStats: { ...prev.playerStats, politicalPower }
            }
        }

        const corruptionIncrease = 1 + Math.floor(amount / 1000);
        playSound('success');

        return {
            ...prev,
            playerStats: {
                ...prev.playerStats,
                politicalPower,
                partyFunds: prev.playerStats.partyFunds + amount,
            },
            country: {
                ...prev.country,
                corruption: prev.country.corruption + corruptionIncrease,
                factions: prev.country.factions.map(f => ({...f, happiness: Math.max(0, f.happiness - 1)}))
            },
            logs: [...prev.logs, `[資金] 企業から ${amount.toLocaleString()} の献金を受けた。 (腐敗度 +${corruptionIncrease})`]
        }
    });
  };


  const handleFundConversion = () => {
    if (gameState.playerStats.partyFunds < FUND_CONVERSION_COST) {
        alert('政党資金が足りません！');
        return;
    }
    playSound('action');
     setGameState(prev => {
        if (!prev) return null;
        return {
            ...prev,
            playerStats: {
                ...prev.playerStats,
                partyFunds: prev.playerStats.partyFunds - FUND_CONVERSION_COST,
                politicalPower: prev.playerStats.politicalPower + FUND_CONVERSION_GAIN
            },
            logs: [...prev.logs, `[資金] ${FUND_CONVERSION_COST.toLocaleString()} の政党資金を ${FUND_CONVERSION_GAIN} の政治力に変換した。`]
        }
    });
  };

  const handleInternalAffairsAction = (action: string) => {
    playSound('action');
    setGameState(prev => {
        if (!prev) return null;
        
        let newCountry = { ...prev.country };
        let newPlayerStats = { ...prev.playerStats };
        let newLogs = [...prev.logs];
        let newParties = [...prev.parties];
        
        switch(action) {
            case 'anti_corruption':
                if (newPlayerStats.politicalPower < ANTI_CORRUPTION_COST_POWER || newCountry.treasury < ANTI_CORRUPTION_COST_TREASURY) {
                    alert('資源が不足しています'); return prev;
                }
                newPlayerStats.politicalPower -= ANTI_CORRUPTION_COST_POWER;
                newCountry.treasury -= ANTI_CORRUPTION_COST_TREASURY;
                const reduction = 2 + Math.floor(Math.random() * 4);
                newCountry.corruption = Math.max(0, newCountry.corruption - reduction);
                newLogs.push(`[内政] 反汚職キャンペーンを実施。腐敗度が ${reduction} 減少した。`);
                break;
            case 'promote_research':
                if (newPlayerStats.politicalPower < PROMOTE_RESEARCH_COST_POWER || newCountry.treasury < PROMOTE_RESEARCH_COST_TREASURY) {
                    alert('資源が不足しています'); return prev;
                }
                newPlayerStats.politicalPower -= PROMOTE_RESEARCH_COST_POWER;
                newCountry.treasury -= PROMOTE_RESEARCH_COST_TREASURY;
                const points = 50 + Math.floor(Math.random() * 51);
                newCountry.researchPoints += points;
                newLogs.push(`[内政] 研究を奨励し、研究ポイントを ${points} 獲得した。`);
                break;
            case 'propaganda':
                 if (newPlayerStats.politicalPower < PROPAGANDA_COST_POWER || newCountry.treasury < PROPAGANDA_COST_TREASURY) {
                    alert('資源が不足しています'); return prev;
                }
                newPlayerStats.politicalPower -= PROPAGANDA_COST_POWER;
                newCountry.treasury -= PROPAGANDA_COST_TREASURY;
                const happinessGain = 1 + Math.floor(Math.random() * 3);
                const supportGain = 0.5 + Math.random();
                newCountry.factions = newCountry.factions.map(f => ({ ...f, happiness: Math.min(100, f.happiness + happinessGain) }));
                newParties = newParties.map(p => p.isPlayer ? { ...p, support: Math.min(100, p.support + supportGain) } : p);
                newLogs.push(`[内政] プロパガンダ活動を実施。国民の幸福度と与党支持率が上昇した。`);
                break;
            case 'infra_investment':
                if (newPlayerStats.politicalPower < INFRA_INVESTMENT_COST_POWER || newCountry.treasury < INFRA_INVESTMENT_COST_TREASURY) {
                    alert('資源が不足しています'); return prev;
                }
                newPlayerStats.politicalPower -= INFRA_INVESTMENT_COST_POWER;
                newCountry.treasury -= INFRA_INVESTMENT_COST_TREASURY;
                const infraHappiness = 2 + Math.floor(Math.random() * 3);
                const infraManpower = 100 + Math.floor(Math.random() * 101);
                newCountry.factions = newCountry.factions.map(f => ({ ...f, happiness: Math.min(100, f.happiness + infraHappiness) }));
                newCountry.manpower += infraManpower;
                newLogs.push(`[内政] インフラに投資し、国民の幸福度と人的資源が向上した。`);
                break;
            case 'healthcare_reform':
                if (newPlayerStats.politicalPower < HEALTHCARE_REFORM_COST_POWER || newCountry.treasury < HEALTHCARE_REFORM_COST_TREASURY) {
                    alert('資源が不足しています'); return prev;
                }
                newPlayerStats.politicalPower -= HEALTHCARE_REFORM_COST_POWER;
                newCountry.treasury -= HEALTHCARE_REFORM_COST_TREASURY;
                const healthHappiness = 3 + Math.floor(Math.random() * 3);
                const healthManpower = 150 + Math.floor(Math.random() * 101);
                newCountry.factions = newCountry.factions.map(f => ({ ...f, happiness: Math.min(100, f.happiness + healthHappiness) }));
                newCountry.manpower += healthManpower;
                newLogs.push(`[内政] 医療制度改革に着手。国民の幸福度と人的資源が向上した。`);
                break;
             case 'disaster_drill':
                if (newPlayerStats.politicalPower < DISASTER_DRILL_COST_POWER || newCountry.treasury < DISASTER_DRILL_COST_TREASURY) {
                    alert('資源が不足しています'); return prev;
                }
                newPlayerStats.politicalPower -= DISASTER_DRILL_COST_POWER;
                newCountry.treasury -= DISASTER_DRILL_COST_TREASURY;
                const drillHappiness = 2 + Math.floor(Math.random() * 2);
                newCountry.factions = newCountry.factions.map(f => ({ ...f, happiness: Math.min(100, f.happiness + drillHappiness) }));
                newLogs.push(`[内政] 全国的な防災訓練を実施。国民の安心感が高まった。`);
                break;
            case 'cultural_festival':
                if (newPlayerStats.politicalPower < CULTURAL_FESTIVAL_COST_POWER || newCountry.treasury < CULTURAL_FESTIVAL_COST_TREASURY) {
                    alert('資源が不足しています'); return prev;
                }
                newPlayerStats.politicalPower -= CULTURAL_FESTIVAL_COST_POWER;
                newCountry.treasury -= CULTURAL_FESTIVAL_COST_TREASURY;
                const festHappiness = 2 + Math.floor(Math.random() * 3);
                const festSupport = 1 + Math.random();
                newCountry.factions = newCountry.factions.map(f => ({ ...f, happiness: Math.min(100, f.happiness + festHappiness) }));
                newParties = newParties.map(p => p.isPlayer ? { ...p, support: Math.min(100, p.support + festSupport) } : p);
                newLogs.push(`[内政] 文化祭典を成功させ、国民の幸福度と与党支持率が上昇した。`);
                break;
        }

        return { ...prev, country: newCountry, playerStats: newPlayerStats, logs: newLogs, parties: newParties };
    });
  };
  
  const handleOpenHireMinisterModal = () => {
    if (gameState.playerStats.politicalPower < HIRE_MINISTER_COST) {
        alert(`政治力が足りません！ (必要: ${HIRE_MINISTER_COST})`);
        return;
    }
    playSound('action');
    setGameState(prev => prev ? { ...prev, playerStats: { ...prev.playerStats, politicalPower: prev.playerStats.politicalPower - HIRE_MINISTER_COST } } : null);
    const candidates = generateMinisterCandidates(3, gameState.ministers);
    setMinisterCandidates(candidates);
    setIsGachaAnimationOpen(true);
  };
  
  const handleHireMinister = (newMinister: Minister) => {
    setGameState(prev => {
        if (!prev) return null;

        const newMinisters = [...prev.ministers.filter(m => m.position !== newMinister.position), newMinister];
        const ministerGroup = ideologyToGroup[newMinister.ideology] || 'other';
        let relationChanged = false;

        const newParties = prev.parties.map(party => {
            if (party.isPlayer) return party;

            const partyGroup = ideologyToGroup[party.ideology] || 'other';
            let relationChange = 0;

            if (
                (ministerGroup === 'conservative' && partyGroup === 'liberal_left') || (ministerGroup === 'liberal_left' && partyGroup === 'conservative') ||
                (ministerGroup === 'economic_right' && partyGroup === 'liberal_left') || (ministerGroup === 'liberal_left' && partyGroup === 'economic_right')
            ) {
                relationChange = -10;
            } else if (ministerGroup !== partyGroup && ministerGroup !== 'centrist' && partyGroup !== 'centrist') {
                relationChange = -5;
            }

            if (relationChange !== 0) {
                relationChanged = true;
                return { ...party, relation: Math.max(0, party.relation + relationChange) };
            }
            return party;
        });
        
        const newLogs = [...prev.logs, `[内閣] ${newMinister.lastName} ${newMinister.firstName}が${newMinister.position}に就任しました。`];
        if (relationChanged) {
            newLogs.push(`[内閣] 新大臣の思想により、一部の野党との関係が悪化しました。`);
        }
        
        playSound('success');
        setIsHireMinisterModalOpen(false);
        setMinisterCandidates([]);

        return { ...prev, ministers: newMinisters, parties: newParties, logs: newLogs };
    });
  };

  const handleDismissMinister = (ministerId: string) => {
    if (gameState.playerStats.politicalPower < DISMISS_MINISTER_COST) {
        alert(`政治力が足りません！ (必要: ${DISMISS_MINISTER_COST})`);
        return;
    }
    playSound('action');
    setGameState(prev => {
        if (!prev) return null;
        const ministerToDismiss = prev.ministers.find(m => m.id === ministerId);
        if (!ministerToDismiss) return prev;
        
        const newMinisters = prev.ministers.filter(m => m.id !== ministerId);
        const ministerGroup = ideologyToGroup[ministerToDismiss.ideology];

        const newParties = prev.parties.map(p => {
            if (p.isPlayer) {
                return { ...p, support: Math.max(0, p.support - 1) };
            }
            const partyGroup = ideologyToGroup[p.ideology];
            if (ministerGroup && partyGroup === ministerGroup) {
                return { ...p, relation: Math.max(0, p.relation - 5) };
            }
            return p;
        });

        return {
            ...prev,
            ministers: newMinisters,
            parties: newParties,
            playerStats: {
                ...prev.playerStats,
                politicalPower: prev.playerStats.politicalPower - DISMISS_MINISTER_COST
            },
            country: {
                ...prev.country,
                stability: Math.max(0, prev.country.stability - 2)
            },
            logs: [...prev.logs, `[内閣] ${ministerToDismiss.lastName} ${ministerToDismiss.position}を解任した。(政治力 -${DISMISS_MINISTER_COST}, 安定度 -2)`]
        }
    });
  };

  const handleCriticizeGovernment = () => {
    if (gameState.playerStats.politicalPower < CRITICIZE_GOVERNMENT_COST) {
        alert('政治力が足りません！'); return;
    }
    playSound('action');
    setGameState(prev => {
        if (!prev) return null;
        let newParties = [...prev.parties];
        const rulingParty = newParties.find(p => p.seats === Math.max(...newParties.map(p => p.seats))) || newParties[0];
        const supportChange = 0.5 + Math.random();

        newParties = newParties.map(p => {
            if(p.partyName === rulingParty.partyName) {
                return { ...p, support: Math.max(0, p.support - supportChange) };
            }
            if(p.isPlayer) {
                return { ...p, support: Math.min(100, p.support + supportChange * 0.5), relation: Math.max(0, p.relation - 5) };
            }
            return p;
        });

        return {
            ...prev,
            parties: newParties,
            playerStats: { ...prev.playerStats, politicalPower: prev.playerStats.politicalPower - CRITICIZE_GOVERNMENT_COST },
            logs: [...prev.logs, `[野党活動] 政府を批判し、与党の支持率を${supportChange.toFixed(1)}%低下させた。`]
        }
    })
  }

  const handleProposeCounterPlan = () => {
    if (gameState.playerStats.politicalPower < COUNTER_PLAN_COST) {
        alert('政治力が足りません！'); return;
    }
    playSound('action');
    setGameState(prev => {
        if (!prev) return null;
        let newParties = [...prev.parties];
        const supportGain = 1.0 + Math.random();

        newParties = newParties.map(p => {
            if(p.isPlayer) {
                return { ...p, support: Math.min(100, p.support + supportGain) };
            }
            return p;
        });

        return {
            ...prev,
            parties: newParties,
            playerStats: { ...prev.playerStats, politicalPower: prev.playerStats.politicalPower - COUNTER_PLAN_COST },
            logs: [...prev.logs, `[野党活動] 建設的な対案を提出し、自党の支持率が${supportGain.toFixed(1)}%上昇した。`]
        }
    });
  }
  
  const handleStartSpeechMinigame = () => {
    if (gameState.playerStats.politicalPower < RALLY_SUPPORTERS_COST) {
        alert('政治力が足りません！'); return;
    }
    playSound('action');
    setIsSpeechMinigameOpen(true);
  }

  const handleSpeechMinigameResult = (score: number) => {
    setIsSpeechMinigameOpen(false);
    setGameState(prev => {
        if (!prev) return null;
        
        const supportGain = score * 0.2; // Example: score of 10 = +2.0% support
        
        const newParties = prev.parties.map(p => {
            if (p.isPlayer) {
                return { ...p, support: Math.min(100, p.support + supportGain) };
            }
            return p;
        });
        
        return {
            ...prev,
            parties: newParties,
            playerStats: {
                ...prev.playerStats,
                politicalPower: prev.playerStats.politicalPower - RALLY_SUPPORTERS_COST
            },
            logs: [...prev.logs, `[野党活動] 支持者集会を成功させ、支持率が${supportGain.toFixed(1)}%上昇した！`]
        };
    });
  };

  const playerParty = useMemo(() => gameState.parties.find(p => p.isPlayer), [gameState.parties]);
  const totalSeats = useMemo(() => gameState.parties.reduce((sum, p) => sum + p.seats, 0), [gameState.parties]);
  const oppositionParties = useMemo(() => gameState.parties.filter(p => !p.isPlayer), [gameState.parties]);
  
  const currentBudgetEffects = useMemo(() => {
    const total = { treasury: 0, researchPointsModifier: 0, manpowerModifier: 0, militaryPowerModifier: 0, militaryFrustration: 0 };
    const happinessChanges: { [key: string]: number } = {};
    (Object.keys(tempBudget) as Array<keyof Budget>).forEach(key => {
        const effect = budgetEffects[key][tempBudget[key]];
        total.treasury += effect.treasury;
        total.researchPointsModifier += effect.researchPointsModifier || 0;
        total.manpowerModifier += effect.manpowerModifier || 0;
        total.militaryPowerModifier += effect.militaryPowerModifier || 0;
        total.militaryFrustration += effect.militaryFrustration || 0;
        for (const factionName in effect.factionHappinessChanges) {
            happinessChanges[factionName] = (happinessChanges[factionName] || 0) + effect.factionHappinessChanges[factionName];
        }
    });
    return { ...total, happinessChanges };
  }, [tempBudget]);
  
  const getRelationLabel = (relation: number): { label: string; color: string } => {
    if (relation >= 80) return { label: '蜜月', color: 'text-green-300' };
    if (relation >= 60) return { label: '友好', color: 'text-green-400' };
    if (relation >= 40) return { label: '中立', color: 'text-slate-400' };
    if (relation >= 20) return { label: '不仲', color: 'text-yellow-500' };
    return { label: '敵対', color: 'text-red-500' };
  };

  const coalitionSeats = useMemo(() => {
    const playerSeats = playerParty?.seats || 0;
    const coalitionPartnerSeats = gameState.playerCoalition.reduce((sum, partyName) => {
        const party = gameState.parties.find(p => p.partyName === partyName);
        return sum + (party?.seats || 0);
    }, 0);
    return playerSeats + coalitionPartnerSeats;
  }, [gameState.playerCoalition, gameState.parties, playerParty]);


  if (gameState.status === GameStatus.CivilWar) {
    return (
        <div className="flex flex-col min-h-screen bg-red-900/50 font-sans">
            <Header playerStats={gameState.playerStats} playerParty={playerParty} totalSeats={totalSeats} country={gameState.country} turn={gameState.turn} />
            <main className="container mx-auto p-4 flex-grow flex items-center justify-center">
                 <div className="bg-slate-800 p-6 md:p-8 rounded-lg shadow-2xl w-full max-w-4xl border-2 border-red-500 animate-fade-in">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-red-400 animate-pulse">内戦状態</h1>
                    <p className="text-center text-slate-300 mb-6">国家の存亡をかけ、反乱軍を鎮圧せよ！</p>
                    <div className="my-4">
                        <h3 className="text-lg font-semibold text-center">戦況</h3>
                        <div className="w-full bg-red-500 rounded-full h-8 overflow-hidden border-2 border-slate-600 mt-2">
                             <div className="bg-blue-500 h-full flex items-center justify-center text-white font-bold"
                                style={{ width: `${50 + gameState.civilWarState!.warProgress / 2}%`, transition: 'width 0.5s ease-in-out' }}>
                                {`${(50 + gameState.civilWarState!.warProgress / 2).toFixed(0)}%`}
                            </div>
                        </div>
                         <div className="flex justify-between text-sm mt-1">
                            <span className="text-blue-300">政府軍</span>
                            <span className="text-red-300">反乱軍</span>
                        </div>
                    </div>
                    <div className="flex justify-between my-6 text-center">
                        <div>
                            <p className="text-slate-400">政府軍兵力</p>
                            <p className="text-2xl font-bold">{gameState.country.militaryPower.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-slate-400">反乱軍兵力</p>
                            <p className="text-2xl font-bold">{gameState.civilWarState!.rebelStrength.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button onClick={() => handleCivilWarTurn('offensive')} className="bg-red-700 hover:bg-red-600 p-4 rounded-lg transition-colors">総攻撃 (政治力 -10)</button>
                        <button onClick={() => handleCivilWarTurn('defensive')} className="bg-blue-700 hover:bg-blue-600 p-4 rounded-lg transition-colors">防衛重視</button>
                        <button onClick={() => handleCivilWarTurn('guerrilla')} className="bg-yellow-700 hover:bg-yellow-600 p-4 rounded-lg transition-colors">ゲリラ戦 (国庫 -2000)</button>
                        <button onClick={() => handleCivilWarTurn('supply_raid')} className="bg-purple-700 hover:bg-purple-600 p-4 rounded-lg transition-colors">兵站攻撃 (政治力 -20)</button>
                    </div>
                </div>
            </main>
        </div>
    );
  }
  
  if (gameState.status === GameStatus.War) {
    return (
        <div className="flex flex-col min-h-screen bg-orange-900/50 font-sans">
            <Header playerStats={gameState.playerStats} playerParty={playerParty} totalSeats={totalSeats} country={gameState.country} turn={gameState.turn} />
            <main className="container mx-auto p-4 flex-grow flex items-center justify-center">
                 <div className="bg-slate-800 p-6 md:p-8 rounded-lg shadow-2xl w-full max-w-4xl border-2 border-orange-500 animate-fade-in">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-orange-400 animate-pulse">戦争状態</h1>
                    <p className="text-center text-slate-300 mb-6">国家の総力を結集し、勝利を掴め！</p>
                    <div className="my-4">
                        <h3 className="text-lg font-semibold text-center">戦況</h3>
                        <div className="w-full bg-red-500 rounded-full h-8 overflow-hidden border-2 border-slate-600 mt-2">
                             <div className="bg-blue-500 h-full flex items-center justify-center text-white font-bold"
                                style={{ width: `${50 + gameState.warState!.warProgress / 2}%`, transition: 'width 0.5s ease-in-out' }}>
                                {`${(50 + gameState.warState!.warProgress / 2).toFixed(0)}%`}
                            </div>
                        </div>
                         <div className="flex justify-between text-sm mt-1">
                            <span className="text-blue-300">自国軍</span>
                            <span className="text-red-300">敵国軍</span>
                        </div>
                    </div>
                    <div className="flex justify-between my-6 text-center">
                        <div>
                            <p className="text-slate-400">自国軍兵力</p>
                            <p className="text-2xl font-bold">{gameState.country.militaryPower.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-slate-400">敵国軍兵力</p>
                            <p className="text-2xl font-bold">{gameState.warState!.enemyStrength.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button onClick={() => handleWarTurn('offensive')} className="bg-red-700 hover:bg-red-600 p-4 rounded-lg transition-colors">総攻撃 (政治力 -10)</button>
                        <button onClick={() => handleWarTurn('defensive')} className="bg-blue-700 hover:bg-blue-600 p-4 rounded-lg transition-colors">防衛重視</button>
                        <button onClick={() => handleWarTurn('guerrilla')} className="bg-yellow-700 hover:bg-yellow-600 p-4 rounded-lg transition-colors">ゲリラ戦 (国庫 -2000)</button>
                        <button onClick={() => handleWarTurn('supply_raid')} className="bg-purple-700 hover:bg-purple-600 p-4 rounded-lg transition-colors">兵站攻撃 (政治力 -20)</button>
                    </div>
                </div>
            </main>
        </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-slate-900 font-sans">
      <Header playerStats={gameState.playerStats} playerParty={playerParty} totalSeats={totalSeats} country={gameState.country} turn={gameState.turn} />

      {isModalOpen && <ProposeLawModal onClose={() => setIsModalOpen(false)} onPropose={(lawName, lawDescription, effect) => {
        setIsModalOpen(false);
        setCanProposeLaw(false);
        setGameState(prev => {
            if (!prev) return null;
            return {
                ...prev,
                playerStats: {
                    ...prev.playerStats,
                    politicalPower: prev.playerStats.politicalPower - LAW_PROPOSAL_COST,
                },
                billToVoteOn: {
                    proposerPartyName: playerParty?.partyName || '与党',
                    lawName,
                    lawDescription,
                    lawEffect: effect,
                },
                logs: [...prev.logs, `[法案提出] 「${lawName}」を議会に提出しました。`],
            }
        });
      }} gameState={gameState} />}
      {gameState.billToVoteOn && (
        <VoteOnBillModal bill={gameState.billToVoteOn} onVote={(vote) => handleStartVoteProcessing(
            gameState.billToVoteOn!.lawName,
            gameState.billToVoteOn!.lawDescription,
            gameState.billToVoteOn!.lawEffect,
            gameState.billToVoteOn!.proposerPartyName,
            vote
        )} />
      )}
      {isVotingInProgress && <VotingProgressModal />}
      {gameState.voteResult && <VoteResultModal result={gameState.voteResult} onClose={handleConfirmVoteResult} />}
      {gameState.activeEvent && <EventModal event={gameState.activeEvent} onChoose={handleEventChoice} gameState={gameState} />}
      {isDonationMinigameOpen && <DonationMinigameModal onResult={handleDonationResult} onClose={() => setIsDonationMinigameOpen(false)} />}
      {isGachaAnimationOpen && <MinisterGachaAnimationModal candidates={ministerCandidates} onAnimationEnd={() => { setIsGachaAnimationOpen(false); setIsHireMinisterModalOpen(true); }} />}
      {isHireMinisterModalOpen && <HireMinisterModal candidates={ministerCandidates} onHire={handleHireMinister} onClose={() => setIsHireMinisterModalOpen(false)} />}
      {isSpeechMinigameOpen && <SpeechMinigameModal onResult={handleSpeechMinigameResult} onClose={() => setIsSpeechMinigameOpen(false)} />}


      <main className="container mx-auto p-4 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-700">
              <div className="flex justify-between items-center mb-2">
                 <h2 className="text-xl font-bold">議会</h2>
                 {gameState.playerStatus === 'ruling' && (
                    <div className="text-right">
                        <p className={`font-bold text-lg ${coalitionSeats > 50 ? 'text-green-400' : 'text-yellow-400'}`}>
                            連立与党: {coalitionSeats} / {totalSeats} 議席
                        </p>
                        <p className="text-xs text-slate-400">
                           {playerParty?.partyName}{gameState.playerCoalition.length > 0 ? `, ${gameState.playerCoalition.join(', ')}` : ''}
                        </p>
                    </div>
                 )}
              </div>
              <ParliamentChart 
                parties={gameState.parties} 
                playerPartyName={playerParty?.partyName || ''}
                playerCoalition={gameState.playerCoalition}
              />
            </div>

             <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700">
                <div className="flex border-b border-slate-600 overflow-x-auto whitespace-nowrap">
                    {gameState.playerStatus === 'ruling' ? (
                        <>
                            <button className={`py-3 px-4 text-sm md:text-base ${activeTab === 'law' ? 'border-b-2 border-blue-400 text-blue-300' : 'text-slate-400'}`} onClick={() => setActiveTab('law')}>法案提出</button>
                            <button className={`py-3 px-4 text-sm md:text-base ${activeTab === 'internal' ? 'border-b-2 border-blue-400 text-blue-300' : 'text-slate-400'}`} onClick={() => setActiveTab('internal')}>内政</button>
                            <button className={`py-3 px-4 text-sm md:text-base ${activeTab === 'cabinet' ? 'border-b-2 border-blue-400 text-blue-300' : 'text-slate-400'}`} onClick={() => setActiveTab('cabinet')}>内閣</button>
                            <button className={`py-3 px-4 text-sm md:text-base ${activeTab === 'budget' ? 'border-b-2 border-blue-400 text-blue-300' : 'text-slate-400'}`} onClick={() => setActiveTab('budget')}>予算編成</button>
                            <button className={`py-3 px-4 text-sm md:text-base ${activeTab === 'diplomacy' ? 'border-b-2 border-blue-400 text-blue-300' : 'text-slate-400'}`} onClick={() => setActiveTab('diplomacy')}>党間協議</button>
                             <button className={`py-3 px-4 text-sm md:text-base ${activeTab === 'funding' ? 'border-b-2 border-blue-400 text-blue-300' : 'text-slate-400'}`} onClick={() => setActiveTab('funding')}>資金活動</button>
                        </>
                    ) : (
                        <button className={`py-3 px-4 text-sm md:text-base ${activeTab === 'opposition_activity' ? 'border-b-2 border-blue-400 text-blue-300' : 'text-slate-400'}`} onClick={() => setActiveTab('opposition_activity')}>野党活動</button>
                    )}
                </div>
                <div className="p-4">
                    {activeTab === 'law' && (
                        <div>
                            <button onClick={() => { playSound('click'); setIsModalOpen(true); }} disabled={!canProposeLaw} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-slate-500 disabled:cursor-not-allowed">
                                新しい法案を提出する (政治力 -{LAW_PROPOSAL_COST})
                            </button>
                            <p className="text-sm text-slate-400 mt-2">法案を起草し、議会に提出します。可決されれば、あなたの政策が国を動かします。</p>
                        </div>
                    )}
                    {activeTab === 'internal' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button onClick={() => handleInternalAffairsAction('anti_corruption')} className="bg-slate-700 hover:bg-slate-600 p-3 rounded text-left transition-colors">
                                <p className="font-bold">反汚職キャンペーン</p>
                                <p className="text-xs text-slate-400">政: {ANTI_CORRUPTION_COST_POWER}, 国: {ANTI_CORRUPTION_COST_TREASURY.toLocaleString()}</p>
                            </button>
                             <button onClick={() => handleInternalAffairsAction('promote_research')} className="bg-slate-700 hover:bg-slate-600 p-3 rounded text-left transition-colors">
                                <p className="font-bold">研究奨励</p>
                                <p className="text-xs text-slate-400">政: {PROMOTE_RESEARCH_COST_POWER}, 国: {PROMOTE_RESEARCH_COST_TREASURY.toLocaleString()}</p>
                            </button>
                             <button onClick={() => handleInternalAffairsAction('propaganda')} className="bg-slate-700 hover:bg-slate-600 p-3 rounded text-left transition-colors">
                                <p className="font-bold">プロパガンダ活動</p>
                                <p className="text-xs text-slate-400">政: {PROPAGANDA_COST_POWER}, 国: {PROPAGANDA_COST_TREASURY.toLocaleString()}</p>
                            </button>
                             <button onClick={() => handleInternalAffairsAction('infra_investment')} className="bg-slate-700 hover:bg-slate-600 p-3 rounded text-left transition-colors">
                                <p className="font-bold">インフラ投資</p>
                                <p className="text-xs text-slate-400">政: {INFRA_INVESTMENT_COST_POWER}, 国: {INFRA_INVESTMENT_COST_TREASURY.toLocaleString()}</p>
                            </button>
                            <button onClick={() => handleInternalAffairsAction('healthcare_reform')} className="bg-slate-700 hover:bg-slate-600 p-3 rounded text-left transition-colors">
                                <p className="font-bold">医療制度改革</p>
                                <p className="text-xs text-slate-400">政: {HEALTHCARE_REFORM_COST_POWER}, 国: {HEALTHCARE_REFORM_COST_TREASURY.toLocaleString()}</p>
                            </button>
                            <button onClick={() => handleInternalAffairsAction('disaster_drill')} className="bg-slate-700 hover:bg-slate-600 p-3 rounded text-left transition-colors">
                                <p className="font-bold">防災訓練</p>
                                <p className="text-xs text-slate-400">政: {DISASTER_DRILL_COST_POWER}, 国: {DISASTER_DRILL_COST_TREASURY.toLocaleString()}</p>
                            </button>
                            <button onClick={() => handleInternalAffairsAction('cultural_festival')} className="bg-slate-700 hover:bg-slate-600 p-3 rounded text-left transition-colors">
                                <p className="font-bold">文化祭典の開催</p>
                                <p className="text-xs text-slate-400">政: {CULTURAL_FESTIVAL_COST_POWER}, 国: {CULTURAL_FESTIVAL_COST_TREASURY.toLocaleString()}</p>
                            </button>
                        </div>
                    )}
                     {activeTab === 'cabinet' && (
                        <div>
                            <div className="mb-4">
                                <button onClick={handleOpenHireMinisterModal} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors">
                                    人材を発掘する (政治力 -{HIRE_MINISTER_COST})
                                </button>
                                <p className="text-sm text-slate-400 mt-2">新たな大臣候補を探し、内閣を強化します。</p>
                            </div>
                            <h3 className="text-lg font-bold mb-2">現在の内閣</h3>
                            <div className="space-y-3">
                                {gameState.ministers.length > 0 ? gameState.ministers.map(m => (
                                    <div key={m.id} className="bg-slate-700/50 p-3 rounded-lg relative">
                                        <p className="font-bold">{m.position}: {m.lastName} {m.firstName}</p>
                                        <p className="text-xs text-slate-400">イデオロギー: {m.ideology}</p>
                                        <ul className="text-xs mt-1">
                                            {m.buffs.map((b, i) => <li key={i} className="text-green-400">+ {b}</li>)}
                                            {m.debuffs.map((d, i) => <li key={i} className="text-red-400">- {d}</li>)}
                                        </ul>
                                        <button 
                                            onClick={() => handleDismissMinister(m.id)}
                                            className="absolute top-2 right-2 text-xs bg-red-800 hover:bg-red-700 text-white px-2 py-1 rounded transition-colors"
                                            title={`解任する (政治力 -${DISMISS_MINISTER_COST})`}
                                        >
                                            解任
                                        </button>
                                    </div>
                                )) : <p className="text-slate-400">まだ大臣が任命されていません。</p>}
                            </div>
                        </div>
                    )}
                    {activeTab === 'budget' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                {(Object.keys(tempBudget) as Array<keyof Budget>).map(key => (
                                    <div key={key} className="mb-4">
                                        <h4 className="font-semibold capitalize text-slate-300">{budgetItemLabels[key as keyof Budget] || key}</h4>
                                        <div className="flex space-x-2 mt-2">
                                            {(['low', 'normal', 'high'] as BudgetItem[]).map(level => (
                                                <button key={level} onClick={() => handleBudgetChange(key, level)}
                                                    className={`px-4 py-1 rounded-full text-sm transition-colors ${tempBudget[key] === level ? 'bg-blue-600 text-white' : 'bg-slate-600 hover:bg-slate-500'}`}>
                                                    {level === 'low' ? '低' : level === 'normal' ? '中' : '高'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                <button onClick={handleExecuteBudget} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full mt-4 transition-colors">
                                    予算執行 (政治力 -{BUDGET_EXECUTION_COST})
                                </button>
                            </div>
                            <div className="bg-slate-900/50 p-4 rounded-lg">
                                <h4 className="font-bold mb-2">ターン毎の変化プレビュー</h4>
                                <ul className="text-sm space-y-1">
                                    {Object.entries(currentBudgetEffects).map(([key, value]) => {
                                        if (key === 'happinessChanges' || value === 0) return null;
                                        return typeof value === 'number' && (
// FIX: Added explicit string casting for the key to resolve potential React key errors.
                                            <li key={key as string} className="flex justify-between">
                                                <span>{resourceLabels[key] || key}</span>
                                                <span className={value > 0 ? 'text-green-400' : 'text-red-400'}>
                                                    {value > 0 ? '+' : ''}{value.toLocaleString()}
                                                </span>
                                            </li>
                                    )})}
                                </ul>
                                <h5 className="font-semibold mt-3 mb-1">派閥の幸福度変化</h5>
                                <ul className="text-sm space-y-1">
                                    {Object.entries(currentBudgetEffects.happinessChanges).map(([faction, change]) => change !== 0 && (
                                        <li key={faction} className="flex justify-between">
                                            <span>{faction}</span>
                                            <span className={change > 0 ? 'text-green-400' : 'text-red-400'}>
                                                {change > 0 ? '+' : ''}{change.toFixed(1)}%
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                    {activeTab === 'diplomacy' && (
                        <div>
                             <p className="text-sm text-slate-400 mb-4">野党との関係を構築し、議会運営を円滑にします。</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {oppositionParties.map(p => {
                                    const relationInfo = getRelationLabel(p.relation);
                                    return (
                                        <div key={p.partyName} className="bg-slate-700/50 p-3 rounded-lg flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-baseline">
                                                    <p className="font-bold">{p.partyName}</p>
                                                    <p className={`text-sm font-semibold ${relationInfo.color}`}>{relationInfo.label} ({p.relation})</p>
                                                </div>
                                                <p className="text-xs text-slate-400">{p.ideology}</p>
                                            </div>
                                            <div className="flex space-x-2 mt-3">
                                                <button onClick={() => handleDiplomacy(p)} className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded w-full transition-colors" title="共同声明 (友好度+)">共同声明 (-{DIPLOMACY_COST})</button>
                                                <button onClick={() => handleCoalitionRequest(p)} className="text-xs bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded w-full transition-colors" title="連立政権への参加を要請">連立交渉 (-{COALITION_REQUEST_COST})</button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                     {activeTab === 'funding' && (
                         <div className="space-y-4">
                             <div>
                                <h3 className="text-lg font-semibold">企業献金を要請</h3>
                                <button onClick={handleDonationRequest} className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mt-2 transition-colors">
                                    交渉する (政治力 -{DONATION_REQUEST_COST})
                                </button>
                                <p className="text-sm text-slate-400 mt-2">タイミングミニゲームに成功すると、企業から献金を受けられます。</p>
                             </div>
                             <div>
                                <h3 className="text-lg font-semibold">政治力に変換</h3>
                                <button onClick={handleFundConversion} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mt-2 transition-colors">
                                    変換する (政党資金 -{FUND_CONVERSION_COST})
                                </button>
                                <p className="text-sm text-slate-400 mt-2">政党資金を消費して、{FUND_CONVERSION_GAIN}の政治力を獲得します。</p>
                             </div>
                         </div>
                     )}
                    {activeTab === 'opposition_activity' && (
                        <div className="space-y-4">
                            <p className="text-slate-300 mb-4">あなたは今や野党です。政府を批判し、支持を集め、次の選挙での勝利を目指しましょう。</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button onClick={handleCriticizeGovernment} className="bg-slate-700 hover:bg-slate-600 p-3 rounded text-left transition-colors">
                                    <p className="font-bold">政府批判</p>
                                    <p className="text-xs text-slate-400">政治力: {CRITICIZE_GOVERNMENT_COST}</p>
                                    <p className="text-xs text-slate-400 mt-1">与党の政策を批判し、支持を切り崩す。</p>
                                </button>
                                <button onClick={handleProposeCounterPlan} className="bg-slate-700 hover:bg-slate-600 p-3 rounded text-left transition-colors">
                                    <p className="font-bold">対案提出</p>
                                    <p className="text-xs text-slate-400">政治力: {COUNTER_PLAN_COST}</p>
                                    <p className="text-xs text-slate-400 mt-1">建設的な対案を示し、支持率と評価を高める。</p>
                                </button>
                                <button onClick={handleStartSpeechMinigame} className="bg-blue-700 hover:bg-blue-600 p-3 rounded text-left transition-colors col-span-1 md:col-span-2">
                                    <p className="font-bold">支持者集会 (ミニゲーム)</p>
                                    <p className="text-xs text-slate-400">政治力: {RALLY_SUPPORTERS_COST}</p>
                                    <p className="text-xs text-slate-400 mt-1">街頭演説を行い、支持を拡大する。</p>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
             </div>
          </div>
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-700">
              <h2 className="text-xl font-bold mb-2">ニュース</h2>
              <div className="h-[250px] overflow-y-auto space-y-3 pr-2">
                  {gameState.newsArticles.map((article, index) => (
                      <div key={index} className="p-3 bg-slate-900/50 rounded-md border border-slate-700/50">
                          <p className="text-sm font-semibold text-cyan-400">{article.outletName}</p>
                          <h3 className="font-bold">{article.headline}</h3>
                          <p className="text-xs text-slate-400 mt-1">{article.body}</p>
                      </div>
                  ))}
              </div>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-700">
              <h2 className="text-xl font-bold mb-2">ログ</h2>
              <div className="h-[300px] bg-slate-900/50 p-2 rounded-md border border-slate-700/50 overflow-y-auto text-sm pr-2">
                {gameState.logs.slice().reverse().map((log, index) => (
                  <p key={index} className={`p-1 ${index === 0 ? 'text-yellow-300 animate-fade-in' : 'text-slate-400'}`}>
                    {log}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer country={gameState.country} />

      <div className="fixed bottom-24 right-4 md:bottom-20 z-20">
        <button onClick={handleNextTurn} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition transform hover:scale-105">
          次のターンへ
        </button>
      </div>
    </div>
  );
};

export default MainGame;
