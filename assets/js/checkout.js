const checkoutProdutos = [
  { id: "pack-100", name: "100 Diamantes", originalAmount: "100", bonusAmount: "20", totalAmount: "120", price: 6, formattedPrice: "R$ 6,00" },
  { id: "pack-310", name: "310 Diamantes", originalAmount: "310", bonusAmount: "62", totalAmount: "372", price: 10.99, formattedPrice: "R$ 10,99" },
  { id: "pack-520", name: "520 Diamantes", originalAmount: "520", bonusAmount: "104", totalAmount: "624", price: 14.9, formattedPrice: "R$ 14,90" },
  { id: "pack-1060", name: "1.060 Diamantes", originalAmount: "1.060", bonusAmount: "1.166", totalAmount: "2.226", price: 20.99, formattedPrice: "R$ 20,99" },
  { id: "pack-2180", name: "2.180 Diamantes", originalAmount: "2.180", bonusAmount: "2.398", totalAmount: "4.578", price: 44.99, formattedPrice: "R$ 44,99" },
  { id: "pack-5600", name: "5.600 Diamantes", originalAmount: "5.600", bonusAmount: "6.160", totalAmount: "11.760", price: 87.99, formattedPrice: "R$ 87,99" },
  { id: "pack-22400", name: "22.400 Diamantes", originalAmount: "22.400", bonusAmount: "24.640", totalAmount: "47.040", price: 209.99, formattedPrice: "R$ 209,99" }
];

const checkoutJogos = {
  "100067": {
    appId: "100067",
    name: "Free Fire",
    icon: "assets/img/icon-freefire.png",
    banner: "assets/img/freefire-banner.jpg",
    coinIcon: "assets/img/diamond.png",
    coinAlt: "Diamante",
    itemPlural: "diamantes"
  },
  "100151": {
    appId: "100151",
    name: "Delta Force",
    icon: "assets/img/icon-delta-force.png",
    banner: "assets/img/channel-delta.jpg",
    coinIcon: "assets/img/delta-coin.png",
    coinAlt: "Delta Coin",
    itemPlural: "coins"
  },
  "100153": {
    appId: "100153",
    name: "HAIKYU!! FLY HIGH",
    icon: "assets/img/icon-haikyuu.png",
    banner: "assets/img/channel-haikyuu.jpg",
    coinIcon: "assets/img/haikyuu-gem.png",
    coinAlt: "Star Gems",
    itemPlural: "itens"
  }
};

const checkoutPagamentos = {
  pix: { label: "Pix", flow: "pix", finishLabel: "PIX" },
  "payment-pix": { label: "Pix", flow: "pix", finishLabel: "PIX" },
  cc: { label: "Cartão de Crédito", flow: "cc", finishLabel: "Cartão de Crédito" },
  "payment-cc": { label: "Cartão de Crédito", flow: "cc", finishLabel: "Cartão de Crédito" },
  picpay: { label: "PicPay", flow: "pix", finishLabel: "PicPay" },
  "payment-picpay": { label: "PicPay", flow: "pix", finishLabel: "PicPay" },
  nupay: { label: "Nupay", flow: "pix", finishLabel: "Nupay" },
  "payment-nupay": { label: "Nupay", flow: "pix", finishLabel: "Nupay" },
  mercado: { label: "Mercado Pago", flow: "pix", finishLabel: "Mercado Pago" },
  "payment-mercadopago": { label: "Mercado Pago", flow: "pix", finishLabel: "Mercado Pago" }
};

const checkoutUpsells = [
  { id: "sombra-roxa", name: "Sombra Roxa", price: 9.99 },
  { id: "barba-velho", name: "Barba do Velho", price: 12.99 },
  { id: "pacote-coelhao", name: "Pacote Coelhão", price: 9.99 },
  { id: "calca-angelical", name: "Calça Angelical Azul", price: 24.8 },
  { id: "caos-arcano", name: "Caos Arcano", price: 17.99 }
];

const checkoutEstado = {
  produto: checkoutProdutos[6],
  pagamentoId: "pix",
  jogadorNome: "Não encontrado",
  upsells: new Set(),
  loading: false,
  cardLoading: false,
  paymentId: "",
  pixCopyPaste: "",
  pixGerado: false,
  pollingTimer: null,
  pollingAttempts: 0
};

document.addEventListener("DOMContentLoaded", () => {
  limparUrlPagina("/checkout");
  restaurarCheckout();
  preencherResumo();
  prepararFormulario();
  prepararFormularioCartao();
  prepararUpsells();
  gerarQrVisual();
});

function limparUrlPagina(path) {
  if (window.location.pathname !== path && window.history && window.history.replaceState) {
    window.history.replaceState(null, document.title, path);
  }
}

function restaurarCheckout() {
  checkoutEstado.produto = normalizarProduto(checkoutEstado.produto);

  try {
    const savedProduct = localStorage.getItem("selectedProduct");
    const savedPayment = localStorage.getItem("selectedPaymentId");
    const playerName = localStorage.getItem("playerName");

    if (savedProduct) {
      const parsed = JSON.parse(savedProduct);
      checkoutEstado.produto = normalizarProduto(parsed);
    }

    if (savedPayment && checkoutPagamentos[savedPayment]) {
      checkoutEstado.pagamentoId = savedPayment;
    }

    if (playerName && playerName.trim()) {
      checkoutEstado.jogadorNome = playerName;
    }
  } catch (error) {
    console.error("Não foi possível restaurar o checkout", error);
  }
}

function normalizarProduto(produto) {
  const fallback = checkoutProdutos.find((item) => item.id === produto.id) || checkoutProdutos[6];
  const jogo = getJogoDoProduto(produto);
  const originalAmount = produto.originalAmount !== undefined ? produto.originalAmount : fallback.originalAmount;
  const bonusAmount = produto.bonusAmount !== undefined ? produto.bonusAmount : fallback.bonusAmount || "";
  return {
    ...fallback,
    ...produto,
    name: produto.name || produto.nome || fallback.name,
    gameId: jogo.appId,
    gameName: produto.gameName || jogo.name,
    gameIcon: produto.gameIcon || jogo.icon,
    gameBanner: produto.gameBanner || jogo.banner,
    coinIcon: produto.coinIcon || jogo.coinIcon,
    coinAlt: produto.coinAlt || jogo.coinAlt,
    itemPlural: jogo.itemPlural,
    originalAmount,
    bonusAmount,
    totalAmount: produto.totalAmount || calcularTotalDiamantes(originalAmount, bonusAmount) || fallback.totalAmount,
    price: Number(produto.price || fallback.price),
    formattedPrice: produto.formattedPrice || fallback.formattedPrice
  };
}

function getJogoDoProduto(produto) {
  const savedApp = getSelectedAppId();
  const appId = produto.gameId || savedApp || "100067";
  return checkoutJogos[appId] || checkoutJogos["100067"];
}

function getSelectedAppId() {
  try {
    return localStorage.getItem("selectedAppId") || "";
  } catch (error) {
    return "";
  }
}

function calcularTotalDiamantes(originalAmount, bonusAmount) {
  const original = Number(String(originalAmount || "").replace(/\D/g, ""));
  const bonus = Number(String(bonusAmount || "").replace(/\D/g, ""));
  if (!original && !bonus) return "";
  return formatarMilhar(original + bonus);
}

function formatarMilhar(valor) {
  return new Intl.NumberFormat("pt-BR").format(valor);
}

function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
}

function getUpsellsSelecionados() {
  document.querySelectorAll(".upsell-option.is-selected").forEach((button) => {
    if (button.dataset.upsellId) checkoutEstado.upsells.add(button.dataset.upsellId);
  });

  return checkoutUpsells.filter((item) => checkoutEstado.upsells.has(item.id));
}

function getTotalCheckout() {
  const produto = checkoutEstado.produto || checkoutProdutos[0];
  return produto.price + getUpsellsSelecionados().reduce((sum, item) => sum + item.price, 0);
}

function atualizarResumoPreco(valor) {
  const target = document.getElementById("summaryPrice");
  if (target) target.textContent = formatarMoeda(Number(valor || 0));
}

function getPagamentoAtual() {
  return checkoutPagamentos[checkoutEstado.pagamentoId] || checkoutPagamentos.pix;
}

function isCartaoCredito() {
  return getPagamentoAtual().flow === "cc";
}

function isPagamentoQrCode() {
  return getPagamentoAtual().flow === "pix";
}

function getMetodoBackendPagamento() {
  return isPagamentoQrCode() ? "pix" : "credit_card";
}

function preencherResumo() {
  const produto = checkoutEstado.produto;
  const pagamento = getPagamentoAtual();
  const cardFlow = isCartaoCredito();
  atualizarIdentidadeJogo(produto);

  document.getElementById("summaryTotal").textContent = produto.totalAmount || produto.name;
  document.getElementById("summaryOriginal").textContent = produto.originalAmount || produto.name;
  document.getElementById("summaryBonus").textContent = produto.bonusAmount || "0";
  atualizarResumoPreco(getTotalCheckout());
  document.getElementById("summaryPayment").textContent = pagamento.label;
  document.getElementById("summaryPlayer").textContent = checkoutEstado.jogadorNome || "Não encontrado";

  const breakdown = document.getElementById("summaryBreakdown");
  const summaryNote = document.querySelector(".summary-note");
  const bonusRow = document.getElementById("summaryBonus").closest(".summary-row");
  breakdown.classList.toggle("is-hidden", !produto.bonusAmount && !produto.originalAmount);
  breakdown.classList.toggle("single-row", !produto.bonusAmount);
  if (bonusRow) bonusRow.classList.toggle("is-hidden", !produto.bonusAmount);
  if (summaryNote) {
    summaryNote.textContent = `Os ${produto.itemPlural || "itens"} são válidos apenas para a região do Brasil e serão creditados diretamente na conta de jogo.`;
    summaryNote.classList.toggle("is-hidden", cardFlow);
  }

  document.getElementById("summaryPlayerRow").classList.toggle("is-hidden", cardFlow);
  document.getElementById("checkoutFormPanel").classList.toggle("is-hidden", cardFlow);
  document.getElementById("cardFormPanel").classList.toggle("is-hidden", !cardFlow);
  document.body.classList.toggle("credit-card-checkout", cardFlow);

  preencherParcelas();
  atualizarTotalUpsell();
}

function atualizarIdentidadeJogo(produto) {
  const jogo = getJogoDoProduto(produto);
  const gameId = produto.gameId || jogo.appId;
  const gameName = produto.gameName || jogo.name;
  const gameIcon = produto.gameIcon || jogo.icon;
  const gameBanner = produto.gameBanner || jogo.banner;
  const coinIcon = produto.coinIcon || jogo.coinIcon;
  const coinUrl = new URL(coinIcon, window.location.href).href;

  document.body.dataset.appId = gameId;
  document.body.style.setProperty("--checkout-coin-icon", `url("${coinUrl}")`);
  document.title = `Centro de Recarga ${gameName}`;

  const gameBlock = document.getElementById("checkoutGameBlock");
  if (gameBlock) gameBlock.setAttribute("aria-label", gameName);

  const headerAvatar = document.getElementById("checkoutHeaderAvatar");
  if (headerAvatar) {
    headerAvatar.src = gameIcon;
    headerAvatar.alt = gameName;
  }

  const banner = document.getElementById("checkoutBannerImg");
  if (banner) {
    banner.src = gameBanner;
    banner.alt = `${gameName} Banner`;
  }

  const icon = document.getElementById("checkoutGameIconImg");
  if (icon) {
    icon.src = gameIcon;
    icon.alt = gameName;
  }

  const title = document.getElementById("checkoutGameTitle");
  if (title) title.textContent = gameName;

  const backLink = document.getElementById("checkoutBackLink");
  if (backLink) {
    backLink.href = "/";
  }
}

function prepararFormulario() {
  const form = document.getElementById("checkoutForm");
  const promoInput = document.getElementById("promoCode");
  const promoButton = document.getElementById("promoApply");
  const phoneInput = document.getElementById("customerPhone");
  const documentInput = document.getElementById("customerDocument");

  form.addEventListener("submit", continuarPagamento);

  form.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => {
      if (input === phoneInput) input.value = mascararTelefone(input.value);
      if (input === documentInput) input.value = mascararCpf(input.value);
      if (input === promoInput) atualizarBotaoPromo();
      validarFormulario(false);
    });
    input.addEventListener("blur", () => validarCampo(input.name, true));
  });

  promoButton.addEventListener("click", aplicarPromocional);
  atualizarBotaoPromo();
  validarFormulario(false);
}

function prepararFormularioCartao() {
  const form = document.getElementById("cardCheckoutForm");
  const installments = document.getElementById("cardInstallments");
  if (!form || !installments) return;

  form.addEventListener("submit", continuarPagamentoCartao);

  const maskById = {
    cardNumber: mascararNumeroCartao,
    cardDueDate: mascararValidade,
    cardCVV: mascararCvv,
    cardCpf: mascararCpf,
    cardDob: mascararDataNascimento,
    cardPhone: mascararTelefone
  };

  form.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => {
      const mask = maskById[input.id];
      if (mask) input.value = mask(input.value);
      validarFormularioCartao(false);
    });
    input.addEventListener("blur", () => validarCampoCartao(getCampoCartao(input), true));
  });

  installments.addEventListener("change", () => {
    atualizarTextoParcelas();
    validarCampoCartao("installments", true);
  });

  validarFormularioCartao(false);
}

function getCampoCartao(input) {
  const byId = {
    cardNumber: "cardNumber",
    cardDueDate: "cardDueDate",
    cardCVV: "cardCVV",
    cardholderName: "name",
    cardEmail: "email",
    cardCpf: "cpf",
    cardDob: "dob",
    cardPhone: "phone"
  };
  return byId[input.id] || input.name;
}

function preencherParcelas() {
  const select = document.getElementById("cardInstallments");
  if (!select) return;

  select.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Selecione o número de parcelas";
  select.appendChild(placeholder);

  for (let count = 1; count <= 12; count += 1) {
    const option = document.createElement("option");
    option.value = String(count);
    option.textContent = getTextoParcela(count);
    select.appendChild(option);
  }

  select.value = "";
  atualizarTextoParcelas();
}

function getTextoParcela(count) {
  const valor = checkoutEstado.produto.price / count;
  const juros = count <= 3 ? "sem juros" : "com juros";
  return `${count}x de ${formatarMoeda(valor)} ${juros}`;
}

function atualizarTextoParcelas() {
  const select = document.getElementById("cardInstallments");
  const text = document.getElementById("installmentButtonText");
  if (!select || !text) return;
  const selected = select.options[select.selectedIndex];
  text.textContent = selected && selected.value ? selected.textContent : "Selecione o número de parcelas";
}

function mascararTelefone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits ? `(${digits}` : "";
  if (digits.length <= 3) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3, 7)}-${digits.slice(7)}`;
}

function mascararNumeroCartao(value) {
  const digits = value.replace(/\D/g, "").slice(0, 19);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function mascararValidade(value) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function mascararCvv(value) {
  return value.replace(/\D/g, "").slice(0, 4);
}

function mascararCpf(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function mascararDataNascimento(value) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function atualizarBotaoPromo() {
  const promoInput = document.getElementById("promoCode");
  const promoButton = document.getElementById("promoApply");
  const hasCode = Boolean(promoInput.value.trim());
  promoButton.classList.toggle("is-disabled", !hasCode);
}

function aplicarPromocional() {
  const promoInput = document.getElementById("promoCode");
  if (!promoInput.value.trim()) {
    mostrarErro("promo", "");
    return;
  }
  mostrarErro("promo", "Código promocional inválido.");
}

function validarFormulario(exibirErros) {
  const nameOk = validarCampo("name", exibirErros);
  const emailOk = validarCampo("email", exibirErros);
  const documentOk = validarCampo("document", exibirErros);
  const phoneOk = validarCampo("phone", exibirErros);
  const productOk = Boolean(checkoutEstado.produto);
  const paymentOk = Boolean(checkoutEstado.pagamentoId);
  const ok = nameOk && emailOk && documentOk && phoneOk && productOk && paymentOk;
  document.getElementById("checkoutSubmit").disabled = !ok || checkoutEstado.loading;
  return ok;
}

function validarCampo(nomeCampo, exibirErro) {
  const inputMap = {
    name: document.getElementById("customerName"),
    email: document.getElementById("customerEmail"),
    document: document.getElementById("customerDocument"),
    phone: document.getElementById("customerPhone")
  };
  const input = inputMap[nomeCampo];
  if (!input) return true;

  const value = input.value.trim();
  let mensagem = "";

  if (nomeCampo === "name" && !value) {
    mensagem = "Campo obrigatório.";
  }

  if (nomeCampo === "email") {
    if (!value) mensagem = "Campo obrigatório.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) mensagem = "E-mail inválido.";
  }

  if (nomeCampo === "document") {
    if (!value) mensagem = "Campo obrigatorio.";
    else if (!validarCpf(value)) mensagem = "CPF invalido.";
  }

  if (nomeCampo === "phone") {
    const digits = value.replace(/\D/g, "");
    if (!digits) mensagem = "Campo obrigatório.";
    else if (digits.length < 10) mensagem = "Telefone inválido.";
  }

  mostrarErro(nomeCampo, exibirErro ? mensagem : "");
  return !mensagem;
}

function validarFormularioCartao(exibirErros) {
  const campos = ["cardNumber", "cardDueDate", "cardCVV", "installments", "name", "email", "cpf", "dob", "phone"];
  const resultados = campos.map((campo) => validarCampoCartao(campo, exibirErros));
  const ok = resultados.every(Boolean);
  document.getElementById("cardSubmit").disabled = checkoutEstado.cardLoading;
  return ok;
}

function validarCampoCartao(nomeCampo, exibirErro) {
  const inputMap = {
    cardNumber: document.getElementById("cardNumber"),
    cardDueDate: document.getElementById("cardDueDate"),
    cardCVV: document.getElementById("cardCVV"),
    installments: document.getElementById("cardInstallments"),
    name: document.getElementById("cardholderName"),
    email: document.getElementById("cardEmail"),
    cpf: document.getElementById("cardCpf"),
    dob: document.getElementById("cardDob"),
    phone: document.getElementById("cardPhone")
  };
  const input = inputMap[nomeCampo];
  if (!input) return true;

  const value = input.value.trim();
  let mensagem = "";

  if (nomeCampo === "cardNumber") {
    const digits = value.replace(/\D/g, "");
    if (!digits) mensagem = "Campo obrigatório.";
    else if (digits.length < 13 || /^(\d)\1+$/.test(digits)) mensagem = "Número do cartão inválido.";
  }

  if (nomeCampo === "cardDueDate") {
    if (!value) mensagem = "Campo obrigatório.";
    else if (!validarValidadeCartao(value)) mensagem = "Validade inválida.";
  }

  if (nomeCampo === "cardCVV") {
    const digits = value.replace(/\D/g, "");
    if (!digits) mensagem = "Campo obrigatório.";
    else if (digits.length < 3) mensagem = "CVV inválido.";
  }

  if (nomeCampo === "installments" && !value) {
    mensagem = "Campo obrigatório.";
  }

  if (nomeCampo === "name" && !value) {
    mensagem = "Campo obrigatório.";
  }

  if (nomeCampo === "email") {
    if (!value) mensagem = "Campo obrigatório.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) mensagem = "E-mail inválido.";
  }

  if (nomeCampo === "cpf") {
    if (!value) mensagem = "Campo obrigatório.";
    else if (!validarCpf(value)) mensagem = "CPF inválido.";
  }

  if (nomeCampo === "dob") {
    if (!value) mensagem = "Campo obrigatório.";
    else if (!validarDataNascimento(value)) mensagem = "Data inválida.";
  }

  if (nomeCampo === "phone") {
    const digits = value.replace(/\D/g, "");
    if (!digits) mensagem = "Campo obrigatório.";
    else if (digits.length < 10) mensagem = "Telefone inválido.";
  }

  mostrarErroCartao(nomeCampo, exibirErro ? mensagem : "");
  return !mensagem;
}

function validarValidadeCartao(value) {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 4) return false;
  const month = Number(digits.slice(0, 2));
  return month >= 1 && month <= 12;
}

function validarCpf(value) {
  const cpf = value.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i += 1) soma += Number(cpf[i]) * (10 - i);
  let digito = (soma * 10) % 11;
  if (digito === 10) digito = 0;
  if (digito !== Number(cpf[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i += 1) soma += Number(cpf[i]) * (11 - i);
  digito = (soma * 10) % 11;
  if (digito === 10) digito = 0;
  return digito === Number(cpf[10]);
}

function validarDataNascimento(value) {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 8) return false;
  const day = Number(digits.slice(0, 2));
  const month = Number(digits.slice(2, 4));
  const year = Number(digits.slice(4));
  const date = new Date(year, month - 1, day);
  const today = new Date();
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day && date < today;
}

function mostrarErro(campo, mensagem) {
  const errorMap = {
    promo: document.getElementById("promoError"),
    name: document.getElementById("nameError"),
    email: document.getElementById("emailError"),
    document: document.getElementById("documentError"),
    phone: document.getElementById("phoneError")
  };
  const error = errorMap[campo];
  if (!error) return;
  error.textContent = mensagem;
  const field = error.closest(".checkout-field");
  if (field) field.classList.toggle("has-error", Boolean(mensagem));
}

function mostrarErroCartao(campo, mensagem) {
  const errorMap = {
    cardNumber: document.getElementById("cardNumberError"),
    cardDueDate: document.getElementById("cardDueDateError"),
    cardCVV: document.getElementById("cardCvvError"),
    installments: document.getElementById("cardInstallmentsError"),
    name: document.getElementById("cardNameError"),
    email: document.getElementById("cardEmailError"),
    cpf: document.getElementById("cardCpfError"),
    dob: document.getElementById("cardDobError"),
    phone: document.getElementById("cardPhoneError")
  };
  const error = errorMap[campo];
  if (!error) return;

  error.textContent = mensagem;
  const field = error.closest(".checkout-field");
  if (field) {
    field.classList.toggle("has-error", Boolean(mensagem));
    const control = field.querySelector("input, select");
    if (control) control.setAttribute("aria-invalid", String(Boolean(mensagem)));
  }
}

function continuarPagamento(event) {
  event.preventDefault();
  if (!validarFormulario(true)) return;

  if (!isPagamentoQrCode()) {
    mostrarErroPagamento("Este metodo de pagamento ainda nao esta disponivel. Escolha Pix para continuar.");
    return;
  }

  if (checkoutEstado.pixGerado) {
    mostrarTelaPix();
    return;
  }

  mostrarLoading(true);
  window.setTimeout(() => {
    mostrarLoading(false);
    abrirUpsellModal();
  }, 700);
}

function continuarPagamentoCartao(event) {
  event.preventDefault();
  mostrarErroPagamento("Pagamento com cartao estara disponivel em breve. Escolha Pix para continuar.");
}

function mostrarLoading(loading) {
  checkoutEstado.loading = loading;
  const submit = document.getElementById("checkoutSubmit");
  submit.textContent = loading ? "Aguarde..." : "Prosseguir para pagamento";
  validarFormulario(false);
}

function mostrarLoadingCartao(loading) {
  checkoutEstado.cardLoading = loading;
  const submit = document.getElementById("cardSubmit");
  submit.textContent = loading ? "Aguarde..." : "Prosseguir para pagamento";
  submit.disabled = loading;
}

function prepararUpsells() {
  document.querySelectorAll(".upsell-option").forEach((button) => {
    button.addEventListener("click", () => selecionarProduto(button.dataset.upsellId));
  });
  document.getElementById("upsellClose").addEventListener("click", fecharUpsellModal);
  document.getElementById("checkoutModalBackdrop").addEventListener("click", fecharUpsellModal);
  document.getElementById("upsellFinish").addEventListener("click", finalizarPedido);
  document.getElementById("pixCopy").addEventListener("click", copiarCodigoPix);

  const historyButton = document.getElementById("cardHistoryButton");
  if (historyButton) {
    historyButton.addEventListener("click", () => {
      mostrarToast("Histórico de transações", "Área preparada para integração futura.");
    });
  }
}

function selecionarProduto(upsellId) {
  if (!checkoutUpsells.some((item) => item.id === upsellId)) return;
  if (checkoutEstado.upsells.has(upsellId)) {
    checkoutEstado.upsells.delete(upsellId);
  } else {
    checkoutEstado.upsells.add(upsellId);
  }

  document.querySelectorAll(".upsell-option").forEach((button) => {
    button.classList.toggle("is-selected", checkoutEstado.upsells.has(button.dataset.upsellId));
  });
  atualizarTotalUpsell();
  atualizarResumoPreco(getTotalCheckout());
}

function atualizarTotalUpsell() {
  const total = getTotalCheckout();
  const target = document.getElementById("upsellTotal");
  if (target) target.textContent = formatarMoeda(total);
}

function abrirUpsellModal() {
  document.getElementById("checkoutModalBackdrop").classList.remove("is-hidden");
  document.getElementById("upsellModal").classList.remove("is-hidden");
}

function fecharUpsellModal() {
  document.getElementById("checkoutModalBackdrop").classList.add("is-hidden");
  document.getElementById("upsellModal").classList.add("is-hidden");
}

function finalizarPedido() {
  finalizarPagamento();
}

async function finalizarPagamento() {
  if (checkoutEstado.pixGerado) {
    fecharUpsellModal();
    mostrarTelaPix();
    return;
  }

  if (!isPagamentoQrCode()) {
    mostrarErroPagamento("Este metodo de pagamento ainda nao esta disponivel. Escolha Pix para continuar.");
    return;
  }

  const dados = coletarDadosPagamento();
  bloquearBotaoPagamento();

  try {
    const response = await criarPagamentoPix(dados);
    if (!response.success) {
      throw new Error(response.message || "Nao foi possivel gerar o Pix.");
    }
    fecharUpsellModal();
    renderizarPix(response);
    iniciarPollingPagamento(response.payment_id);
  } catch (error) {
    mostrarErroPagamento(error.message || "Nao foi possivel gerar o Pix. Tente novamente.");
    liberarBotaoPagamento();
  }
}

function coletarDadosPagamento() {
  const upsellsSelecionados = getUpsellsSelecionados();
  return {
    payment_method: getMetodoBackendPagamento(),
    selected_payment_method: checkoutEstado.pagamentoId,
    product_id: checkoutEstado.produto.id,
    upsell_ids: upsellsSelecionados.map((item) => item.id),
    customer: {
      name: document.getElementById("customerName").value.trim(),
      email: document.getElementById("customerEmail").value.trim(),
      phone: document.getElementById("customerPhone").value.replace(/\D/g, ""),
      document: document.getElementById("customerDocument").value.replace(/\D/g, "")
    }
  };
}

async function criarPagamentoPix(dados) {
  const response = await fetch("api/create-payment.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(dados)
  });

  const json = await response.json().catch(() => ({
    success: false,
    message: "Resposta invalida do servidor."
  }));

  if (!response.ok && !json.message) {
    json.message = "Erro ao comunicar com a BlackCat Pay.";
  }

  return json;
}

function renderizarPix(response) {
  checkoutEstado.paymentId = response.payment_id || "";
  checkoutEstado.pixCopyPaste = response.pix_copy_paste || "";
  checkoutEstado.pixGerado = true;
  const totalPago = Number(response.amount || getTotalCheckout());
  checkoutEstado.produto.formattedPrice = formatarMoeda(totalPago);
  atualizarResumoPreco(totalPago);

  try {
    localStorage.setItem("lastPaymentSummary", JSON.stringify({
      payment_id: checkoutEstado.paymentId,
      product_name: checkoutEstado.produto.name,
      game_name: checkoutEstado.produto.gameName,
      amount: totalPago,
      status: response.status || "pending"
    }));
  } catch (error) {
    // Sem persistencia local obrigatoria.
  }

  mostrarTelaPix();
  mostrarPagamentoPendente();
  document.getElementById("paymentError").textContent = "";
  document.getElementById("pixPaymentId").textContent = checkoutEstado.paymentId ? `ID de pagamento: ${checkoutEstado.paymentId}` : "";
  document.getElementById("pixExpiration").textContent = response.expires_at ? `Valido ate: ${response.expires_at}` : "";
  document.getElementById("pixCode").textContent = checkoutEstado.pixCopyPaste || "Codigo Pix nao retornado pela BlackCat Pay.";
  document.getElementById("pixCopy").disabled = !checkoutEstado.pixCopyPaste;

  const qr = document.getElementById("fakeQr");
  qr.classList.remove("has-image");
  qr.innerHTML = "";

  const qrImage = normalizarImagemQr(response.pix_qr_code);
  if (qrImage) {
    qr.classList.add("has-image");
    const image = document.createElement("img");
    image.className = "pix-qr-image";
    image.src = qrImage;
    image.alt = "QR Code Pix";
    qr.appendChild(image);
  } else if (checkoutEstado.pixCopyPaste) {
    renderizarQrLocal(qr, checkoutEstado.pixCopyPaste);
  } else {
    qr.classList.add("has-image");
    const placeholder = document.createElement("span");
    placeholder.className = "qr-placeholder";
    placeholder.textContent = "Use o Pix copia e cola";
    qr.appendChild(placeholder);
    mostrarErroPagamento("Codigo Pix nao foi retornado pela BlackCat Pay. Gere um novo pagamento ou tente novamente.");
  }

  liberarBotaoPagamento();
}

function renderizarQrLocal(target, pixCode) {
  target.classList.add("has-image");

  if (window.QRCode) {
    try {
      target.innerHTML = "";
      new QRCode(target, {
        text: pixCode,
        width: 174,
        height: 174,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M
      });

      const generated = target.querySelector("img") || target.querySelector("canvas") || target.querySelector("svg");
      if (generated) {
        generated.classList.add("pix-qr-image");
        generated.setAttribute("aria-label", "QR Code Pix");
        return;
      }
    } catch (error) {
      target.innerHTML = "";
    }
  }

  const image = document.createElement("img");
  image.className = "pix-qr-image";
  image.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(pixCode)}`;
  image.alt = "QR Code Pix";
  target.innerHTML = "";
  target.appendChild(image);
}

function normalizarImagemQr(value) {
  const qr = String(value || "").trim().replace(/\s+/g, "");
  if (!qr) return "";
  if (/^data:image\//i.test(qr) || /^https?:\/\//i.test(qr)) return qr;
  if (/^[a-z0-9+/]+=*$/i.test(qr) && qr.length > 80) return `data:image/png;base64,${qr}`;
  return "";
}

function mostrarTelaPix() {
  // Pix real via backend PHP. Credenciais e chamada para a BlackCat Pay ficam fora do JavaScript.
  const pagamento = getPagamentoAtual();
  document.getElementById("checkoutFormPanel").classList.add("is-hidden");
  document.getElementById("cardFormPanel").classList.add("is-hidden");
  document.getElementById("summaryPlayerRow").classList.add("is-hidden");
  document.getElementById("summaryPayment").textContent = pagamento.finishLabel || pagamento.label;
  document.getElementById("pixPanelTitle").textContent = `Pague com ${pagamento.finishLabel || pagamento.label}`;
  document.getElementById("pixPanel").classList.remove("is-hidden");
  document.getElementById("cardStatusPage").classList.add("is-hidden");
  document.body.classList.remove("card-status-mode");
  window.scrollTo({ top: 0, left: 0 });
}

function iniciarPollingPagamento(paymentId) {
  pararPollingPagamento();
  if (!paymentId) return;

  checkoutEstado.pollingAttempts = 0;
  checkoutEstado.pollingTimer = window.setInterval(() => {
    verificarStatusPagamento(paymentId);
  }, 8000);
  verificarStatusPagamento(paymentId);
}

async function verificarStatusPagamento(paymentId) {
  checkoutEstado.pollingAttempts += 1;

  try {
    const response = await fetch(`api/check-payment.php?payment_id=${encodeURIComponent(paymentId)}`, {
      method: "GET",
      headers: { "Accept": "application/json" }
    });
    const json = await response.json();

    if (!response.ok || !json.success) {
      throw new Error(json.message || "Nao foi possivel consultar o pagamento.");
    }

    if (json.status === "approved") {
      mostrarPagamentoAprovado();
      return;
    }

    if (["rejected", "expired", "cancelled"].includes(json.status)) {
      pararPollingPagamento();
      mostrarErroPagamento("Pagamento nao aprovado. Gere um novo Pix ou tente novamente.");
      liberarBotaoPagamento();
      return;
    }

    mostrarPagamentoPendente();
  } catch (error) {
    if (checkoutEstado.pollingAttempts >= 30) {
      pararPollingPagamento();
      mostrarErroPagamento("Nao foi possivel confirmar o pagamento automaticamente. Atualize a pagina ou consulte o suporte.");
    }
  }
}

function pararPollingPagamento() {
  if (checkoutEstado.pollingTimer) {
    window.clearInterval(checkoutEstado.pollingTimer);
    checkoutEstado.pollingTimer = null;
  }
}

function mostrarPagamentoAprovado() {
  pararPollingPagamento();
  const status = document.getElementById("pixStatusText");
  if (status) {
    status.textContent = "Pagamento aprovado";
    status.classList.add("is-approved");
  }

  try {
    localStorage.setItem("lastPaymentStatus", "approved");
  } catch (error) {
    // Sem persistencia local obrigatoria.
  }

  window.setTimeout(() => {
    window.location.href = "/obrigado.html";
  }, 1200);
}

function mostrarPagamentoPendente() {
  const status = document.getElementById("pixStatusText");
  if (status) {
    status.textContent = "Aguardando pagamento";
    status.classList.remove("is-approved");
  }
}

function mostrarErroPagamento(mensagem) {
  const error = document.getElementById("paymentError");
  if (error) error.textContent = mensagem;
  mostrarToast("Pagamento", mensagem);
}

function bloquearBotaoPagamento() {
  checkoutEstado.loading = true;
  const buttons = [document.getElementById("upsellFinish"), document.getElementById("checkoutSubmit")];
  buttons.forEach((button) => {
    if (!button) return;
    button.disabled = true;
    button.dataset.originalText = button.dataset.originalText || button.textContent;
    button.textContent = "Aguarde...";
  });
}

function liberarBotaoPagamento() {
  checkoutEstado.loading = false;
  const buttons = [document.getElementById("upsellFinish"), document.getElementById("checkoutSubmit")];
  buttons.forEach((button) => {
    if (!button) return;
    button.disabled = false;
    if (button.dataset.originalText) button.textContent = button.dataset.originalText;
  });
  validarFormulario(false);
}

function mostrarTelaAnaliseCartao() {
  // FUTURA INTEGRAÇÃO:
  // A cobrança de cartão deve ser feita por backend seguro ou tokenização oficial do gateway.
  // Nunca salvar número do cartão, CVV, CPF ou dados bancários sensíveis no front-end.
  limparFormularioCartao();
  document.getElementById("checkoutCard").classList.add("is-hidden");
  document.getElementById("cardStatusPage").classList.remove("is-hidden");
  document.getElementById("cardTransactionId").textContent = "1778180971385404744";
  document.body.classList.add("card-status-mode");
  window.scrollTo({ top: 0, left: 0 });
}

function limparFormularioCartao() {
  const campos = ["cardNumber", "cardDueDate", "cardCVV", "cardInstallments", "cardholderName", "cardEmail", "cardCpf", "cardDob", "cardPhone"];
  campos.forEach((id) => {
    const control = document.getElementById(id);
    if (control) control.value = "";
  });
  atualizarTextoParcelas();
}

function gerarQrVisual() {
  const qr = document.getElementById("fakeQr");
  if (!qr) return;
  qr.innerHTML = "";

  for (let y = 0; y < 41; y += 1) {
    for (let x = 0; x < 41; x += 1) {
      const cell = document.createElement("span");
      if (moduloQrEscuro(x, y)) cell.className = "is-dark";
      qr.appendChild(cell);
    }
  }
}

function moduloQrEscuro(x, y) {
  if (finderQr(x, y, 0, 0) || finderQr(x, y, 34, 0) || finderQr(x, y, 0, 34)) return true;
  if (areaBrancaFinder(x, y, 0, 0) || areaBrancaFinder(x, y, 34, 0) || areaBrancaFinder(x, y, 0, 34)) return false;
  const value = (x * 17 + y * 31 + x * y * 7) % 11;
  return value === 0 || value === 2 || value === 5 || (x % 5 === 0 && y % 3 === 0);
}

function finderQr(x, y, ox, oy) {
  const dx = x - ox;
  const dy = y - oy;
  if (dx < 0 || dy < 0 || dx > 6 || dy > 6) return false;
  const edge = dx === 0 || dy === 0 || dx === 6 || dy === 6;
  const center = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
  return edge || center;
}

function areaBrancaFinder(x, y, ox, oy) {
  const dx = x - ox;
  const dy = y - oy;
  return dx >= -1 && dx <= 7 && dy >= -1 && dy <= 7;
}

async function copiarCodigoPix() {
  const code = checkoutEstado.pixCopyPaste || document.getElementById("pixCode").textContent.trim();
  if (!code) {
    mostrarToast("Pix", "Codigo Pix ainda nao disponivel.");
    return;
  }
  try {
    await navigator.clipboard.writeText(code);
    mostrarToast("Código copiado", "Código Pix copiado.");
  } catch (error) {
    mostrarToast("Copie manualmente", "Selecione o código Pix na tela.");
  }
}

function mostrarToast(titulo, descricao) {
  const region = document.getElementById("toastRegion");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<strong>${titulo}</strong><span>${descricao}</span>`;
  region.appendChild(toast);
  window.setTimeout(() => toast.remove(), 3600);
}

