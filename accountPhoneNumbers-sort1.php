<?php

require __DIR__ . '/twilio-php-master/Twilio/autoload.php';

use Twilio\Rest\Client;

$client = new Client(getenv('ACCOUNT_SID'), getenv('AUTH_TOKEN'));
//
date_default_timezone_set("UTC");
$result = $client->messages->read();
$i = 0;
$arNumbers = "";
echo '++ Account phone numbers:';
foreach ($client->incomingPhoneNumbers->read() as $number) {
    echo "\xA" . $number->dateCreated->format('Y-m-d H:i') . " : " . $number->phoneNumber;
    $arNumbers[$i++] = $number->phoneNumber;
}
sort($arNumbers);
$arrlength = count($arNumbers);
echo "\xA++ Account phone numbers sorted:";
for($i = 0; $i < $arrlength; $i++) {
    echo "\xA" . $arNumbers[$i];
}
echo "\xA+ End of List.";
?>
