const CHART = document.getElementById("lineChart");
let lineChart = new Chart(CHART, {
	type: 'line',
    //var data = Papa.parse(csv);
	data: {
    labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September"],
    datasets: [
        {
            label: "My First dataset",
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
            data: [71, 52, 32, 34, 49, 61, 65, 59, 21],
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




