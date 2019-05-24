<?php

// https://yourdomain.herokuapp.com/sendSms.php?msgFrom=16505551111&msgTo=16505552222&msgBody=hello&smsPassword=yourpassword

$msgFrom = htmlspecialchars($_GET["msgFrom"]);
if ($msgFrom == "") {
    $msgFrom = $argv[1];    // Note, $argv[0] is the program name.
    if ($msgFrom == "") {
        echo '-- Required parameter: msgFrom.';
        return;
    }
}
$msgTo = htmlspecialchars($_GET["msgTo"]);
if ($msgTo == "") {
    $msgTo = $argv[2];
    if ($msgFrom == "") {
        echo '-- Required parameter: msgTo.';
        return;
    }
}
$msgBody = htmlspecialchars($_GET["msgBody"]);
if ($msgBody == "") {
    $msgBody = $argv[3];
    if ($msgBody == "") {
        echo '-- Required parameter: msgBody.';
        return;
    }
}
$tokenPassword = htmlspecialchars($_GET["smsPassword"]);
if ($tokenPassword == "") {
    $tokenPassword = $argv[4];
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
use Twilio\Exceptions\RestException;

$client = new Client(getenv('ACCOUNT_SID'), getenv('AUTH_TOKEN'));
echo '++ Send SMS message, From: ' . $msgFrom . " to " . $msgTo . " :" . $msgBody . ":\xA";
$msgBody = str_replace("%27", "'", $msgBody);
try {
    $sms = $client->account->messages->create(
            $msgTo, array('from' => $msgFrom, 'body' => $msgBody)
    );
} catch (RestException $e) {
    $errMessage = $e->getMessage();
    // echo "- getStatusCode(): " . $e->getStatusCode() . "\xA";
    // echo "- getMessage(): " . $e->getMessage() . "\xA";
    if (strpos($errMessage, "violates a blacklist") > 0 ) {
        echo "- Error: " . $msgTo . " has unsubscribed from receiving messages from " . $msgFrom . ".\xA";
    } else {
        echo "- Error message: " . $e->getMessage() . "\xA";
        // - Error message: [HTTP 400] Unable to create record: The message From/To pair violates a blacklist rule.
    }
    return;
}
//$msgTo, array('from' => $msgFrom, 'body' => $msgBody, 'statusCallback' => $echoUrl)
echo "+ Message sent, SID: " . $sms->sid;
?>
