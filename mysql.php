<?php

$conexion = new mysqli(
    "localhost",
    "root",
    "",
    "pagina"
);

if($conexion->connect_error){
    die("Error de conexión");
}

$nombre = $_POST['nombre'];
$correo = $_POST['correo'];

$sql = "INSERT INTO usuarios(nombre, correo)
VALUES ('$nombre', '$correo')";

if($conexion->query($sql)){
    echo "Datos guardados";
}else{
    echo "Error";
}

?>