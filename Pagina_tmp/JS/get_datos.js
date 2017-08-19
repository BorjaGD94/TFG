function get_datos(id, callback){

	var xhr = new XMLHttpRequest();
    xhr.open('GET', './Pacientes_DB.db', true);
    xhr.responseType = 'arraybuffer';

    xhr.onload = function(e) {

        var uInt8Array = new Uint8Array(this.response);
        var db = new SQL.Database(uInt8Array);
        var datos = db.exec("SELECT * FROM datos_pacientes WHERE N_PACIENTE ="+id);
        callback(datos);
	};
	xhr.send(); 
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
}


function add_datos(datos,fecha){
    var id = url1.searchParams.get("var1");
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

    console.log(max_c);
    console.log(min_c);
    console.log(max_s);
    console.log(min_s);
    console.log(max_t);
    console.log(min_tr);

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://127.0.0.1:8080/Pacientes_DB.db', true);
    //xhr.open('GET', './../Pacientes_DB.db', true);
    xhr.responseType = 'arraybuffer';
    //console.log(nombre, apellido);

    xhr.onload = function(e) {

        var uInt8Array = new Uint8Array(this.response);
        var db = new SQL.Database(uInt8Array);
        var id = url1.searchParams.get("var1");
        
        db.run("INSERT INTO datos_pacientes VALUES (:Time_ms, :Coronal, :Sagital, :Transversal, :N_Paciente, :Fecha, :max_c, :min_c, :max_s, :min_s, :max_t, :min_t)", {':Time_ms':t, ':Coronal':c,':Sagital':s, ':Transversal':tr, ':N_Paciente':id, ':Fecha':fecha, ':max_c':max_c, ':min_c':min_c, ':max_s':max_s, ':min_s':min_s, ':max_t':max_t, ':min_t':min_tr});

        var contents = db.exec("SELECT * FROM datos_pacientes");
        
        console.log(contents);

    };
    xhr.send(); 

}

function Evolucion(move){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://127.0.0.1:8080/Pacientes_DB.db', true);
    //xhr.open('GET', './../Pacientes_DB.db', true);
    xhr.responseType = 'arraybuffer';
    //console.log(nombre, apellido);

    xhr.onload = function(e) {

        var uInt8Array = new Uint8Array(this.response);
        var db = new SQL.Database(uInt8Array);

        var N_pac = url1.searchParams.get("var1");
        var genero = url1.searchParams.get("var4");
        
        var max_minimo = db.exec("SELECT max_c, min_c, max_s, min_s, max_t, min_t, Fecha FROM datos_pacientes WHERE N_PACIENTE ="+N_pac);

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
            grafico_evolucion(max,min,fecha,"Transversal",max_max,max_min,min_max,min_min);

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
            grafico_evolucion(max,min,fecha,"Sagital",max_max,max_min,min_max,min_min);
        }
        else{
            for(i=0;i<max_minimo[0].values.length;i++){
                max.push(max_minimo[0].values[i][4]);
                min.push(max_minimo[0].values[i][5]);
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
                grafico_evolucion(max,min,fecha,"Coronal",max_max,max_min,min_max,min_min);
        }

    };
    xhr.send(); 

}



function grafico_evolucion(maximo, minimo, fechas, x, maximo_max, maximo_min, minimo_max, minimo_min){
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
            fill:false,
            data:maximo_max,
        },
        {
            fill:false,
            data:maximo_min,
        },
        {
            fill:false,
            data:minimo_max,
        },
        {
            fill:false,
            data:minimo_min,
        },
        {
            label: "Evolucion "+x+" de "+nombre+" "+apellido,
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
            label: "Evolucion "+x+" de "+nombre+" "+apellido,
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
}





