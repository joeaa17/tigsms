function sendSms() {
    clearMessages();
    theSmsPassword = $("#smsPassword").val();
    if (theSmsPassword === "") {
        $("div#msgPassword").html("<b>Password is required</b>");
        logger("- Required: Password.");
        return;
    }
    // logger("Send message.");
    // msgFrom = $("#msgFrom").val();
    msgFrom = $('#accountNumbers :selected').text();
    if (msgFrom === "") {
        $("div#msgMsgFrom").html("<b>Required</b>");
        return;
    }
    msgTo = $("#msgTo").val();
    if (msgTo === "") {
        $("div#msgMsgTo").html("<b>Required</b>");
        logger("Required: Send to number.");
        return;
    }
    msgBody = $("#msgBody").val();
    if (msgBody === "") {
        $("div#msgMsgBody").html("<b>Required</b>");
        logger("Required: Message.");
        return;
    }
    if (msgBody.indexOf("'") > 0) {
        // Single quote doesn't work.
        // msgBody = msgBody.replace(/'/g, '"');
        msgBody = msgBody.replace(/'/g, '%27');
        // logger("+ Found single quote: " + msgBody);
    }
    logger("Wait, sending SMS message...");
    $("div#activityMessages").html("<b>Wait, sending SMS message...</b>");
    // https://api.jquery.com/jquery.get/
    $.get("sendSms.php?msgFrom=" + encodeURIComponent(msgFrom) + "&msgTo=" + encodeURIComponent(msgTo) + "&msgBody=" + encodeURIComponent(msgBody) + "&smsPassword=" + theSmsPassword, function (response) {
        $("div#activityMessages").html("+ Completed.");
        logger("Response: " + response);
        if (response === "0") {
            $("div#msgPassword").html("<b>Password is invalid</b>");
            logger("- Password invalid.");
            return;
        }
        sidStart = response.indexOf("SID");
        if (sidStart > 0) {
            // ++ Send SMS message, From: 16508661199 to 16508668188 :msg 2: + Message sent, SID: SM89e38624126f4c5d9a39f76ca2b0e281
            theUrl = '<a target="console" href="https://www.twilio.com/console/sms/logs/' + response.substring(sidStart + 5, response.length) + '" style="color:#954C08">See log.</a>';
            $("div#msgMsgBody").html("Message sent. " + theUrl);
            $("div#activityMessages").html("+ Completed.");
        }
        if (response.indexOf("RestException") > 0) {
            $("div#msgMsgBody").html("Message failed to send.");
            if (response.indexOf("'To' number") > 0 && response.indexOf("not a valid phone number") > 0) {
                $("div#msgMsgTo").html("Invalid phone number.");
            }
            if (response.indexOf("'From' number") > 0 && response.indexOf("not a valid phone number") > 0) {
                $("div#msgMsgFrom").html("Invalid phone number.");
            }
            if (response.indexOf("From phone number") > 0 && response.indexOf("is not a valid") > 0) {
                $("div#msgMsgFrom").html("Invalid phone number.");
            }
        }
    }).fail(function () {
        logger("- Send failed.");
    });
}
function listSms() {
    clearMessages();
    logger("List messages, please wait...");
    $("div#activityMessages").html("<b>Wait, getting messages...</b>");
    $.get("smsListDateFilter.php", function (response) {
        logger(response);
        $("div#activityMessages").html("+ Completed.");
    }).fail(function () {
        logger("- List failed.");
    });
}
function deleteSms() {
    clearMessages();
    logger("Deleting messages, please wait...");
    $("div#activityMessages").html("<b>Wait, deleting messages...</b>");
    $.get("smsListDateFilterDelete.php", function (response) {
        logger(response);
        $("div#activityMessages").html("+ Completed.");
    }).fail(function () {
        logger("- Delete failed.");
    });
}
function listSenderLogs() {
    clearMessages();
    logger("List sender message logs, please wait...");
    theSmsPassword = $("#smsPassword").val();
    if (theSmsPassword === "") {
        $("div#msgPassword").html("<b>Password is required</b>");
        logger("- Required: Password.");
        return;
    }
    msgFrom = $('#accountNumbers :selected').text();
    if (msgFrom === "") {
        $("div#msgMsgFrom").html("<b>Required</b>");
        logger("Required: Send from Twilio number.");
        return;
    }
    $("div#activityMessages").html("<b>Wait, Listing log messages...</b>");
    $.get("smsListSenderFilter.php?msgFrom=" + msgFrom + "&smsPassword=" + theSmsPassword, function (response) {
        logger(response);
        if (response === "0") {
            $("div#msgPassword").html("<b>Password is invalid</b>");
            logger("- Password invalid.");
            return;
        }
        $("div#activityMessages").html("+ Completed.");
    }).fail(function () {
        logger("- Delete failed.");
    });
}
function deleteSenderLogs() {
    clearMessages();
    logger("Deleting sender message logs, please wait...");
    theSmsPassword = $("#smsPassword").val();
    if (theSmsPassword === "") {
        $("div#msgPassword").html("<b>Password is required</b>");
        logger("- Required: Password.");
        return;
    }
    msgFrom = $('#accountNumbers :selected').text();
    if (msgFrom === "") {
        $("div#msgMsgFrom").html("<b>Required</b>");
        logger("Required: Send from Twilio number.");
        return;
    }
    $("div#activityMessages").html("<b>Wait, deleting log messages...</b>");
    $.get("smsListSenderFilterDelete.php?msgFrom=" + msgFrom + "&smsPassword=" + theSmsPassword, function (response) {
        logger(response);
        if (response === "0") {
            $("div#msgPassword").html("<b>Password is invalid</b>");
            logger("- Password invalid.");
            return;
        }
        $("div#activityMessages").html("+ Completed.");
    }).fail(function () {
        logger("- Delete failed.");
    });
}
function accNumbers() {
    clearMessages();
    theSmsPassword = $("#smsPassword").val();
    if (theSmsPassword === "") {
        $("div#msgPassword").html("<b>Password is required</b>");
        logger("- Required: Password.");
        return;
    }
    logger("Get account phone numbers and Messaging Services.");
    $("div#activityMessages").html("<b>Wait, getting account phone numbers...</b>");
    $.get("accountPhoneNumbers.php?tokenpassword=" + theSmsPassword, function (response) {
        logger(response);
        if (response.startsWith("0")) {
            $("div#msgPassword").html("<b>Password is invalid</b>");
            logger("- Password invalid.");
            return;
        }
        $("div#activityMessages").html("+ Completed.");
        setAccNumbers();
    }).fail(function () {
        logger("- Get account phone numbers failed.");
    });
}
function conversation() {
    clearMessages();
    logger("Wait, getting SMS conversation...");
    msgFrom = $('#accountNumbers :selected').text();
    if (msgFrom === "") {
        $("div#msgMsgFrom").html("<b>Required</b>");
        logger("Required: Send from Twilio number.");
        return;
    }
    msgTo = $("#msgTo").val();
    if (msgTo === "") {
        $("div#msgMsgTo").html("<b>Required</b>");
        logger("Required: Send to number.");
        return;
    }
    $("div#activityMessages").html("<b>Wait, getting SMS conversation...</b>");
    $.get("smsConversation.php?msgFrom=" + msgFrom + "&msgTo=" + msgTo, function (response) {
        logger(response);
        $("div#activityMessages").html("+ Completed.");
    }).fail(function () {
        logger("- Delete failed.");
    });
}
function deleteConversation() {
    clearMessages();
    logger("Wait, deleting SMS conversation...");
    // > Wait, deleting SMS conversation...
    // > + Number of deleted message = 22 
    msgFrom = $('#accountNumbers :selected').text();
    if (msgFrom === "") {
        $("div#msgMsgFrom").html("<b>Required</b>");
        logger("Required: Send from Twilio number.");
        return;
    }
    msgTo = $("#msgTo").val();
    if (msgTo === "") {
        $("div#msgMsgTo").html("<b>Required</b>");
        logger("Required: Send to number.");
        return;
    }
    $("div#activityMessages").html("<b>Wait, deleting SMS conversation...</b>");
    $.get("smsConversationDelete.php?msgFrom=" + msgFrom + "&msgTo=" + msgTo, function (response) {
        logger(response);
        $("div#activityMessages").html(response);
    }).fail(function () {
        logger("- Delete failed.");
    });
}
// -----------------------------------------------------------------------------
function setAccNumbers() {
    logger("+ setAccNumbers");
    // $('#accountNumbers option:selected').val("+16505551111");
    var options = $("#accountNumbers");
    // $.each(data, function() {
    //   options.append(new Option(this.text, this.value));
    // });
    $("div#activityMessages").html("+ Please wait, loading phone numbers...");
    $.get("accountNumberList.php?tokenpassword=" + theSmsPassword, function (response) {
        logger(response);
        if (response.indexOf("Credentials are required") > 0) {
            $("div#msgMsgFrom").html("Check environment credentials");
            $("div#activityMessages").html("<b>- Error: environment credentials are required.</b>");
            options.append($("<option />").val("").text("Eror loading"));
            return;
        }
        if (response === "0") {
            $("div#msgMsgFrom").html("<b>No account phone numbers.</b>");
            $("div#activityMessages").html("<b>- You are required to have at least one account phone numbers.</b>");
        }
        arrayNumbers = response.split(":");
        // options.append($("<option />").val(aNumbers[0]).text(aNumbers[0]));
        arrayNumbers.forEach(function (aNumbers) {
            options.append($("<option />").val(aNumbers).text(aNumbers));
        });
        $('#accountNumbers option')[0].selected = true; // by default, select the first option.
        $("div#activityMessages").html("+ Account phone numbers loaded.");
        setButtons("ready");
    }).fail(function () {
        logger("- Get account phone numbers failed.");
    });
}

// -----------------------------------------------------------------------------
// topPage.js menu

var theBar = 0;
function menuicon() {
    // logger("+ Clicked menuicon");
    document.getElementById("menuDropdownItems").classList.toggle("show");
}
function menubar() {
    theBar = 1;
    // logger("+ Clicked menubar");
}
window.onclick = function (e) {
    // logger("+ menu Clicked window");
    if (!e.target.matches('.menuicon') && !e.target.matches('.menubar')) {
        if (theBar === 0) {
            // logger("+ Clicked window");
            var dropdowns = document.getElementsByClassName("menuDropdownList");
            for (var d = 0; d < dropdowns.length; d++) {
                var openDropdown = dropdowns[d];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }
    theBar = 0;
}

// -----------------------------------------------------------------------------
function clearMessages() {
    $("div#msgPassword").html("");
    $("div#msgMsgFrom").html("");
    $("div#msgMsgTo").html("");
    $("div#msgMsgBody").html("");
}
function logger(message) {
    var aTextarea = document.getElementById('log');
    aTextarea.value += "\n> " + message;
    aTextarea.scrollTop = aTextarea.scrollHeight;
}
function clearLog() {
    log.value = "+ Ready";
}
window.onload = function () {
    log.value = "++ Ready";
    setButtons("init");
    $("div#msgPassword").html("Required");
    // setAccNumbers();
};

// -----------------------------------------------------------------
function setButtons(activity) {
    logger("setButtons, activity: " + activity);
    // $("div.callMessages").html("Activity: " + activity);
    switch (activity) {
        case "init":
            $('#sendSms').prop('disabled', true);
            $('#conversation').prop('disabled', true);
            $('#deleteConversation').prop('disabled', true);
            $('#listSms').prop('disabled', true);
            $('#deleteSms').prop('disabled', true);
            $('#listSenderLogs').prop('disabled', true);
            $('#deleteSenderLogs').prop('disabled', true);
            break;
        case "ready":
            $('#sendSms').prop('disabled', false);
            $('#conversation').prop('disabled', false);
            $('#deleteConversation').prop('disabled', false);
            $('#listSms').prop('disabled', false);
            $('#deleteSms').prop('disabled', false);
            $('#listSenderLogs').prop('disabled', false);
            $('#deleteSenderLogs').prop('disabled', false);
            break;
    }
}

// -----------------------------------------------------------------------------
