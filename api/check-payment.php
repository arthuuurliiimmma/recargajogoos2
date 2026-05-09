<?php
require __DIR__ . '/paradisepags.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(405, ['success' => false, 'message' => 'Metodo nao permitido.']);
}

$paymentId = trim((string) ($_GET['payment_id'] ?? ''));
if ($paymentId === '' || !preg_match('/^[a-zA-Z0-9._:-]{1,120}$/', $paymentId)) {
    jsonResponse(400, ['success' => false, 'message' => 'payment_id invalido.']);
}

$status = checkParadisePaymentStatus($paymentId);
if (!$status['success']) {
    jsonResponse(502, [
        'success' => false,
        'gateway' => 'paradisepags',
        'payment_id' => $paymentId,
        'status' => 'unknown',
        'message' => $status['error'] ?? 'Nao foi possivel consultar o pagamento.',
    ]);
}

jsonResponse(200, [
    'success' => true,
    'gateway' => 'paradisepags',
    'payment_id' => $paymentId,
    'status' => $status['status'],
]);

function jsonResponse($statusCode, $payload)
{
    http_response_code($statusCode);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
