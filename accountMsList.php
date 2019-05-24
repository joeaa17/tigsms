<?php
require __DIR__ . '/twilio-php-master/Twilio/autoload.php';
use Twilio\Rest\Client;
$client = new Client(getenv('ACCOUNT_SID'), getenv('AUTH_TOKEN'));
$service = $client->messaging->v1->services(getenv("MESSAGING_SERVICE_SID"))
                                 ->fetch();
echo "+ Messaging Service name: " . $service->friendlyName . "\xA";
echo "+ Messaging Service list:" . "\xA";
// $services = $client->messaging->v1->services->read();
foreach ($client->messaging->v1->services->read() as $service) {
    echo "++ SID,name: " . $service->sid . ", " . $service->friendlyName . "\xA";
}
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
echo substr($sNumbers,0,strlen($sNumbers)-1) . "\xA";
// echo "\xA";
?>