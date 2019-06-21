<?php
$msgFrom = htmlspecialchars($_GET["msgFrom"]);
if ($msgFrom == "") {
    $msgFrom = $argv[1];    // Note, $argv[0] is the program name.
    if ($msgFrom == "") {
        echo '-- Required parameter: msgFrom.';
        return;
    }
}
$tokenPassword = htmlspecialchars($_GET["smsPassword"]);
if ($tokenPassword == "") {
    $tokenPassword = $argv[2];
    if ($tokenPassword == "") {
        echo '-- Required parameter: smsPassword.' . " :" . $tokenPassword . ":";
        return;
    }
}
$token_password = getenv("TOKEN_PASSWORD");
if ($token_password !== $tokenPassword) {
    // echo "0" . " Environment:" . $token_password . ": Parameter:" . $tokenPassword . ":";
    echo "0";
    return;
}

require __DIR__ . '/twilio-php-master/Twilio/autoload.php';
use Twilio\Rest\Client;
$client = new Client(getenv('ACCOUNT_SID'), getenv('AUTH_TOKEN'));
//
$paramsFrom = array("from" => $msgFrom);
$resultFrom = $client->messages->read($paramsFrom);
echo '++ Delete messages from: ' . $msgFrom;
foreach ($resultFrom as $message) {
    echo "\xA- Delete: " . $message->dateSent->format("Y-m-d H:i:s") . " "
            // . $message->sid
            . " " . $message->from . " " . $message->to
            . " " . $message->status . " > " . $message->body;
    $client->messages($message->sid)->delete();
}
echo "\xA++ Delete messages to: " . $msgFrom;
$paramsTo = array("to" => $msgFrom);
$resultTo = $client->messages->read($paramsTo);
foreach ($resultTo as $message) {
    echo "\xA- Delete: " . $message->dateSent->format("Y-m-d H:i:s") . " "
            // . $message->sid
            . " " . $message->from . " " . $message->to
            . " " . $message->status . " > " . $message->body;
    $client->messages($message->sid)->delete();
}
echo "\xA+ End of List.";
?>
