<?php

function blackcatpayConfig()
{
    static $config = null;
    if ($config === null) {
        $config = require __DIR__ . '/config.php';
    }
    return $config;
}

function blackcatpayRequest($method, $endpoint, $payload = [])
{
    $config = blackcatpayConfig();
    $baseUrl = rtrim((string) ($config['BLACKCATPAY_API_BASE_URL'] ?? ''), '/');

    if ($baseUrl === '') {
        return [
            'success' => false,
            'status_code' => 0,
            'error' => 'BLACKCATPAY_API_BASE_URL nao configurada. Confirme a URL oficial no painel BlackCat Pay.',
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
    $format = strtolower((string) ($config['BLACKCATPAY_REQUEST_FORMAT'] ?? 'form'));
    $authMode = strtolower((string) ($config['BLACKCATPAY_AUTH_MODE'] ?? 'payload'));
    $url = $baseUrl . '/' . ltrim($endpoint, '/');
    $headers = ['Accept: application/json'];
    $body = null;

    if ($authMode === 'payload') {
        if (!empty($config['BLACKCATPAY_CLIENT_ID'])) {
            $payload['client_id'] = $config['BLACKCATPAY_CLIENT_ID'];
        }
        if (!empty($config['BLACKCATPAY_CLIENT_SECRET'])) {
            $payload['client_secret'] = $config['BLACKCATPAY_CLIENT_SECRET'];
        }
        if (!empty($config['BLACKCATPAY_TOKEN'])) {
            $payload['token'] = $config['BLACKCATPAY_TOKEN'];
        }
    } elseif ($authMode === 'api_key' && !empty($config['BLACKCATPAY_TOKEN'])) {
        $headers[] = 'X-API-Key: ' . $config['BLACKCATPAY_TOKEN'];
    } elseif ($authMode === 'bearer' && !empty($config['BLACKCATPAY_TOKEN'])) {
        $headers[] = 'Authorization: Bearer ' . $config['BLACKCATPAY_TOKEN'];
    } elseif ($authMode === 'headers') {
        if (!empty($config['BLACKCATPAY_CLIENT_ID'])) {
            $headers[] = 'X-Client-Id: ' . $config['BLACKCATPAY_CLIENT_ID'];
        }
        if (!empty($config['BLACKCATPAY_CLIENT_SECRET'])) {
            $headers[] = 'X-Client-Secret: ' . $config['BLACKCATPAY_CLIENT_SECRET'];
        }
        if (!empty($config['BLACKCATPAY_TOKEN'])) {
            $headers[] = 'X-Api-Token: ' . $config['BLACKCATPAY_TOKEN'];
        }
    }

    if ($method === 'GET' && !empty($payload)) {
        $url .= (strpos($url, '?') === false ? '?' : '&') . http_build_query($payload);
    } elseif ($method !== 'GET') {
        if ($format === 'json') {
            $body = json_encode($payload, JSON_UNESCAPED_UNICODE);
            $headers[] = 'Content-Type: application/json; charset=utf-8';
        } else {
            $body = http_build_query($payload);
            $headers[] = 'Content-Type: application/x-www-form-urlencoded';
        }
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
            'event' => 'blackcatpay_curl_error',
            'endpoint' => $endpoint,
            'error' => $curlError,
        ]);
        return [
            'success' => false,
            'status_code' => $statusCode,
            'error' => 'Falha de comunicacao com a BlackCat Pay.',
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
            'event' => 'blackcatpay_http_error',
            'endpoint' => $endpoint,
            'status_code' => $statusCode,
            'response' => $decoded,
        ]);
    }

    return [
        'success' => $ok,
        'status_code' => $statusCode,
        'error' => $ok ? null : extractBlackCatMessage($decoded),
        'raw' => $decoded,
    ];
}

function createBlackCatPixPayment($orderData)
{
    $config = blackcatpayConfig();

    // CONFIRMAR NA DOCUMENTACAO OFICIAL DA BLACKCAT PAY.
    // Nao usar este endpoint em producao sem validar no painel da gateway.
    $ENDPOINT_CREATE_PIX = $config['BLACKCATPAY_ENDPOINT_CREATE_PIX'] ?? '/pix/qrcode';

    $amountInCents = (int) round(((float) $orderData['amount']) * 100);
    $items = [];
    foreach (($orderData['items'] ?? []) as $item) {
        $items[] = [
            'title' => blackcatSubstring($item['description'] ?? $item['name'] ?? 'Produto digital', 0, 120),
            'unitPrice' => (int) round(((float) ($item['amount'] ?? 0)) * 100),
            'quantity' => 1,
            'tangible' => false,
        ];
    }

    if (empty($items)) {
        $items[] = [
            'title' => blackcatSubstring($orderData['description'], 0, 120),
            'unitPrice' => $amountInCents,
            'quantity' => 1,
            'tangible' => false,
        ];
    }

    // Payload oficial da documentacao BlackCat Pay:
    // POST /sales/create-sale com JSON e header X-API-Key.
    $payload = [
        'amount' => $amountInCents,
        'currency' => 'BRL',
        'paymentMethod' => 'pix',
        'items' => $items,
        'customer' => [
            'name' => $orderData['customer']['name'],
            'email' => $orderData['customer']['email'],
            'phone' => onlyDigits($orderData['customer']['phone']),
            'document' => [
                'number' => onlyDigits($orderData['customer']['document']),
                'type' => 'cpf',
            ],
        ],
        'pix' => [
            'expiresInDays' => 1,
        ],
        'postbackUrl' => rtrim((string) ($config['APP_BASE_URL'] ?? ''), '/') . '/api/webhook-blackcatpay.php',
        'metadata' => json_encode([
            'product_id' => $orderData['product_id'],
            'product_name' => $orderData['product_name'],
            'upsell_ids' => $orderData['upsell_ids'] ?? [],
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        'externalRef' => $orderData['external_id'],
    ];

    $gateway = blackcatpayRequest('POST', $ENDPOINT_CREATE_PIX, $payload);
    if (!$gateway['success']) {
        return [
            'success' => false,
            'error' => $gateway['error'] ?: 'Nao foi possivel gerar o Pix.',
            'gateway_response' => $gateway,
        ];
    }

    $raw = unwrapBlackCatData($gateway['raw']);
    $paymentData = is_array($raw['paymentData'] ?? null) ? $raw['paymentData'] : [];
    $paymentId = extractFirstValue($raw, ['transactionId', 'payment_id', 'id', 'transaction_id', 'txid', 'externalRef', 'external_id']);
    $copyKeys = ['copyPaste', 'qrCode', 'pix_copy_paste', 'copy_paste', 'pixCopiaECola', 'pix_copy_and_paste', 'brcode', 'emv', 'payload'];
    $qrKeys = ['qrCodeBase64', 'pix_qr_code', 'qr_code_base64', 'qrcode_base64', 'pixQrCodeBase64', 'base64', 'qrImageUrl', 'qrCodeUrl', 'qr_code_url', 'imageUrl'];
    $copyPaste = extractFirstValue($paymentData, $copyKeys) ?: extractFirstValue($raw, $copyKeys);
    $qrCode = extractFirstValue($paymentData, $qrKeys) ?: extractFirstValue($raw, $qrKeys);
    $status = normalizeBlackCatStatus(extractFirstValue($raw, ['status', 'payment_status', 'state']));
    $expiresAt = extractFirstValue($paymentData, ['expiresAt', 'expires_at', 'expiration_date', 'dueDate'])
        ?: extractFirstValue($raw, ['expiresAt', 'expires_at', 'expiration_date', 'dueDate']);

    if (is_array($raw) && isset($raw['calendar']) && is_array($raw['calendar'])) {
        $expiresAt = $expiresAt ?: extractFirstValue($raw['calendar'], ['dueDate', 'expires_at']);
    }

    writeLog('payment.log', [
        'event' => 'blackcatpay_create_payment_fields',
        'payment_id' => (string) ($paymentId ?: $orderData['external_id']),
        'response_keys' => array_keys($raw),
        'payment_data_keys' => is_array($paymentData) ? array_keys($paymentData) : [],
        'has_qr_image' => $qrCode !== null && $qrCode !== '',
        'has_copy_paste' => $copyPaste !== null && $copyPaste !== '',
        'amount' => (float) $orderData['amount'],
        'upsell_ids' => $orderData['upsell_ids'] ?? [],
    ]);

    return [
        'success' => true,
        'gateway' => 'blackcatpay',
        'payment_id' => (string) ($paymentId ?: $orderData['external_id']),
        'method' => 'pix',
        'status' => $status ?: 'pending',
        'amount' => (float) $orderData['amount'],
        'pix_qr_code' => $qrCode ?: '',
        'pix_copy_paste' => $copyPaste ?: '',
        'expires_at' => $expiresAt ?: '',
        'invoice_url' => extractFirstValue($raw, ['invoiceUrl', 'invoice_url', 'checkoutUrl', 'checkout_url']) ?: '',
        'raw' => $raw,
    ];
}

function checkBlackCatPaymentStatus($paymentId)
{
    $config = blackcatpayConfig();

    // CONFIRMAR NA DOCUMENTACAO OFICIAL DA BLACKCAT PAY.
    // Nao usar este endpoint em producao sem validar no painel da gateway.
    $ENDPOINT_CHECK_PAYMENT = $config['BLACKCATPAY_ENDPOINT_CHECK_PAYMENT'] ?? '/transactions/{id}';
    $endpoint = str_replace('{id}', rawurlencode($paymentId), $ENDPOINT_CHECK_PAYMENT);

    $gateway = blackcatpayRequest('GET', $endpoint);
    if (!$gateway['success']) {
        return [
            'success' => false,
            'error' => $gateway['error'] ?: 'Nao foi possivel consultar o pagamento.',
            'status' => 'unknown',
        ];
    }

    $raw = unwrapBlackCatData($gateway['raw']);
    $status = normalizeBlackCatStatus(extractFirstValue($raw, ['status', 'payment_status', 'state']));

    return [
        'success' => true,
        'gateway' => 'blackcatpay',
        'payment_id' => $paymentId,
        'status' => $status,
        'raw' => $raw,
    ];
}

function validateBlackCatWebhook($payload, $headers)
{
    $config = blackcatpayConfig();
    $secret = (string) ($config['BLACKCATPAY_WEBHOOK_SECRET'] ?? '');

    if ($secret === '') {
        return [
            'valid' => true,
            'reason' => 'Webhook secret nao configurado. Validacao de assinatura pendente de confirmacao no painel.',
        ];
    }

    $signature = findHeader($headers, [
        'x-blackcat-signature',
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
        'reason' => 'Assinatura HMAC SHA-256. Confirmar header oficial na documentacao BlackCat Pay.',
    ];
}

function normalizeBlackCatStatus($status)
{
    $status = strtoupper(trim((string) $status));

    $map = [
        'PENDING' => 'pending',
        'WAITING_PAYMENT' => 'pending',
        'AWAITING_PAYMENT' => 'pending',
        'PROCESSING' => 'pending',
        'PAID' => 'approved',
        'APPROVED' => 'approved',
        'COMPLETED' => 'approved',
        'CONFIRMED' => 'approved',
        'REJECTED' => 'rejected',
        'FAILED' => 'rejected',
        'DENIED' => 'rejected',
        'EXPIRED' => 'expired',
        'CANCELLED' => 'cancelled',
        'CANCELED' => 'cancelled',
        'REFUNDED' => 'cancelled',
    ];

    return $map[$status] ?? 'unknown';
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

function unwrapBlackCatData($raw)
{
    if (isset($raw['data']) && is_array($raw['data'])) {
        return $raw['data'];
    }
    if (isset($raw['response']) && is_array($raw['response'])) {
        return $raw['response'];
    }
    if (isset($raw['requestBody']) && is_array($raw['requestBody'])) {
        return $raw['requestBody'];
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

function extractBlackCatMessage($raw)
{
    $message = extractFirstValue($raw, ['message', 'error', 'description', 'detail']);
    return is_string($message) && $message !== '' ? $message : 'Erro retornado pela BlackCat Pay.';
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
            if (in_array($lower, ['client_secret', 'secret', 'token', 'authorization', 'x-api-key', 'password', 'cvv'], true)) {
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

function blackcatSubstring($value, $start, $length)
{
    $value = (string) $value;
    if (function_exists('mb_substr')) {
        return mb_substr($value, $start, $length, 'UTF-8');
    }
    return substr($value, $start, $length);
}
