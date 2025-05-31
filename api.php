<?php
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$location = $input['location'] ?? '';

// Debug output - remove this after testing
file_put_contents('debug.log', "Received location: $location\n", FILE_APPEND);

if (empty($location)) {
    echo json_encode(['error' => 'Location is required']);
    exit;
}

// Always return mock data for now
$mockData = [
    'hotels' => [
        [
            'name' => "Grand $location Hotel",
            'location' => $location,
            'price' => rand(80, 300),
            'rating' => round(rand(30, 50)/10, 1)
        ],
        [
            'name' => "$location Plaza",
            'location' => $location,
            'price' => rand(100, 400),
            'rating' => round(rand(35, 50)/10, 1)
        ]
    ]
];

file_put_contents('debug.log', "Returning mock data\n", FILE_APPEND);
echo json_encode($mockData);
?>