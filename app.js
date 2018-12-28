var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var CryptoJS = require("crypto-js");

var clients = {};



app.get('/', function(req, res){
  res.send('server is running');
});

io.on("connection", function (client) {  
    client.on("join", function(name){
		client.join('chat');
    	console.log("Entrou: " + name);
        clients[client.id] = new Array();
		clients[client.id].id = name
		clients[client.id].checkout = 0;
        client.broadcast.emit("whois", name);
		var bemvindo = CryptoJS.AES.encrypt("Bem-vindo "+name, 'webchat132').toString();
		client.emit("chat", "Sistema", bemvindo);
    });

    client.on("send", function(msg){
		// Decrypt
		var bytes  = CryptoJS.AES.decrypt(msg, 'webchat132');
		var originalText = bytes.toString(CryptoJS.enc.Utf8);
    	console.log("Message "+clients[client.id].id+": " + originalText);
        client.broadcast.emit("chat", clients[client.id].id, msg);
    });
	
	
	client.on("everbody", function(msg){
		for (var cliente in clients ) {
			client.emit("whois", clients[cliente].id);		  
		}
    });
	
	client.on("checkin", function(msg){
		clients[client.id].checkout = 0;
		
    });

    client.on("disconnect", function(){
    	console.log("Saiu: "+clients[client.id]);
        io.emit("disconnect", clients[client.id]);
        delete clients[client.id];
    });
	
	
});

function intervalFunc() 
{
	io.in('chat').emit("checkout", "?");
	for (var cliente in clients ) {
	  //console.log(clients[cliente].id);
      clients[cliente].checkout++;
	  if (clients[cliente].checkout > 10){
		   io.in('chat').emit("update", clients[cliente].id+" saiu...");
			delete clients[cliente];
		}
      
	} 

}

setInterval(intervalFunc, 1000);

http.listen(3000, function(){
  console.log('listening on port 3000');
});
