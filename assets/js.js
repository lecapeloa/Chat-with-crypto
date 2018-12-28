$(document).ready(function(){  
    var socket = io.connect("http://192.168.0.17:3000");
    var ready = false;
    $("#submit").submit(function(e) {
		e.preventDefault();
		$("#nick").fadeOut();
		$("#chat").fadeIn();
		var name = $("#nickname").val();
		var time = new Date();
		$("#name").html(name);
		$("#time").html('Login: ' + time.getHours() + ':' + time.getMinutes());

		ready = true;
		socket.emit("join", name);

	});

	$("#textarea").keypress(function(e){
        if(e.which == 13) {
        	var text = $("#textarea").val();
        	$("#textarea").val('');
        	var time = new Date();
					$(".chat").append('<li class="self"><div class="msg"><span>' + $("#nickname").val() + ':</span><p>' + text + '</p><time>' + time.getHours() + ':' + time.getMinutes() + '</time></div></li>');
					
					socket.emit("send", text);
					// automatically scroll down
					document.getElementById('bottom').scrollIntoView();
        }
    });


    socket.on("update", function(msg) {
    	if (ready) {
    		$('.chat').append('<li class="info">' + msg + '</li>')
    	}
    }); 
	
	socket.on("checkout", function(msg) {
    	if (ready) {
    		socket.emit("checkin", "ok");
    	}
    }); 
	socket.on("pc", function(msg) {
    	if (ready) {
    		$('#pc').html(msg);
    	}
    }); 

    socket.on("chat", function(client,msg) {
    	if (ready) {
				var time = new Date();
				$(".chat").append('<li class="field"><div class="msg"><span>' + client + ':</span><p>' + msg + '</p><time>' + time.getHours() + ':' + time.getMinutes() + '</time></div></li>');
				
    	}
    });




});

