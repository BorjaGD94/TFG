var socket = io.connect("http://172.20.10.5:8124");
socket.on("reload", function (data) {
        location.reload();
    });

function get_datos_node(id_p, callback){
    var socket = io.connect("http://172.20.10.5:8124");
    console.log("Conexíon establecida con el servidor");

    socket.on("message",function(message){
        message = JSON.parse(message);
        //console.log(message);
    });

     var datos1 = {
            operacion: "Datos paciente",
            id: id_p,
            n: nombre
    }
    socket.send(JSON.stringify(datos1));
    console.log("Solicitud de listado de movimientos de "+nombre+" enviada");
    socket.on("datos_paciente", function (data) {
      console.log("Lista de movimientos de "+nombre+" recibida");
        callback(data);
    });
}

var var_i = 0;
function crearGrafico(time, mov, n){
    var_i+=1;
    var url = window.location.href;
    var url1 = new URL(url);
    var nombre = url1.searchParams.get("var2");
    var apellido = url1.searchParams.get("var3");
    if(n==3){
        x="Coronal";
    }
    else if(n==2){
        x="Sagital";
    }
    else if(n==1){
        x="Transversal";
    }
    var Movimiento = mov.split(',');
    var Tiempo = time.split(',');
    const CHART = document.getElementById("lineChart");
    if (var_i>=2){
        lineChart.destroy();
    }
    lineChart = new Chart(CHART, {
    type: 'line',
    data: {
    labels: Tiempo,
    datasets: [
        {
            label: "Movimiento "+x+" de "+nombre+" "+apellido,
            fill: false,
            lineTension: 0.5,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: Movimiento,
            spanGaps: false,
        }
    ]
},options: {
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: false
            }
        }]
    }
}
});
console.log("Gráfico de movimiento en el plano "+x+" de "+nombre+" "+apellido+" disponible en el navegador");
}


function add_datos(datos,fecha){
    var Time = [];
    var Coronal = [];
    var Sagital = [];
    var Transversal = [];

    for(var i = 1; i < datos.length-1; i++){
        Time.push(datos[i][0]);
        Coronal.push(parseFloat(datos[i][1]).toFixed(2));
        Sagital.push(parseFloat(datos[i][2]).toFixed(2));
        Transversal.push(parseFloat(datos[i][3]).toFixed(2));
    }

    var max_c = Math.max.apply(null, Coronal);
    var min_c = Math.min.apply(null, Coronal);
    var max_t = Math.max.apply(null, Transversal);
    var min_tr = Math.min.apply(null, Transversal);
    var max_s = Math.max.apply(null, Sagital);
    var min_s = Math.min.apply(null, Sagital);


    var t = Time.join();
    var c = Coronal.join();
    var s = Sagital.join();
    var tr = Transversal.join();

    var socket = io.connect("http://172.20.10.5:8124");
    console.log("Conexíon establecida con el servidor");

    socket.on("message",function(message){
        //console.log("El servidor ha enviado un mensaje:");
        message = JSON.parse(message);
        //console.log(message);
    });

     var datos3 = {
            operacion: "Añadir datos de paciente",
            id: url1.searchParams.get("var1"),
            n: url1.searchParams.get("var2"),
            t1: t,
            c1: c,
            s1: s,
            t1: tr,
            mxc: max_c,
            mnc: min_c,
            mxt: max_t,
            mntr: min_tr,
            mxs: max_s,
            mns: min_s,
            f: fecha
    }
    socket.send(JSON.stringify(datos3));
    console.log("Datos de movimieto de "+datos3.n+" enviados");
}

function Evolucion(move){

    var socket = io.connect("http://172.20.10.5:8124");
    console.log("Conexíon establecida con el servidor");

    socket.on("message",function(message){
        //console.log("El servidor ha enviado un mensaje:");
        message = JSON.parse(message);
        //console.log(message);
    });

     var datos2 = {
            operacion: "Datos de Evolucion paciente",
            id: url1.searchParams.get("var1"),
            n:  url1.searchParams.get("var2")
    }
    socket.send(JSON.stringify(datos2));
    console.log("Solicitud de datos de evolución de "+datos2.n+" enviada");
    socket.on("datos_evolucion_paciente", function (max_minimo) {
        console.log("Datos de evolución de "+datos2.n+" recibidos");
        var genero = url1.searchParams.get("var4");

        var max = [];
        var max_max = [];
        var max_min = [];
        var min = [];
        var min_max = [];
        var min_min = [];
        var fecha = [];

        if(move==1){
            for(i=0;i<max_minimo[0].values.length;i++){
                max.push(max_minimo[0].values[i][0]);
                min.push(max_minimo[0].values[i][1]);
                fecha.push(max_minimo[0].values[i][6])
                if (genero == "h"){
                    max_max.push(49.2);
                    max_min.push(32.6);
                    min_max.push(-44.3);
                    min_min.push(-28.3);
                }
                else{
                    max_max.push(54.8);
                    max_min.push(35.8);
                    min_max.push(-53.1);
                    min_min.push(-37.9);
                }

            }
            grafico_evolucion(max,min,fecha,"Coronal",max_max,max_min,min_max,min_min,"Flexión Lateral","Extensión Lateral");

        }
        else if(move==2){
            for(i=0;i<max_minimo[0].values.length;i++){
                max.push(max_minimo[0].values[i][2]);
                min.push(max_minimo[0].values[i][3]);
                fecha.push(max_minimo[0].values[i][6])
                if (genero == "h"){
                    max_max.push(72.5);
                    max_min.push(48.3);
                    min_max.push(-82.6);
                    min_min.push(-57.2);
                }
                else{
                    max_max.push(68.2);
                    max_min.push(48.8);
                    min_max.push(-90.7);
                    min_min.push(-64.3);
                }
            }
            grafico_evolucion(max,min,fecha,"Sagital",max_max,max_min,min_max,min_min,"Flexión","Extensión");
        }
        else{
            for(i=0;i<max_minimo[0].values.length;i++){
                max.push(max_minimo[0].values[i][4]);
                min.push(max_minimo[0].values[i][5]);
                fecha.push(max_minimo[0].values[i][6])
                if (genero == "h"){
                    max_max.push(87.4);
                    max_min.push(72.2);
                    min_max.push(-83.5);
                    min_min.push(-67.1);
                }
                else{
                    max_max.push(89);
                    max_min.push(74.6);
                    min_max.push(-87.8);
                    min_min.push(-72.4);
                }
            }
                grafico_evolucion(max,min,fecha,"Transversal",max_max,max_min,min_max,min_min,"Rotación derecha","Rotación izquierda");
        }
    });

}



function grafico_evolucion(maximo, minimo, fechas, x, maximo_max, maximo_min, minimo_max, minimo_min,titulo1,titulo2){
    var_i+=1;
    var url = window.location.href;
    var url1 = new URL(url);
    var nombre = url1.searchParams.get("var2");
    var apellido = url1.searchParams.get("var3");
    var sexo = url1.searchParams.get("var4");
    const CHART = document.getElementById("lineChart");
    if (var_i>=2){
        lineChart.destroy();
    }
    lineChart = new Chart(CHART, {
    type: 'line',
    data: {
    labels: fechas,
    datasets: [
        {
            label: titulo1+" max",
            fill:'end',
            data:maximo_max,
        },
        {
            label: titulo1+" min",
            fill:true,
            data:maximo_min,
        },
        {
            label: titulo2+" max",
            fill:'bottom',
            data:minimo_max,
        },
        {
            label: titulo2+" min",
            fill:true,
            data:minimo_min,
        },
        {
            label: titulo1,
            fill: false,
            lineTension: 0.5,
            backgroundColor: "rgba(247,70,74,0.4)",
            borderColor: "rgba(247,70,74,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(247,70,74,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(247,70,74,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: maximo,
            spanGaps: false,
        },
        {
            label: titulo2,
            fill: false,
            lineTension: 0.5,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: minimo,
            spanGaps: false,
        },
    ]
},options: {
    title: {
            display: true,
            text: "Evolucion en el plano "+x+" de "+nombre+" "+apellido
        },
    scales: {
        yAxes: [{
            ticks: {
                    beginAtZero: false,
                    min: -90,
                    max: 90
                },
            gridLines: {
                drawBorder: true,
                }
        }]
    }
}
});
console.log("Gráfico de Evolución en el plano "+x+" de "+nombre+" "+apellido+" disponible en el navegador");
}


function borrar_datos(N_p,nombre){
    var r = confirm("¿Esta seguro de que quiere borrar estos datos?");
    if (r == true){

        var socket = io.connect("http://172.20.10.5:8124");
        console.log("Conexíon establecida con el servidor");

            socket.on("message",function(message){
                //console.log("El servidor ha enviado un mensaje:");
                message = JSON.parse(message);
                //console.log(message);
            });

            var data = {
                operacion: "Borrar datos de paciente",
                id: N_p,
                n: nombre
            }
            socket.send(JSON.stringify(data));
            console.log("Solicitud para borrar datos de "+data.n+" enviada");
    }
    else{
        console.log("Datos no borrados");
    }
}
