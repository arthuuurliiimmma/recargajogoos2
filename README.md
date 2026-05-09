# RecargaJogo Clone

Projeto estatico do Centro de Recarga com home, checkout, pagina de aprovado e integracao Pix via backend PHP para ParadisePags. Continua compativel com hospedagem compartilhada na Hostinger.

## Como abrir localmente

Para navegar pela home, basta abrir `index.html` no navegador. Para testar os endpoints PHP, use um ambiente com PHP/cURL habilitado, por exemplo Apache local, XAMPP ou a propria Hostinger.

Rotas principais:

- Home limpa: `/`
- Checkout limpo: `/checkout`
- Pagamento aprovado limpo: `/obrigado`
- Arquivo da home: `index.html`
- Arquivo do checkout: `checkout.html`
- Arquivo de aprovado: `obrigado.html`

## Como subir na Hostinger

Envie o conteudo da pasta `recargajogo-clone` para `public_html`:

- `index.html`
- `.htaccess`
- `checkout.html`
- `obrigado.html`
- `assets/*`
- `api/*`

Ative PHP com cURL na hospedagem. Nao precisa de Node, build, banco de dados ou servidor customizado.

## Configurar ParadisePags

A documentacao oficial fica em:

```text
https://multi.paradisepags.com/documentation
```

O projeto ja foi ajustado para os dados oficiais:

- Base URL: `https://multi.paradisepags.com`
- Autenticacao: header `X-API-Key`
- Criar Pix: `POST /api/v1/transaction.php`
- Consultar status: `GET /api/v1/query.php?action=get_transaction&id={id}`
- Formato: JSON
- Valores: centavos

Edite `api/config.php` se precisar trocar a chave ou URL:

- `PARADISEPAGS_API_BASE_URL`
- `PARADISEPAGS_SECRET_KEY`
- `PARADISEPAGS_WEBHOOK_SECRET`
- `PARADISEPAGS_SOURCE`
- `PARADISEPAGS_PRODUCT_HASH`
- `APP_BASE_URL`

`PARADISEPAGS_SECRET_KEY` deve conter a Secret Key privada do painel ParadisePags. Nunca coloque essa chave no JavaScript.

## Webhook

Configure no painel ParadisePags a URL:

```text
https://recargasjogo.sbs/api/webhook-paradisepags.php
```

O arquivo `api/webhook-blackcatpay.php` continua existindo apenas como compatibilidade com a URL antiga, mas o webhook novo deve ser o da ParadisePags.

## Como testar Pix

1. Preencha `api/config.php` com os dados oficiais.
2. Suba para a Hostinger ou rode em ambiente PHP local.
3. Na home, selecione produto e metodo Pix, PicPay, NuPay ou Mercado Pago.
4. No checkout, preencha nome, e-mail, CPF e telefone.
5. Clique para finalizar.
6. O front-end chama `api/create-payment.php`.
7. O PHP calcula o valor pelo `product_id` e pelos itens de `Promocao Especial`, chama a ParadisePags e retorna QR Code/copia e cola.
   PicPay, NuPay e Mercado Pago usam a mesma cobranca Pix por QR Code. Cartao continua sem integracao real.
8. Se a ParadisePags retornar somente o Pix copia e cola, o arquivo local `assets/js/qrcode.min.js` gera um QR Code valido no navegador.
9. O checkout consulta `api/check-payment.php` ate o status virar `approved`, `rejected`, `expired` ou `cancelled`.
10. Quando `approved`, redireciona para `obrigado.html`.

## Produtos e valores

Os valores confiaveis ficam no backend, em `getAllowedProducts()` dentro de `api/create-payment.php`. Edite esse array para alterar precos, nomes ou descricoes. O front-end nao define o valor cobrado.

Os itens do modal `Promocao Especial` tambem sao validados no backend em `getAllowedUpsells()`. Quando o usuario seleciona esses itens, o checkout envia apenas os IDs e o PHP soma os valores no servidor antes de criar a venda na ParadisePags.

## Arquivos principais

- Home: `index.html`
- Checkout: `checkout.html`
- Pagina de aprovado: `obrigado.html`
- CSS geral: `assets/css/style.css`
- CSS do checkout: `assets/css/checkout.css`
- Home/login/produtos: `assets/js/main.js`
- Checkout/Pix/polling: `assets/js/checkout.js`
- Gerador local de QR Code Pix: `assets/js/qrcode.min.js`
- Configuracao ParadisePags: `api/config.php`
- Cliente cURL ParadisePags: `api/paradisepags.php`
- Criar Pix: `api/create-payment.php`
- Consultar status: `api/check-payment.php`
- Webhook atual: `api/webhook-paradisepags.php`
- Webhook antigo compatibilidade: `api/webhook-blackcatpay.php`
- Logs protegidos: `api/logs`

## Cartao e outros metodos

Cartao nao foi integrado. Ao tentar finalizar cartao, o checkout mostra:

```text
Pagamento com cartao estara disponivel em breve. Escolha Pix para continuar.
```

PicPay, NuPay e Mercado Pago usam o mesmo endpoint Pix para gerar QR Code. Qualquer outro metodo deve continuar visual ate existir endpoint oficial documentado da ParadisePags. Nao invente endpoints.

## Seguranca

- Nenhuma credencial fica no JavaScript.
- O front-end chama apenas os endpoints PHP locais.
- O backend valida metodo, cliente e produto.
- O valor e calculado no backend.
- Logs mascaram CPF e removem token/secret.
- `api/logs/.htaccess` bloqueia acesso direto aos logs.
- Nao salve numero de cartao, CVV, senhas ou dados bancarios no front-end.
