var socket = io.connect("http://192.168.1.33:8124"); 
socket.on("reload", function (data) {
    	location.reload();
	});

function save_paciente(nombre, apellido, sexo){
	//var socket = io.connect("http://192.168.1.33:8124"); 
	var socket = io.connect("http://192.168.1.33:8124"); 
    console.log("Conexíon establecida con el servidor");  
    socket.on("message",function(message){  
        console.log("El servidor ha enviado un mensaje:");
        message = JSON.parse(message);
        //console.log(message.data); 
    });

     var data = {
        	operacion: "Añadir paciente",  /*creating a Js ojbect to be sent to the server*/ 
            n: nombre, /*getting the text input data      */
            a: apellido,
            s: sexo               
    }
    socket.send(JSON.stringify(data));
    console.log("Solicitud para añadir paciente: ("+data.n+" "+data.a+") enviada");
}

function get_paciente_node(callback){

    var socket = io.connect("http://192.168.1.33:8124");
    console.log("Conexíon establecida con el servidor");  

    socket.on("message",function(message){  
        message = JSON.parse(message);
        //console.log(message.data); 
    });

     var datos5 = {
            operacion: "Pacientes"         
    }
    socket.send(JSON.stringify(datos5));
    console.log("Solicitud de listado de pacientes enviada");
    socket.on("pacientes", function (data) {
        console.log("Lista de pacientes recibida");
        callback(data);
    });

}

function borrar_paciente(N_p,nombre){
	var y = confirm("¿Esta seguro de que quiere borrar a este paciente?. Al eliminar un paciente borrara todos sus datos asociados.");
    if (y == true){

    	var socket = io.connect("http://192.168.1.33:8124");  
        console.log("Conexíon establecida con el servidor");  
            socket.on("message",function(message){  
                console.log("El servidor ha enviado un mensaje:");
                message = JSON.parse(message);
                //console.log(message.data); 
            });

            var data = { 
            	operacion: "Borrar paciente", 
                id: N_p,   
                n: nombre         
            }
            socket.send(JSON.stringify(data));
            console.log("Solicitud para borrar paciente: ("+data.n+") enviada");
        }
        else{
        console.log("Datos no borrados");
    }
}

function datos(id,nombre,apellido,sexo){
	window.location.href = "http://192.168.1.33:8124/../evolucion.html?var1="+id+"&var2="+nombre+"&var3="+apellido+"&var4="+sexo;
}



