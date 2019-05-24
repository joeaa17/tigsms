<?php

require __DIR__ . '/twilio-php-master/Twilio/autoload.php';

use Twilio\Rest\Client;

$client = new Client(getenv('ACCOUNT_SID'), getenv('AUTH_TOKEN'));
$result = $client->messages->read();
$i = 0;
$arNumbers = "";
// date_default_timezone_set("UTC");
foreach ($client->incomingPhoneNumbers->read() as $number) {
    // echo "\xA" . $number->dateCreated->format('Y-m-d H:i') . " : " . $number->phoneNumber;
    $arNumbers[$i++] = $number->phoneNumber;
}
if ($arNumbers == "") {
    echo "0";
    return;
}
$arrlength = count($arNumbers);
sort($arNumbers);
$sNumbers = "";
$separator = ":";
for($i = 0; $i < $arrlength; $i++) {
    // echo "\xA" . $arNumbers[$i];
    if ($i == $arrlength-1) {
        $separator = "";
    }
    $sNumbers = $sNumbers . $arNumbers[$i] . $separator;
}
echo $sNumbers;
// echo "\xA";
?>
