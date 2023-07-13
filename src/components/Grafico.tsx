import React, { useState, useEffect } from "react";
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
      },
    ],
  };

  useEffect(() => {
    console.log(listado);
    let cs = 0;
    let cb = 0;
    let cBondi = 0;

    let final: number[] = []

    listado.map((i: any) => {
      switch (i.categoria) {
        case "Super":
          cs++;
          break;
        case "Boludeces":
          cb++;
          break;
        case "Bondi":
          cBondi++;
          break;
      }
    });

    final.push(cs, cb, cBondi);
    console.log(final)

    // const nuevo = listado.reduce((acc: any, obj: any) => {
    //   var key = obj.categoria;
    //   if (!acc[key]) {
    //     acc[key] = [];
    //   }
    //   acc[key].push(obj);
    //   return acc;
    // }, {});

    // console.log(nuevo)
  }, []);

  return (
    <div>
      <Bar options={options} data={data} />
    </div>
  );
}
