import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import getLocalItems from "../funciones/GetLocalItems";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
export default function GraficoLinea() {
  const [listado, setListado] = useState(getLocalItems());

  let nuevoListado: number[] = [];

  useEffect(() => {
    //console.log(listado)
    const nuevo = listado.reduce((acc: any, obj: any) => {
      var key = obj.fecha;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {});

    console.log(nuevo["01/03/2023"]);

    for (const key in nuevo) {
      const objetos = nuevo[key];

      console.log(objetos);

      let suma = 0;
      for (const objeto of objetos) {
        suma = suma + objeto.gasto;
      }
      nuevoListado.push(suma);
      console.log(suma);
    }
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Gastos por Día",
      },
    },
  };

  const labels = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: nuevoListado,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  return <Line options={options} data={data} />;
}
