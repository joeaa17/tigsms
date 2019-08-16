<?php

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
date_default_timezone_set( "UTC" );
// date_default_timezone_set( "America/Los_Angeles" );

require __DIR__ . '/../twilio-php-master/Twilio/autoload.php';

use Twilio\Rest\Client;

$client = new Client(getenv('ACCOUNT_SID'), getenv('AUTH_TOKEN'));
//
if ($msgTo == "all") {
    $paramsFrom = array("from" => $msgFrom);
    $paramsTo = array("to" => $msgFrom);    
} else {
    $paramsFrom = array("from" => $msgFrom,"to" => $msgTo);
    $paramsTo = array("to" => $msgFrom,"from" => $msgTo);    
}
//
$result = $client->messages->read($paramsFrom);
//
$i = 0;
//$aData = "";
//
// echo '++ List messages: date-time-SID-from-to-status-text.';
// echo "\xA--- Outgoing --------------";
foreach ($result as $message) {
//     echo "\xA" . $message->dateSent->format("Y-m-d h:i:s")." ".$message->from." ".$message->to." ".$message->status." > ".$message->body;
    if ($message->status === "delivered") {
        $aData[$i++] = $message->dateSent->format("Y-m-d H:i:s")." Delivered > ".$message->body;
    }
}
$result = $client->messages->read($paramsTo);
// echo "\xA--- Incoming --------------";
foreach ($result as $message) {
//     echo "\xA" . $message->dateSent->format("Y-m-d h:i:s")." ".$message->from." ".$message->to." ".$message->status." > ".$message->body;
    if ($message->status === "received") {
        $aData[$i++] = $message->dateSent->format("Y-m-d H:i:s")." Received             < ".$message->body;
    }
}
// echo "\xA+ End of List.";
//
// echo "-----------------";
if ($i == 0) {
    echo "+ No messages exchanged between ".$msgFrom." & ".$msgTo;
    echo "\xA-----------------";
    return;
}
sort($aData);
$arrlength = count($aData);
echo "++ Conversation between: ".$msgFrom." & ".$msgTo;
for($i = 0; $i < $arrlength; $i++) {
    echo "\xA" . $aData[$i];
}
echo "\xA-----------------";
?>
