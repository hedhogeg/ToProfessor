var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var mysql = require('mysql');

var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'me',
    password : '123456',
    database : 'my_db'
});
db.connect();

db.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
});

db.end();

var server = http.createServer(function (request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if (pathname === '/'){
        fs.readFile(`./main.html`, 'utf-8', function (err, main){
            response.writeHead(200);
            response.end(main);
        })
    }
    else {
        response.writeHead(404);
        response.end('Not found');
    }
})

server.listen(3000);