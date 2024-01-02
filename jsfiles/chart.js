const ctx = document.getElementById("myChart").getContext("2d");
var gradient = ctx.createLinearGradient(0, 0, 0, 400);
gradient.addColorStop(0, 'rgba(250,174,50,1)');   
gradient.addColorStop(1, 'rgba(250,174,50,0)');
let data_arr;

// localStorage.setItem("streaks",JSON.stringify([3,8,18,23,15,11,9]));
function returndata_arr(){
  data_arr = JSON.parse(localStorage.getItem("streaks"));
  // chart.update()
  return data_arr;
}
// setInterval(returndata_arr,60000)

function updateChart() {
  // Assuming returndata_arr() is a function that returns the updated data
  const newData = returndata_arr();
  // Update the chart's data
  chart.data.datasets[0].data = newData;
  // Update the chart
  chart.update();
}

// Periodically update the chart every 5 seconds (adjust the interval as needed)
setInterval(updateChart,62000);

const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: ["M", "T", "W", "T", "F", "S", "S"],
    datasets: [
      {
        label: "Streaks",
        data: returndata_arr(),
        fill: true,
        fillColor : gradient, // Put the gradient here as a fill color
        strokeColor : "#ff6c23",
        backgroundColor: "rgba(0, 0, 0, 0)",
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 2,
        pointRadius: 2,
      },
    ],
  },
  options: {
    scales: {
      xAxes: [
        {
          gridLines: {
            display: false,
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            stepSize: 10,
            max: 100,
          },
          grid: {
            color: "rgb(0,0,0)",
            drawBorder: false,
          },
        },
      ],
    },
    responsive: false,
    elements: {
      line: {
        tension: 1, // controls the curvature of the line
        cubicInterpolationMode: "monotone", // makes the line smoother
      },
    },
  },
});

