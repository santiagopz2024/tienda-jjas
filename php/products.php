<?php
header('Content-Type: application/json');
// Ruta del archivo JSON
$jsonPath = '../data/products.json';
// Verifica si el archivo existe y envía los datos
if (file_exists($jsonPath)) {
 echo file_get_contents($jsonPath);
} else {
 echo json_encode([]);
}
?>    
