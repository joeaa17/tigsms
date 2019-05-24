<?php
require __DIR__ . '/twilio-php-master/Twilio/autoload.php';
use Twilio\Rest\Client;
$client = new Client(getenv('ACCOUNT_SID'), getenv('AUTH_TOKEN'));
$i = 0;
$sNumbers = "";
$separator = ":";
foreach ($client->incomingPhoneNumbers->read() as $number) {
    $sNumbers = $sNumbers . $number->phoneNumber . $separator;
}
if ($sNumbers == "") {
    echo "0";
    return;
}
foreach ($client->messaging->v1->services->read() as $service) {
    $sNumbers = $sNumbers . $service->sid . $separator;
}
echo substr($sNumbers,0,strlen($sNumbers)-1);
// echo "\xA";
?>