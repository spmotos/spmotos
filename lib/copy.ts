export const copy = {
  brand: "SP Motos",
  tagline:
    "Loja de motos seminovas em Pelotas/RS: financiamento, consórcio e negociação direto no WhatsApp. Há 28 anos no mercado.",
  a11y: {
    skipToContent: "Ir para o conteúdo",
    mainContentId: "conteudo-principal",
  },
  nav: {
    home: "Início",
    venda: "Venda sua moto",
    contato: "Contato",
    menu: "Menu principal",
    menuOpen: "Abrir menu",
    menuClose: "Fechar menu",
  },
  whatsappChooseContact: "Escolha com quem conversar:",
  whatsappNegotiateWith: (name: string): string => `Negociar com ${name}`,
  whatsappSellWith: (name: string): string => `Quero vender minha moto — ${name}`,
  whatsappAriaNegotiate: (name: string, phone: string): string =>
    `Negociar no WhatsApp com ${name}, ${phone}`,
  whatsappAriaSell: (name: string, phone: string): string =>
    `Quero vender minha moto no WhatsApp com ${name}, ${phone}`,
  whatsappAriaHeader: (name: string, phone: string): string => `WhatsApp com ${name}, ${phone}`,
  social: {
    heading: "Redes sociais",
    ariaFollow: (network: string): string => `SP Motos no ${network} (abre em nova aba)`,
  },
  searchPlaceholder: "Pesquisar marca, modelo ou nome",
  searchSubmit: "Buscar",
  card: {
    details: "Ver detalhes",
    badgeNew: "Nova",
    badgeUsed: "Seminova",
    noPhoto: "Sem foto",
  },
  filters: {
    model: "Modelo da moto",
    category: "Categoria",
    priceBand: "Faixa de preço",
    todasMarcas: "Todas as marcas",
    anyPrice: "Qualquer preço",
    priceUpTo: (value: string): string => `Até ${value}`,
    limpar: "Limpar",
    buscar: "Buscar",
  },
  empty: {
    noResults: {
      title: "Nenhuma moto com esse filtro",
      body: "Fale com a loja no WhatsApp e contamos o que está chegando.",
    },
    unavailable: {
      title: "Estoque temporariamente indisponível",
      body: "Não conseguimos carregar as motos agora. Fale com a loja no WhatsApp ou tente de novo em alguns minutos.",
    },
  },
  errorPage: {
    title: "Algo deu errado",
    body: "Não foi possível carregar esta página. Tente de novo ou fale com a loja no WhatsApp.",
    retry: "Tentar de novo",
  },
  notFound: {
    title: "Página não encontrada",
    body: "O endereço pode ter mudado ou a moto já foi vendida.",
    backToEstoque: "Ver motos à venda",
  },
  home: {
    metaTitle: "SP Motos | Loja de Motos Seminovas em Pelotas/RS",
    heroKicker: "Loja de motos em Pelotas/RS",
    heroTitleLead: "Há 28 anos",
    heroTitleAccent: "realizando sonhos.",
    heroBody:
      "Motos selecionadas, ficha completa e negociação direto no WhatsApp da loja. Fechamento presencial.",
    heroCta: "Ver estoque",
    heroBannerAlt: "SP Motos — vitrine de motos em Pelotas",
    heroChip1: "Parcelamento nos cartões de crédito",
    heroChip2: "Financiamento com as melhores taxas do mercado",
    heroChip3: "Consórcio de motos",
    heroChip4: "Financiamento de moto que você encontrou particular",
    estoqueTitle: "Motos à venda em Pelotas",
    loadMore: "Carregar mais motos",
    loadingMore: "Carregando…",
    allLoaded: "Você viu todas as motos deste filtro.",
    loadMoreError: "Não foi possível carregar mais motos. Tente de novo.",
    loadedBatch: (count: number): string =>
      count === 1 ? "Mais 1 moto carregada." : `Mais ${count} motos carregadas.`,
  },
  trust: {
    item3Title: "WhatsApp da loja",
    item3Body: "Sandra ou Caroline — escolha com quem prefere falar.",
    item4Title: "Fechamento presencial",
    item4Body: "A conclusão da venda é feita na loja.",
  },
  detail: {
    metaDescription: (resumo: string): string =>
      `${resumo}. Moto à venda na SP Motos em Pelotas/RS — negocie pelo WhatsApp.`,
    close: "Fechar detalhes da moto",
    modalNotFound: "Esta moto não está mais no estoque.",
    galleryPrev: "Foto anterior",
    galleryNext: "Próxima foto",
    specs: "Ficha técnica",
    accessories: "Acessórios",
    notes: "Observações",
    km: "Quilometragem",
    year: "Ano",
    color: "Cor",
    engine: "Motor",
    gearbox: "Câmbio",
    fuel: "Combustível",
    origin: "Procedência",
  },
  venda: {
    title: "Venda ou consigne sua moto",
    metaTitle: "Venda ou consigne sua moto em Pelotas",
    metaDescription:
      "Consignação na SP Motos: sua moto exposta para milhares de clientes, negociação pela equipe e você continua proprietário até fechar a venda.",
    lead:
      "Quer vender sua moto e não tem tempo de ficar respondendo mensagem, marcando visita e toda a burocracia?",
    videoHeading: "Veja como funciona",
    videoAria: "Vídeo explicando a venda consignada na SP Motos",
    videoFallback: "Seu navegador não suporta a reprodução de vídeo.",
    videoDataHint: "O vídeo só é baixado quando você apertar play (útil em dados móveis).",
    servicesHighlightTitle: "Também na SP Motos",
    servicesHighlightConsorcio: "Consórcio de motos — planeje a compra com a nossa equipe.",
    servicesHighlightFinanciamento:
      "Financiamento de moto particular — achou a moto por conta própria? A gente ajuda a fechar o crédito.",
    sections: [
      {
        title: "A SP Motos cuida de tudo",
        body: "Pois aqui na SP Motos nós fazemos isso para você. Toda a negociação é realizada pela nossa equipe, com atendimento profissional do começo ao fim.",
      },
      {
        title: "Venda consignada",
        body: "Trabalhamos com venda consignada: sua moto fica exposta para milhares de clientes na vitrine, com a loja conduzindo visitas e propostas.",
      },
      {
        title: "Você continua proprietário",
        body: "Você continua sendo o proprietário da moto até a venda ser concluída, com muito mais tranquilidade e segurança.",
      },
      {
        title: "Há 28 anos no mercado",
        body: "Há 28 anos ajudando clientes a comprar e vender motos em Pelotas.",
      },
    ],
    closing:
      "Quer saber mais como funciona a consignação? Então entre em contato com a SP Motos.",
    whatsappPrefill: "Olá! Quero saber mais sobre venda consignada na SP Motos.",
  },
  contato: {
    title: "Contato",
    metaTitle: "Contato e endereço da loja de motos em Pelotas",
    metaDescription:
      "Endereço, horário e mapa da SP Motos em Pelotas. Veja como chegar e fale com a loja no WhatsApp.",
    intro:
      "Visite a loja ou fale com a equipe no WhatsApp. Confira o endereço, o horário de atendimento e trace a rota até a SP Motos.",
    address: "Avenida Domingos de Almeida, 3364 — Pelotas/RS",
    addressShort: "Av. Domingos de Almeida, 3364",
    hours: "Segunda a sexta, 9h às 18h; sábado, 9h ao meio-dia",
    phoneHint: "WhatsApp — Sandra ou Caroline",
    mapHeading: "Onde estamos",
    mapIframeTitle: "Mapa da SP Motos em Pelotas",
    openMapLabel: "Abrir mapa em tela cheia",
    directionsHeading: "Como chegar",
    googleMapsLabel: "Google Maps",
    wazeLabel: "Waze",
    routeFromLocationLabel: "Rota a partir da minha localização",
    geolocationLoading: "Obtendo localização…",
    geolocationDenied:
      "Não foi possível usar sua localização. Ative a permissão no navegador ou use Google Maps ou Waze.",
    geolocationUnavailable:
      "Localização indisponível neste dispositivo. Use Google Maps ou Waze para traçar a rota.",
  },
  footer: "Liberdade em 2 rodas.",
  footerNavLabel: "Links do rodapé",
};
