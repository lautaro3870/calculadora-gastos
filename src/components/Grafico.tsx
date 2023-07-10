import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import getLocalItems from "../funciones/GetLocalItems";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);



export default function Grafico() {

  const [listado, setListado] = useState(getLocalItems());

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Gastos",
      },
    },
  };
  
  const labels = ["Super", "Boludeces", "Tren", "Bondi", "Bar", "Otros"];
  
  const data = {
    labels,
    datasets: [
      {
        label: "Gastos",
        data: listado.map((i: any) => i.gasto),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      }
    ],
  };

  return (
    <div>
      <Bar options={options} data={data} />
    </div>
  );
}
