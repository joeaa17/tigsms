<?php
require __DIR__ . '/twilio-php-master/Twilio/autoload.php';
use Twilio\Rest\Client;
$client = new Client(getenv('ACCOUNT_SID'), getenv('AUTH_TOKEN'));
date_default_timezone_set("UTC");
date_default_timezone_set( "America/Los_Angeles" );
$todayStart = date('Y-m-d') + ' 00:00:00';  // date('2018-08-24 00:00:00')
$todayEnd = date('Y-m-d') + ' 21:59:59';    // date('2018-08-24 21:59:59')
$params = array(
    'dateSentAfter' => date($todayStart),
    'dateSentBefore' => date($todayEnd)
);
$result = $client->messages->read($params);
echo '++ List messages: date-time-SID-from-to-status-text.';
foreach ($result as $message) {
    echo "\xA" . $message->dateSent->format("Y-m-d H:i:s") . " " . $message->sid
            . " " . $message->from . " " . $message->to
            . " " . $message->status . " > " . $message->body;
}
echo "\xA+ End of List.";
//    $sms->sid, $sms->from, $sms->to, $sms->dateSent->format('Y-m-d H:i:s'), $sms->status, $sms->direction, $sms->price, $sms->body
?>
