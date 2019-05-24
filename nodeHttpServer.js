// -----------------------------------------------------------------------------
console.log("+++ Start: nodeHttpServer.js");

var makeRequest = require('request');

// -----------------------------------------------------------------------------
// Webserver
// -----------------------------------------------------------------------------

var http = require("http");
var url = require("url");
var path = require("path");
var port = process.argv[2] || 8000;
var fs = require("fs");
tokenHost = process.env.TOKEN_HOST;
console.log("+ tokenHost :" + tokenHost + ":");

http.createServer(function (request, response) {

    var uri = url.parse(request.url).pathname;
    var filename = path.join(process.cwd(), uri);
    fs.exists(filename, function (exists) {
        console.log("+ request.url: " + request.url + ", URI: " + uri);

        if (uri === "/sendSms.php") {
            // /agents?msgFrom=me&To=you
            var query = require('url').parse(request.url, true).query;
            console.log("+ Send From: " + query.msgFrom + ' To: ' + query.msgTo + ' : ' + query.msgBody);
            const exec = require('child_process').exec;
            const theProgramName = uri;
            const theProgram = 'php ' + path.join(process.cwd(), theProgramName) + " " + query.msgFrom + " " + query.msgTo + " '" + query.msgBody + "'" + " " + query.smsPassword;
            exec(theProgram, (error, stdout, stderr) => {
                theResponse = `${stdout}`;
                console.log('+ theResponse: ' + theResponse);
                // console.log(`${stderr}`);
                if (error !== null) {
                    console.log(`exec error: ${error}`);
                }
                response.writeHead(200);
                response.write(theResponse, "binary");
                response.end();
            });
            return;
        }
        if (uri === "/smsConversation.php" || uri === "/smsConversationDelete.php") {
            // /agents?msgFrom=me&To=you
            var query = require('url').parse(request.url, true).query;
            console.log("+ Parameters, From: " + query.msgFrom + ' To: ' + query.msgTo);
            const exec = require('child_process').exec;
            const theProgramName = uri;
            const theProgram = 'php ' + path.join(process.cwd(), theProgramName) + " " + query.msgFrom + " " + query.msgTo;
            exec(theProgram, (error, stdout, stderr) => {
                theResponse = `${stdout}`;
                // console.log('+ theResponse: ' + theResponse);
                // console.log(`${stderr}`);
                if (error !== null) {
                    console.log(`exec error: ${error}`);
                }
                response.writeHead(200);
                response.write(theResponse, "binary");
                response.end();
                console.log('+ Sent response.');
            });
            return;
        }
        if (uri === "/smsListSenderFilter.php" || uri === "/smsListSenderFilterDelete.php") {
            // /agents?msgFrom=me&To=you
            var query = require('url').parse(request.url, true).query;
            console.log("+ Sender parameters, From: " + query.msgFrom);
            const exec = require('child_process').exec;
            const theProgramName = uri;
            const theProgram = 'php ' + path.join(process.cwd(), theProgramName) + " " + query.msgFrom + " " + query.smsPassword;
            exec(theProgram, (error, stdout, stderr) => {
                theResponse = `${stdout}`;
                // console.log('+ theResponse: ' + theResponse);
                // console.log(`${stderr}`);
                if (error !== null) {
                    console.log(`exec error: ${error}`);
                }
                response.writeHead(200);
                response.write(theResponse, "binary");
                response.end();
                console.log('+ Sent response.');
            });
            return;
        }
        if (uri === "/smsListDateFilter.php"
                || uri === "/smsListDateFilterDelete.php"
                || uri === "/accountPhoneNumbers.php"
                || uri === "/accountNumberList.php"
                ) {
            var query = require('url').parse(request.url, true).query;
            console.log("+ Run: " + uri);
            const exec = require('child_process').exec;
            const theProgramName = uri;
            const theProgram = 'php ' + path.join(process.cwd(), theProgramName);
            exec(theProgram, (error, stdout, stderr) => {
                theResponse = `${stdout}`;
                console.log('+ theResponse: ' + theResponse);
                // console.log(`${stderr}`);
                if (error !== null) {
                    console.log(`exec error: ${error}`);
                }
                response.writeHead(200);
                response.write(theResponse, "binary");
                response.end();
                console.log('+ Sent response.');
            });
            return;
        }
        // ---------------------------------------------------------------------
        if (uri === "/sendSms1.php") {
            console.log("++ Send SMS message.");
            theParam = request.url.substring(request.url.indexOf("?"));
            console.log("+ theParam :" + theParam + ":");
            //
            theHostnameFieldname = "&tokenhost=";
            var theIndex = request.url.indexOf(theHostnameFieldname);
            if (theIndex > 0) {
                tokenHost = request.url.substring(theIndex + theHostnameFieldname.length);
            }
            theRequest = "https://" + tokenHost + "/sendsms" + theParam;
            console.log('+ theRequest:', theRequest);
            makeRequest(theRequest, function (theError, theFullResponse, theResponse) {
                theResponseStatusCode = theFullResponse && theFullResponse.statusCode;
                if (theResponseStatusCode === 200) {
                    console.log('+ theResponse:', theResponse);
                    response.writeHead(200);
                    response.write(theResponse, "binary");
                    response.end();
                } else {
                    console.log('- Error:', theError);
                    console.log('- Status code: ' + theResponseStatusCode);
                    response.writeHead(500, {"Content-Type": "text/plain"});
                    response.write('- Error: ' + theError + "\n");
                    response.write('- Status code: ' + theResponseStatusCode + "\n");
                    response.end();
                }
            });
            return;
        }
        // ---------------------------------------------------------------------
        // Handle static files
        if (!exists) {
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("404 Not Found\n");
            response.end();
            return;
        }
        if (fs.statSync(filename).isDirectory()) {
            filename += '/index.html';
        }
        fs.readFile(filename, "binary", function (err, file) {
            if (err) {
                response.writeHead(500, {"Content-Type": "text/plain"});
                response.write(err + "\n");
                response.end();
                return;
            }
            response.writeHead(200);
            response.write(file, "binary");
            response.end();
        });

// -----------------------------------------------------------------------------
    });
}).listen(parseInt(port, 10));
console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");
