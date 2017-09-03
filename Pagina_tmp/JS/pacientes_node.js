
function save_paciente(nombre, apellido, sexo){
	var socket = io.connect("http://127.0.0.1:8124"); 

    socket.on("message",function(message){  
        console.log("El servidor ha recibido el paciente");
        message = JSON.parse(message);
        console.log(message); /*converting the data into JS object */
        /*appending the data on the page using Jquery */
    });

     var data = {
        	operacion: "Añadir paciente",  /*creating a Js ojbect to be sent to the server*/ 
            n: nombre, /*getting the text input data      */
            a: apellido,
            s: sexo               
    }
    socket.send(JSON.stringify(data));
    socket.on("reload", function (data) {
    	location.reload();
	});
}

function get_paciente_node(callback){

	var socket = io.connect('http://127.0.0.1:8124');
    socket.on('pacientes', function(pacientes) {
        callback(pacientes);
    });

}

function borrar_paciente(N_p,nombre){
	var y = confirm("¿Esta seguro de que quiere borrar a este paciente?. Al eliminar un paciente borrara todos sus datos asociados.");
    if (y == true){
    	var socket = io.connect("http://127.0.0.1:8124"); 

            socket.on("message",function(message){  
                console.log("El servidor ha recibido la petición para borrar los datos del paciente");
                message = JSON.parse(message);
                console.log(message); /*converting the data into JS object */
                    /*appending the data on the page using Jquery */
            });

            var data = { /*creating a Js ojbect to be sent to the server*/
            	operacion: "Borrar paciente", 
                id: N_p, /*getting the text input data      */    
                n: nombre         
            }
            socket.send(JSON.stringify(data));
            socket.on("reload", function (data) {
    			location.reload();
			});
        }
        else{
        console.log("Datos no borrados");
    }
}

function datos(id,nombre,apellido,sexo){
    window.location.href = "./../evolucion.html?var1="+id+"&var2="+nombre+"&var3="+apellido+"&var4="+sexo;
}

