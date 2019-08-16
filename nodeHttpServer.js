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

        if (uri === "/tigsms/sendSms.php") {
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
        if (uri === "/tigsms/smsConversation.php" || uri === "/tigsms/smsConversationDelete.php") {
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
        if (uri === "/tigsms/smsListSenderFilter.php" || uri === "/tigsms/smsListSenderFilterDelete.php") {
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
        // ---------------------------------------------------------------------
        if (uri === "/tigsms/smsListDateFilter.php"
                || uri === "/tigsms/smsListDateFilterDelete.php"
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
        if (uri === "/tigsms/accountPhoneNumbers.php"
                || uri === "/tigsms/accountNumberList.php"
                ) {
            var query = require('url').parse(request.url, true).query;
            const exec = require('child_process').exec;
            const theProgramName = uri;
            const theProgram = 'php ' + path.join(process.cwd(), theProgramName) + " " + query.tokenpassword;
            console.log("+ Run: " + theProgram);
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
