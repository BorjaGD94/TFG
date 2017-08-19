function save_paciente(nombre, apellido, sexo){

        //Este código sirve para guardar los cambios en el navegador pero no en nuestra base de datos.

        function toBinString (arr) {
            var uarr = new Uint8Array(arr);
            var strings = [], chunksize = 0xffff;
            // There is a maximum stack size. We cannot call String.fromCharCode with as many arguments as we want
            for (var i=0; i*chunksize < uarr.length; i++){
                strings.push(String.fromCharCode.apply(null, uarr.subarray(i*chunksize, (i+1)*chunksize)));
            }
            return strings.join('');
        }
        function toBinArray (str) {
            var l = str.length,
            arr = new Uint8Array(l);
            for (var i=0; i<l; i++) arr[i] = str.charCodeAt(i);
            return arr;
        }

        var dbstr = window.localStorage.getItem("./../Pacientes_DB.db");
        var db = new SQL.Database(toBinArray(dbstr));

        db.run("INSERT INTO pacientes VALUES (:id, :nombre, :apellido, :sexo)", {':nombre':nombre, ':apellido':apellido,':sexo':sexo});

        var contents = db.exec("SELECT * FROM pacientes");
        
        console.log(contents);

        window.localStorage.setItem("./../Pacientes_DB.db", toBinString(db.export()));


}