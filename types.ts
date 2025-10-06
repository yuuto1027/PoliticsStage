
export enum GameStatus {
  Playing = 'Playing',
  Election = 'Election',
  CivilWar = 'CivilWar',
  War = 'War',
}

export type BudgetItem = 'low' | 'normal' | 'high';

export interface Budget {
  tax: BudgetItem;
  education: BudgetItem;
  welfare: BudgetItem;
  defense: BudgetItem;
}

export type FactionName = '富裕層' | '中間層' | '貧困層' | '資本家' | '労働者';

export interface Faction {
  name: FactionName;
  happiness: number;
  populationShare: number;
}

export interface Country {
  name: string;
  flag: string | null;
  treasury: number;
  factions: Faction[];
  manpower: number;
  researchPoints: number;
  militaryPower: number;
  corruption: number;
  stability: number;
}

export interface Party {
  partyName: string;
  ideology: string;
  isPlayer?: boolean;
  seats: number;
  support: number;
  relation: number;
}

export interface Player {
  // Currently seems to be an empty object
}

export interface PlayerStats {
  partyFunds: number;
  politicalPower: number;
}

export interface PartyEffect {
  targetPartyName: string;
  action: 'dissolve' | 'confiscate_seats' | 'grant_seats';
  value?: number;
}

export interface LawEffect {
  resourceChanges: {
    treasury: number;
    stability: number;
    manpower: number;
    researchPoints: number;
    militaryPower: number;
  };
  factionHappinessChanges: Record<FactionName, number>;
  effects: {
    buff: string[];
    debuff: string[];
  };
  politicalSystemChange?: string;
  partyEffects?: PartyEffect[];
}

export interface BillToVoteOn {
  proposerPartyName: string;
  lawName: string;
  lawDescription: string;
  lawEffect: LawEffect;
}

type CountryResourceKey = keyof Omit<Country, 'factions' | 'flag' | 'name'>;

export interface GameEventChoice {
  text: string;
  effects: {
    resourceChanges: Partial<Record<CountryResourceKey, number>>;
    playerStatChanges: Partial<PlayerStats>;
    factionHappinessChanges?: Partial<Record<FactionName, number>>;
    playerSupportChange: number;
  };
}

export interface GameEvent {
  id: string;
  type: 'domestic' | 'international' | 'protest';
  title: string;
  description: string;
  choices: GameEventChoice[];
}

export interface NewsArticle {
  outletName: string;
  politicalLeaning: 'conservative' | 'liberal' | 'neutral';
  headline: string;
  body: string;
}

export interface PartyVote {
  partyName: string;
  vote: 'approve' | 'oppose';
  seats: number;
}

export interface VoteResult {
  isPassed: boolean;
  lawName: string;
  approveVotes: number;
  opposeVotes: number;
  partyVotes: PartyVote[];
  lawEffect: LawEffect;
  proposerPartyName: string;
}

export type MinisterPosition = '財務大臣' | '国防大臣' | '外務大臣' | '内務大臣' | '科学技術大臣';

type MinisterEffectResourceChanges = Partial<Record<'treasury' | 'stability' | 'manpower' | 'researchPoints' | 'militaryPower', number>>;
type MinisterEffectCountryModifiers = Partial<Record<'corruption', number>>;

export interface Minister {
    id: string;
    firstName: string;
    lastName: string;
    position: MinisterPosition;
    ideology: string;
    buffs: string[];
    debuffs: string[];
    effects: {
        resourceChanges: MinisterEffectResourceChanges;
        countryModifiers: MinisterEffectCountryModifiers;
        factionHappinessChanges: Partial<Record<FactionName, number>>;
    };
}

export interface GameState {
  status: GameStatus;
  turn: number;
  player: Player;
  country: Country;
  playerStats: PlayerStats;
  parties: Party[];
  logs: string[];
  newsArticles: NewsArticle[];
  billToVoteOn: BillToVoteOn | null;
  activeEvent: GameEvent | null;
  playerStatus: 'ruling' | 'opposition';
  civilWarState: {
    rebelStrength: number;
    warProgress: number;
    rebelSupplyDebuffTurns: number;
  } | null;
  warState: {
    enemyStrength: number;
    warProgress: number;
    enemySupplyDebuffTurns: number;
  } | null;
  budget: Budget;
  militaryFrustration: number;
  electionState: {
    campaignTurn: number;
    playerBuffs?: { counterArgumentTurns: number }
  } | null;
  voteResult: VoteResult | null;
  diplomaticPacts: { partyName: string; turnsRemaining: number }[];
  playerCoalition: string[];
  oppositionCoalitions: { name: string; members: string[] }[];
  ministers: Minister[];
}
