export type TabCategory = 'indices' | 'futures' | 'forex' | 'bonds' | 'crypto';

export type MainView = 'markets' | 'news' | 'ideas' | 'profile';

export type DisplayMode = 'table' | 'cards';

export interface SparklinePoint {
  time: string;
  value: number;
}

export interface MarketItem {
  id: string;
  symbol: string;
  name: string;
  subName?: string;
  category: TabCategory;
  region: 'us' | 'world' | 'asia' | 'europe';
  badgeNumber?: string;
  badgeBg?: string;
  badgeColor?: string;
  iconType?: 'badge' | 'custom' | 'flag' | 'apple' | 'nvidia';
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap?: string;
  currency: string;
  high24h: number;
  low24h: number;
  openPrice: number;
  prevClose: number;
  week52High: number;
  week52Low: number;
  peRatio?: string;
  dividendYield?: string;
  trend: 'up' | 'down';
  sparkline: number[];
  chartData: {
    '1D': SparklinePoint[];
    '5D': SparklinePoint[];
    '1M': SparklinePoint[];
    '6M': SparklinePoint[];
    '1Y': SparklinePoint[];
    'ALL': SparklinePoint[];
  };
  sentiment: 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';
  description: string;
  sector?: string;
}

export interface MarketSummaryStats {
  globalMarketCap: string;
  globalMarketCapChange: string;
  volume24h: string;
  volume24hChange: string;
  activeMarkets: string;
  vixIndex: number;
  vixChange: number;
  fearGreedIndex: number;
  fearGreedLabel: string;
}

export interface TopMover {
  symbol: string;
  name: string;
  changePercent: number;
  price: number;
  type: 'gainer' | 'loser';
}

export interface MarketNewsItem {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  category: string;
  summary: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  readTime: string;
  url?: string;
  relatedSymbols: string[];
}

export interface TradeIdea {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  timeAgo: string;
  symbol: string;
  bias: 'Long' | 'Short' | 'Neutral';
  timeframe: string;
  summary: string;
  chartDescription: string;
  likes: number;
  comments: number;
  tags: string[];
}

export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'above' | 'below';
  isActive: boolean;
  createdAt: string;
}
