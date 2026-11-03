<?php
/**
 * SAHARA STAFFING INC. — CMS PERSISTENCE ENDPOINT (PHP / GODADDY COMPATIBLE)
 * Handles incoming JSON payload from Executive Admin Dashboard and writes to flat JSON file.
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataFile = __DIR__ . '/site-content.json';

// Handle GET request to read content
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($dataFile)) {
        $content = file_get_contents($dataFile);
        echo $content;
    } else {
        echo json_encode(['status' => 'empty', 'message' => 'No content published yet']);
    }
    exit;
}

// Handle POST request to save content
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    
    if (empty($rawInput)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Empty request body received'
        ]);
        exit;
    }

    $decoded = json_decode($rawInput, true);
    if ($decoded === null && json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Invalid JSON payload: ' . json_last_error_msg()
        ]);
        exit;
    }

    // Attach timestamp metadata
    $decoded['_last_published_at'] = date('c');
    $decoded['_published_by'] = 'admin@saharastaffing.com';

    $jsonToWrite = json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    
    $writeResult = file_put_contents($dataFile, $jsonToWrite, LOCK_EX);

    if ($writeResult === false) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Failed to write data to site-content.json. Check directory permissions.'
        ]);
        exit;
    }

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Site Content Successfully Published & Live Worldwide!',
        'bytes_written' => $writeResult,
        'timestamp' => date('c')
    ]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);

