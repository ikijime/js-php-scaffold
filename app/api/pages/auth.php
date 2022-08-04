<?php

session_start();

if ($_SESSION["auth"] == true) {
    return json_encode(array("auth" => true));
} else {
    return json_encode(array("auth" => false));
}
