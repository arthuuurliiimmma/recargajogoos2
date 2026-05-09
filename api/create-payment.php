<?php
require __DIR__ . '/paradisepags.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(405, ['success' => false, 'message' => 'Metodo nao permitido.']);
}

$contentType = $_SERVER['CONTENT_TYPE'] ?? $_SERVER['HTTP_CONTENT_TYPE'] ?? '';
if (stripos($contentType, 'application/json') === false) {
    jsonResponse(415, ['success' => false, 'message' => 'Content-Type deve ser application/json.']);
}

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) {
    jsonResponse(400, ['success' => false, 'message' => 'JSON invalido.']);
}

$products = getAllowedProducts();
$upsells = getAllowedUpsells();
$paymentMethod = strtolower(trim((string) ($input['payment_method'] ?? '')));
$pixLikeMethods = [
    'pix',
    'payment-pix',
    'picpay',
    'payment-picpay',
    'nupay',
    'payment-nupay',
    'mercado',
    'mercadopago',
    'payment-mercado',
    'payment-mercadopago',
];
$productId = trim((string) ($input['product_id'] ?? ''));
$upsellIds = [];
foreach (['upsell_ids', 'upsells', 'selected_upsells', 'addon_ids'] as $upsellField) {
    if (is_array($input[$upsellField] ?? null)) {
        $upsellIds = array_merge($upsellIds, $input[$upsellField]);
    }
}
$customer = is_array($input['customer'] ?? null) ? $input['customer'] : [];

if ($paymentMethod === '') {
    jsonResponse(400, ['success' => false, 'message' => 'Metodo de pagamento obrigatorio.']);
}

if ($paymentMethod === 'cc' || $paymentMethod === 'card' || $paymentMethod === 'credit_card') {
    jsonResponse(400, [
        'success' => false,
        'message' => 'Pagamento com cartao estara disponivel em breve. Escolha Pix para continuar.',
    ]);
}

if (!in_array($paymentMethod, $pixLikeMethods, true)) {
    jsonResponse(400, [
        'success' => false,
        'message' => 'Este metodo de pagamento ainda nao esta disponivel. Escolha Pix para continuar.',
    ]);
}

$paymentMethod = 'pix';

if ($productId === '' || !isset($products[$productId])) {
    jsonResponse(400, ['success' => false, 'message' => 'Produto invalido.']);
}

$name = trim((string) ($customer['name'] ?? ''));
$email = trim((string) ($customer['email'] ?? ''));
$phone = onlyDigits($customer['phone'] ?? '');
$document = onlyDigits($customer['document'] ?? '');

if ($name === '') {
    jsonResponse(400, ['success' => false, 'message' => 'Nome completo obrigatorio.']);
}

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(400, ['success' => false, 'message' => 'E-mail invalido.']);
}

if (strlen($phone) < 10 || strlen($phone) > 11) {
    jsonResponse(400, ['success' => false, 'message' => 'Telefone invalido.']);
}

if (!isValidCpf($document)) {
    jsonResponse(400, ['success' => false, 'message' => 'CPF invalido.']);
}

$product = $products[$productId];
$selectedUpsells = [];
foreach ($upsellIds as $upsellId) {
    $upsellId = trim((string) $upsellId);
    if ($upsellId === '') {
        continue;
    }
    if (!isset($upsells[$upsellId])) {
        jsonResponse(400, ['success' => false, 'message' => 'Item promocional invalido.']);
    }
    $selectedUpsells[$upsellId] = $upsells[$upsellId];
}

$externalId = 'RJ-' . date('YmdHis') . '-' . bin2hex(random_bytes(4));
$amount = (float) $product['amount'];
$items = [
    [
        'id' => $productId,
        'name' => $product['name'],
        'amount' => (float) $product['amount'],
        'description' => $product['description'],
    ],
];

foreach ($selectedUpsells as $upsellId => $upsell) {
    $amount += (float) $upsell['amount'];
    $items[] = [
        'id' => $upsellId,
        'name' => $upsell['name'],
        'amount' => (float) $upsell['amount'],
        'description' => $upsell['description'],
    ];
}
$amount = round($amount, 2);

$orderData = [
    'external_id' => $externalId,
    'product_id' => $productId,
    'product_name' => $product['name'],
    'upsell_ids' => array_keys($selectedUpsells),
    'amount' => $amount,
    'description' => $product['description'],
    'items' => $items,
    'customer' => [
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'document' => $document,
    ],
];

writeLog('payment.log', [
    'event' => 'create_payment_request',
    'external_id' => $externalId,
    'product_id' => $productId,
    'upsell_ids' => array_keys($selectedUpsells),
    'amount' => $amount,
    'customer' => [
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'document' => $document,
    ],
]);

$payment = createParadisePixPayment($orderData);

if (!$payment['success']) {
    writeLog('error.log', [
        'event' => 'create_payment_failed',
        'external_id' => $externalId,
        'product_id' => $productId,
        'upsell_ids' => array_keys($selectedUpsells),
        'message' => $payment['error'] ?? 'Erro desconhecido',
    ]);

    jsonResponse(502, [
        'success' => false,
        'gateway' => 'paradisepags',
        'message' => $payment['error'] ?? 'Nao foi possivel gerar o Pix.',
    ]);
}

writeLog('payment.log', [
    'event' => 'create_payment_success',
    'external_id' => $externalId,
    'payment_id' => $payment['payment_id'],
    'status' => $payment['status'],
    'amount' => $payment['amount'],
    'upsell_ids' => array_keys($selectedUpsells),
]);

jsonResponse(200, [
    'success' => true,
    'gateway' => 'paradisepags',
    'payment_id' => $payment['payment_id'],
    'method' => 'pix',
    'status' => $payment['status'],
    'amount' => $payment['amount'],
    'items' => array_map(function ($item) {
        return [
            'id' => $item['id'],
            'name' => $item['name'],
            'amount' => $item['amount'],
        ];
    }, $items),
    'pix_qr_code' => $payment['pix_qr_code'],
    'pix_copy_paste' => $payment['pix_copy_paste'],
    'invoice_url' => $payment['invoice_url'] ?? '',
    'expires_at' => $payment['expires_at'],
]);

function jsonResponse($statusCode, $payload)
{
    http_response_code($statusCode);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function getAllowedProducts()
{
    return [
        'pack-100' => ['name' => '100 Diamantes', 'amount' => 6.00, 'description' => '100 Diamantes Free Fire'],
        'pack-310' => ['name' => '310 Diamantes', 'amount' => 10.99, 'description' => '310 Diamantes Free Fire'],
        'pack-520' => ['name' => '520 Diamantes', 'amount' => 14.90, 'description' => '520 Diamantes Free Fire'],
        'pack-1060' => ['name' => '1.060 Diamantes', 'amount' => 20.99, 'description' => '1.060 Diamantes Free Fire'],
        'pack-2180' => ['name' => '2.180 Diamantes', 'amount' => 44.99, 'description' => '2.180 Diamantes Free Fire'],
        'pack-5600' => ['name' => '5.600 Diamantes', 'amount' => 87.99, 'description' => '5.600 Diamantes Free Fire'],
        'pack-22400' => ['name' => '22.400 Diamantes', 'amount' => 209.99, 'description' => '22.400 Diamantes Free Fire'],
        'offer-weekly-sub' => ['name' => 'Assinatura Semanal', 'amount' => 14.99, 'description' => 'Assinatura Semanal Free Fire'],
        'offer-monthly-sub' => ['name' => 'Assinatura Mensal', 'amount' => 44.99, 'description' => 'Assinatura Mensal Free Fire'],
        'offer-booyah-pass' => ['name' => 'Passe Booyah', 'amount' => 11.99, 'description' => 'Passe Booyah Free Fire'],
        'offer-booyah-premium-plus' => ['name' => 'Passe Booyah Premium Plus', 'amount' => 29.99, 'description' => 'Passe Booyah Premium Plus Free Fire'],

        'df-pack-60' => ['name' => '60 Delta Coins', 'amount' => 4.89, 'description' => '60 Delta Coins Delta Force'],
        'df-pack-300' => ['name' => '300 Delta Coins', 'amount' => 9.49, 'description' => '300 Delta Coins Delta Force'],
        'df-pack-680' => ['name' => '680 Delta Coins', 'amount' => 19.90, 'description' => '680 Delta Coins Delta Force'],
        'df-pack-1280' => ['name' => '1.280 Delta Coins', 'amount' => 37.99, 'description' => '1.280 Delta Coins Delta Force'],
        'df-pack-3280' => ['name' => '3.280 Delta Coins', 'amount' => 97.99, 'description' => '3.280 Delta Coins Delta Force'],
        'df-pack-6480' => ['name' => '6.480 Delta Coins', 'amount' => 149.90, 'description' => '6.480 Delta Coins Delta Force'],
        'df-offer-genesis' => ['name' => 'Black Hawk Down - Genesis', 'amount' => 29.90, 'description' => 'Black Hawk Down Genesis Delta Force'],
        'df-offer-reinvention' => ['name' => 'Black Hawk Down - Reinvencao', 'amount' => 14.90, 'description' => 'Black Hawk Down Reinvencao Delta Force'],
        'df-offer-tide' => ['name' => 'Suprimentos de Mare', 'amount' => 5.99, 'description' => 'Suprimentos de Mare Delta Force'],
        'df-offer-tide-advanced' => ['name' => 'Suprimentos de Mare - Avancado', 'amount' => 7.50, 'description' => 'Suprimentos de Mare Avancado Delta Force'],

        'hq-pack-60' => ['name' => '60 Star Gems', 'amount' => 5.99, 'description' => '60 Star Gems HAIKYU FLY HIGH'],
        'hq-pack-300' => ['name' => '300 Star Gems', 'amount' => 29.99, 'description' => '300 Star Gems HAIKYU FLY HIGH'],
        'hq-pack-980' => ['name' => '980 Star Gems', 'amount' => 65.90, 'description' => '980 Star Gems HAIKYU FLY HIGH'],
        'hq-pack-1980' => ['name' => '1.980 Star Gems', 'amount' => 107.90, 'description' => '1.980 Star Gems HAIKYU FLY HIGH'],
        'hq-pack-3280' => ['name' => '3.280 Star Gems', 'amount' => 144.90, 'description' => '3.280 Star Gems HAIKYU FLY HIGH'],
        'hq-pack-6480' => ['name' => '6.480 Star Gems', 'amount' => 399.90, 'description' => '6.480 Star Gems HAIKYU FLY HIGH'],
        'hq-offer-ultra-1' => ['name' => 'Especial de Recrutar Ultra I', 'amount' => 5.99, 'description' => 'Especial Recrutar Ultra I HAIKYU'],
        'hq-offer-ultra-2' => ['name' => 'Especial de Recrutar Ultra II', 'amount' => 26.99, 'description' => 'Especial Recrutar Ultra II HAIKYU'],
        'hq-offer-memoria-3' => ['name' => 'Especial de Recrutar Memoria III', 'amount' => 52.11, 'description' => 'Especial Recrutar Memoria III HAIKYU'],
        'hq-offer-memoria-4' => ['name' => 'Especial de Recrutar Memoria IV', 'amount' => 77.31, 'description' => 'Especial Recrutar Memoria IV HAIKYU'],
        'hq-offer-novatos' => ['name' => 'Pacote Exclusivo para Novatos', 'amount' => 5.99, 'description' => 'Pacote Exclusivo para Novatos HAIKYU'],
        'hq-offer-torcer-1' => ['name' => 'Oferta Especial Torcer 1a Vez', 'amount' => 35.99, 'description' => 'Oferta Especial Torcer 1a Vez HAIKYU'],
        'hq-offer-memoria-1-vez' => ['name' => 'Oferta Especial Memoria 1a Vez', 'amount' => 125.91, 'description' => 'Oferta Especial Memoria 1a Vez HAIKYU'],
        'hq-offer-recrutar-ultra-4' => ['name' => 'Bilhete de Recrutar Ultra IV', 'amount' => 157.41, 'description' => 'Bilhete de Recrutar Ultra IV HAIKYU'],
        'hq-offer-recrutar-ultra-5' => ['name' => 'Bilhete de Recrutar Ultra V', 'amount' => 265.41, 'description' => 'Bilhete de Recrutar Ultra V HAIKYU'],
        'hq-offer-recrutar-ultra-6' => ['name' => 'Bilhete de Recrutar Ultra VI', 'amount' => 299.99, 'description' => 'Bilhete de Recrutar Ultra VI HAIKYU'],
        'hq-offer-recrutar-1' => ['name' => 'Bilhete de Recrutar x1', 'amount' => 5.99, 'description' => 'Bilhete de Recrutar x1 HAIKYU'],
        'hq-offer-recrutar-5' => ['name' => 'Bilhete de Recrutar x5', 'amount' => 26.99, 'description' => 'Bilhete de Recrutar x5 HAIKYU'],
        'hq-offer-recrutar-10' => ['name' => 'Bilhete de Recrutar x10', 'amount' => 67.49, 'description' => 'Bilhete de Recrutar x10 HAIKYU'],
        'hq-offer-recrutar-20' => ['name' => 'Bilhete de Recrutar x20', 'amount' => 157.41, 'description' => 'Bilhete de Recrutar x20 HAIKYU'],
        'hq-offer-recrutar-30' => ['name' => 'Bilhete de Recrutar x30', 'amount' => 265.41, 'description' => 'Bilhete de Recrutar x30 HAIKYU'],
        'hq-offer-recrutar-55' => ['name' => 'Bilhete de Recrutar x55', 'amount' => 399.91, 'description' => 'Bilhete de Recrutar x55 HAIKYU'],
    ];
}

function getAllowedUpsells()
{
    return [
        'sombra-roxa' => [
            'name' => 'Sombra Roxa',
            'amount' => 9.99,
            'description' => 'Sombra Roxa Free Fire',
        ],
        'barba-velho' => [
            'name' => 'Barba do Velho',
            'amount' => 12.99,
            'description' => 'Barba do Velho Free Fire',
        ],
        'pacote-coelhao' => [
            'name' => 'Pacote Coelhao',
            'amount' => 9.99,
            'description' => 'Pacote Coelhao Free Fire',
        ],
        'calca-angelical' => [
            'name' => 'Calca Angelical Azul',
            'amount' => 24.80,
            'description' => 'Calca Angelical Azul Free Fire',
        ],
        'caos-arcano' => [
            'name' => 'Caos Arcano',
            'amount' => 17.99,
            'description' => 'Caos Arcano Free Fire',
        ],
    ];
}

function isValidCpf($cpf)
{
    $cpf = onlyDigits($cpf);
    if (strlen($cpf) !== 11 || preg_match('/^(\d)\1{10}$/', $cpf)) {
        return false;
    }

    for ($t = 9; $t < 11; $t++) {
        $sum = 0;
        for ($i = 0; $i < $t; $i++) {
            $sum += (int) $cpf[$i] * (($t + 1) - $i);
        }
        $digit = ((10 * $sum) % 11) % 10;
        if ((int) $cpf[$t] !== $digit) {
            return false;
        }
    }

    return true;
}
