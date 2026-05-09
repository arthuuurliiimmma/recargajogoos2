<?php
require __DIR__ . '/paradisepags.php';

header('Content-Type: application/json; charset=utf-8');

$rawBody = file_get_contents('php://input');
$contentType = $_SERVER['CONTENT_TYPE'] ?? $_SERVER['HTTP_CONTENT_TYPE'] ?? '';
$headers = function_exists('getallheaders') ? getallheaders() : [];

if (stripos($contentType, 'application/json') !== false) {
    $payload = json_decode($rawBody, true);
    if (!is_array($payload)) {
        $payload = [];
    }
} else {
    $payload = $_POST;
    if (empty($payload) && $rawBody !== '') {
        parse_str($rawBody, $payload);
    }
}

$validation = validateParadiseWebhook($rawBody, $headers);
if (!$validation['valid']) {
    writeLog('webhook.log', [
        'event' => 'webhook_invalid_signature',
        'reason' => $validation['reason'],
        'headers' => $headers,
    ]);
    http_response_code(401);
    echo json_encode(['success' => false]);
    exit;
}

$body = unwrapParadiseData($payload);
$paymentId = extractFirstValue($body, ['transaction_id', 'id']);
$externalId = extractFirstValue($body, ['external_id', 'reference']);
$statusRaw = extractFirstValue($body, ['status', 'payment_status', 'raw_status']);
$status = normalizeParadiseStatus($statusRaw);

writeLog('webhook.log', [
    'event' => 'paradisepags_webhook_received',
    'payment_id' => $paymentId,
    'external_id' => $externalId,
    'status' => $status,
    'status_raw' => $statusRaw,
    'payload' => $payload,
]);

http_response_code(200);
echo json_encode([
    'success' => true,
    'gateway' => 'paradisepags',
    'payment_id' => $paymentId,
    'external_id' => $externalId,
    'status' => $status,
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
