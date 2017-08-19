function parseData(createGraph){
    Papa.parse("../Datos_csv/Eloy_Prueba_1.csv", {
    	download: true,
    	complete: function(results) {
    		//console.log(results.data);
    		createGraph(results.data);
    	}
    });
}


function createGraph(data){
	var Time = [];
	var Coronal = [];

	for(var i = 1; i < data.length; i++){
		Time.push(data[i][0]);
		Coronal.push(data[i][1]);
	}
    console.log(Coronal);
    console.log(Time);
    console.log(Math.max.apply(null, Coronal));/*Aquí vemos el valor máximo de Coronal,
     y lo utilizaremos para hacer un gráfico de progreso donde existirán valores de normalidad*/
	//console.log(Time);
	//console.log(Coronal);
	const CHART = document.getElementById("lineChart");
	let lineChart = new Chart(CHART, {
	type: 'line',
	data: {
    labels: Time,
    datasets: [
        {
            label: "Movimiento Coronal Eloy",
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
            data: Coronal,
            spanGaps: false,
        }
    ]
},options: {
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
    }
}
});
}

parseData(createGraph);




