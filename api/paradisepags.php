<?php

function paradisepagsConfig()
{
    static $config = null;
    if ($config === null) {
        $config = require __DIR__ . '/config.php';
    }
    return $config;
}

function paradisepagsRequest($method, $endpoint, $payload = [])
{
    $config = paradisepagsConfig();
    $baseUrl = rtrim((string) ($config['PARADISEPAGS_API_BASE_URL'] ?? ''), '/');
    $secretKey = (string) ($config['PARADISEPAGS_SECRET_KEY'] ?? '');

    if ($baseUrl === '' || $secretKey === '') {
        return [
            'success' => false,
            'status_code' => 0,
            'error' => 'ParadisePags nao configurada. Preencha PARADISEPAGS_API_BASE_URL e PARADISEPAGS_SECRET_KEY.',
            'raw' => null,
        ];
    }

    if (!function_exists('curl_init')) {
        return [
            'success' => false,
            'status_code' => 0,
            'error' => 'cURL nao esta habilitado no PHP.',
            'raw' => null,
        ];
    }

    $method = strtoupper($method);
    $url = $baseUrl . '/' . ltrim($endpoint, '/');
    $headers = [
        'Accept: application/json',
        'X-API-Key: ' . $secretKey,
    ];
    $body = null;

    if ($method === 'GET' && !empty($payload)) {
        $url .= (strpos($url, '?') === false ? '?' : '&') . http_build_query($payload);
    } elseif ($method !== 'GET') {
        $body = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $headers[] = 'Content-Type: application/json; charset=utf-8';
    }

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
    ]);

    if ($body !== null) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
    }

    $response = curl_exec($ch);
    $curlError = curl_error($ch);
    $statusCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($response === false) {
        writeLog('error.log', [
            'event' => 'paradisepags_curl_error',
            'endpoint' => $endpoint,
            'error' => $curlError,
        ]);
        return [
            'success' => false,
            'status_code' => $statusCode,
            'error' => 'Falha de comunicacao com a ParadisePags.',
            'raw' => null,
        ];
    }

    $decoded = json_decode($response, true);
    if (!is_array($decoded)) {
        $decoded = ['raw_response' => $response];
    }

    $ok = $statusCode >= 200 && $statusCode < 300;
    if (!$ok) {
        writeLog('error.log', [
            'event' => 'paradisepags_http_error',
            'endpoint' => $endpoint,
            'status_code' => $statusCode,
            'response' => $decoded,
        ]);
    }

    return [
        'success' => $ok,
        'status_code' => $statusCode,
        'error' => $ok ? null : extractParadiseMessage($decoded),
        'raw' => $decoded,
    ];
}

function createParadisePixPayment($orderData)
{
    $config = paradisepagsConfig();
    $endpoint = $config['PARADISEPAGS_ENDPOINT_CREATE_PIX'] ?? '/api/v1/transaction.php';
    $amountInCents = (int) round(((float) $orderData['amount']) * 100);

    $payload = [
        'amount' => $amountInCents,
        'description' => paradiseSubstring($orderData['description'] ?? $orderData['product_name'] ?? 'Produto digital', 0, 120),
        'reference' => $orderData['external_id'],
        'postback_url' => rtrim((string) ($config['APP_BASE_URL'] ?? ''), '/') . '/api/webhook-paradisepags.php',
        'source' => $config['PARADISEPAGS_SOURCE'] ?? 'api_externa',
        'customer' => [
            'name' => $orderData['customer']['name'],
            'email' => $orderData['customer']['email'],
            'phone' => onlyDigits($orderData['customer']['phone']),
            'document' => onlyDigits($orderData['customer']['document']),
        ],
        'tracking' => [
            'src' => 'recargasjogo',
            'sck' => $orderData['external_id'],
        ],
    ];

    if (!empty($config['PARADISEPAGS_PRODUCT_HASH'])) {
        $payload['productHash'] = $config['PARADISEPAGS_PRODUCT_HASH'];
    }

    $gateway = paradisepagsRequest('POST', $endpoint, $payload);
    if (!$gateway['success']) {
        return [
            'success' => false,
            'error' => $gateway['error'] ?: 'Nao foi possivel gerar o Pix.',
            'gateway_response' => $gateway,
        ];
    }

    $raw = unwrapParadiseData($gateway['raw']);
    $paymentId = extractFirstValue($raw, ['transaction_id', 'id']);
    $copyPaste = extractFirstValue($raw, ['qr_code', 'pix_code', 'brcode', 'emv']);
    $qrCode = extractFirstValue($raw, ['qr_code_base64', 'qrcode_base64', 'pix_qr_code', 'qr_code_url', 'qrImageUrl']);
    $statusRaw = extractFirstValue($raw, ['payment_status', 'status']);
    $expiresAt = extractFirstValue($raw, ['expires_at', 'expiration_date', 'dueDate']);

    writeLog('payment.log', [
        'event' => 'paradisepags_create_payment_fields',
        'payment_id' => (string) ($paymentId ?: $orderData['external_id']),
        'response_keys' => array_keys($raw),
        'has_qr_image' => $qrCode !== null && $qrCode !== '',
        'has_copy_paste' => $copyPaste !== null && $copyPaste !== '',
        'amount' => (float) $orderData['amount'],
        'upsell_ids' => $orderData['upsell_ids'] ?? [],
    ]);

    return [
        'success' => true,
        'gateway' => 'paradisepags',
        'payment_id' => (string) ($paymentId ?: $orderData['external_id']),
        'method' => 'pix',
        'status' => normalizeParadiseStatus($statusRaw),
        'amount' => (float) $orderData['amount'],
        'pix_qr_code' => $qrCode ?: '',
        'pix_copy_paste' => $copyPaste ?: '',
        'expires_at' => $expiresAt ?: '',
        'invoice_url' => '',
        'raw' => $raw,
    ];
}

function checkParadisePaymentStatus($paymentId)
{
    $config = paradisepagsConfig();
    $endpointTemplate = $config['PARADISEPAGS_ENDPOINT_CHECK_PAYMENT'] ?? '/api/v1/query.php?action=get_transaction&id={id}';
    $endpoint = str_replace('{id}', rawurlencode($paymentId), $endpointTemplate);

    $gateway = paradisepagsRequest('GET', $endpoint);
    if (!$gateway['success']) {
        return [
            'success' => false,
            'error' => $gateway['error'] ?: 'Nao foi possivel consultar o pagamento.',
            'status' => 'unknown',
        ];
    }

    $raw = unwrapParadiseData($gateway['raw']);
    $status = normalizeParadiseStatus(extractFirstValue($raw, ['payment_status', 'status']));

    return [
        'success' => true,
        'gateway' => 'paradisepags',
        'payment_id' => $paymentId,
        'status' => $status,
        'raw' => $raw,
    ];
}

function validateParadiseWebhook($payload, $headers)
{
    $config = paradisepagsConfig();
    $secret = (string) ($config['PARADISEPAGS_WEBHOOK_SECRET'] ?? '');

    if ($secret === '') {
        return [
            'valid' => true,
            'reason' => 'Webhook secret nao configurado. A documentacao publica nao exige assinatura.',
        ];
    }

    $signature = findHeader($headers, [
        'x-paradise-signature',
        'x-signature',
        'x-webhook-signature',
        'x-hub-signature-256',
    ]);

    if (!$signature) {
        return ['valid' => false, 'reason' => 'Assinatura ausente.'];
    }

    $rawPayload = is_string($payload) ? $payload : json_encode($payload, JSON_UNESCAPED_UNICODE);
    $expected = hash_hmac('sha256', $rawPayload, $secret);
    $signature = preg_replace('/^sha256=/i', '', trim($signature));

    return [
        'valid' => hash_equals($expected, $signature),
        'reason' => 'Assinatura HMAC SHA-256.',
    ];
}

function normalizeParadiseStatus($status)
{
    $status = strtolower(trim((string) $status));

    $map = [
        'success' => 'pending',
        'pending' => 'pending',
        'processing' => 'pending',
        'under_review' => 'pending',
        'waiting_payment' => 'pending',
        'awaiting_payment' => 'pending',
        'approved' => 'approved',
        'paid' => 'approved',
        'completed' => 'approved',
        'failed' => 'rejected',
        'rejected' => 'rejected',
        'cancelled' => 'cancelled',
        'canceled' => 'cancelled',
        'expired' => 'expired',
        'refunded' => 'cancelled',
        'chargeback' => 'cancelled',
    ];

    return $map[$status] ?? 'pending';
}

function maskDocument($document)
{
    $digits = onlyDigits($document);
    if (strlen($digits) <= 4) {
        return '***';
    }
    return str_repeat('*', max(0, strlen($digits) - 4)) . substr($digits, -4);
}

function writeLog($file, $data)
{
    $allowed = ['payment.log', 'webhook.log', 'error.log'];
    if (!in_array($file, $allowed, true)) {
        $file = 'error.log';
    }

    $dir = __DIR__ . '/logs';
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }

    $line = json_encode([
        'time' => date('c'),
        'data' => sanitizeLogData($data),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    file_put_contents($dir . '/' . $file, $line . PHP_EOL, FILE_APPEND | LOCK_EX);
}

function onlyDigits($value)
{
    return preg_replace('/\D+/', '', (string) $value);
}

function unwrapParadiseData($raw)
{
    if (isset($raw['data']) && is_array($raw['data'])) {
        return $raw['data'];
    }
    if (isset($raw['transaction']) && is_array($raw['transaction'])) {
        return $raw['transaction'];
    }
    if (isset($raw['response']) && is_array($raw['response'])) {
        return $raw['response'];
    }
    return is_array($raw) ? $raw : [];
}

function extractFirstValue($data, $keys)
{
    if (!is_array($data)) {
        return null;
    }

    $wanted = array_map('strtolower', array_map('strval', $keys));

    foreach ($data as $key => $value) {
        if (in_array(strtolower((string) $key), $wanted, true) && $value !== '' && !is_array($value)) {
            return $value;
        }
    }

    foreach ($data as $value) {
        if (is_array($value)) {
            $nested = extractFirstValue($value, $keys);
            if ($nested !== null && $nested !== '') {
                return $nested;
            }
        }
    }

    return null;
}

function extractParadiseMessage($raw)
{
    $message = extractFirstValue($raw, ['message', 'error', 'description', 'detail']);
    return is_string($message) && $message !== '' ? $message : 'Erro retornado pela ParadisePags.';
}

function findHeader($headers, $names)
{
    $normalized = [];
    foreach ($headers as $key => $value) {
        $normalized[strtolower($key)] = $value;
    }

    foreach ($names as $name) {
        $name = strtolower($name);
        if (isset($normalized[$name])) {
            return $normalized[$name];
        }
    }

    return null;
}

function sanitizeLogData($data)
{
    if (is_array($data)) {
        $clean = [];
        foreach ($data as $key => $value) {
            $lower = strtolower((string) $key);
            if (in_array($lower, ['client_secret', 'secret', 'secret_key', 'token', 'authorization', 'x-api-key', 'password', 'cvv'], true)) {
                $clean[$key] = '[redacted]';
            } elseif (in_array($lower, ['cpf', 'document', 'taxid', 'tax_id'], true)) {
                $clean[$key] = maskDocument($value);
            } else {
                $clean[$key] = sanitizeLogData($value);
            }
        }
        return $clean;
    }

    return $data;
}

function paradiseSubstring($value, $start, $length)
{
    $value = (string) $value;
    if (function_exists('mb_substr')) {
        return mb_substr($value, $start, $length, 'UTF-8');
    }
    return substr($value, $start, $length);
}
