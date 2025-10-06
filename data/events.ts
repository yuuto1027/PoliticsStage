import { GameEvent, BillToVoteOn } from '../types';

export type PredefinedBill = Omit<BillToVoteOn, 'proposerPartyName'>;

export const oppositionBills: PredefinedBill[] = [
  // Conservative / Right-wing (Reviewed)
  {
    lawName: '法人税減税法',
    lawDescription: '企業の国際競争力を高めるため、法人税率を大幅に引き下げる。',
    lawEffect: {
      resourceChanges: { treasury: -2800, stability: -3, manpower: 100, researchPoints: 0, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': 6, '中間層': 1, '貧困層': -5, '資本家': 9, '労働者': -3 },
      effects: { buff: ['企業の投資意欲向上', '雇用の微増'], debuff: ['富裕層への優遇との批判', '歳入の大幅な減少'] },
    },
  },
  {
    lawName: '国防力強化法',
    lawDescription: '周辺国の脅威に対抗するため、防衛予算を増額し、軍備を近代化する。',
    lawEffect: {
      resourceChanges: { treasury: -3500, stability: 5, manpower: 200, researchPoints: 50, militaryPower: 250 },
      factionHappinessChanges: { '富裕層': 2, '中間層': 3, '貧困層': 1, '資本家': 4, '労働者': 2 },
      effects: { buff: ['抑止力の向上', '愛国心の高揚'], debuff: ['近隣諸国との緊張激化', '平和主義者からの反発'] },
    },
  },
  {
    lawName: '伝統的家族価値保護法',
    lawDescription: '伝統的な家族のあり方を尊重し、支援するための法案。',
    lawEffect: {
      resourceChanges: { treasury: -500, stability: 2, manpower: 0, researchPoints: 0, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': 2, '中間層': 1, '貧困層': 0, '資本家': 1, '労働者': 1 },
      effects: { buff: ['保守層からの支持獲得'], debuff: ['多様な家族像を否定するとの批判', 'リベラル層の反発'] },
    },
  },
    {
    lawName: '移民規制強化法',
    lawDescription: '国内の治安維持と雇用保護のため、移民の受け入れ基準を厳格化する。',
    lawEffect: {
      resourceChanges: { treasury: 200, stability: 3, manpower: -200, researchPoints: 0, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': 1, '中間層': 2, '貧困層': 3, '資本家': -6, '労働者': 4 },
      effects: { buff: ['治安改善への期待', '国内労働市場の保護'], debuff: ['労働力不足の深刻化', '国際社会からの非難'] },
    },
  },
  {
    lawName: '市場原理主義導入法',
    lawDescription: '公共サービスに市場原理を導入し、民営化を促進することで、行政のスリム化を図る。',
    lawEffect: {
      resourceChanges: { treasury: 2000, stability: -6, manpower: -150, researchPoints: 0, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': 7, '中間層': -3, '貧困層': -9, '資本家': 10, '労働者': -7 },
      effects: { buff: ['財政の健全化', 'サービスの効率化'], debuff: ['公共サービスの質の低下懸念', '弱者切り捨てとの批判'] },
    },
  },
  // Liberal / Left-wing (Reviewed)
  {
    lawName: '環境保護税導入法',
    lawDescription: '炭素排出量に応じて課税する「炭素税」を導入し、環境問題への取り組みを強化する。',
    lawEffect: {
      resourceChanges: { treasury: 1800, stability: -4, manpower: 0, researchPoints: 60, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': -3, '中間層': 1, '貧困層': -4, '資本家': -9, '労働者': -2 },
      effects: { buff: ['環境技術開発の促進', '国際的な評価の向上'], debuff: ['産業界からの強い反発', 'エネルギー価格の上昇'] },
    },
  },
  {
    lawName: '富裕税導入法',
    lawDescription: '一定以上の資産を持つ富裕層に対し新たな税を課し、格差是正の財源とする。',
    lawEffect: {
      resourceChanges: { treasury: 3000, stability: -5, manpower: 0, researchPoints: 0, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': -18, '中間層': 2, '貧困層': 9, '資本家': -12, '労働者': 6 },
      effects: { buff: ['歳入増加と格差是正', '低所得者層からの支持'], debuff: ['富裕層の国外流出懸念', '投資意欲の減退'] },
    },
  },
  {
    lawName: '労働者権利向上法',
    lawDescription: '最低賃金の大幅な引き上げや、解雇規制の強化により、労働者の地位を向上させる。',
    lawEffect: {
      resourceChanges: { treasury: -1200, stability: 4, manpower: 150, researchPoints: 0, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': -3, '中間層': 1, '貧困層': 5, '資本家': -11, '労働者': 13 },
      effects: { buff: ['労働者の生活水準向上', '内需の拡大'], debuff: ['企業経営の圧迫', '失業率増加のリスク'] },
    },
  },
  {
    lawName: '公教育無償化法',
    lawDescription: '幼稚園から大学までの教育費を完全に無償化し、教育機会の平等を確保する。',
    lawEffect: {
      resourceChanges: { treasury: -5500, stability: 7, manpower: 80, researchPoints: 120, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': -6, '中間層': 9, '貧困層': 11, '資本家': -3, '労働者': 8 },
      effects: { buff: ['国民全体の教育水準向上', '子育て世代からの絶大な支持'], debuff: ['莫大な財政負担', '教育の質の低下懸念'] },
    },
  },
  {
    lawName: 'ヘイトスピーチ規制法',
    lawDescription: '人種や信条などに基づく差別的言動を法的に規制し、罰則を設ける。',
    lawEffect: {
      resourceChanges: { treasury: 0, stability: 4, manpower: 0, researchPoints: 0, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': 1, '中間層': 3, '貧困層': 2, '資本家': 0, '労働者': 2 },
      effects: { buff: ['社会的差別の抑制', 'マイノリティの保護'], debuff: ['表現の自由を侵害するとの批判', '規制範囲を巡る対立'] },
    },
  },
  // Centrist / Niche (Reviewed)
  {
    lawName: 'デジタル通貨導入法',
    lawDescription: '中央銀行が発行するデジタル通貨（CBDC）を導入し、キャッシュレス社会を推進する。',
    lawEffect: {
      resourceChanges: { treasury: 500, stability: -3, manpower: 0, researchPoints: 80, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': 3, '中間層': 1, '貧困層': -3, '資本家': 4, '労働者': 0 },
      effects: { buff: ['金融取引の効率化', '脱税防止'], debuff: ['プライバシー侵害への懸念', 'システム障害のリスク'] },
    },
  },
    {
    lawName: '地方分権推進法',
    lawDescription: '中央政府の権限と財源を大幅に地方自治体へ移譲し、地域の自立を促す。',
    lawEffect: {
      resourceChanges: { treasury: -1800, stability: 5, manpower: 0, researchPoints: 0, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': 1, '中間層': 3, '貧困層': 2, '資本家': 0, '労働者': 2 },
      effects: { buff: ['地域の実情に合った行政', '住民サービスの向上'], debuff: ['地域間格差の拡大懸念', '国としての一体性の低下'] },
    },
  },
  {
    lawName: '再生可能エネルギー固定価格買取制度改正法',
    lawDescription: '再生可能エネルギーの買取価格を見直し、国民負担を軽減する。',
    lawEffect: {
      resourceChanges: { treasury: 900, stability: 2, manpower: 0, researchPoints: -30, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': 2, '中間層': 4, '貧困層': 3, '資本家': -4, '労働者': 3 },
      effects: { buff: ['電気料金の値下げ', '財政負担の軽減'], debuff: ['再生可能エネルギー事業者の撤退', '環境目標達成の遅延'] },
    },
  },
  {
    lawName: 'ベーシックインカム導入実験法',
    lawDescription: '特定の地域で、全国民に最低限の所得を給付するベーシックインカムの社会実験を行う。',
    lawEffect: {
      resourceChanges: { treasury: -4000, stability: 6, manpower: 0, researchPoints: 150, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': -7, '中間層': 3, '貧困層': 16, '資本家': -5, '労働者': 6 },
      effects: { buff: ['貧困問題の解決への期待', '新しい社会モデルの模索'], debuff: ['莫大な実験費用', '労働意欲の低下を懸念する声'] },
    },
  },
  {
    lawName: '国家公務員制度改革法',
    lawDescription: '年功序列を廃し、能力主義に基づく新たな公務員制度を導入する。',
    lawEffect: {
      resourceChanges: { treasury: 700, stability: -4, manpower: 0, researchPoints: 0, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': 3, '中間層': 1, '貧困層': -3, '資本家': 4, '労働者': -4 },
      effects: { buff: ['行政の効率化', '人件費の削減'], debuff: ['公務員の士気低下', '経験豊富な人材の流出'] },
    },
  },
  {
    lawName: '文化芸術支援法',
    lawDescription: '国内の文化・芸術活動に対する政府の助成金を大幅に増額する。',
    lawEffect: {
      resourceChanges: { treasury: -1000, stability: 3, manpower: 0, researchPoints: 20, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': 1, '中間層': 2, '貧困層': 1, '資本家': 1, '労働者': 1 },
      effects: { buff: ['文化の振興', 'クリエイターの育成'], debuff: ['「税金の無駄遣い」との批判'] },
    },
  },
  {
    lawName: '食料自給率向上法',
    lawDescription: '国内の農業を保護・育成し、食料自給率の向上を目指す。',
    lawEffect: {
      resourceChanges: { treasury: -2200, stability: 4, manpower: 250, researchPoints: 0, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': 0, '中間層': 2, '貧困層': 3, '資本家': -3, '労働者': 4 },
      effects: { buff: ['食料安全保障の強化', '地方経済の活性化'], debuff: ['食料品価格の上昇', '貿易相手国からの反発'] },
    },
  },
  {
    lawName: 'スタートアップ支援法',
    lawDescription: '新規事業を立ち上げる起業家に対し、資金援助や税制優遇を行う。',
    lawEffect: {
      resourceChanges: { treasury: -1500, stability: 1, manpower: 50, researchPoints: 100, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': 3, '中間層': 1, '貧困層': 0, '資本家': 6, '労働者': 1 },
      effects: { buff: ['イノベーションの促進', '新産業の創出'], debuff: ['財政負担', '成功率の低い事業への投資リスク'] },
    },
  },
  {
    lawName: '動物愛護法改正案',
    lawDescription: 'ペットショップでの生体販売を規制し、動物福祉を向上させる。',
    lawEffect: {
      resourceChanges: { treasury: 0, stability: 2, manpower: 0, researchPoints: 0, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': 1, '中間層': 2, '貧困層': 1, '資本家': 0, '労働者': 1 },
      effects: { buff: ['動物福祉の向上', '国民の倫理観の高まり'], debuff: ['ペット業界からの反発'] },
    },
  },
  {
    lawName: 'サイバーセキュリティ強化法',
    lawDescription: '重要インフラへのサイバー攻撃に備え、国家的なセキュリティ体制を強化する。',
    lawEffect: {
      resourceChanges: { treasury: -2000, stability: 5, manpower: 0, researchPoints: 80, militaryPower: 50 },
      factionHappinessChanges: { '富裕層': 2, '中間層': 3, '貧困層': 1, '資本家': 4, '労働者': 2 },
      effects: { buff: ['国家インフラの防衛力向上', 'デジタル社会への信頼性向上'], debuff: ['多額の予算が必要', 'プライバシー監視強化への懸念'] },
    },
  },
    {
    lawName: 'ギャンブル依存症対策法',
    lawDescription: 'ギャンブル依存症の予防と治療を支援するための全国的な体制を整備する。',
    lawEffect: {
      resourceChanges: { treasury: -700, stability: 1, manpower: 0, researchPoints: 0, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': 0, '中間層': 2, '貧困層': 3, '資本家': -2, '労働者': 1 },
      effects: { buff: ['社会問題の解決に貢献', '国民の健康福祉向上'], debuff: ['関連産業からの反発'] },
    },
  },
  {
    lawName: 'インフラ長寿命化計画法',
    lawDescription: '高度経済成長期に建設されたインフラの老朽化対策として、大規模な補修・更新計画を策定する。',
    lawEffect: {
      resourceChanges: { treasury: -5000, stability: 6, manpower: 300, researchPoints: 0, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': 1, '中間層': 4, '貧困層': 3, '資本家': 6, '労働者': 5 },
      effects: { buff: ['国民の安全確保', '建設業界の活性化'], debuff: ['莫大な財政負担', '工事による交通渋滞'] },
    },
  },
  {
    lawName: 'フェイクニュース対策法',
    lawDescription: '悪意のある偽情報の拡散に対し、プラットフォーマーに削除義務を課し、罰則を設ける。',
    lawEffect: {
      resourceChanges: { treasury: 0, stability: 3, manpower: 0, researchPoints: 0, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': 1, '中間層': 3, '貧困層': 2, '資本家': 0, '労働者': 2 },
      effects: { buff: ['健全な世論形成に貢献', '社会の混乱を防止'], debuff: ['表現の自由・報道の自由の萎縮懸念'] },
    },
  },
  {
    lawName: '宇宙開発推進法',
    lawDescription: '国家宇宙機関の予算を倍増させ、独自の衛星網構築や惑星探査計画を推進する。',
    lawEffect: {
      resourceChanges: { treasury: -4000, stability: 2, manpower: 0, researchPoints: 250, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': 2, '中間層': 2, '貧困層': 0, '資本家': 3, '労働者': 1 },
      effects: { buff: ['科学技術力の向上', '国民の夢を育む'], debuff: ['費用対効果を疑問視する声', '失敗時のリスクが大きい'] },
    },
  },
  {
    lawName: '選挙制度改革法',
    lawDescription: '一票の格差を是正し、インターネット投票を導入することで、より民意を反映した選挙制度を目指す。',
    lawEffect: {
      resourceChanges: { treasury: -400, stability: -3, manpower: 0, researchPoints: 0, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': -3, '中間層': 2, '貧困層': 3, '資本家': -2, '労働者': 1 },
      effects: { buff: ['投票率の向上期待', '民主主義の深化'], debuff: ['各政党の思惑が絡み合い、合意形成が困難'] },
    },
  },
  {
    lawName: '水道事業民営化法',
    lawDescription: '老朽化した水道事業の運営権を民間企業に売却し、効率的な経営を目指す。',
    lawEffect: {
      resourceChanges: { treasury: 3500, stability: -7, manpower: -80, researchPoints: 0, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': 5, '中間層': -4, '貧困層': -8, '資本家': 9, '労働者': -6 },
      effects: { buff: ['財政負担の軽減', '経営の効率化'], debuff: ['水道料金の値上がり懸念', '水の安全保障への不安'] },
    },
  },
  {
    lawName: '歴史教科書ガイドライン改定',
    lawDescription: '自国の歴史に誇りを持てるような、愛国的な記述を重視する教科書ガイドラインを策定する。',
    lawEffect: {
      resourceChanges: { treasury: 0, stability: -5, manpower: 0, researchPoints: 0, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': 1, '中間層': 0, '貧困層': 0, '資本家': 0, '労働者': -1 },
      effects: { buff: ['国民のアイデンティティ強化', '保守層からの支持'], debuff: ['近隣諸国からの強い反発', '歴史修正主義との批判'] },
    },
  },
  {
    lawName: '議員定数削減法',
    lawDescription: '「身を切る改革」として、国会の議員定数を10%削減する。',
    lawEffect: {
      resourceChanges: { treasury: 900, stability: 1, manpower: 0, researchPoints: 0, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': 2, '中間層': 3, '貧困層': 2, '資本家': 1, '労働者': 2 },
      effects: { buff: ['行政改革のアピール', '国会経費の削減'], debuff: ['多様な民意が反映されにくくなるとの批判'] },
    },
  },
  {
    lawName: '原子力発電所再稼働推進法',
    lawDescription: '安全基準を満たした原子力発電所の再稼働を、国の責任において推進する。',
    lawEffect: {
      resourceChanges: { treasury: 1200, stability: -6, manpower: 80, researchPoints: 0, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': 3, '中間層': -3, '貧困層': -5, '資本家': 7, '労働者': 0 },
      effects: { buff: ['エネルギーの安定供給', '電気料金の抑制'], debuff: ['大規模事故への不安', '環境保護団体からの強い反発'] },
    },
  },
  {
    lawName: '超党派災害対策基本法',
    lawDescription: '大規模災害発生時の対応について、政府と野党が協力する枠組みを法制化する。',
    lawEffect: {
      resourceChanges: { treasury: -400, stability: 6, manpower: 0, researchPoints: 0, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': 2, '中間層': 4, '貧困層': 3, '資本家': 2, '労働者': 3 },
      effects: { buff: ['災害対応の迅速化', '政治的混乱の回避'], debuff: ['野党の存在意義が薄れるとの懸念'] },
    },
  },
  {
    lawName: '国民基礎サービス法',
    lawDescription: '医療、教育、交通などの基礎的な公共サービスを完全に無償化し、国民の生活基盤を保障する。',
    lawEffect: {
      resourceChanges: { treasury: -7000, stability: 9, manpower: 250, researchPoints: 50, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': -11, '中間層': 9, '貧困層': 13, '資本家': -9, '労働者': 11 },
      effects: { buff: ['国民の生活満足度が大幅に向上', '人的資本への投資'], debuff: ['莫大な財政負担', 'サービスの質の低下懸念'] },
    },
  },
  {
    lawName: '人工知能開発促進法',
    lawDescription: '国家の未来を左右する人工知能技術の研究開発に対し、大規模な予算を投下し、世界的な拠点を目指す。',
    lawEffect: {
      resourceChanges: { treasury: -3000, stability: 1, manpower: 0, researchPoints: 350, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': 4, '中間層': 2, '貧困層': -3, '資本家': 8, '労働者': -4 },
      effects: { buff: ['次世代の産業基盤を構築', '技術的優位性の確保'], debuff: ['倫理的な問題や雇用の喪失懸念'] },
    },
  },
  {
    lawName: '企業統治改革法',
    lawDescription: '企業の経営透明性を高め、株主の権利を強化することで、健全な市場経済を促進する。',
    lawEffect: {
      resourceChanges: { treasury: 400, stability: -3, manpower: 0, researchPoints: 0, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': 4, '中間層': 1, '貧困層': 0, '資本家': -6, '労働者': 0 },
      effects: { buff: ['海外投資家からの信頼向上'], debuff: ['短期的な利益を追求する経営への批判', '企業側の反発'] },
    },
  },
  {
    lawName: '国語純化法',
    lawDescription: '公文書やメディアにおける安易な外来語の使用を規制し、美しい国語を守り育てる。',
    lawEffect: {
      resourceChanges: { treasury: 0, stability: 1, manpower: 0, researchPoints: -20, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': 0, '中間層': 1, '貧困層': 0, '資本家': -2, '労働者': 0 },
      effects: { buff: ['文化的なアイデンティティの強化', '保守層からの支持'], debuff: ['国際化に逆行するとの批判', '表現の自由の制限'] },
    },
  },
  {
    lawName: 'ギグワーカー保護法',
    lawDescription: '配達員やフリーランスなど、ギグエコノミーで働く人々に労働者としての権利を認め、社会保障を適用する。',
    lawEffect: {
      resourceChanges: { treasury: -1600, stability: 3, manpower: 0, researchPoints: 0, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': -2, '中間層': 2, '貧困層': 4, '資本家': -7, '労働者': 9 },
      effects: { buff: ['新たな働き方に対応したセーフティネット構築'], debuff: ['関連企業のコスト増', 'サービスの価格上昇懸念'] },
    },
  },
  {
    lawName: '「つながらない権利」法',
    lawDescription: '労働者の休息時間を確保するため、勤務時間外の業務連絡を原則として禁止する。',
    lawEffect: {
      resourceChanges: { treasury: 0, stability: 2, manpower: 0, researchPoints: 0, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': -2, '中間層': 3, '貧困層': 2, '資本家': -5, '労働者': 6 },
      effects: { buff: ['労働者のメンタルヘルス改善', 'ワークライフバランスの向上'], debuff: ['国際的なビジネスにおける競争力低下の懸念', '緊急時の対応の遅れ'] },
    },
  },
  {
    lawName: 'ネット匿名性制限法',
    lawDescription: 'ネット上の誹謗中傷やフェイクニュース対策として、SNSなどでの匿名による投稿を一部制限する。',
    lawEffect: {
      resourceChanges: { treasury: 0, stability: 4, manpower: 0, researchPoints: -30, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': 1, '中間層': 2, '貧困層': -2, '資本家': 0, '労働者': 1 },
      effects: { buff: ['ネット空間の健全化'], debuff: ['表現の自由の萎縮', '内部告発などの減少懸念'] },
    },
  },
  {
    lawName: '義務投票制導入法',
    lawDescription: '民主主義への参加意識を高めるため、全ての有権者に選挙での投票を義務付け、違反者には軽い罰金を科す。',
    lawEffect: {
      resourceChanges: { treasury: 400, stability: -2, manpower: 0, researchPoints: 0, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': -2, '中間層': 1, '貧困層': 3, '資本家': -2, '労働者': 0 },
      effects: { buff: ['投票率の大幅な向上', '民意のより正確な反映'], debuff: ['個人の自由の侵害との批判', '無関心層の白票増加'] },
    },
  },
  {
    lawName: 'ジャンクフード税導入法',
    lawDescription: '国民の健康増進のため、糖分や脂肪分が多い食品・飲料に課税し、その税収を健康政策に充てる。',
    lawEffect: {
      resourceChanges: { treasury: 1300, stability: -3, manpower: 0, researchPoints: 0, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': 1, '中間層': 2, '貧困層': -5, '資本家': -3, '労働者': -2 },
      effects: { buff: ['国民の健康改善', '医療費の抑制効果'], debuff: ['低所得者層への負担増', '個人の選択への過度な介入との批判'] },
    },
  },
  {
    lawName: '週休3日制導入実験法',
    lawDescription: '公務員を対象に、給与を維持したまま週休3日制を試験的に導入し、生産性や幸福度への影響を検証する。',
    lawEffect: {
      resourceChanges: { treasury: -1800, stability: 5, manpower: -80, researchPoints: 50, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': -4, '中間層': 7, '貧困層': 5, '資本家': -6, '労働者': 9 },
      effects: { buff: ['国民の幸福度向上', '新たな働き方のモデルケースとなる可能性'], debuff: ['行政サービスの低下懸念', '人件費の増加'] },
    },
  },
  {
    lawName: '警察予算増額法',
    lawDescription: '国内の治安を強化するため、警察官の増員と装備の近代化に大規模な予算を投じる。',
    lawEffect: {
      resourceChanges: { treasury: -2200, stability: 6, manpower: -40, researchPoints: 0, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': 3, '中間層': 4, '貧困層': 1, '資本家': 2, '労働者': 2 },
      effects: { buff: ['犯罪率の低下', '市民の体感治安の向上'], debuff: ['人権団体による警察権力の強大化への懸念', '財政負担の増大'] },
    },
  },
  {
    lawName: '金融市場規制緩和法',
    lawDescription: '金融市場の自由な競争を促すため、多くの規制を撤廃し、海外からの投資を呼び込む。',
    lawEffect: {
      resourceChanges: { treasury: 900, stability: -7, manpower: 0, researchPoints: 0, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': 9, '中間層': -3, '貧困層': -7, '資本家': 11, '労働者': -5 },
      effects: { buff: ['金融市場の活性化'], debuff: ['金融危機の発生リスク増大', '国内金融機関への打撃'] },
    },
  },
  {
    lawName: '愛国教育推進法',
    lawDescription: '学校教育において、自国の歴史と文化に対する誇りを育むための教育内容を強化する。',
    lawEffect: {
      resourceChanges: { treasury: -700, stability: 3, manpower: 0, researchPoints: 0, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': 2, '中間層': 1, '貧困層': 0, '資本家': 1, '労働者': 1 },
      effects: { buff: ['国民の一体感の醸成'], debuff: ['排外主義的な思想を助長するとの批判', '教育現場からの反発'] },
    },
  },
  {
    lawName: '労働組合活動制限法',
    lawDescription: '企業の円滑な経営を支援するため、ストライキの決行条件を厳格化するなど、労働組合の活動に一定の制限を設ける。',
    lawEffect: {
      resourceChanges: { treasury: 400, stability: -6, manpower: 0, researchPoints: 0, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': 4, '中間層': 0, '貧困層': -5, '資本家': 9, '労働者': -11 },
      effects: { buff: ['企業の生産性向上', '海外からの投資誘致'], debuff: ['労働者からの激しい反発', '労働条件の悪化懸念'] },
    },
  },
  {
    lawName: '相続税最高税率引き上げ法',
    lawDescription: '富の再分配を強化するため、高額な遺産に対する相続税の最高税率を大幅に引き上げる。',
    lawEffect: {
      resourceChanges: { treasury: 2200, stability: -4, manpower: 0, researchPoints: 0, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': -14, '中間層': 1, '貧困層': 7, '資本家': -9, '労働者': 5 },
      effects: { buff: ['格差是正への貢献', '歳入の増加'], debuff: ['富裕層による資産の国外移転', '企業の事業承継への悪影響'] },
    },
  },
  {
    lawName: '化石燃料全面禁止法',
    lawDescription: '地球温暖化対策として、10年以内に国内での化石燃料の使用を原則として全面的に禁止する。',
    lawEffect: {
      resourceChanges: { treasury: -4500, stability: -9, manpower: -400, researchPoints: 180, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': -6, '中間層': -3, '貧困層': -9, '資本家': -16, '労働者': -7 },
      effects: { buff: ['環境保護における国際的なリーダーシップの発揮'], debuff: ['経済活動の大混乱', 'エネルギー価格の暴騰'] },
    },
  },
  {
    lawName: '難民受け入れ拡大法',
    lawDescription: '人道的観点から、紛争や迫害から逃れてきた難民の受け入れ枠を大幅に拡大する。',
    lawEffect: {
      resourceChanges: { treasury: -1300, manpower: 350, stability: -8, researchPoints: 0, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': -3, '中間層': -5, '貧困層': 3, '資本家': -4, '労働者': -6 },
      effects: { buff: ['国際社会からの賞賛', '労働力不足の緩和'], debuff: ['社会統合コストの増大', '国内での治安悪化への懸念'] },
    },
  },
  {
    lawName: '同性婚法制化法',
    lawDescription: '法の下の平等を保障するため、同性カップルの婚姻を法的に認め、異性カップルと同等の権利を保障する。',
    lawEffect: {
      resourceChanges: { treasury: 0, stability: 3, manpower: 0, researchPoints: 0, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': 1, '中間層': 4, '貧困層': 2, '資本家': 0, '労働者': 3 },
      effects: { buff: ['人権意識の高まりを国内外に示す', '多様性を尊重する社会の実現'], debuff: ['伝統的な価値観を重んじる層からの強い反発'] },
    },
  },
  {
    lawName: 'AI倫理規制法',
    lawDescription: '人工知能の暴走や悪用を防ぐため、AIの開発と利用に関する厳格な倫理規定と法的枠組みを設ける。',
    lawEffect: {
      resourceChanges: { treasury: -400, stability: 2, manpower: 0, researchPoints: -60, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': 0, '中間層': 2, '貧困層': 1, '資本家': -3, '労働者': 1 },
      effects: { buff: ['AIの安全な利用促進', '市民のプライバシー保護'], debuff: ['技術革新の停滞', '国際的な開発競争からの脱落リスク'] },
    },
  },
  {
    lawName: 'パンデミック準備法',
    lawDescription: '将来のパンデミックに備え、ワクチン開発体制の強化、医療物資の国家備蓄、司令塔機能の創設などを行う。',
    lawEffect: {
      resourceChanges: { treasury: -2800, stability: 4, manpower: 0, researchPoints: 90, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': 1, '中間層': 3, '貧困層': 2, '資本家': 1, '労働者': 2 },
      effects: { buff: ['将来の感染症危機への対応力強化'], debuff: ['平時における多額の維持費', '「無駄な投資」との批判'] },
    },
  },
  {
    lawName: '直接民主制導入法',
    lawDescription: '重要な法案については、議会だけでなく国民投票によって直接その是非を問う制度を導入する。',
    lawEffect: {
      resourceChanges: { treasury: -900, stability: -6, manpower: 0, researchPoints: 0, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': -4, '中間層': 0, '貧困層': 3, '資本家': -5, '労働者': 1 },
      effects: { buff: ['民意の直接的な反映'], debuff: ['ポピュリズムによる政治の不安定化', '専門的な判断が困難になる'] },
    },
  },
  {
    lawName: '反汚職特別機関設置法',
    lawDescription: '政治家や高級官僚の汚職を捜査するため、他の政府機関から独立した強力な権限を持つ特別機関を設置する。',
    lawEffect: {
      resourceChanges: { treasury: -1100, stability: 7, manpower: 0, researchPoints: 0, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': -6, '中間層': 5, '貧困層': 6, '資本家': -7, '労働者': 4 },
      effects: { buff: ['政治腐敗の抑制', '政府への信頼回復'], debuff: ['既存の権力機構との激しい対立', '魔女狩り的な捜査への懸念'] },
    },
  },
  {
    lawName: '銃所持規制緩和法',
    lawDescription: '国民の自衛権を尊重し、身元調査を通過した市民に対する銃の所持許可基準を緩和する。',
    lawEffect: {
      resourceChanges: { treasury: 0, stability: -12, manpower: 0, researchPoints: 0, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': 5, '中間層': -4, '貧困層': -6, '資本家': 1, '労働者': -3 },
      effects: { buff: ['自衛権の強化を主張する層からの支持'], debuff: ['銃犯罪の急増懸念', '社会不安の増大'] },
    },
  },
  {
    lawName: '嗜好品非犯罪化法',
    lawDescription: '特定の嗜好品（ソフトドラッグなど）の個人使用を非犯罪化し、取締りよりも健康問題として対処する。',
    lawEffect: {
      resourceChanges: { treasury: 700, stability: -5, manpower: 0, researchPoints: 0, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': 3, '中間層': 1, '貧困層': -3, '資本家': 0, '労働者': 0 },
      effects: { buff: ['司法コストの削減', '税収の増加'], debuff: ['薬物乱用の拡大懸念', '保守層からの強い反発'] },
    },
  },
  {
    lawName: 'インターネット基本法',
    lawDescription: '政府による検閲や通信の秘密の侵害を禁じ、国民の自由なインターネットアクセスを国家の責務として保障する。',
    lawEffect: {
      resourceChanges: { treasury: -1300, stability: 2, manpower: 0, researchPoints: 40, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': 2, '中間層': 3, '貧困層': 1, '資本家': 3, '労働者': 2 },
      effects: { buff: ['デジタル分野での自由と革新を促進'], debuff: ['偽情報やヘイトスピーチ対策が困難になる'] },
    },
  },
  {
    lawName: '遺伝子組換え作物推進法',
    lawDescription: '食糧安全保障を強化するため、遺伝子組換え作物の国内での開発・栽培を奨励し、規制を緩和する。',
    lawEffect: {
      resourceChanges: { treasury: 400, stability: -4, manpower: 90, researchPoints: 70, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': 1, '中間層': -3, '貧困層': -5, '資本家': 8, '労働者': -2 },
      effects: { buff: ['食料生産性の向上', '気候変動に強い農業の実現'], debuff: ['消費者団体や環境保護団体からの強い反発'] },
    },
  },
  {
    lawName: '退役軍人支援強化法',
    lawDescription: '国のために奉仕した退役軍人に対し、医療、住宅、雇用の面で包括的かつ手厚い支援を提供する。',
    lawEffect: {
      resourceChanges: { treasury: -2000, stability: 3, manpower: 0, researchPoints: 0, militaryPower: 50 },
      factionHappinessChanges: { '富裕層': 1, '中間層': 3, '貧困層': 2, '資本家': 0, '労働者': 2 },
      effects: { buff: ['軍の士気向上', '退役軍人の社会復帰促進'], debuff: ['恒久的な財政負担の増大'] },
    },
  },
  {
    lawName: '言語教育改革法',
    lawDescription: 'グローバル化に対応するため、小学校からの第二外国語教育を義務化し、国際的な人材を育成する。',
    lawEffect: {
      resourceChanges: { treasury: -1600, stability: 0, manpower: 0, researchPoints: 30, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': 1, '中間層': 2, '貧困層': 0, '資本家': 2, '労働者': 1 },
      effects: { buff: ['国民の国際競争力向上'], debuff: ['教育現場の負担増', 'どの言語を選択するかで国内対立'] },
    },
  },
  {
    lawName: '公共交通網拡充法',
    lawDescription: '都市部および地方の公共交通網（鉄道、バスなど）に大規模な投資を行い、利便性を向上させる。',
    lawEffect: {
      resourceChanges: { treasury: -4000, stability: 5, manpower: 180, researchPoints: 0, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': 0, '中間層': 5, '貧困層': 7, '資本家': 2, '労働者': 4 },
      effects: { buff: ['交通渋滞の緩和と環境負荷の低減', '地方の活性化'], debuff: ['莫大な建設費用と期間', '自動車業界からの反発'] },
    },
  },
  {
    lawName: '一院制導入法',
    lawDescription: '議会の意思決定を迅速化するため、二院制を廃止し、一院制に移行する。',
    lawEffect: {
      resourceChanges: { treasury: 700, stability: -8, manpower: 0, researchPoints: 0, militaryPower: 0 },
      factionHappinessChanges: { '富裕層': -3, '中間層': -2, '貧困層': 0, '資本家': -3, '労働者': -2 },
      effects: { buff: ['法案審議の迅速化', '行政コストの削減'], debuff: ['熟慮を欠いた法案が成立しやすくなる', '政治の不安定化'] },
    },
  },
  {
      lawName: 'ロボット市民権検討法',
      lawDescription: '高度な自我を持つ可能性のあるAIロボットに対し、基本的な権利を与えるべきかどうかの国民的議論を開始する。',
      lawEffect: {
        resourceChanges: { treasury: -500, stability: -5, manpower: 0, researchPoints: 150, militaryPower: 0 },
        factionHappinessChanges: { '富裕層': 2, '中間層': 1, '貧困層': -3, '資本家': 3, '労働者': -5 },
        effects: { buff: ['倫理的研究の促進', '技術主義者からの支持'], debuff: ['社会の混乱', '労働者からの強い反発'] },
      },
  },
  {
      lawName: '脱成長戦略法',
      lawDescription: '経済成長（GDP）を国家の最優先目標から外し、国民の幸福度と環境の持続可能性を新たな指標とする。',
      lawEffect: {
        resourceChanges: { treasury: -3000, stability: 10, manpower: -100, researchPoints: 0, militaryPower: -50 },
        factionHappinessChanges: { '富裕層': -8, '中間層': 5, '貧困層': 6, '資本家': -12, '労働者': 4 },
        effects: { buff: ['国民の幸福度向上', '環境負荷の低減'], debuff: ['経済の停滞', '資本家からの猛反発'] },
      },
  },
  {
      lawName: '国民スポーツ義務化法',
      lawDescription: '国民の健康増進のため、全ての成人に週3時間以上のスポーツ活動を義務付け、達成状況を管理する。',
      lawEffect: {
        resourceChanges: { treasury: -1500, stability: -4, manpower: 500, researchPoints: 0, militaryPower: 0 },
        factionHappinessChanges: { '富裕層': -2, '中間層': 2, '貧困層': 1, '資本家': 0, '労働者': 3 },
        effects: { buff: ['国民の健康寿命の延伸', '医療費の削減'], debuff: ['個人の自由の侵害との強い批判'] },
      },
  },
  {
      lawName: 'サイバースペース基本法',
      lawDescription: 'デジタル空間における個人の権利（匿名性、表現の自由、データ自己決定権）を最大限保障する。',
      lawEffect: {
        resourceChanges: { treasury: -800, stability: -2, manpower: 0, researchPoints: 70, militaryPower: 0 },
        factionHappinessChanges: { '富裕層': 3, '中間層': 2, '貧困層': 0, '資本家': 2, '労働者': 1 },
        effects: { buff: ['イノベーションの促進'], debuff: ['サイバー犯罪や偽情報の増加リスク'] },
      },
  },
  {
      lawName: '文化多様性保護法',
      lawDescription: '国内の少数派言語や文化の保護・振興のために公的資金を投入し、教育カリキュラムに組み込む。',
      lawEffect: {
        resourceChanges: { treasury: -1200, stability: 4, manpower: 0, researchPoints: 0, militaryPower: 0 },
        factionHappinessChanges: { '富裕層': 0, '中間層': 2, '貧困層': 1, '資本家': -1, '労働者': 1 },
        effects: { buff: ['社会の多様性と寛容性の促進'], debuff: ['国家の一体性を損なうとの保守層からの反発'] },
      },
  }
];


export const domesticEvents: GameEvent[] = [
  // Existing
  {
    id: 'infra_project',
    type: 'domestic',
    title: '大規模インフラ計画',
    description: '老朽化した交通網を刷新し、経済を活性化させるための大規模なインフラ計画が提案されています。多額の予算が必要ですが、成功すれば国家の安定に大きく貢献します。',
    choices: [
      { text: '承認する', effects: { resourceChanges: { treasury: -5000, stability: 10 }, playerStatChanges: {}, playerSupportChange: 3 } },
      { text: '見送る', effects: { resourceChanges: {}, playerStatChanges: {}, playerSupportChange: -1 } },
    ],
  },
  {
    id: 'good_harvest',
    type: 'domestic',
    title: '記録的な豊作',
    description: '天候に恵まれ、全国的に記録的な豊作となりました。食料価格が下落し、国民の生活に余裕が生まれています。',
    choices: [
      { text: '市場に介入しない', effects: { resourceChanges: { stability: 3 }, playerStatChanges: {}, playerSupportChange: 2 } },
      { text: '農家に追加支援', effects: { resourceChanges: { treasury: -1000, stability: 5 }, playerStatChanges: {}, playerSupportChange: 3 } },
    ],
  },
  {
    id: 'tech_breakthrough',
    type: 'domestic',
    title: '技術的ブレークスルー',
    description: '国立研究所が画期的な新技術を発見しました。この技術を実用化するには、さらなる投資が必要です。',
    choices: [
      { text: '研究に投資する', effects: { resourceChanges: { treasury: -2000, researchPoints: 200 }, playerStatChanges: {}, playerSupportChange: 1 } },
      { text: '成果を公表する', effects: { resourceChanges: { researchPoints: 50 }, playerStatChanges: {}, playerSupportChange: 0 } },
    ],
  },
    {
    id: 'national_strike',
    type: 'domestic',
    title: '全国的なストライキ',
    description: '労働条件の改善を求め、全国の労働組合が大規模なストライキに突入しました。経済活動が停滞し、社会不安が広がっています。',
    choices: [
      { text: '要求の一部を飲む', effects: { resourceChanges: { treasury: -3000, stability: -5 }, playerStatChanges: {}, playerSupportChange: 1 } },
      { text: '強硬姿勢を貫く', effects: { resourceChanges: { stability: -15 }, playerStatChanges: {}, playerSupportChange: -5 } },
    ],
  },
  {
    id: 'celebrity_scandal',
    type: 'domestic',
    title: '著名人のスキャンダル',
    description: '政府を支持する著名な文化人にスキャンダルが発覚し、メディアが連日報道しています。政府のイメージダウンは避けられません。',
    choices: [
      { text: '静観する', effects: { resourceChanges: { stability: -3 }, playerStatChanges: {}, playerSupportChange: -2 } },
      { text: '関係を否定する', effects: { resourceChanges: { stability: -1 }, playerStatChanges: { politicalPower: -10 }, playerSupportChange: -3 } },
    ],
  },
  {
    id: 'natural_disaster',
    type: 'domestic',
    title: '大規模な自然災害',
    description: '巨大な台風が国土を直撃し、各地で甚大な被害が発生しています。迅速な復旧作業が求められています。',
    choices: [
      { text: '全力で復旧にあたる', effects: { resourceChanges: { treasury: -4000, manpower: -1000, stability: -10 }, playerStatChanges: {}, playerSupportChange: 2 } },
      { text: '国際社会に支援を要請', effects: { resourceChanges: { treasury: -1500, manpower: -1000, stability: -10 }, playerStatChanges: {}, playerSupportChange: 0 } },
    ],
  },
    {
    id: 'education_reform',
    type: 'domestic',
    title: '教育改革の議論',
    description: '時代遅れと批判される現行の教育システムについて、改革を求める声が高まっています。',
    choices: [
      { text: '改革案に着手する', effects: { resourceChanges: { treasury: -1500, researchPoints: 50 }, playerStatChanges: { politicalPower: -10 }, playerSupportChange: 1 } },
      { text: '時期尚早と判断する', effects: { resourceChanges: {}, playerStatChanges: {}, playerSupportChange: -1 } },
    ],
  },
  {
    id: 'energy_crisis',
    type: 'domestic',
    title: 'エネルギー危機',
    description: 'エネルギーの輸入価格が高騰し、国内の電力供給が逼迫しています。産業界からは対策を求める声が上がっています。',
    choices: [
      { text: '国民に節電を要請', effects: { resourceChanges: { stability: -5 }, playerStatChanges: {}, playerSupportChange: -2 } },
      { text: '代替エネルギー開発を促進', effects: { resourceChanges: { treasury: -2500, researchPoints: 80 }, playerStatChanges: {}, playerSupportChange: 1 } },
    ],
  },
  {
    id: 'art_festival',
    type: 'domestic',
    title: '国際芸術祭の開催',
    description: '首都で国際的な芸術祭が開催され、多くの観光客が訪れています。文化振興と経済効果が期待されます。',
    choices: [
      { text: '政府として支援する', effects: { resourceChanges: { treasury: -500, stability: 3 }, playerStatChanges: {}, playerSupportChange: 2 } },
      { text: '民間の活動に任せる', effects: { resourceChanges: { stability: 1 }, playerStatChanges: {}, playerSupportChange: 0 } },
    ],
  },
  {
    id: 'financial_crash',
    type: 'domestic',
    title: '金融市場の暴落',
    description: '株式市場が突如として暴落し、多くの企業や個人投資家が深刻な打撃を受けています。金融不安が広がっています。',
    choices: [
      { text: '緊急の経済対策を実施', effects: { resourceChanges: { treasury: -6000, stability: -10 }, playerStatChanges: {}, playerSupportChange: 1 } },
      { text: '市場の自浄作用に任せる', effects: { resourceChanges: { treasury: -1000, stability: -20 }, playerStatChanges: {}, playerSupportChange: -8 } },
    ],
  },
  {
    id: 'aging_population',
    type: 'domestic',
    title: '高齢化問題',
    description: '社会の高齢化が急速に進行し、社会保障費が増大しています。年金制度の持続可能性が問われています。',
    choices: [
      { text: '社会保障費を増額', effects: { resourceChanges: { treasury: -3500, stability: 2 }, playerStatChanges: {}, playerSupportChange: 2 } },
      { text: '労働人口の確保に注力', effects: { resourceChanges: { manpower: 500 }, playerStatChanges: { politicalPower: -10 }, playerSupportChange: 0 } },
    ],
  },
    {
    id: 'space_exploration',
    type: 'domestic',
    title: '宇宙開発計画',
    description: '我が国の科学技術の粋を集めた宇宙開発計画が、新たな段階を迎えようとしています。',
    choices: [
      { text: '計画を拡大する', effects: { resourceChanges: { treasury: -3000, researchPoints: 150 }, playerStatChanges: {}, playerSupportChange: 2 } },
      { text: '現行規模を維持する', effects: { resourceChanges: { treasury: -500, researchPoints: 30 }, playerStatChanges: {}, playerSupportChange: 0 } },
    ],
  },
  {
    id: 'cyber_attack',
    type: 'domestic',
    title: '大規模サイバー攻撃',
    description: '政府の基幹システムが大規模なサイバー攻撃を受け、一部の行政機能が麻痺しています。',
    choices: [
      { text: 'セキュリティ対策を強化', effects: { resourceChanges: { treasury: -2000, stability: -5, researchPoints: 50 }, playerStatChanges: {}, playerSupportChange: 0 } },
      { text: '犯人グループを特定し報復', effects: { resourceChanges: { stability: -8 }, playerStatChanges: { politicalPower: -15 }, playerSupportChange: -2 } },
    ],
  },
  {
    id: 'historic_discovery',
    type: 'domestic',
    title: '歴史的な遺跡の発見',
    description: '国内で古代文明の巨大な遺跡が発見され、国民の歴史への関心が高まっています。',
    choices: [
      { text: '国家プロジェクトとして保護', effects: { resourceChanges: { treasury: -1000, stability: 4 }, playerStatChanges: {}, playerSupportChange: 2 } },
      { text: '地元の自治体に一任', effects: { resourceChanges: { stability: 1 }, playerStatChanges: {}, playerSupportChange: 0 } },
    ],
  },
  {
    id: 'epidemic_outbreak',
    type: 'domestic',
    title: '感染症の流行',
    description: '未知の感染症が国内で流行の兆しを見せています。医療体制の強化が急務です。',
    choices: [
      { text: '医療機関に予算を重点配分', effects: { resourceChanges: { treasury: -2500, manpower: -500, stability: -5 }, playerStatChanges: {}, playerSupportChange: 1 } },
      { text: '行動制限を要請', effects: { resourceChanges: { manpower: -200, stability: -8 }, playerStatChanges: {}, playerSupportChange: -3 } },
    ],
  },
  {
    id: 'urban_redevelopment',
    type: 'domestic',
    title: '都市再開発計画',
    description: '首都中心部の大規模な再開発計画が持ち上がっています。経済効果は大きいですが、立ち退きを迫られる住民からの反発も予想されます。',
    choices: [
      { text: '計画を承認する', effects: { resourceChanges: { treasury: -4000, stability: -5 }, playerStatChanges: {}, playerSupportChange: 2 } },
      { text: '計画を凍結する', effects: { resourceChanges: { stability: 2 }, playerStatChanges: {}, playerSupportChange: -1 } },
    ],
  },
  {
    id: 'water_shortage',
    type: 'domestic',
    title: '深刻な水不足',
    description: '記録的な小雨により、国内のダム貯水率が過去最低を記録。このままでは大規模な断水が避けられません。',
    choices: [
      { text: '取水制限を実施', effects: { resourceChanges: { stability: -4, manpower: -200 }, playerStatChanges: {}, playerSupportChange: -2 } },
      { text: '海水淡水化プラントを建設', effects: { resourceChanges: { treasury: -3500, researchPoints: 50 }, playerStatChanges: {}, playerSupportChange: 1 } },
    ],
  },
  {
    id: 'youth_unemployment',
    type: 'domestic',
    title: '若者の失業問題',
    description: '若年層の失業率が深刻な水準に達しており、社会問題化しています。',
    choices: [
      { text: '雇用創出企業へ補助金', effects: { resourceChanges: { treasury: -2000, manpower: 200 }, playerStatChanges: {}, playerSupportChange: 2 } },
      { text: '職業訓練プログラムを拡充', effects: { resourceChanges: { treasury: -1000, researchPoints: 80 }, playerStatChanges: {}, playerSupportChange: 1 } },
    ],
  },
  {
    id: 'media_freedom_debate',
    type: 'domestic',
    title: 'メディアの自由を巡る議論',
    description: '一部メディアの過激な報道が問題視され、政府による規制を求める声と、報道の自由を擁護する声が対立しています。',
    choices: [
      { text: '報道の自由を尊重', effects: { resourceChanges: { stability: -3 }, playerStatChanges: {}, playerSupportChange: 0 } },
      { text: '一定の規制を導入', effects: { resourceChanges: { stability: 3 }, playerStatChanges: { politicalPower: -10 }, playerSupportChange: 0 } },
    ],
  },
  {
    id: 'major_company_bankruptcy',
    type: 'domestic',
    title: '大企業の経営危機',
    description: '国内有数の大企業が経営不振に陥り、倒産の危機に瀕しています。救済しなければ、多くの失業者が生まれます。',
    choices: [
      { text: '公的資金で救済する', effects: { resourceChanges: { treasury: -7000, manpower: 1000, stability: -5 }, playerStatChanges: {}, playerSupportChange: 0 } },
      { text: '市場の淘汰に任せる', effects: { resourceChanges: { treasury: 0, manpower: -1500, stability: -15 }, playerStatChanges: {}, playerSupportChange: 0 } },
    ],
  },
  // New (20)
  {
    id: 'corporate_merger_review',
    type: 'domestic',
    title: '巨大企業合併の承認',
    description: '国内の主要企業2社が合併を申請しています。承認すれば国際競争力は高まりますが、市場の独占が懸念されます。',
    choices: [
      { text: '合併を承認する', effects: { resourceChanges: { treasury: 1000, stability: -4 }, playerStatChanges: {}, playerSupportChange: 1 } },
      { text: '独占禁止法に基づき却下', effects: { resourceChanges: { stability: 2 }, playerStatChanges: {}, playerSupportChange: -1 } },
    ],
  },
  {
    id: 'food_safety_scandal',
    type: 'domestic',
    title: '食品偽装スキャンダル',
    description: '大手食品メーカーによる大規模な食品偽装が発覚し、国民に食への不信感が広がっています。',
    choices: [
      { text: '厳罰化と規制強化を発表', effects: { resourceChanges: { stability: -2 }, playerStatChanges: { politicalPower: -10 }, playerSupportChange: 1 } },
      { text: '企業の自主的な改善を待つ', effects: { resourceChanges: { stability: -8 }, playerStatChanges: {}, playerSupportChange: -4 } },
    ],
  },
  {
    id: 'housing_bubble',
    type: 'domestic',
    title: '不動産バブル懸念',
    description: '主要都市の不動産価格が異常な高騰を続けています。このままではバブルが崩壊し、経済に深刻な打撃を与える恐れがあります。',
    choices: [
      { text: '金融引き締めを行う', effects: { resourceChanges: { treasury: -500, stability: -5 }, playerStatChanges: {}, playerSupportChange: -2 } },
      { text: '市場の動向を注視する', effects: { resourceChanges: { stability: -2 }, playerStatChanges: {}, playerSupportChange: 0 } },
    ],
  },
  {
    id: 'university_protests',
    type: 'domestic',
    title: '大学での抗議活動',
    description: '学費の値上げに反対する学生たちが、全国の大学で大規模な抗議活動を展開しています。',
    choices: [
      { text: '学生側と対話する', effects: { resourceChanges: { stability: 1 }, playerStatChanges: { politicalPower: -5 }, playerSupportChange: 1 } },
      { text: '大学側の決定を支持', effects: { resourceChanges: { stability: -4 }, playerStatChanges: {}, playerSupportChange: -2 } },
    ],
  },
  {
    id: 'clean_energy_breakthrough',
    type: 'domestic',
    title: 'クリーンエネルギーの躍進',
    description: '国内企業が、極めて効率的なクリーンエネルギー技術の開発に成功しました。普及には大規模なインフラ投資が必要です。',
    choices: [
      { text: '国家プロジェクトとして推進', effects: { resourceChanges: { treasury: -4000, researchPoints: 100, stability: 5 }, playerStatChanges: {}, playerSupportChange: 3 } },
      { text: '民間投資に期待する', effects: { resourceChanges: { researchPoints: 20 }, playerStatChanges: {}, playerSupportChange: 1 } },
    ],
  },
  {
    id: 'organized_crime_crackdown',
    type: 'domestic',
    title: '犯罪組織の一斉摘発',
    description: '警察が大規模な作戦を実行し、国内最大の犯罪組織の幹部を一斉に逮捕しました。市民からは喝采が上がっています。',
    choices: [
      { text: '警察の功績を称える', effects: { resourceChanges: { stability: 8 }, playerStatChanges: {}, playerSupportChange: 4 } },
      { text: '（特に何もしない）', effects: { resourceChanges: { stability: 3 }, playerStatChanges: {}, playerSupportChange: 1 } },
    ],
  },
  {
    id: 'bridge_collapse',
    type: 'domestic',
    title: 'インフラ老朽化の悲劇',
    description: '地方都市で老朽化した橋が崩落し、多数の死傷者が出ました。国内のインフラの脆弱性が露呈しました。',
    choices: [
      { text: '全国的なインフラ点検を約束', effects: { resourceChanges: { treasury: -3000, stability: -8 }, playerStatChanges: {}, playerSupportChange: -2 } },
      { text: 'これは稀な事故だと説明', effects: { resourceChanges: { stability: -15 }, playerStatChanges: {}, playerSupportChange: -7 } },
    ],
  },
  {
    id: 'rural_depopulation',
    type: 'domestic',
    title: '地方の過疎化',
    description: '地方の人口流出が止まらず、多くの集落が消滅の危機に瀕しています。抜本的な対策が求められています。',
    choices: [
      { text: '地方への移住を奨励', effects: { resourceChanges: { treasury: -2500, manpower: 100 }, playerStatChanges: {}, playerSupportChange: 1 } },
      { text: '都市部への集約を推進', effects: { resourceChanges: { treasury: 500, stability: -4 }, playerStatChanges: {}, playerSupportChange: -1 } },
    ],
  },
  {
    id: 'record_heatwave',
    type: 'domestic',
    title: '記録的な猛暑',
    description: '観測史上最も暑い夏が到来し、熱中症による被害が拡大しています。電力需要も過去最高を記録しています。',
    choices: [
      { text: '緊急の熱中症対策を実施', effects: { resourceChanges: { treasury: -1000, manpower: -300, stability: -5 }, playerStatChanges: {}, playerSupportChange: 0 } },
      { text: '気候変動対策をアピール', effects: { resourceChanges: { stability: -2 }, playerStatChanges: { politicalPower: -5 }, playerSupportChange: 1 } },
    ],
  },
  {
    id: 'pension_system_crisis',
    type: 'domestic',
    title: '年金制度の危機',
    description: '年金財政の悪化が深刻化し、このままでは制度が破綻するとの試算が発表されました。国民に大きな不安が広がっています。',
    choices: [
      { text: '保険料の引き上げを検討', effects: { resourceChanges: { treasury: 2000, stability: -8 }, playerStatChanges: {}, playerSupportChange: -5 } },
      { text: '給付額の削減に着手', effects: { resourceChanges: { treasury: 3000, stability: -10 }, playerStatChanges: {}, playerSupportChange: -6 } },
    ],
  },
  {
    id: 'major_court_ruling',
    type: 'domestic',
    title: '最高裁の重要判決',
    description: '国の根幹に関わる重要な裁判で、政府の方針に反する判決が最高裁判所によって下されました。',
    choices: [
      { text: '司法の判断を尊重する', effects: { resourceChanges: { stability: 3 }, playerStatChanges: { politicalPower: -10 }, playerSupportChange: 1 } },
      { text: '判決を批判し、法改正を示唆', effects: { resourceChanges: { stability: -5 }, playerStatChanges: {}, playerSupportChange: -2 } },
    ],
  },
  {
    id: 'rare_earth_shortage',
    type: 'domestic',
    title: '重要資源の不足',
    description: 'ハイテク産業に不可欠なレアアースの輸入が滞り、国内の生産活動に大きな支障が出ています。',
    choices: [
      { text: '代替技術の開発を支援', effects: { resourceChanges: { treasury: -2000, researchPoints: 120 }, playerStatChanges: {}, playerSupportChange: 1 } },
      { text: '外交交渉で供給再開を目指す', effects: { resourceChanges: { stability: -3 }, playerStatChanges: { politicalPower: -15 }, playerSupportChange: 0 } },
    ],
  },
  {
    id: 'cult_growth',
    type: 'domestic',
    title: 'カルト教団の台頭',
    description: '社会不安を背景に、過激な教義を掲げるカルト教団が信者を増やし、問題行動を起こしています。',
    choices: [
      { text: '法的な監視を強化する', effects: { resourceChanges: { stability: 2 }, playerStatChanges: {}, playerSupportChange: 1 } },
      { text: '信教の自由を尊重し静観', effects: { resourceChanges: { stability: -6 }, playerStatChanges: {}, playerSupportChange: -3 } },
    ],
  },
  {
    id: 'mineral_deposit_discovery',
    type: 'domestic',
    title: '巨大鉱物資源の発見',
    description: '国内で、これまで産出されなかった貴重な鉱物資源の巨大な鉱床が発見されました。',
    choices: [
      { text: '国家管理で開発を進める', effects: { resourceChanges: { treasury: 5000, stability: 5 }, playerStatChanges: {}, playerSupportChange: 3 } },
      { text: '環境への影響を調査', effects: { resourceChanges: { researchPoints: 30 }, playerStatChanges: {}, playerSupportChange: 1 } },
    ],
  },
  {
    id: 'agency_scandal',
    type: 'domestic',
    title: '政府機関の不祥事',
    description: '重要な政府機関で、巨額の公金横領事件が発覚しました。政府の監督責任が問われています。',
    choices: [
      { text: 'トップを更迭し、綱紀粛正を図る', effects: { resourceChanges: { stability: -2 }, playerStatChanges: {}, playerSupportChange: -1 } },
      { text: '組織を擁護し、調査を約束', effects: { resourceChanges: { stability: -7 }, playerStatChanges: {}, playerSupportChange: -4 } },
    ],
  },
  {
    id: 'historical_monument_debate',
    type: 'domestic',
    title: '歴史的建造物を巡る論争',
    description: 'ある歴史的な建造物の扱いを巡り、保存を訴える市民団体と、再開発を主張する経済団体が激しく対立しています。',
    choices: [
        { text: '文化遺産として保存', effects: { resourceChanges: { treasury: -1500, stability: 3 }, playerStatChanges: {}, playerSupportChange: 1 } },
        { text: '再開発を許可する', effects: { resourceChanges: { treasury: 2000, stability: -3 }, playerStatChanges: {}, playerSupportChange: -1 } },
    ],
  },
];

export const internationalEvents: GameEvent[] = [
    {
        id: 'border_dispute',
        type: 'international',
        title: '国境紛争',
        description: '隣国が、我が国の領土の領有権を主張し始めました。緊張が高まっています。',
        choices: [
            { text: '外交交渉で解決を図る', effects: { resourceChanges: { stability: -2 }, playerStatChanges: { politicalPower: -10 }, playerSupportChange: 0 } },
            { text: '軍を派遣して威嚇する', effects: { resourceChanges: { militaryPower: -50, stability: -5 }, playerStatChanges: {}, playerSupportChange: 2 } },
        ],
    },
    {
        id: 'trade_deal',
        type: 'international',
        title: '貿易協定の提案',
        description: '大国から、有利な貿易協定の締結が提案されました。国内産業への影響も考慮する必要があります。',
        choices: [
            { text: '協定を締結する', effects: { resourceChanges: { treasury: 2000, stability: 3 }, factionHappinessChanges: { '資本家': 5, '労働者': -3 }, playerStatChanges: {}, playerSupportChange: 2 } },
            { text: '国内産業を保護するため拒否', effects: { resourceChanges: {}, playerStatChanges: {}, playerSupportChange: -1 } },
        ],
    },
    {
        id: 'refugee_crisis',
        type: 'international',
        title: '難民危機',
        description: '隣国で内戦が勃発し、多くの難民が国境に押し寄せています。人道的な対応が求められています。',
        choices: [
            { text: '難民を受け入れる', effects: { resourceChanges: { treasury: -2000, manpower: 500, stability: -10 }, playerStatChanges: {}, playerSupportChange: -3 } },
            { text: '国境を封鎖する', effects: { resourceChanges: { stability: 5 }, playerStatChanges: {}, playerSupportChange: 1 } },
        ],
    },
];

export const protestEvent: GameEvent = {
    id: 'protest_rally',
    type: 'protest',
    title: '反政府デモ',
    description: '政府の政策に不満を持つ市民が、大規模な抗議デモを行っています。支持率が低迷しており、国民の不満が高まっています。',
    choices: [
        { text: '市民との対話を試みる', effects: { resourceChanges: { stability: -2 }, playerStatChanges: { politicalPower: -10 }, playerSupportChange: 1 } },
        { text: 'デモを強制的に解散させる', effects: { resourceChanges: { stability: -8 }, playerStatChanges: {}, playerSupportChange: -5 } },
        { text: '要求を無視する', effects: { resourceChanges: { stability: -5 }, playerStatChanges: {}, playerSupportChange: -3 } },
    ],
};

export const corruptionProtestEvent: GameEvent = {
  id: 'corruption_protest',
  type: 'protest',
  title: '汚職への抗議',
  description: '政府高官の汚職疑惑が報じられ、国民の怒りが爆発。大規模な抗議デモに発展しています。',
  choices: [
    { text: '疑惑を徹底的に調査すると約束', effects: { resourceChanges: { stability: -3, corruption: -5 }, playerStatChanges: { politicalPower: -15 }, playerSupportChange: 1 } },
    { text: 'これは野党の陰謀だと主張', effects: { resourceChanges: { stability: -7, corruption: 2 }, playerStatChanges: {}, playerSupportChange: -4 } },
  ],
};

export const scandalEvent: GameEvent = {
  id: 'donation_scandal',
  type: 'domestic',
  title: '献金スキャンダル',
  description: 'あなたの党への不透明な企業献金が明るみに出ました。野党とメディアは激しく追及しています。',
  choices: [
    { text: '秘書の責任にして辞任させる', effects: { resourceChanges: { stability: -5 }, playerStatChanges: { politicalPower: -20 }, playerSupportChange: -5 } },
    { text: '法的に問題はないと強弁する', effects: { resourceChanges: { stability: -8 }, playerStatChanges: {}, playerSupportChange: -8 } },
  ],
};

export const coupEvent: GameEvent = {
  id: 'coup_attempt',
  type: 'domestic',
  title: 'クーデターの勃発',
  description: '軍部が政府に反旗を翻し、首都の中枢を占拠しました。彼らは軍事政権の樹立を要求しています。',
  choices: [
    { text: '要求を受け入れ、軍事政権を樹立', effects: { resourceChanges: { stability: -20, militaryPower: 500 }, playerStatChanges: {}, playerSupportChange: -20 } },
    { text: '徹底抗戦を表明する', effects: { resourceChanges: {}, playerStatChanges: {}, playerSupportChange: 0 } },
  ],
};

export const warEvent: GameEvent = {
    id: 'border_war',
    type: 'international',
    title: '国境紛争',
    description: '隣国との間で領土を巡る緊張が高まり、国境で武力衝突が発生しました。全面戦争の危機が迫っています。',
    choices: [
        { text: '断固として戦う', effects: { resourceChanges: {}, playerStatChanges: {}, playerSupportChange: 5 } },
        { text: '外交交渉で解決を目指す', effects: { resourceChanges: { stability: -5 }, playerStatChanges: { politicalPower: -20 }, playerSupportChange: -3 } },
    ],
};
