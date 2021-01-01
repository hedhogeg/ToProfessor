var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var mysql = require('mysql');

var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '123456',
    database : 'guestbook'
});
db.connect();



var server = http.createServer(function (request, response){
    var _url_ = request.url;
    var queryData = url.parse(_url_, true).query;
    var pathname = url.parse(_url_, true).pathname;

    if (pathname === '/main'){pathname = '/'}

    if (pathname === '/'){
        if (queryData.css){
            fs.readFile(`./${queryData.css}.css`, 'utf-8', function (err, data){
                response.writeHead(200, {'Content-Type' : 'text/css'});
                response.end(data)
            })
        }
        else {
            fs.readFile(`./main.html`, 'utf-8', function (err, data) {
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.end(data);
            })
        }}
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
        var data = '';
        request.on('data', function (dt){
            data += dt;
        })
        request.on('end', function (){
            var post = qs.parse(data);
            var id = post.id
        })
        //
        //db
        //
        response.writeHead(302,{Location : `/page?id=${post.num}`});
        response.end();
    }
    else if (pathname === '/deletePage'){
        //
        //db
        //
        response.writeHead(302, {Location : `/`});
        response.end();
    }
    else {
        response.writeHead(404);
        response.end('Not found');
    }
})



server.listen(3000);

db.end();
