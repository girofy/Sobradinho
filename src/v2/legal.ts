// RASCUNHO para revisão de um advogado antes de publicar na loja.
// Troque os campos entre colchetes. Base: LGPD (Lei 13.709/2018), arts. 9 e 18.
export const LEGAL = {
  responsavel: '[NOME COMPLETO OU EMPRESA RESPONSÁVEL]',
  documento: '[CPF/CNPJ]',
  email: '[E-MAIL DE CONTATO]',
  cidade: 'Sobradinho, Bahia',
  atualizado: '[DATA DA PUBLICAÇÃO]',
};

export const TERMS: { h: string; p: string[] }[] = [
  { h: 'O que é o Sobradinho Online', p: ['Um aplicativo comunitário e gratuito para moradores e visitantes de Sobradinho (BA) trocarem informações, divulgarem eventos, serviços e anúncios, e participarem de consultas populares.'] },
  { h: 'Quem pode usar', p: ['Pessoas com 13 anos ou mais. Menores de 18 anos devem usar com acompanhamento dos pais ou responsáveis.', 'Você deve informar um nome verdadeiro e não pode se passar por outra pessoa, empresa ou órgão público.'] },
  { h: 'O que não é permitido', p: [
    'Ofensa, ameaça, discurso de ódio, assédio ou discriminação.',
    'Golpes, pirâmides, venda de produtos ilegais, armas, drogas ou animais silvestres.',
    'Divulgar foto, endereço, telefone ou dados de alguém sem permissão.',
    'Notícia falsa, spam e contas automáticas que finjam ser moradores.',
    'Conteúdo sexual, violento ou que envolva crianças de forma imprópria.',
  ] },
  { h: 'Seu conteúdo', p: ['O que você posta continua sendo seu. Ao publicar, você autoriza o app a exibir esse conteúdo dentro do aplicativo e em cartões de compartilhamento.', 'Podemos remover conteúdo e suspender contas que quebrem estas regras, com ou sem aviso, principalmente em caso de risco a alguém.'] },
  { h: 'Negociações e serviços', p: ['Anúncios e serviços são combinados direto entre as pessoas. O app não participa, não intermedeia pagamento e não garante qualidade, entrega ou preço. Desconfie de pedidos de pagamento antecipado.'] },
  { h: 'Selos, ranking e convites', p: ['Selos como Fundador, Verificado e Embaixador são reconhecimentos dentro do app, sem valor em dinheiro. Convites falsos ou contas criadas só para subir no ranking anulam o selo.'] },
  { h: 'Mudanças e contato', p: ['Podemos atualizar estes termos e avisaremos no app. Dúvidas: [E-MAIL DE CONTATO].'] },
];

export const PRIVACY: { h: string; p: string[] }[] = [
  { h: 'Quem cuida dos seus dados', p: [`Controlador: ${LEGAL.responsavel}, ${LEGAL.documento}, ${LEGAL.cidade}. Contato para assuntos de dados pessoais: ${LEGAL.email}.`] },
  { h: 'Que dados coletamos', p: [
    'Que você informa: nome, @ de usuário, bairro, foto de perfil e capa, bio, link, WhatsApp (se você colocar) e o que você publica, comenta e vota.',
    'Do uso do app: data de cadastro, convites (quem entrou pelo seu código), denúncias, preferências e dados técnicos básicos do aparelho para o app funcionar e ficar seguro.',
    'Não coletamos sua localização exata, contatos da agenda nem dados bancários.',
  ] },
  { h: 'Para que usamos', p: [
    'Mostrar seu perfil e suas publicações para a comunidade (execução do serviço que você pediu).',
    'Contar convites, selos e ranking (execução do serviço).',
    'Prevenir golpes, spam e abuso, e atender denúncias (legítimo interesse e segurança).',
    'Gerar estatísticas agregadas e anônimas das consultas populares, por exemplo "62% votaram em lazer". Nunca mostramos o voto de uma pessoa específica.',
  ] },
  { h: 'Com quem compartilhamos', p: [
    'Com outros usuários: o que você deixa público no perfil e nas publicações. Seu WhatsApp só aparece se você permitir.',
    'Com fornecedores de tecnologia que hospedam o app (por exemplo, o Google Firebase), apenas para o app funcionar.',
    'Com autoridades, quando a lei exigir.',
    'Não vendemos seus dados.',
  ] },
  { h: 'Por quanto tempo guardamos', p: ['Enquanto sua conta existir. Ao excluir a conta, apagamos seus dados em até 30 dias, exceto o que a lei mandar guardar por mais tempo (por exemplo, registros de acesso por 6 meses, pelo Marco Civil da Internet).'] },
  { h: 'Seus direitos', p: ['Você pode, a qualquer momento: confirmar se tratamos seus dados, acessar, corrigir, pedir cópia, pedir exclusão, revogar consentimento e saber com quem compartilhamos. Faça isso pelo próprio app (Ajustes) ou pelo e-mail de contato.', 'Você também pode reclamar na Autoridade Nacional de Proteção de Dados (ANPD).'] },
  { h: 'Excluir sua conta', p: ['Dentro do app: Ajustes > Excluir conta. Fora do app: [LINK DA PÁGINA WEB DE EXCLUSÃO], exigido pelo Google Play.'] },
  { h: 'Atualizações', p: [`Última atualização: ${LEGAL.atualizado}.`] },
];

export const FAQ: { q: string; a: string }[] = [
  { q: 'Como ganho o selo Verificado?', a: 'Chamando 10 pessoas que entrem pelo seu código e façam a primeira ação no app. Veja seu progresso em Pessoas.' },
  { q: 'O que é ser Fundador?', a: 'Os 100 primeiros cadastrados ganham um número de Fundador que fica pra sempre no perfil.' },
  { q: 'Como denuncio um post?', a: 'Toque nos três pontinhos do post e em Denunciar. É anônimo.' },
  { q: 'Como anuncio meu serviço?', a: 'Vá em Cidade > Serviços > Oferecer. É grátis.' },
  { q: 'Como apago minha conta?', a: 'Ajustes > Excluir conta. Seus dados são apagados.' },
  { q: 'Quem faz o app?', a: 'Gente de Sobradinho. Não é da prefeitura nem de partido.' },
];
