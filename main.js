var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

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
        else if (queryData.png){
            fs.readFile(`./data/${queryData.png}.png`, function (err, data) {
                response.writeHead(200, {'Content-Type': 'image/png'});
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
        const date = new Date()
        currentTime = getTime(date).join(":")
        console.log(currentTime)
        var data = '';
        request.on('data', function (dt){
            data += dt;
        })
        request.on('end', function (){
            var post = qs.parse(data);
            var name = post.name
            var pw = post.pw
            var desc = post.desc

            var num=31
            fs.mkdirSync(`./data/${num}`)
            fs.writeFileSync(`./data/${num}/${name}.txt`, desc, 'utf-8')
            fs.writeFileSync(`./data/${num}/time.txt`, currentTime)
            fs.writeFile(`./data/${num}/pw.txt`, pw, function (err){
                response.writeHead(302,{Location : `/page`});
                response.end();
        })})
    }
    else if (pathname === '/deletePage'){
        let pwdata='';
        let num = 31;
        request.on('data', function (pwdt){
            pwdata += pwdt;
        })
        request.on('end', function (){
            var pwpost=qs.parse(pwdata);
            var pw = pwpost.pw
            fs.readFile(`./data/${num}/pw.txt`, 'utf-8', function (err, data) {
                console.log(data,pw)
                if (pw == data){
                    deleteFolderRecursive(`./data/${num}`)
                    response.writeHead(302, {Location : `/`});
                    response.end();
                }
                else{
                    response.writeHead(302, {Location : `/page`});
                    response.end();
                }
            })
        })
    }
    else {
        response.writeHead(404);
        response.end('Not found');
    }
})
server.listen(3000);


function getTime(date) {
    const year = date.getFullYear()
    const month = date.getMonth()+1
    const day = date.getDate()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    return [`${year - 2000}`,
        `${month < 10 ? `0${month}` : month}`,
        `${day < 10 ? `0${day}` : day}`,
        `${hours < 10 ? `0${hours}` : hours}`,
        `${minutes < 10 ? `0${minutes}` : minutes}`]
}

var deleteFolderRecursive = function(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file, index){
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}

