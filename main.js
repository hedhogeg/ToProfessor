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
      var data = fs.readFileSync(`./HTML/mainUp.html`, 'utf-8')

      let list = fs.readdirSync('./data')
      for (var i=0; i < list.length; i++){
        var numLi = list[i]
        var arr = fs.readdirSync(`./data/${numLi}`)
        var id = arr.filter(i => i !='pw.txt' && i !='time.txt')[0].slice(0,-4)
        var time = ''
        var desc = ''
        time += fs.readFileSync(`./data/${numLi}/time.txt`)
        desc += fs.readFileSync(`./data/${numLi}/${id}.txt`)
        data +=`
        <a href="/page/${numLi}">
          <div id="${numLi}" class="uplist">
            <div class="time">
              ${time}
            </div>
            <div class="content" id="js-content">
              <div class="id">
                ${id}
              </div>
              <div class="preview">
                ${desc}
              </div>
            </div>
          </div>
        </a>`
      }
    data += fs.readFileSync(`./HTML/mainDown.html`, 'utf-8')

    response.writeHead(200, {'Content-Type' : 'text/html'});
    response.end(data);
    }
    else if (pathname === '/File'){
        if (queryData.css){
            fs.readFile(`./File/${queryData.css}.css`, 'utf-8', function (err, data){
                response.writeHead(200, {'Content-Type' : 'text/css'});
                response.end(data)
            })
        }
        else if (queryData.png){
            fs.readFile(`./File/${queryData.png}.png`, function (err, data) {
                response.writeHead(200, {'Content-Type': 'image/png'});
                response.end(data)
            })
        }
        else {
            response.writeHead(404);
            response.end("not found")
        }
    }
    else if (pathname.slice(0,5) === `/page`){
      let num = pathname.slice(6)

      var data = fs.readFileSync(`./HTML/pageUp.html`, 'utf-8')

      let list = fs.readdirSync('./data')
      for (var i=0; i < list.length; i++){
        var numLi = list[i]
        var arr = fs.readdirSync(`./data/${numLi}`)
        var id = arr.filter(i => i !='pw.txt' && i !='time.txt')[0].slice(0,-4)
        var time = ''
        var desc = ''
        time += fs.readFileSync(`./data/${numLi}/time.txt`)
        desc += fs.readFileSync(`./data/${numLi}/${id}.txt`)
        data +=`
        <a href="/page/${numLi}">
          <div id="${numLi}" class="uplist">
            <div class="time">
              ${time}
            </div>
            <div class="content" id="js-content">
              <div class="id">
                ${id}
              </div>
              <div class="preview">
                ${desc}
              </div>
            </div>
          </div>
        </a>  
        `
      }

      var arrC = fs.readdirSync(`./data/${num}`)
      var idC = arrC.filter(i => i !='pw.txt' && i !='time.txt')[0].slice(0,-4)
      var timeC = ''
      var descC = ''
      timeC += fs.readFileSync(`./data/${num}/time.txt`)
      descC += fs.readFileSync(`./data/${num}/${idC}.txt`)

      data += `
        </section>
      </aside>
      <main id="main">
        <h2 class="blind">글작성</h2>
        <div id="content-info">
          <div id="content-name">
            ${idC}
          </div>
          <div id="content-container">
            <span id="content-time">${timeC.slice(0,8)+". "+timeC.slice(12)}</span>
            <form action="/deletePage" method="POST" class="content-form">
              <input type="password" placeholder="password" id="content-pw" name="pw"/>
              <input type="submit" value="Delete" id="content-submit"/>
              <input type="text" value="${num}" name="pageNum" class="hide"/>
            </form>
          </div>
        </div>
        <div id="content-content">
          <div id="content-description">${descC}</div>
        </div>
      `

      data += fs.readFileSync(`./HTML/pageDown.html`, 'utf-8')

      response.writeHead(200, {'Content-Type' : 'text/html'});
      response.end(data);
    }
    else if (pathname === '/createPage'){
        const date = new Date()

        currentTime = getTime(date)

        var data = '';
        request.on('data', function (dt){
            data += dt;
        })
        request.on('end', function (){
            var post = qs.parse(data);
            var name = post.name;
            var pw = post.pw;
            var desc = post.desc;

            let liC = fs.readdirSync('./data');
            if (!liC[0]){
                var num = 1
            }
            else {
                var num = parseInt(liC[liC.length - 1]) + 1;
            }

            fs.mkdirSync(`./data/${num}`);
            fs.writeFileSync(`./data/${num}/${name}.txt`, desc.replace(/\n/g,"<br>"), 'utf-8');
            fs.writeFileSync(`./data/${num}/time.txt`, currentTime);
            fs.writeFile(`./data/${num}/pw.txt`, pw, function (err){
                response.writeHead(302,{Location : `/page/${num}`});
                response.end();
        })})
    }
    else if (pathname === '/deletePage'){
        let pwdata='';
        let num = '';
        request.on('data', function (pwdt){
            pwdata += pwdt;
        })
        request.on('end', function (){
            var dtpost=qs.parse(pwdata);
            var pw = dtpost.pw;
            num += dtpost.pageNum;
            fs.readFile(`./data/${num}/pw.txt`, 'utf-8', function (err, data) {
                if (pw == data){
                    deleteFolderRecursive(`./data/${num}`);
                    response.writeHead(302, {Location : `/`});
                    response.end();
                }
                else{
                    response.writeHead(302, {Location : `/page/${num}`});
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
    return `${year - 2000}`+"."+
        `${month < 10 ? `0${month}` : month}`+"."+
        `${day < 10 ? `0${day}` : day}`+"<br>"+
        `${hours < 10 ? `0${hours}` : hours}`+":"+
        `${minutes < 10 ? `0${minutes}` : minutes}`
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

