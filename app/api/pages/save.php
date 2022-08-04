<?php

session_start();
if ($_SESSION["auth"] != true) {
    header("HTTP/1.0 403 Forbidden");
    die;
}

$_POST = json_decode( file_get_contents("php://input"), true );

$file = $_POST["pageName"];
$newHTML = $_POST["html"];

$backups = json_decode(file_get_contents("../backups/backups.json"));
if(!is_array($backups)) {
    $backups = [];
}

if ($newHTML && $file) {
    $backupFilename = uniqid() . ".html";
    copy("../../../" . $file, "../backups/" . $backupFilename);
    array_push($backups, ["path" => $file, "file" => $backupFilename, "time" => date("H:i:s d:m:y")]);
    file_put_contents("../backups/backups.json", json_encode($backups));
    file_put_contents("../../../" . $file, $newHTML);
    header("HTTP/1.0 200 OK"); 
} else {
    header("HTTP/1.0 400 Bad Request"); 
}