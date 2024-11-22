<?php
header('Content-Type: application/json');
$requestBody = file_get_contents('php://input');
$cart = json_decode($requestBody, true);
if (!empty($cart)) {
// Simula un procesamiento exitoso
echo json_encode(["success" => true, "message" => "Compra realizada correctamente."]);
} else {
echo json_encode(["success" => false, "message" => "El carrito está vacío."]);
}
?>
