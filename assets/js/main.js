const jogos = {
  "100067": {
    appId: "100067",
    name: "Free Fire",
    icon: "assets/img/icon-freefire.png",
    coinIcon: "assets/img/diamond.png",
    coinAlt: "Diamante",
    channelBg: "assets/img/freefire-banner.jpg",
    modalBg: "assets/img/freefire-banner.jpg",
    initialSlide: 0,
    showFreeItems: true,
    showEvents: true,
    socials: ["facebook", "google", "x", "vk"],
    produtos: [
      { id: "pack-100", nome: "100 Diamantes", originalAmount: "100", bonusAmount: "20", totalLabel: "100 + 20", totalAmount: "120", formattedPrice: "R$ 6,00", price: 6 },
      { id: "pack-310", nome: "310 Diamantes", originalAmount: "310", bonusAmount: "62", totalLabel: "310 + 62", totalAmount: "372", formattedPrice: "R$ 10,99", price: 10.99 },
      { id: "pack-520", nome: "520 Diamantes", originalAmount: "520", bonusAmount: "104", totalLabel: "520 + 104", totalAmount: "624", formattedPrice: "R$ 14,90", price: 14.9 },
      { id: "pack-1060", nome: "1.060 Diamantes", originalAmount: "1.060", bonusAmount: "1.166", totalLabel: "1.060 + 1.166", totalAmount: "2.226", formattedPrice: "R$ 20,99", price: 20.99, promo: "110% DE BÔNUS" },
      { id: "pack-2180", nome: "2.180 Diamantes", originalAmount: "2.180", bonusAmount: "2.398", totalLabel: "2.180 + 2.398", totalAmount: "4.578", formattedPrice: "R$ 44,99", price: 44.99, promo: "110% DE BÔNUS" },
      { id: "pack-5600", nome: "5.600 Diamantes", originalAmount: "5.600", bonusAmount: "6.160", totalLabel: "5.600 + 6.160", totalAmount: "11.760", formattedPrice: "R$ 87,99", price: 87.99, promo: "110% DE BÔNUS" },
      { id: "pack-22400", nome: "22.400 Diamantes", originalAmount: "22.400", bonusAmount: "24.640", totalLabel: "22.400 + 24.640", totalAmount: "47.040", formattedPrice: "R$ 209,99", price: 209.99, promo: "110% DE BÔNUS" }
    ],
    ofertas: [
      { id: "offer-weekly-sub", nome: "Assinatura Semanal", originalAmount: "Assinatura Semanal", bonusAmount: "", totalLabel: "Assinatura Semanal", totalAmount: "Assinatura Semanal", formattedPrice: "R$ 14,99", price: 14.99, image: "assets/img/offer-weekly.png", hot: true },
      { id: "offer-monthly-sub", nome: "Assinatura Mensal", originalAmount: "Assinatura Mensal", bonusAmount: "", totalLabel: "Assinatura Mensal", totalAmount: "Assinatura Mensal", formattedPrice: "R$ 44,99", price: 44.99, image: "assets/img/offer-monthly.png", hot: true },
      { id: "offer-booyah-pass", nome: "Passe Booyah", originalAmount: "Passe Booyah", bonusAmount: "", totalLabel: "Passe Booyah", totalAmount: "Passe Booyah", formattedPrice: "R$ 11,99", price: 11.99, image: "assets/img/offer-booyah.png" },
      { id: "offer-booyah-premium-plus", nome: "Passe Booyah Premium Plus", originalAmount: "Passe Booyah Premium Plus", bonusAmount: "", totalLabel: "Passe Booyah Premium Plus", totalAmount: "Passe Booyah Premium Plus", formattedPrice: "R$ 29,99", price: 29.99, image: "assets/img/offer-booyah-premium.png" }
    ]
  },
  "100151": {
    appId: "100151",
    name: "Delta Force",
    icon: "assets/img/icon-delta-force.png",
    coinIcon: "assets/img/delta-coin.png",
    coinAlt: "Delta Coin",
    channelBg: "assets/img/channel-delta.jpg",
    modalBg: "assets/img/channel-delta.jpg",
    initialSlide: 0,
    showFreeItems: false,
    showEvents: false,
    socials: ["garena", "facebook", "google"],
    produtos: [
      { id: "df-pack-60", nome: "60 Delta Coins", originalAmount: "60", bonusAmount: "39", totalLabel: "60 + 39", totalAmount: "99", formattedPrice: "R$ 4,89", price: 4.89 },
      { id: "df-pack-300", nome: "300 Delta Coins", originalAmount: "300", bonusAmount: "181", totalLabel: "300 + 181", totalAmount: "481", formattedPrice: "R$ 9,49", price: 9.49 },
      { id: "df-pack-680", nome: "680 Delta Coins", originalAmount: "680", bonusAmount: "307", totalLabel: "680 + 307", totalAmount: "987", formattedPrice: "R$ 19,90", price: 19.9 },
      { id: "df-pack-1280", nome: "1.280 Delta Coins", originalAmount: "1.280", bonusAmount: "1.280", totalLabel: "1.280 + 1.280", totalAmount: "2.560", formattedPrice: "R$ 37,99", price: 37.99, promo: "COINS EM DOBRO" },
      { id: "df-pack-3280", nome: "3.280 Delta Coins", originalAmount: "3.280", bonusAmount: "3.280", totalLabel: "3.280 + 3.280", totalAmount: "6.560", formattedPrice: "R$ 97,99", price: 97.99, promo: "COINS EM DOBRO" },
      { id: "df-pack-6480", nome: "6.480 Delta Coins", originalAmount: "6.480", bonusAmount: "2.916", totalLabel: "6.480 + 2.916", totalAmount: "9.396", formattedPrice: "R$ 149,90", price: 149.9 }
    ],
    ofertas: [
      { id: "df-offer-genesis", nome: "Black Hawk Down - Gênesis", originalAmount: "Gênesis", bonusAmount: "", totalLabel: "Gênesis", totalAmount: "Gênesis", formattedPrice: "R$ 29,90", price: 29.9, image: "assets/img/df-offer-genesis.png", contain: true },
      { id: "df-offer-reinvention", nome: "Black Hawk Down - Reinvenção", originalAmount: "Reinvenção", bonusAmount: "", totalLabel: "Reinvenção", totalAmount: "Reinvenção", formattedPrice: "R$ 14,90", price: 14.9, image: "assets/img/df-offer-reinvention.png", contain: true },
      { id: "df-offer-tide", nome: "Suprimentos de Maré", originalAmount: "Maré", bonusAmount: "", totalLabel: "Maré", totalAmount: "Maré", formattedPrice: "R$ 5,99", price: 5.99, image: "assets/img/df-offer-tide.png", contain: true },
      { id: "df-offer-tide-advanced", nome: "Suprimentos de Maré - Avançado", originalAmount: "Avançado", bonusAmount: "", totalLabel: "Avançado", totalAmount: "Avançado", formattedPrice: "R$ 7,50", price: 7.5, image: "assets/img/df-offer-tide-advanced.png", contain: true }
    ]
  },
  "100153": {
    appId: "100153",
    name: "HAIKYU!! FLY HIGH",
    icon: "assets/img/icon-haikyuu.png",
    coinIcon: "assets/img/haikyuu-gem.png",
    coinAlt: "Star Gems",
    channelBg: "assets/img/channel-haikyuu.jpg",
    modalBg: "assets/img/channel-haikyuu.jpg",
    initialSlide: 4,
    showFreeItems: false,
    showEvents: false,
    socials: ["facebook", "google"],
    produtos: [
      { id: "hq-pack-60", nome: "60 Star Gems", originalAmount: "60", bonusAmount: "", totalLabel: "60", totalAmount: "60", formattedPrice: "R$ 5,99", price: 5.99 },
      { id: "hq-pack-300", nome: "300 Star Gems", originalAmount: "300", bonusAmount: "", totalLabel: "300", totalAmount: "300", formattedPrice: "R$ 29,99", price: 29.99 },
      { id: "hq-pack-980", nome: "980 Star Gems", originalAmount: "980", bonusAmount: "", totalLabel: "980", totalAmount: "980", formattedPrice: "R$ 65,90", price: 65.9 },
      { id: "hq-pack-1980", nome: "1.980 Star Gems", originalAmount: "1.980", bonusAmount: "", totalLabel: "1.980", totalAmount: "1.980", formattedPrice: "R$ 107,90", price: 107.9 },
      { id: "hq-pack-3280", nome: "3.280 Star Gems", originalAmount: "3.280", bonusAmount: "", totalLabel: "3.280", totalAmount: "3.280", formattedPrice: "R$ 144,90", price: 144.9 },
      { id: "hq-pack-6480", nome: "6.480 Star Gems", originalAmount: "6.480", bonusAmount: "", totalLabel: "6.480", totalAmount: "6.480", formattedPrice: "R$ 399,90", price: 399.9 }
    ],
    ofertas: [
      { id: "hq-offer-ultra-1", nome: "Especial de Recrutar Ultra I", originalAmount: "Especial de Recrutar Ultra I", bonusAmount: "", totalLabel: "Especial de Recrutar Ultra I", totalAmount: "Especial de Recrutar Ultra I", formattedPrice: "R$ 5,99", price: 5.99, image: "assets/img/hq-offer-ultra-1.png" },
      { id: "hq-offer-ultra-2", nome: "Especial de Recrutar Ultra II", originalAmount: "Especial de Recrutar Ultra II", bonusAmount: "", totalLabel: "Especial de Recrutar Ultra II", totalAmount: "Especial de Recrutar Ultra II", formattedPrice: "R$ 26,99", price: 26.99, image: "assets/img/hq-offer-ultra-2.png" },
      { id: "hq-offer-memoria-3", nome: "Especial de Recrutar Memória III", originalAmount: "Especial de Recrutar Memória III", bonusAmount: "", totalLabel: "Especial de Recrutar Memória III", totalAmount: "Especial de Recrutar Memória III", formattedPrice: "R$ 52,11", price: 52.11, image: "assets/img/hq-offer-memoria-3.png" },
      { id: "hq-offer-memoria-4", nome: "Especial de Recrutar Memória IV", originalAmount: "Especial de Recrutar Memória IV", bonusAmount: "", totalLabel: "Especial de Recrutar Memória IV", totalAmount: "Especial de Recrutar Memória IV", formattedPrice: "R$ 77,31", price: 77.31, image: "assets/img/hq-offer-memoria-4.png" },
      { id: "hq-offer-novatos", nome: "Pacote Exclusivo para Novatos", originalAmount: "Pacote Exclusivo para Novatos", bonusAmount: "", totalLabel: "Pacote Exclusivo para Novatos", totalAmount: "Pacote Exclusivo para Novatos", formattedPrice: "R$ 5,99", price: 5.99, image: "assets/img/hq-offer-novatos.png" },
      { id: "hq-offer-torcer-1", nome: "Oferta Especial Torcer 1ª Vez", originalAmount: "Oferta Especial Torcer 1ª Vez", bonusAmount: "", totalLabel: "Oferta Especial Torcer 1ª Vez", totalAmount: "Oferta Especial Torcer 1ª Vez", formattedPrice: "R$ 35,99", price: 35.99, image: "assets/img/hq-offer-torcer-1.png" },
      { id: "hq-offer-memoria-1-vez", nome: "Oferta Especial Memória 1ª Vez", originalAmount: "Oferta Especial Memória 1ª Vez", bonusAmount: "", totalLabel: "Oferta Especial Memória 1ª Vez", totalAmount: "Oferta Especial Memória 1ª Vez", formattedPrice: "R$ 125,91", price: 125.91, image: "assets/img/hq-offer-memoria-1-vez.png" },
      { id: "hq-offer-recrutar-ultra-4", nome: "Bilhete de Recrutar Ultra IV", originalAmount: "Bilhete de Recrutar Ultra IV", bonusAmount: "", totalLabel: "Bilhete de Recrutar Ultra IV", totalAmount: "Bilhete de Recrutar Ultra IV", formattedPrice: "R$ 157,41", price: 157.41, image: "assets/img/hq-offer-recrutar-ultra-4.png" },
      { id: "hq-offer-recrutar-ultra-5", nome: "Bilhete de Recrutar Ultra V", originalAmount: "Bilhete de Recrutar Ultra V", bonusAmount: "", totalLabel: "Bilhete de Recrutar Ultra V", totalAmount: "Bilhete de Recrutar Ultra V", formattedPrice: "R$ 265,41", price: 265.41, image: "assets/img/hq-offer-recrutar-ultra-5.png" },
      { id: "hq-offer-recrutar-ultra-6", nome: "Bilhete de Recrutar Ultra VI", originalAmount: "Bilhete de Recrutar Ultra VI", bonusAmount: "", totalLabel: "Bilhete de Recrutar Ultra VI", totalAmount: "Bilhete de Recrutar Ultra VI", formattedPrice: "R$ 299,99", price: 299.99, image: "assets/img/hq-offer-recrutar-ultra-6.png" },
      { id: "hq-offer-recrutar-1", nome: "Bilhete de Recrutar x1", originalAmount: "Bilhete de Recrutar x1", bonusAmount: "", totalLabel: "Bilhete de Recrutar x1", totalAmount: "Bilhete de Recrutar x1", formattedPrice: "R$ 5,99", price: 5.99, image: "assets/img/hq-offer-recrutar-1.png" },
      { id: "hq-offer-recrutar-5", nome: "Bilhete de Recrutar x5", originalAmount: "Bilhete de Recrutar x5", bonusAmount: "", totalLabel: "Bilhete de Recrutar x5", totalAmount: "Bilhete de Recrutar x5", formattedPrice: "R$ 26,99", price: 26.99, image: "assets/img/hq-offer-recrutar-5.png" },
      { id: "hq-offer-recrutar-10", nome: "Bilhete de Recrutar x10", originalAmount: "Bilhete de Recrutar x10", bonusAmount: "", totalLabel: "Bilhete de Recrutar x10", totalAmount: "Bilhete de Recrutar x10", formattedPrice: "R$ 67,49", price: 67.49, image: "assets/img/hq-offer-recrutar-10.png" },
      { id: "hq-offer-recrutar-20", nome: "Bilhete de Recrutar x20", originalAmount: "Bilhete de Recrutar x20", bonusAmount: "", totalLabel: "Bilhete de Recrutar x20", totalAmount: "Bilhete de Recrutar x20", formattedPrice: "R$ 157,41", price: 157.41, image: "assets/img/hq-offer-recrutar-20.png" },
      { id: "hq-offer-recrutar-30", nome: "Bilhete de Recrutar x30", originalAmount: "Bilhete de Recrutar x30", bonusAmount: "", totalLabel: "Bilhete de Recrutar x30", totalAmount: "Bilhete de Recrutar x30", formattedPrice: "R$ 265,41", price: 265.41, image: "assets/img/hq-offer-recrutar-30.png" },
      { id: "hq-offer-recrutar-55", nome: "Bilhete de Recrutar x55", originalAmount: "Bilhete de Recrutar x55", bonusAmount: "", totalLabel: "Bilhete de Recrutar x55", totalAmount: "Bilhete de Recrutar x55", formattedPrice: "R$ 399,91", price: 399.91, image: "assets/img/hq-offer-recrutar-55.png" }
    ]
  }
};

const socialMap = {
  garena: { className: "social-white social-garena", img: "assets/img/garena-logo.svg", alt: "Garena logo" },
  facebook: { className: "social-blue", img: "assets/img/social-facebook.svg", alt: "Facebook logo" },
  google: { className: "social-white", img: "assets/img/social-google.svg", alt: "Google logo" },
  x: { className: "social-white", img: "assets/img/social-x.svg", alt: "Twitter logo" },
  vk: { className: "social-blue-alt", img: "assets/img/social-vk.svg", alt: "VK logo" }
};

const pagamentos = [
  { id: "pix", nome: "PIX", type: "pix" },
  { id: "cc", nome: "Cartão de Crédito", type: "cc" },
  { id: "picpay", nome: "PicPay", type: "picpay" },
  { id: "nupay", nome: "Nupay", type: "nupay" },
  { id: "mercado", nome: "Mercado Pago", type: "mercado" }
];

const PLAYER_ACTION_HASH = "4020850acbddb3eb36ae1d0b42088e884fcc3b4236";
const NEXT_ROUTER_STATE_TREE = "%5B%22%22%2C%7B%22children%22%3A%5B%22__PAGE__%22%2C%7B%7D%2Cnull%2Cnull%5D%7D%2Cnull%2Cnull%2Ctrue%5D";

const estado = {
  appId: getAppIdInicial(),
  produtoId: null,
  pagamentoId: null,
  playerId: "",
  playerName: "",
  slideAtual: 0,
  carouselTimer: null,
  ofertasExpandidas: false
};

document.addEventListener("DOMContentLoaded", () => {
  renderizarJogo();
  iniciarCarousel();
  restaurarSessao();
  restaurarSelecao();
  prepararEntradaNumerica();
  prepararSelecaoDeJogos();
  sincronizarInterface();
});

window.addEventListener("resize", () => setHeroSlide(estado.slideAtual));
window.addEventListener("popstate", () => selecionarJogo(getAppIdInicial(), false));

function getAppIdInicial() {
  const params = new URLSearchParams(window.location.search);
  let savedApp = "";
  try {
    savedApp = localStorage.getItem("selectedAppId") || "";
  } catch (error) {
    savedApp = "";
  }
  const app = params.get("app") || savedApp || "100067";
  return jogos[app] ? app : "100067";
}

function getJogoAtual() {
  return jogos[estado.appId] || jogos["100067"];
}

function getProdutosAtuais() {
  const jogo = getJogoAtual();
  return [...jogo.produtos, ...jogo.ofertas];
}

function prepararSelecaoDeJogos() {
  document.querySelectorAll(".game-option").forEach((option) => {
    option.addEventListener("click", (event) => {
      const appId = option.dataset.appId;
      if (!appId || !jogos[appId]) return;
      event.preventDefault();
      selecionarJogo(appId, true);
    });
  });
}

function selecionarJogo(appId, atualizarUrl) {
  if (!jogos[appId]) return;
  const mudou = estado.appId !== appId;
  estado.appId = appId;
  estado.ofertasExpandidas = false;

  if (mudou) {
    estado.produtoId = null;
    estado.pagamentoId = null;
    estado.playerId = "";
    estado.playerName = "";
    limparSelecaoPersistida();
  }

  if (atualizarUrl) {
    window.history.pushState({ appId }, "", "/");
  }

  try {
    localStorage.setItem("selectedAppId", estado.appId);
  } catch (error) {
    console.error("Failed to save selected game", error);
  }

  renderizarJogo();
  setHeroSlide(getJogoAtual().initialSlide);
  sincronizarInterface();
}

function limparSelecaoPersistida() {
  try {
    localStorage.removeItem("selectedProduct");
    localStorage.removeItem("selectedPaymentId");
    localStorage.removeItem("playerName");
    localStorage.removeItem("playerId");
    localStorage.setItem("selectedAppId", estado.appId);
  } catch (error) {
    console.error("Failed to clear previous selection", error);
  }
}

function renderizarJogo() {
  const jogo = getJogoAtual();
  document.body.dataset.appId = jogo.appId;
  document.title = `Centro de Recarga ${jogo.name}`;

  atualizarImagem("headerAvatar", jogo.icon, "User avatar");
  atualizarImagem("channelIcon", jogo.icon, `${jogo.name} Icon`);
  atualizarImagem("accountIcon", jogo.icon, "");
  atualizarImagem("modalHeroImg", jogo.modalBg, `${jogo.name} Banner`);
  atualizarImagem("modalGameIcon", jogo.icon, `${jogo.name} Icon`);

  document.querySelector(".channel-icon").classList.toggle("hot-corner", jogo.appId === "100067");
  document.querySelector(".modal-game-icon").classList.toggle("hot-corner", jogo.appId === "100067");
  document.getElementById("channel-section").setAttribute("aria-label", jogo.name);
  document.querySelector(".channel-bg").style.backgroundImage = `url("${jogo.channelBg}")`;
  document.getElementById("channelTitle").textContent = jogo.name;
  document.getElementById("loginModalTitle").textContent = jogo.name;

  document.getElementById("freeItemSection").classList.toggle("is-hidden", !jogo.showFreeItems);
  document.getElementById("eventsSection").classList.toggle("is-hidden", !jogo.showEvents);

  document.querySelectorAll(".game-option").forEach((option) => {
    const selected = option.dataset.appId === jogo.appId;
    option.classList.toggle("is-selected", selected);
    option.setAttribute("aria-checked", selected ? "true" : "false");
  });

  renderizarSociais();
  renderizarRecargas();
  renderizarOfertas();
  atualizarIconesPagamento();
}

function atualizarImagem(id, src, alt) {
  const image = document.getElementById(id);
  if (!image) return;
  image.src = src;
  image.alt = alt;
}

function renderizarSociais() {
  const jogo = getJogoAtual();
  document.querySelectorAll("[data-social-buttons]").forEach((container) => {
    container.innerHTML = "";
    jogo.socials.forEach((socialId) => {
      const social = socialMap[socialId];
      if (!social) return;

      const button = document.createElement("button");
      button.className = `social-btn ${social.className}`;
      button.type = "button";
      button.setAttribute("aria-label", social.alt.replace(" logo", ""));
      button.addEventListener("click", abrirServicoIndisponivel);

      const image = document.createElement("img");
      image.src = social.img;
      image.alt = social.alt;
      button.appendChild(image);
      container.appendChild(button);
    });
  });
}

function renderizarRecargas() {
  const jogo = getJogoAtual();
  const grid = document.getElementById("rechargeGrid");
  grid.innerHTML = "";

  jogo.produtos.forEach((produto) => {
    const button = document.createElement("button");
    button.className = `recharge-card${produto.promo ? " has-promo" : ""}`;
    button.type = "button";
    button.setAttribute("role", "radio");
    button.dataset.productId = produto.id;
    button.setAttribute("aria-checked", "false");
    button.addEventListener("click", () => selecionarProduto(produto.id));

    if (produto.promo) {
      const promo = document.createElement("span");
      promo.className = "promo-strip";
      promo.textContent = produto.promo;
      button.appendChild(promo);
    }

    const main = document.createElement("span");
    main.className = "recharge-main";
    main.innerHTML = `<img src="${jogo.coinIcon}" alt="${jogo.coinAlt}">${produto.originalAmount}`;
    button.appendChild(main);
    grid.appendChild(button);
  });
}

function renderizarOfertas() {
  const jogo = getJogoAtual();
  const grid = document.getElementById("offersGrid");
  const more = document.getElementById("showMoreOffers");
  const ofertas = estado.ofertasExpandidas ? jogo.ofertas : jogo.ofertas.slice(0, 8);
  grid.innerHTML = "";

  ofertas.forEach((oferta) => {
    const button = document.createElement("button");
    button.className = `offer-card${oferta.contain ? " offer-contain" : ""}`;
    button.type = "button";
    button.setAttribute("role", "radio");
    button.dataset.productId = oferta.id;
    button.setAttribute("aria-checked", "false");
    button.addEventListener("click", () => selecionarProduto(oferta.id));

    if (oferta.hot) {
      const hot = document.createElement("span");
      hot.className = "hot-ribbon";
      hot.textContent = "Hot";
      button.appendChild(hot);
    }

    const image = document.createElement("span");
    image.className = "offer-image";
    image.innerHTML = `<img src="${oferta.image}" alt="${oferta.nome}">`;
    button.appendChild(image);

    const name = document.createElement("span");
    name.className = "offer-name";
    name.textContent = oferta.nome;
    button.appendChild(name);

    grid.appendChild(button);
  });

  if (more) more.classList.toggle("is-hidden", jogo.ofertas.length <= 8 || estado.ofertasExpandidas);
}

function mostrarMaisOfertas() {
  estado.ofertasExpandidas = true;
  renderizarOfertas();
  atualizarProdutos();
}

function atualizarIconesPagamento() {
  const jogo = getJogoAtual();
  document.querySelectorAll(".promo-badge img").forEach((image) => {
    image.src = jogo.coinIcon;
    image.alt = "Promo";
  });
}

function iniciarCarousel() {
  const dots = document.getElementById("heroDots");
  const slides = document.querySelectorAll(".hero-slide");
  dots.innerHTML = "";
  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = "hero-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
    dot.addEventListener("click", () => setHeroSlide(index));
    dots.appendChild(dot);
  });
  setHeroSlide(getJogoAtual().initialSlide);
  estado.carouselTimer = window.setInterval(() => mudarSlide(1), 4500);
}

function mudarSlide(direcao) {
  const total = document.querySelectorAll(".hero-slide").length;
  setHeroSlide((estado.slideAtual + direcao + total) % total);
}

function setHeroSlide(index) {
  const track = document.getElementById("heroTrack");
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".hero-dot");
  if (!slides.length || !track) return;
  estado.slideAtual = index;

  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === index);
  });
  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === index);
  });

  if (window.matchMedia("(min-width: 768px)").matches) {
    const slideWidth = slides[0].getBoundingClientRect().width;
    const stageWidth = track.parentElement.getBoundingClientRect().width;
    const offset = (stageWidth - slideWidth) / 2 - index * slideWidth;
    track.style.transform = `translateX(${offset}px)`;
  } else {
    track.style.transform = `translateX(-${index * 100}%)`;
  }
}

function restaurarSessao() {
  try {
    const playerId = localStorage.getItem("playerId");
    const playerName = localStorage.getItem("playerName");
    const selectedAppId = localStorage.getItem("selectedAppId");
    if (playerId && selectedAppId === estado.appId) {
      estado.playerId = playerId;
      estado.playerName = playerName || "Não encontrado";
    }
  } catch (error) {
    console.error("Failed to access localStorage", error);
  }
}

function restaurarSelecao() {
  try {
    const savedProduct = localStorage.getItem("selectedProduct");
    const savedPayment = localStorage.getItem("selectedPaymentId");
    const selectedAppId = localStorage.getItem("selectedAppId");

    if (savedProduct && selectedAppId === estado.appId) {
      const parsed = JSON.parse(savedProduct);
      if (parsed && getProdutosAtuais().some((produto) => produto.id === parsed.id)) {
        estado.produtoId = parsed.id;
      }
    }

    if (savedPayment && pagamentos.some((pagamento) => pagamento.id === savedPayment)) {
      estado.pagamentoId = savedPayment;
    }
  } catch (error) {
    console.error("Failed to restore selected product", error);
  }
}

function prepararEntradaNumerica() {
  document.querySelectorAll('input[inputmode="numeric"]').forEach((input) => {
    atualizarEstadoBotaoLogin(input);
    input.addEventListener("input", () => {
      input.value = input.value.replace(/\D/g, "");
      atualizarEstadoBotaoLogin(input);
    });
  });
}

function atualizarEstadoBotaoLogin(input) {
  const form = input.closest("form");
  const button = form ? form.querySelector(".login-submit") : null;
  if (button && button.textContent !== "Aguarde...") {
    button.disabled = !input.value.trim();
  }
}

function sincronizarInterface() {
  atualizarConta();
  atualizarProdutos();
  atualizarPagamentos();
  atualizarSticky();
}

function atualizarConta() {
  const logged = Boolean(estado.playerId);
  document.getElementById("accountTitle").textContent = logged ? "Conta" : "Login";
  document.getElementById("loginBox").classList.toggle("is-hidden", logged);
  document.getElementById("accountBox").classList.toggle("is-hidden", !logged);
  document.getElementById("logoutLink").classList.toggle("is-hidden", !logged);
  document.getElementById("accountId").textContent = estado.playerId;
  document.getElementById("accountName").textContent = "";
}

function atualizarProdutos() {
  document.querySelectorAll("[data-product-id]").forEach((card) => {
    const selected = card.dataset.productId === estado.produtoId;
    card.classList.toggle("is-selected", selected);
    card.setAttribute("aria-checked", selected ? "true" : "false");
  });
}

function atualizarPagamentos() {
  const produto = getProdutoSelecionado();
  const jogo = getJogoAtual();
  document.querySelectorAll(".payment-card").forEach((card) => {
    const selected = card.dataset.paymentId === estado.pagamentoId;
    const info = card.querySelector("[data-payment-info]");
    card.classList.toggle("is-selected", selected);
    card.setAttribute("aria-checked", selected ? "true" : "false");

    if (!info) return;
    if (!produto) {
      info.innerHTML = "";
      return;
    }

    const bonus = produto.bonusAmount
      ? `<span>+ Bônus <img src="${jogo.coinIcon}" alt="${jogo.coinAlt}"> ${produto.bonusAmount}</span>`
      : "";
    info.innerHTML = `<strong>${produto.formattedPrice}</strong>${bonus}`;
  });
}

function atualizarSticky() {
  const sticky = document.getElementById("stickyCheckout");
  const produto = getProdutoSelecionado();
  if (!produto) {
    sticky.classList.add("is-hidden");
    return;
  }

  document.getElementById("stickyProduct").textContent = produto.totalLabel;
  document.getElementById("stickyTotal").innerHTML = `Total: <b>${produto.formattedPrice}</b>`;
  sticky.classList.remove("is-hidden");
}

function getProdutoSelecionado() {
  return getProdutosAtuais().find((produto) => produto.id === estado.produtoId) || null;
}

function selecionarProduto(produtoId) {
  if (!getProdutosAtuais().some((produto) => produto.id === produtoId)) return;
  estado.produtoId = produtoId;
  atualizarProdutos();
  atualizarPagamentos();
  atualizarSticky();
}

function selecionarPagamento(pagamentoId) {
  if (!pagamentos.some((pagamento) => pagamento.id === pagamentoId)) return;
  estado.pagamentoId = pagamentoId;
  atualizarPagamentos();
}

function validarFormulario(form) {
  const input = form.querySelector('input[inputmode="numeric"]');
  const error = form.id === "modalLoginForm" ? document.getElementById("modalLoginError") : document.getElementById("loginError");
  const playerId = (input.value || "").replace(/\D/g, "").trim();
  input.value = playerId;

  if (!playerId) {
    mostrarErro("Por favor, insira um ID válido.", error);
    return null;
  }

  mostrarErro("", error);
  return playerId;
}

async function loginPorId(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const playerId = validarFormulario(form);
  if (!playerId) return;

  mostrarLoading(true);
  let playerName = "Não encontrado";

  try {
    const apiName = await buscarJogadorApi(playerId);
    if (apiName) playerName = apiName;
  } catch (error) {
    console.error("Erro na API de busca de jogador:", error);
  }

  estado.playerId = playerId;
  estado.playerName = playerName;

  try {
    localStorage.setItem("playerName", playerName);
    localStorage.setItem("playerId", playerId);
    localStorage.setItem("selectedAppId", estado.appId);
    salvarHistorico(playerId, playerName);
  } catch (error) {
    console.error("Failed to access localStorage", error);
  }

  mostrarLoading(false);
  fecharModal();
  sincronizarInterface();
}

async function buscarJogadorApi(playerId) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 6500);

  try {
    const response = await fetch("https://www.recargajogo.es/", {
      method: "POST",
      mode: "cors",
      credentials: "omit",
      headers: {
        "Accept": "text/x-component",
        "Content-Type": "text/plain;charset=UTF-8",
        "Next-Action": PLAYER_ACTION_HASH,
        "Next-Router-State-Tree": NEXT_ROUTER_STATE_TREE
      },
      body: JSON.stringify([playerId]),
      signal: controller.signal
    });

    const text = await response.text();
    return extrairNickname(text);
  } finally {
    window.clearTimeout(timeout);
  }
}

function extrairNickname(texto) {
  if (!texto) return "";
  const directMatch = texto.match(/"nickname"\s*:\s*"([^"]+)"/);
  if (directMatch) return limparTextoApi(directMatch[1]);

  const escapedMatch = texto.match(/\\"nickname\\"\s*:\s*\\"([^"\\]+)\\"/);
  if (escapedMatch) return limparTextoApi(escapedMatch[1]);

  return "";
}

function limparTextoApi(valor) {
  try {
    return JSON.parse(`"${valor}"`);
  } catch (_) {
    return valor;
  }
}

function salvarHistorico(playerId, playerName) {
  const key = `playerHistory_${estado.appId}`;
  const current = JSON.parse(localStorage.getItem(key) || "[]");
  const next = [{ id: playerId, name: playerName }, ...current.filter((item) => item.id !== playerId)].slice(0, 5);
  localStorage.setItem(key, JSON.stringify(next));
}

function mostrarLoading(loading) {
  const text = loading ? "Aguarde..." : "Login";
  document.querySelectorAll(".login-submit").forEach((button) => {
    button.textContent = text;
    const form = button.closest("form");
    const input = form ? form.querySelector('input[inputmode="numeric"]') : null;
    button.disabled = loading || !input || !input.value.trim();
    if (input) input.disabled = loading;
  });
}

function mostrarErro(mensagem, target) {
  if (target) {
    target.textContent = mensagem;
    return;
  }
  if (mensagem) mostrarToast("Erro", mensagem);
}

function confirmarSaida() {
  abrirModal("logoutModal");
}

function sairConta() {
  estado.playerId = "";
  estado.playerName = "";
  try {
    localStorage.removeItem("playerName");
    localStorage.removeItem("playerId");
    localStorage.removeItem("selectedAppId");
  } catch (error) {
    console.error("Failed to access localStorage", error);
  }
  fecharModal();
  sincronizarInterface();
}

function abrirContaRapida() {
  if (estado.playerId) {
    confirmarSaida();
    return;
  }
  abrirModal("loginModal");
}

function abrirServicoIndisponivel() {
  abrirModal("serviceModal");
}

function resgatarItem() {
  if (estado.appId !== "100067") return;
  if (!estado.playerId) {
    abrirModal("loginModal");
    return;
  }

  abrirModal("almostModal");
}

function confirmarResgatePendente() {
  fecharModal();
}

function continuarPagamento() {
  if (!estado.playerId) {
    mostrarToast("Erro", "Você deve fazer login para continuar.");
    const loginSection = document.getElementById("login-section");
    if (loginSection) loginSection.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const produto = getProdutoSelecionado();
  if (!produto) {
    mostrarToast("Erro", "Por favor, selecione um valor de recarga.");
    return;
  }

  if (!estado.pagamentoId) {
    mostrarToast("Erro", "Por favor, selecione um método de pagamento.");
    return;
  }

  try {
    localStorage.setItem("selectedProduct", JSON.stringify(produtoParaCheckout(produto)));
    localStorage.setItem("selectedPaymentId", estado.pagamentoId);
    localStorage.setItem("selectedAppId", estado.appId);
  } catch (error) {
    console.error("Failed to access localStorage", error);
    mostrarToast("Erro", "Não foi possível iniciar o checkout. Verifique as permissões do seu navegador.");
    return;
  }

  window.location.href = "/checkout.html";
}

function produtoParaCheckout(produto) {
  const jogo = getJogoAtual();
  return {
    ...produto,
    name: produto.nome,
    gameId: jogo.appId,
    gameName: jogo.name,
    gameIcon: jogo.icon,
    gameBanner: jogo.channelBg,
    coinIcon: jogo.coinIcon,
    coinAlt: jogo.coinAlt
  };
}

function abrirModal(id) {
  document.getElementById("modalBackdrop").classList.remove("is-hidden");
  document.querySelectorAll(".modal").forEach((modal) => modal.classList.add("is-hidden"));
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove("is-hidden");
}

function fecharModal() {
  document.getElementById("modalBackdrop").classList.add("is-hidden");
  document.querySelectorAll(".modal").forEach((modal) => modal.classList.add("is-hidden"));
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") fecharModal();
});

function mostrarToast(titulo, descricao) {
  const region = document.getElementById("toastRegion");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<strong>${titulo}</strong><span>${descricao}</span>`;
  region.appendChild(toast);
  window.setTimeout(() => toast.remove(), 4200);
}
