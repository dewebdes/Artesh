var express = require('express')
var app = express()

var request = require('request')
var tr = require('../index.js')

phantom = require('phantom')

const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('connect', () => {
console.log('connected to the db');
})
pool.connect();

/*const { Client } = require('pg')
const client = new Client()
client.connect()
client.query('SELECT $1::text as message', ['Hello world!'], (err, res) => {
  console.log(err ? err.stack : res.rows[0].message) // Hello World!
  client.end()
})*/



var ipservices = [
  'http://icanhazip.com',
  'http://ifconfig.me/ip',
  'https://api.ipify.org',
  'http://ip.appspot.com',
  'http://ip-spot.com',
]

function findExternalIp (request, done) {
  var iterator = 0
  function tick () {
    console.log('ticking')
    url = ipservices[iterator++]
    if (!url) return done(null)

    request(url, function (err_, req_, body) {
      if (err_) {
        console.log(err_)
        tick()
      } else {
        console.log(body)
        done(body)
      }
    })
  }
  tick()
}

var limiter = require('express-rate-limit')({
  windowMs: 1000 * 60 * 15, // 15 min
  max: 200,
  delayMs: 0
})

var renewTorSessionTimeout = 1000 * 30 // 30 second timeout on session renew
var renewTorSessionTime = Date.now() - renewTorSessionTimeout

app.use(limiter)
app.use(express.static('public'))

app.use(function (req, res, next) {
  console.log(req.originalUrl)
  next()
})

app.get('/api/test', function (req, res) {
	tr.request('http://ipozal.com/ip.php', function (err, res2, body) {
	  if (!err && res2.statusCode == 200) {
	    console.log("Your public (through Tor) IP is: " + body);
		res.send(body);
	  }
	});
})

//http://176.9.28.88:3366/api/

app.get('/api/mylive', function (req, res) {
	phantom.create(["--proxy=127.0.0.1:9050", "--proxy-type=socks5"]).then((instance) => {
          phInstance = instance;
          return instance.createPage();
      })
      .then((page) => {
          sitepage = page;
          return page.open('http://ipozal.com/');
      })
      .then((status) => {

	sitepage.property('content').then(function(content) {
			res.send(content+"");
	      });
          return sitepage.property('title');


      })
      .then((content) => {
          sitepage.close();
          phInstance.exit();
      })
      .catch((error) => {
          console.log(error);
          phInstance.exit();
      });
})




//https://www.hunkemoller.de/de_de/nachtwasche/sexy-nachtwasche.html
app.get('/api/gesy1', function (req, res) {
	console.log("**** befor ");
	phantom.create(["--proxy=127.0.0.1:9050", "--proxy-type=socks5"]).then((instance) => {
		console.log("**** after");
          phInstance = instance;
          return instance.createPage();
      })
      .then((page) => {
          sitepage = page;
//		page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js');
          return page.open('https://www.hunkemoller.de/de_de/nachtwasche/sexy-nachtwasche.html');
      })
      .then((status) => {
//res.send(sitepage+"<script>alert(123);</script>");
sitepage.property('content').then(function(content) {
        	res.send(content+"<style>body{overflow: scroll;}</style><script type='text/javascript' src='https://ipozal.com/socket.io.js'></script><script>var prsnar;socket = io.connect('https://telnet.center',{secure: true});socket.on('connect', function() {alert(123);function prsn(name,ava){this.name=name;this.ava=ava;};prsnar=new Array();var ndl = document.querySelectorAll('div[itemprop=\"item\"]');console.log(ndl); for(var i=0;i<=ndl.length-1;i++){var ncava = ndl[i].querySelector('img').src;var ncname = ndl[i].querySelector('h2').innerText;var nc = new prsn(ncname,ncava);prsnar[prsnar.length]=nc;console.log(ncava+'-'+ncname);}console.log(JSON.stringify(prsnar));    });</script>");
        	//page.close();
        	//ph.exit();
      });
var ua = sitepage.evaluate(function() {
      return document.getElementsByTagName('a')[10].innerText;
    });
//res.send(ua);
	//var p = sitepage.evaluate(function () {
          ///  return document.getElementsByTagName('html')[0].innerHTML
        //});
          //console.log(status+" - "+p);
	//res.send(p);
          return sitepage.property('title');


      })
      .then((content) => {
          console.log(content);
	//res.send(content);
          sitepage.close();
          phInstance.exit();
      })
      .catch((error) => {
          console.log(error);
          phInstance.exit();
      });
})



//********************
app.get('/api/gesy2', function (req, res) {
phantom.create(function(err,ph) {
  return ph.createPage(function(err,page) {
    return page.open("http://tilomitra.com/repository/screenscrape/ajax.html", function(err,status) {
      console.log("opened site? ", status);
      page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', function(err) {
        //jQuery Loaded.
        //Wait for a bit for AJAX content to load on the page. Here, we are waiting 5 seconds.
        setTimeout(function() {
          return page.evaluate(function() {
            //Get what you want from the page using jQuery. A good way is to populate an object with all the jQuery commands that you need and then return the object.
            var h2Arr = [],
            pArr = [];
            $('h2').each(function() {
              h2Arr.push($(this).html());
            });
            $('p').each(function() {
              pArr.push($(this).html());
            });

            return {
              h2: h2Arr,
              p: pArr
            };
          }, function(err,result) {
            console.log(result);
		res.send(result);
            ph.exit();
          });
        }, 5000);
      });
	});
  });
});
});
//********************




app.get('/api/test2', function (req, res) {
	console.log("**** befor ");
	phantom.create(["--proxy=127.0.0.1:9050", "--proxy-type=socks5"]).then((instance) => {
		console.log("**** after");
          phInstance = instance;
          return instance.createPage();
      })
      .then((page) => {
          sitepage = page;
          return page.open('http://ipozal.com/ip.php');
      })
      .then((status) => {
	sitepage.property('content').then(function(content) {
        	res.send(content);
        	//page.close();
        	//ph.exit();
      });
	//var p = sitepage.evaluate(function () {
          //  return document.getElementsByTagName('html')[0].innerHTML
        //});
          //console.log(status+" - "+p);
	//res.send(p);
          return sitepage.property('title');
      })
      .then((content) => {
          console.log(content);
          sitepage.close();
          phInstance.exit();
      })
      .catch((error) => {
          console.log(error);
          phInstance.exit();
      });
})


app.get('/api/myip', function (req, res) {
  res.send(req.headers['x-forwarded-for'] || req.ip)
})

app.get('/api/serverip', function (req, res) {
  findExternalIp(request, function (ip) {
    res.send(ip)
  })
})

app.get('/api/mytorip', function (req, res) {
  findExternalIp(tr.request, function (ip) {
    res.send(ip)
  })
})

app.get('/api/requestNewTorSession', function (req, res) {
  var now = Date.now()
  var delta = now - renewTorSessionTime
  if (delta > renewTorSessionTimeout) {
    renewTorSessionTime = now

    tr.renewTorSession(function (err, success) {
      if (err) return res.status(500).send({
        statusCode: 500,
        message: 'error - could not renew tor session'
      })
      res.status(200).send({
        statusCode: 200,
        message: 'success'
      })
    })
  } else {
    var s = (delta / 1000) | 0
    res.status(400).send({
      statusCode: 400,
      message: 'too frequest session renews, try again in ' + s + ' seconds'
    })
  }
})

var port = 3366
var server = require('http').createServer(app)
server.listen(port, function () {
  console.log('Server listening on port *:' + port)
})






