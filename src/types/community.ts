export type MainTab = 'feed' | 'servicos' | 'classificados' | 'perfil' | 'jornal' | 'inicio' | 'resolve' | 'participa' | 'gente';

export type FeedSubTab = 'para_voce' | 'jornal' | 'que_rolou';

export type PostFilter = 'todos' | 'foto_video' | 'mais_recentes' | 'perto_de_mim' | 'em_alta';

export type ClassifiedCategory = 'todos' | 'desapego' | 'imoveis' | 'veiculos' | 'servicos' | 'empregos';

export interface ClassifiedItem {
  id: string;
  title: string;
  price: string;
  category: 'desapego' | 'imoveis' | 'veiculos' | 'servicos' | 'empregos';
  description: string;
  imageUrl: string;
  neighborhood: string;
  sellerName: string;
  sellerWhatsApp: string;
  timeAgo: string;
  status: 'disponivel' | 'reservado' | 'vendido';
  featured?: boolean;
}

export interface FeedPost {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar?: string;
  neighborhood: string;
  timeAgo: string;
  title?: string;
  content: string;
  imageUrl?: string;
  imageAlt?: string;
  likesCount: number;
  commentsCount: number;
  comments: {
    id: string;
    author: string;
    content: string;
    timeAgo: string;
  }[];
  isLiked?: boolean;
  isSaved?: boolean;
  category?: string;
}

export interface RecapItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'destaque' | 'vitoria' | 'viral' | 'evento';
  imageUrl: string;
  imageAlt?: string;
  neighborhood: string;
  dateStr: string;
  reactions: {
    fire: number;
    applause: number;
    heart: number;
  };
  userReaction?: 'fire' | 'applause' | 'heart' | null;
}

export interface CitizenRankItem {
  id: string;
  rank: number;
  name: string;
  handle: string;
  neighborhood: string;
  avatarUrl?: string;
  points: number;
  badge: string;
  level: number;
  contributionsCount: number;
  isCurrentUser?: boolean;
}

export interface UserConfig {
  name: string;
  handle: string;
  neighborhood: string;
  bio: string;
  whatsapp: string;
  notifyAlerts: boolean;
  notifyNeighborhood: boolean;
  notifyPolls: boolean;
  showWhatsappPublic: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  providerName: string;
  providerHandle: string;
  neighborhood: string;
  category: string; // 'reformas' | 'eletrica' | 'faxina' | 'consertos' | 'beleza' | 'aulas' | 'outros'
  priceTag?: string;
  contactNumber: string;
  photos?: string[];
  badges?: string[];
  verified?: boolean;
}

export interface PersonProfile {
  id: string;
  name: string;
  handle: string;
  neighborhood: string;
  talents: string;
  bio: string;
  avatarUrl?: string;
  badge?: string;
  isNeighbor?: boolean;
  contactWhatsApp?: string;
}

export interface PollQuestion {
  id: string;
  kicker: string;
  question: string;
  context: string;
  totalVotes: number;
  options: {
    id: string;
    text: string;
    votes: number;
  }[];
  userVotedOptionId?: string | null;
}

export interface NewspaperData {
  editionNumber: string;
  dateStr: string;
  headline: string;
  coverImageUrl: string;
  coverImageCaption: string;
  lead: string;
  bodyParagraphs: string[];
  sideStories: {
    id: string;
    kicker: string;
    headline: string;
    lead: string;
  }[];
}
