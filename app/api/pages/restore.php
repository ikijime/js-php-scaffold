<?php

session_start();
if ($_SESSION["auth"] != true) {
    header("HTTP/1.0 403 Forbidden");
    die;
}

$_POST = json_decode( file_get_contents("php://input"), true );

if ($_POST["path"]) {
    file_put_contents("../../../" . $_POST["path"], file_get_contents("../backups/" . $_POST["file"]));
} else {
    header("HTTP/1.0 400 Bad Request"); 
}