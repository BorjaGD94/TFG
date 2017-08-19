function get_paciente(callback){

	var xhr = new XMLHttpRequest();
    xhr.open('GET', './../Pacientes_DB.db', true);
    xhr.responseType = 'arraybuffer';

    xhr.onload = function(e) {

        var uInt8Array = new Uint8Array(this.response);
        var db = new SQL.Database(uInt8Array);

        var row_n = db.exec("SELECT COUNT(*) FROM pacientes")
        var paciente = db.exec("SELECT * FROM pacientes");
        callback(paciente[0].values,row_n[0].values[0][0])

	};
	xhr.send(); 
}

function datos(id,nombre,apellido,sexo){
    window.location.href = "./../evolucion.html?var1="+id+"&var2="+nombre+"&var3="+apellido+"&var4="+sexo;
}