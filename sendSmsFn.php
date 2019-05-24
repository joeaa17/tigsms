<?php
$tokenHost = htmlspecialchars($_GET["tokenhost"]);
if ($tokenHost == "") {
    $tokenHost = getenv('TOKEN_HOST');
    if ($tokenHost == "") {
        echo '-- TOKEN_HOST must be an environment variable.';
        return;
    }
}
$msgFrom = htmlspecialchars($_GET["msgFrom"]);
if ($msgFrom == "") {
    echo '-- Required parameter: msgFrom.';
    return;
}
$msgTo = htmlspecialchars($_GET["msgTo"]);
if ($msgTo == "") {
    echo '-- Required parameter: msgTo.';
    return;
}
$msgBody = htmlspecialchars($_GET["msgBody"]);
if ($msgBody == "") {
    echo '-- Required parameter: msgBody.';
    return;
}
$theRequest = "https://" . $tokenHost . "/sendsms?msgFrom=" . $msgFrom . "&msgTo=" . $msgTo . "&msgBody=" . urlencode($msgBody);
// echo "\xA+ $theRequest :" . $theRequest . ": \xA";
$response = file_get_contents($theRequest);
echo $response;
?>
