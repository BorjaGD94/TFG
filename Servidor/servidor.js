var express = require('express');
var http = require('http');
var io = require('socket.io');

var fs = require('fs');
var SQL = require('./sql.js');

var timestamp = require('console-timestamp');

var app = express();
app.use(express.static('./../pagina_web'));


var server = http.createServer(app).listen(8124, '172.20.10.5');
io = io.listen(server);


io.sockets.on("connection",function(socket){

    console.log(timestamp('hh:mm:ss:iii')+" Conexión establecida con el cliente");

    var message_to_client = {
        data:"Conexión establecida con el servidor"
      }
    socket.send(JSON.stringify(message_to_client));

    socket.on("message",function(info){
        datos = JSON.parse(info);
        console.log(timestamp('hh:mm:ss:iii')+" Petición del cliente: "+datos.operacion);

        if (datos.operacion == "Pacientes"){
            var filebuffer = fs.readFileSync('./Pacientes_DB.db');
            var db = new SQL.Database(filebuffer);
            console.log(timestamp('hh:mm:ss:iii')+" Base de datos abierta");
            var pacientes = db.exec("SELECT * FROM pacientes");
            socket.emit("pacientes",pacientes[0].values);
            console.log(timestamp('hh:mm:ss:iii')+" Listado de pacientes enviado al cliente");
            db.close();
            console.log(timestamp('hh:mm:ss:iii')+" Base de datos cerrada");
        }

        if(datos.operacion == "Añadir paciente"){
            console.log(timestamp('hh:mm:ss:iii')+" Paciente a añadir: "+datos.n+" "+datos.a);
            var filebuffer = fs.readFileSync('./Pacientes_DB.db');

            var db = new SQL.Database(filebuffer);
            console.log(timestamp('hh:mm:ss:iii')+" Base de datos abierta");
            db.run("INSERT INTO pacientes VALUES (:id, :nombre, :apellido, :sexo)", {':nombre':datos.n, ':apellido':datos.a,':sexo':datos.s});
            console.log(timestamp('hh:mm:ss:iii')+" Se ha añadido al paciente "+datos.n+" "+datos.a+" a la base de datos");
            var data = db.export();
            var buffer = new Buffer(data);
            fs.writeFileSync("./Pacientes_DB.db", buffer);
            db.close();
            console.log(timestamp('hh:mm:ss:iii')+" Base de datos cerrada");
            io.sockets.emit("reload",{});
          }

        if(datos.operacion=="Borrar paciente"){
            var filebuffer = fs.readFileSync('./Pacientes_DB.db');

            var db = new SQL.Database(filebuffer);
            console.log(timestamp('hh:mm:ss:iii')+" Base de datos abierta");
            db.run("DELETE FROM datos_pacientes WHERE N_Paciente="+datos.id);
            db.run("DELETE FROM pacientes WHERE id="+datos.id);
            var data = db.export();
            var buffer = new Buffer(data);
            fs.writeFileSync("./Pacientes_DB.db", buffer);
            console.log(timestamp('hh:mm:ss:iii')+" Paciente "+datos.n+" y sus datos asociados eliminados de la base de datos");
            db.close();
            console.log(timestamp('hh:mm:ss:iii')+" Base de datos cerrada");
            io.sockets.emit("reload",{});
        }

        if(datos.operacion=="Datos paciente"){
            var filebuffer = fs.readFileSync('./Pacientes_DB.db');

            var db = new SQL.Database(filebuffer);
            console.log(timestamp('hh:mm:ss:iii')+" Base de datos abierta");
            var datos_paciente = db.exec("SELECT * FROM datos_pacientes WHERE N_Paciente = "+datos.id+" ORDER BY datetime(FECHA) asc LIMIT (select count() from datos_pacientes)");

            socket.emit("datos_paciente",datos_paciente);
            console.log(timestamp('hh:mm:ss:iii')+" Listado de movimientos de "+datos.n+" enviado al cliente");

            db.close();
            console.log(timestamp('hh:mm:ss:iii')+" Base de datos cerrada");
        }

        if(datos.operacion=="Datos de Evolucion paciente"){
            var filebuffer = fs.readFileSync('./Pacientes_DB.db');

            var db = new SQL.Database(filebuffer);
            console.log(timestamp('hh:mm:ss:iii')+" Base de datos abierta");

            var datos_evolucion_paciente = db.exec("SELECT max_c, min_c, max_s, min_s, max_t, min_t, Fecha FROM datos_pacientes WHERE N_PACIENTE ="+datos.id+" ORDER BY datetime(FECHA) asc LIMIT (select count() from datos_pacientes)");

            socket.emit("datos_evolucion_paciente",datos_evolucion_paciente);
            console.log(timestamp('hh:mm:ss:iii')+" Listado de datos de evolución de movimiento de "+datos.n+" enviado al cliente");
            db.close();
            console.log(timestamp('hh:mm:ss:iii')+" Base de datos cerrada");
        }

        if(datos.operacion == "Añadir datos de paciente"){

            var filebuffer = fs.readFileSync('./Pacientes_DB.db');

            var db = new SQL.Database(filebuffer);
            console.log(timestamp('hh:mm:ss:iii')+" Base de datos abierta");
            db.run("INSERT INTO datos_pacientes VALUES (:id_datos, :Time_ms, :Coronal, :Sagital, :Transversal, :N_Paciente, :Fecha, :max_c, :min_c, :max_s, :min_s, :max_t, :min_t)", {':Time_ms':datos.t1, ':Coronal':datos.c1,':Sagital':datos.s1, ':Transversal':datos.t1, ':N_Paciente':datos.id, ':Fecha':datos.f, ':max_c':datos.mxc, ':min_c':datos.mnc, ':max_s':datos.mxs, ':min_s':datos.mns, ':max_t':datos.mxt, ':min_t':datos.mntr});
            var data = db.export();
            var buffer = new Buffer(data);
            fs.writeFileSync("./Pacientes_DB.db", buffer);
            console.log(timestamp('hh:mm:ss:iii')+" Datos de movimiento de "+datos.n+" guardados en la base de datos");
            db.close();
            console.log(timestamp('hh:mm:ss:iii')+" Base de datos cerrada");
            io.sockets.emit("reload",{});
          }

        if(datos.operacion=="Borrar datos de paciente"){
            var filebuffer = fs.readFileSync('./Pacientes_DB.db');

            var db = new SQL.Database(filebuffer);
            console.log(timestamp('hh:mm:ss:iii')+" Base de datos abierta");
            db.run("DELETE FROM datos_pacientes WHERE id_datos="+datos.id);

            var data = db.export();
            var buffer = new Buffer(data);
            fs.writeFileSync("./Pacientes_DB.db", buffer);
            console.log(timestamp('hh:mm:ss:iii')+" Datos de moviento del paciente "+datos.n+" borrados")
            db.close();
            console.log(timestamp('hh:mm:ss:iii')+" Base de datos cerrada");
            io.sockets.emit("reload",{});
        }

      });

});
