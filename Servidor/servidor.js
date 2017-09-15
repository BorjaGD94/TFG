var express = require('express');
var http = require('http');
var io = require('socket.io');

var fs = require('fs');
var SQL = require('./sql.js');
 
 
var app = express();
app.use(express.static('./../pagina_tmp'));

 
var server = http.createServer(app).listen(8124, '192.168.1.41');
io = io.listen(server); 

 
io.sockets.on("connection",function(socket){

      socket.on("message",function(info){
        datos = JSON.parse(info);
        /*This event is triggered at the server side when client sends the data using socket.send() method */
        if (datos.operacion == "Pacientes"){
            console.log("Obtener lista de pacientes");

            var filebuffer = fs.readFileSync('./Pacientes_DB.db');
            var db = new SQL.Database(filebuffer);
            var pacientes = db.exec("SELECT * FROM pacientes");

            socket.emit("pacientes",pacientes[0].values);

            db.close();
        }
        if(datos.operacion == "Añadir paciente"){
            console.log("Paciente a añadir: "+datos.n);
            var filebuffer = fs.readFileSync('./Pacientes_DB.db');

            var db = new SQL.Database(filebuffer);

            db.run("INSERT INTO pacientes VALUES (:id, :nombre, :apellido, :sexo)", {':nombre':datos.n, ':apellido':datos.a,':sexo':datos.s});

            var data = db.export();
            var buffer = new Buffer(data);
            fs.writeFileSync("./Pacientes_DB.db", buffer);
            db.close();
            var ack_to_client = {
                data:"El servidor ha añadido un paciente a la db"
            }
            socket.send(JSON.stringify(ack_to_client));
            io.sockets.emit("reload",{});
          }

        if(datos.operacion=="Borrar paciente"){
          console.log("Paciente a borrar: "+datos.nombre);
            var filebuffer = fs.readFileSync('./Pacientes_DB.db');

            var db = new SQL.Database(filebuffer);

            db.run("DELETE FROM datos_pacientes WHERE N_Paciente="+datos.id);
            db.run("DELETE FROM pacientes WHERE id="+datos.id);

            var data = db.export();
            var buffer = new Buffer(data);
            fs.writeFileSync("./Pacientes_DB.db", buffer);
            db.close();
            var ack_to_client = {
                data:"El servidor ha eliminado un paciente de la db"
            }
            socket.send(JSON.stringify(ack_to_client));
            io.sockets.emit("reload",{});
        }

        if(datos.operacion=="Datos paciente"){
          console.log("Mostrar datos de: "+datos.n);
            var filebuffer = fs.readFileSync('./Pacientes_DB.db');

            var db = new SQL.Database(filebuffer);

            //var datos_paciente = db.exec("SELECT * FROM datos_pacientes WHERE N_PACIENTE ="+datos.id);
            var datos_paciente = db.exec("SELECT * FROM datos_pacientes WHERE N_Paciente = "+datos.id+" ORDER BY datetime(FECHA) asc LIMIT (select count() from datos_pacientes)");

            socket.emit("datos_paciente",datos_paciente);

            db.close();
        }

        if(datos.operacion=="Datos de Evolucion paciente"){
          console.log("Mostrar datos de evolucion de: "+datos.n);
            var filebuffer = fs.readFileSync('./Pacientes_DB.db');

            var db = new SQL.Database(filebuffer);

            //var datos_evolucion_paciente = db.exec("SELECT max_c, min_c, max_s, min_s, max_t, min_t, Fecha FROM datos_pacientes WHERE N_PACIENTE ="+datos.id);
            var datos_evolucion_paciente = db.exec("SELECT max_c, min_c, max_s, min_s, max_t, min_t, Fecha FROM datos_pacientes WHERE N_PACIENTE ="+datos.id+" ORDER BY datetime(FECHA) asc LIMIT (select count() from datos_pacientes)");

            socket.emit("datos_evolucion_paciente",datos_evolucion_paciente);
            db.close();
        }

        if(datos.operacion == "Añadir datos de paciente"){
            console.log("Paciente a añadir: "+datos.n);

            var filebuffer = fs.readFileSync('./Pacientes_DB.db');

            var db = new SQL.Database(filebuffer);

            db.run("INSERT INTO datos_pacientes VALUES (:id_datos, :Time_ms, :Coronal, :Sagital, :Transversal, :N_Paciente, :Fecha, :max_c, :min_c, :max_s, :min_s, :max_t, :min_t)", {':Time_ms':datos.t1, ':Coronal':datos.c1,':Sagital':datos.s1, ':Transversal':datos.t1, ':N_Paciente':datos.id, ':Fecha':datos.f, ':max_c':datos.mxc, ':min_c':datos.mnc, ':max_s':datos.mxs, ':min_s':datos.mns, ':max_t':datos.mxt, ':min_t':datos.mntr});
            var data = db.export();
            var buffer = new Buffer(data);
            fs.writeFileSync("./Pacientes_DB.db", buffer);
            db.close();
            var ack_to_client = {
                data:"El servidor ha datos de un paciente a la db"
            }
            socket.send(JSON.stringify(ack_to_client));
            io.sockets.emit("reload",{});
          }

        if(datos.operacion=="Borrar datos de paciente"){
          console.log("Datos de paciente a borrar: "+datos.n);
            var filebuffer = fs.readFileSync('./Pacientes_DB.db');

            var db = new SQL.Database(filebuffer);

            db.run("DELETE FROM datos_pacientes WHERE id_datos="+datos.id);

            var data = db.export();
            var buffer = new Buffer(data);
            fs.writeFileSync("./Pacientes_DB.db", buffer);
            db.close();
            var ack_to_client = {
                data:"El servidor ha eliminado los datos del paciente de la db"
            }
            socket.send(JSON.stringify(ack_to_client));
            io.sockets.emit("reload",{});
        }

      });
        /*Sending the Acknowledgement back to the client , this will trigger "message" event on the clients side*/

});


    

