import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Line } from "react-chartjs-2";
import getLocalItems from "../funciones/GetLocalItems";

ChartJS.register(
  TimeScale,
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
export default function GraficoLinea() {
  const [listado, setListado] = useState(getLocalItems());
  const [datos, setDatos] = useState<{ fecha: any; valor: number; }[]>([]);

  const calcular = () => {
    let nuevoListado = [];
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

      const nuevoObjeto = {
        fecha: objetos[0].fecha,
        valor: suma
      }

      nuevoListado.push(nuevoObjeto);
      setDatos(nuevoListado);
      console.log(suma);
    }
  };

  useEffect(() => {
    //console.log(listado)
    calcular();
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
    // scales: {
    //   x: {
    //     adapters: {
    //       type: "time",
    //       distribution: "linear",
    //       time: {
    //         parser: "yyyy-MM-dd",
    //         unit: "month"
    //       },
    //       title: {
    //         display: true,
    //         text: "Date"
    //       }
    //     }
    //   }
    // }
    
  };

  function getDatesOfMonth(year: any, month: any) {
    const daysInMonth = new Date(year, month, 0).getDate();
    const datesArray = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const formattedDate = formatDate(date);
      datesArray.push(formattedDate);
    }

    return datesArray;
  }

  function formatDate(date: any) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}`;
  }

  const year = new Date().getFullYear();
  const month = new Date().getMonth(); // July
  const datesOfMonth = getDatesOfMonth(year, month);

  // const labels = [
  //   1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  //   22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  // ];

  const labels = datesOfMonth;

  const data = {
    labels,
    datasets: [
      {
        label: "Gastos",
        data: datos.map((i: any) => i.valor),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  return (
    <div>
      <Line options={options} data={data} />
    </div>
  );
}
