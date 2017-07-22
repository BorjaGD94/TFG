function save_paciente(nombre, apellido){
	var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://127.0.0.1:8080/Pacientes_DB.db', true);
    xhr.responseType = 'arraybuffer';
    //console.log(nombre, apellido);

    xhr.onload = function(e) {
        var uInt8Array = new Uint8Array(this.response);
        var db = new SQL.Database(uInt8Array);
        
        db.run("BEGIN TRANSACTION;");
        db.run("INSERT INTO pacientes VALUES (:id, :nombre, :apellido)", {':nombre':nombre, ':apellido':apellido});
        //db.run("INSERT INTO pacientes(nombre,apellido) VALUES('"nombre"','"apellido"');");
        db.run("COMMIT;");
        var contents = db.exec("SELECT * FROM pacientes");
        
        console.log(contents);

        function toBinString (uInt8Array) {
            var uarr = new Uint8Array(uInt8Array);
            var strings = [], chunksize = 0xffff;
            // There is a maximum stack size. We cannot call String.fromCharCode with as many arguments as we want
            for (var i=0; i*chunksize < uarr.length; i++){
                strings.push(String.fromCharCode.apply(null, uarr.subarray(i*chunksize, (i+1)*chunksize)));
            }
            return strings.join('');
        }

        window.localStorage.setItem("Pacientes_DB.db", toBinString(db.export()));

        return uInt8Array;
	};
	xhr.send();
}
