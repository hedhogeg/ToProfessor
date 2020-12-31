var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var mysql = require('mysql');

var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '123456',
    database : 'opentt'
});
db.connect();



var server = http.createServer(function (request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;


    if (pathname === '/'){
        fs.readFile(`./main.html`, 'utf-8', function (err, data){
            response.writeHead(200, {'Content-Type' : 'text/html'});
            response.end(data);
        })
    }
    else if (pathname === '/main.css'){
        fs.readFile(`./main.css`, 'utf-8', function (err, data){
            response.writeHead(200, {'Content-Type' : 'text/css'});
            response.end(data)
        })
    }
    else if (pathname === '/page'){
        fs.readFile(`./page.html`, 'utf-8', function (err, data){
            //
            //이름, 파일 리스트 data 에 삽입
            //
            response.writeHead(200, {'Content-Type' : 'text/html'});
            response.end(data);

        })
    }
    else if (pathname === '/createPage'){
        //
        //
        //
        response.writeHead(302);// page 방금 쓴 파일로 이동
        response.end();
    }
    else if (pathname === '/deletePage'){
        //
        //
        //
        response.writeHead(302);// main 이동
        response.end();
    }
    else {
        response.writeHead(404);
        response.end('Not found');
    }
})



server.listen(3000);

db.end();
