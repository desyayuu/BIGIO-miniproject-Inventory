import React, { useEffect, useState } from 'react';
import ApexCharts from 'react-apexcharts';

const DonutChart = () => {
  const [chartOptions, setChartOptions] = useState({
    series: [70, 30],
    colors: ["#336E78", "#B22222"],
    chart: {
      height: 320,
      width: "100%",
      type: "donut",
    },
    stroke: {
      colors: ["transparent"],
      lineCap: "",
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              show: true,
              fontFamily: "Inter, sans-serif",
              offsetY: 20,
            },
            total: {
              showAlways: true,
              show: true,
              
              fontFamily: "Inter, sans-serif",
              formatter: function (w) {
                const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return + sum;
              },
            },
            value: {
              show: true,
              fontFamily: "Inter, sans-serif",
              offsetY: -20,
              formatter: function (value) {
                return value ;
              },
            },
          },
          size: "80%",
        },
      },
    },
    grid: {
      padding: {
        top: -2,
      },
    },
    labels: ["Barang Masuk", "Barang Keluar"],
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "bottom",
      fontFamily: "Inter, sans-serif",
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return value;
        },
      },
    },
    xaxis: {
      labels: {
        formatter: function (value) {
          return value ;
        },
      },
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
  });

  const items = [
    { name: 'Laptop', percentage: 70.2 },
    { name: 'Mouse', percentage: 29.8 },
  ];

  const handleCheckboxChange = (event, itemName) => {
    const checkbox = event.target;

    const updatedItems = items.map((item) => {
      if (item.name === itemName) {
        return {
          ...item,
          percentage: checkbox.checked ? 80.2 : 70.2,
        };
      }
      return item;
    });

    const updatedSeries = updatedItems.map((item) => item.percentage);

    setChartOptions({
      ...chartOptions,
      series: updatedSeries,
    });
  };

  return (
    <div className="max-w-sm w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
      <div className="py-6" id="donut-chart">
        <ApexCharts options={chartOptions} series={chartOptions.series} type="donut" height={chartOptions.chart.height} />
      </div>

      <div className="flex" id="devices">
        {items.map((item) => (
          <div className="flex items-center me-4" key={item.name}>
            <input
              id={`checkbox-${item.name}`}
              type="checkbox"
              value={item.name}
              onChange={(e) => handleCheckboxChange(e, item.name)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor={`checkbox-${item.name}`} className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{item.name}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;