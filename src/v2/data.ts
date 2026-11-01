import type { Author, Post, Prefs } from './types';

// Bairros que aparecem nas escolhas. CONFIRA e ajuste para os bairros reais de Sobradinho-BA.
export const HOODS = ['Centro', 'Vila São Joaquim', 'Vila São Francisco', 'Santana', 'Portelinha', 'Beira do Lago', 'Zona rural'];

// Contas da casa: postam conteúdo útil todo dia e são identificadas como Equipe.
export const HOUSE: Author[] = [
  { id: 'h-oficial', name: 'Sobradinho Online', handle: 'sobradinho.online', house: true, verified: true, color: '#2563EB', bio: 'A cidade num lugar só. Conta oficial da equipe.' },
  { id: 'h-agenda', name: 'Agenda Sobradinho', handle: 'agenda', house: true, color: '#EA580C', bio: 'Festa, forró, culto, feira, jogo. Tudo que vai rolar.' },
  { id: 'h-utilidade', name: 'Utilidade Pública', handle: 'utilidade', house: true, color: '#0F766E', bio: 'Telefones, plantão, avisos de água e luz.' },
  { id: 'h-barragem', name: 'Olhar da Barragem', handle: 'olhardabarragem', house: true, color: '#0369A1', bio: 'As fotos mais bonitas da cidade, mandadas por vocês.' },
  { id: 'h-achados', name: 'Achados e Perdidos', handle: 'achados', house: true, color: '#7C3AED', bio: 'Perdeu? Achou? Posta aqui com foto e bairro.' },
  { id: 'h-vagas', name: 'Vagas e Bicos', handle: 'vagas', house: true, color: '#16A34A', bio: 'Trabalho daqui pra gente daqui. Publicar é grátis.' },
];

const H = 3600_000;

export function seedPosts(now: number): Post[] {
  const base = () => ({ reactions: {}, comments: [], shares: 0, myReaction: null });
  return [
    {
      ...base(), id: 's-boasvindas', authorId: 'h-oficial', at: now - 0.2 * H, kind: 'post', pinned: true, photoSlot: 'cidade',
      text: 'Chegou o app da nossa cidade. Aqui você vê o que tá rolando, acha quem resolve, vende, compra e vota no que Sobradinho precisa.\n\nOs 100 primeiros cadastrados viram Fundadores, e o número fica pra sempre no perfil.',
      quickReplies: ['Cheguei! 🙌', 'Bora encher isso aqui', 'Sou do Centro 📍'],
    },
    {
      ...base(), id: 's-forro', authorId: 'h-agenda', at: now - 1.5 * H, kind: 'event',
      text: '22º Forró do Vaqueiro: 13, 14 e 15 de novembro. Prepara a bota! Toque em "Eu vou" e chame sua turma.',
      quickReplies: ['Eu vou! 🤠', 'Quem vai comigo?', 'Já tô ensaiando o xote'],
    },
    {
      ...base(), id: 's-foto', authorId: 'h-barragem', at: now - 3 * H, kind: 'post', photoSlot: 'barragem',
      text: 'Desafio da semana: mande sua melhor foto da barragem ou do lago. A mais curtida vira a capa do app por 7 dias, com seu nome.',
      quickReplies: ['Vou mandar a minha 📸', 'Pôr do sol daqui é outro nível'],
    },
    {
      ...base(), id: 's-telefones', authorId: 'h-utilidade', at: now - 5 * H, kind: 'post',
      text: 'Guarde estes números:\n🚑 SAMU 192\n🚓 Polícia Militar 190\n🚒 Bombeiros 193\n\nFalta algum número da cidade? Comente aqui que a gente confere e fixa na aba Cidade.',
      quickReplies: ['Salvei ✅', 'Falta o do hospital'],
    },
    {
      ...base(), id: 's-vagas', authorId: 'h-vagas', at: now - 8 * H, kind: 'post', photoSlot: 'trabalho',
      text: 'Tem vaga no seu comércio ou faz bico (pedreiro, diarista, manicure, frete)? Publique de graça em Cidade > Serviços. Quem contrata aqui é vizinho.',
      quickReplies: ['Faço frete 🚚', 'Tô procurando trabalho'],
    },
    {
      ...base(), id: 's-achados', authorId: 'h-achados', at: now - 20 * H, kind: 'post', photoSlot: 'achados',
      text: 'Perdeu documento, chave, bicho de estimação? Achou alguma coisa? Poste aqui com foto e bairro. Cidade pequena resolve rápido quando todo mundo vê.',
      quickReplies: ['Boa iniciativa 👏'],
    },
    {
      ...base(), id: 's-bairros', authorId: 'h-oficial', at: now - 26 * H, kind: 'poll',
      text: 'Guerra dos bairros: qual bairro vai chamar mais gente pro app essa semana?',
      poll: { question: 'Qual bairro chama mais gente?', unlockAt: 50, options: HOODS.slice(0, 4).map((h, i) => ({ id: `b${i}`, text: h, votes: 0 })) },
    },
  ];
}

// Pergunta do dia: 1 toque, sem precisar postar nada. Ideal para quem é tímido.
// Mistura de "Treta do dia" (opinião forte, gera debate e compartilhamento) com consulta popular (dado pra prefeitura).
// Regra: polêmica sobre gosto e cidade, nunca sobre pessoa, religião, cor ou partido.
export const DAILY_QUESTIONS: { q: string; options: string[]; kicker: string }[] = [
  { kicker: 'Treta do dia', q: 'O pôr do sol de Sobradinho é o mais bonito do Velho Chico. Petrolina e Juazeiro que lutem.', options: ['Concordo demais', 'Petrolina ganha', 'Juazeiro ganha', 'Empate técnico'] },
  { kicker: 'Consulta popular', q: 'O que mais falta em Sobradinho hoje?', options: ['Lazer pra juventude', 'Emprego', 'Saúde', 'Evento todo mês'] },
  { kicker: 'Treta do dia', q: 'Espetinho sem farofa não é espetinho.', options: ['Verdade absoluta', 'Farofa é opcional', 'Vinagrete é que manda', 'Nem como espetinho'] },
  { kicker: 'Forró do Vaqueiro', q: 'O FDV26 vai ser o melhor de todos os tempos?', options: ['Vai ser histórico', 'Igual aos outros', 'Os antigos eram melhores', 'Nunca fui, vou estrear'] },
  { kicker: 'Treta do dia', q: 'Quem nunca tomou banho no lago não é sobradinhense de verdade.', options: ['Verdade', 'Exagero', 'Tenho medo do lago', 'Prefiro piscina'] },
  { kicker: 'Consulta popular', q: 'Se a cidade ganhasse uma coisa amanhã, qual seria?', options: ['Cinema', 'Praça nova', 'Wi-fi grátis na praça', 'Feira cultural'] },
  { kicker: 'Treta do dia', q: 'Pior coisa de Sobradinho: o calor, a falta de lazer ou a fofoca?', options: ['O calor', 'Falta de lazer', 'A fofoca', 'Nada, aqui é perfeito'] },
  { kicker: 'Treta do dia', q: 'Domingo sem churrasco não é domingo.', options: ['Verdade', 'Depende do bolso', 'Domingo é de descansar', 'Prefiro peixe do lago'] },
  { kicker: 'Treta do dia', q: 'Paredão, vaquejada ou pé de serra: o que mais anima Sobradinho?', options: ['Paredão', 'Vaquejada', 'Forró pé de serra', 'Tudo junto'] },
  { kicker: 'Consulta popular', q: 'Como você fica sabendo do que acontece na cidade?', options: ['Grupo de WhatsApp', 'Instagram', 'Rádio', 'Boca a boca'] },
];
export const DAILY_UNLOCK_AT = 30;

export function todayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}
export function dailyFor(key: string) {
  const days = Math.floor(new Date(key).getTime() / 86_400_000);
  return DAILY_QUESTIONS[days % DAILY_QUESTIONS.length];
}

export const UTILITY: { group: string; items: { label: string; phone?: string; note?: string }[] }[] = [
  { group: 'Emergência', items: [
    { label: 'SAMU', phone: '192' },
    { label: 'Polícia Militar', phone: '190' },
    { label: 'Bombeiros', phone: '193' },
    { label: 'Disque Denúncia (Direitos Humanos)', phone: '100' },
    { label: 'Central de Atendimento à Mulher', phone: '180' },
  ] },
  { group: 'Da cidade (a confirmar)', items: [
    { label: 'Hospital / UPA', note: 'Número a confirmar pela equipe' },
    { label: 'Prefeitura', note: 'Número a confirmar pela equipe' },
    { label: 'Água e esgoto', note: 'Número a confirmar pela equipe' },
    { label: 'Energia (Coelba)', note: 'Número a confirmar pela equipe' },
  ] },
];

export const SERVICE_CATEGORIES = ['Reformas', 'Elétrica', 'Faxina', 'Frete', 'Beleza', 'Aulas', 'Comida', 'Outros'];
export const CLASSIFIED_CATEGORIES = ['Desapego', 'Celular e eletrônicos', 'Casa', 'Veículos', 'Imóveis', 'Moda', 'Outros'];

export const DEFAULT_PREFS: Prefs = {
  notifComments: true, notifReactions: true, notifCity: true, notifEvents: true,
  privateWhatsapp: false, showHood: true, haptics: true, sounds: true, reduceMotion: false, dataSaver: false,
};
