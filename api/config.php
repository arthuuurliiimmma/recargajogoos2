<?php
return [
    // Copie as credenciais reais no painel oficial da ParadisePags.
    // Nunca coloque client_secret, token ou webhook_secret em arquivos JavaScript.
    'PARADISEPAGS_API_BASE_URL' => 'https://multi.paradisepags.com',
    'PARADISEPAGS_SECRET_KEY' => 'sk_3217149c7f1e10cad6d7fe9deb40a99f9eb993957f991997f09148fcc32cde59',
    'PARADISEPAGS_WEBHOOK_SECRET' => '',
    'APP_BASE_URL' => 'https://recargasjogo.sbs',
    'ENVIRONMENT' => 'production',

    // Documentacao oficial ParadisePags:
    // https://multi.paradisepags.com/documentation
    'PARADISEPAGS_ENDPOINT_CREATE_PIX' => '/api/v1/transaction.php',
    'PARADISEPAGS_ENDPOINT_CHECK_PAYMENT' => '/api/v1/query.php?action=get_transaction&id={id}',

    // Enviar source=api_externa para nao exigir productHash cadastrado no painel.
    'PARADISEPAGS_SOURCE' => 'api_externa',
    'PARADISEPAGS_PRODUCT_HASH' => '',
];
