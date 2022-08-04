<?php

if (file_exists($_FILES["image"]["tmp_name"])) {
    $fileExtension = explode("/", $_FILES["image"]["type"])[1];
    $fileName = uniqid() . "." . $fileExtension;

    if (!is_dir("../../../img/")) {
        mkdir("../../../img/");
    }
    
    $imgPath = "../../../img/{$fileName}";

    move_uploaded_file($_FILES["image"]["tmp_name"], $imgPath);
    echo json_encode(array("src" => $fileName));
}
