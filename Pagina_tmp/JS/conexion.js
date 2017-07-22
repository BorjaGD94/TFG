function conexion(){
	var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://127.0.0.1:8080/prueba.db', true);
    xhr.responseType = 'arraybuffer';

    xhr.onload = function(e) {
        var uInt8Array = new Uint8Array(this.response);
        var db = new SQL.Database(uInt8Array);
        // var contents = db.exec("SELECT * FROM EloyPrueba1");
        // console.log(contents);
	};
	xhr.send();
    return db;
}