export const REACTIONS = ['❤️', '🔥', '😂', '👏', '😮', '😢'] as const;
export type Reaction = (typeof REACTIONS)[number];

export interface Author {
  id: string;
  name: string;
  handle: string;
  avatar?: string; // data URL, /img/... or undefined (iniciais)
  hood?: string;
  bio?: string;
  house?: boolean; // conta da equipe
  verified?: boolean;
  color: string; // cor de fundo do avatar com iniciais
}

export interface Comment {
  id: string;
  authorId: string;
  text: string;
  at: number;
  likes: number;
  liked?: boolean;
  replies: Comment[];
}

export interface PollData {
  question: string;
  options: { id: string; text: string; votes: number }[];
  myVote?: string;
  unlockAt: number; // resultado da cidade aparece com X votos
}

export interface Post {
  id: string;
  authorId: string;
  at: number;
  text: string;
  photo?: string; // data URL ou /img/...
  photoSlot?: string; // nome da imagem esperada em public/img (prompts)
  kind: 'post' | 'poll' | 'event';
  poll?: PollData;
  hood?: string;
  pinned?: boolean;
  reactions: Partial<Record<Reaction, number>>;
  myReaction?: Reaction | null;
  comments: Comment[];
  quickReplies?: string[];
  saved?: boolean;
  shares: number;
}

export interface Notif {
  id: string;
  at: number;
  icon: 'system' | 'comment' | 'reaction' | 'invite' | 'event' | 'badge';
  text: string;
  read: boolean;
  go?: Route;
}

export interface Me {
  id: 'me';
  name: string;
  handle: string;
  bio: string;
  hood: string;
  avatar?: string;
  cover?: string;
  whatsapp: string;
  link: string;
  joinedAt: number;
}

export interface Listing {
  id: string;
  kind: 'classificado' | 'servico';
  title: string;
  price: string;
  category: string;
  description: string;
  photo?: string;
  hood: string;
  whatsapp: string;
  authorId: string;
  at: number;
}

export interface Prefs {
  notifComments: boolean;
  notifReactions: boolean;
  notifCity: boolean;
  notifEvents: boolean;
  privateWhatsapp: boolean;
  showHood: boolean;
  haptics: boolean;
  sounds: boolean;
  reduceMotion: boolean;
  dataSaver: boolean;
}

export interface State {
  version: number;
  me: Me;
  posts: Post[];
  listings: Listing[];
  notifs: Notif[];
  following: string[];
  blocked: string[];
  muted: string[];
  reports: { postId: string; reason: string; at: number }[];
  daily: Record<string, string>; // data -> opção votada
  prefs: Prefs;
  onboarded: boolean;
}

export type Route =
  | { s: 'post'; id: string; focus?: boolean }
  | { s: 'notifs' }
  | { s: 'settings' }
  | { s: 'settings-section'; id: 'conta' | 'notificacoes' | 'privacidade' | 'bloqueados' | 'aparencia' | 'ajuda' | 'sobre' | 'termos' | 'politica' | 'excluir' }
  | { s: 'edit' }
  | { s: 'user'; id: string }
  | { s: 'city'; id: 'servicos' | 'classificados' | 'agenda' | 'utilidade' | 'consulta' }
  | { s: 'search' }
  | { s: 'event' };

export type Tab = 'inicio' | 'cidade' | 'pessoas' | 'perfil';
