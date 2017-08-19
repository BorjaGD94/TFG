function save_paciente(nombre, apellido, sexo){
	var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://127.0.0.1:8080/Pacientes_DB.db', true);
    //xhr.open('GET', './../Pacientes_DB.db', true);
    xhr.responseType = 'arraybuffer';
    //console.log(nombre, apellido);

    xhr.onload = function(e) {

        var uInt8Array = new Uint8Array(this.response);
        var db = new SQL.Database(uInt8Array);
        
        db.run("INSERT INTO pacientes VALUES (:id, :nombre, :apellido, :sexo)", {':nombre':nombre, ':apellido':apellido,':sexo':sexo});

        var contents = db.exec("SELECT * FROM pacientes");
        
        console.log(contents);

	};
	xhr.send(); 

}




