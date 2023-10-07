import { useState, useEffect } from "react";
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
import { useQuery } from "@apollo/client";
import {
  GASTOS_CATEGORIA_MES,
  GASTOS_CATEGORIA_MES_REPORTE,
} from "../graphql/Query";
import CircularProgress from "@mui/material/CircularProgress";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import meses from "../Meses";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Grafico() {
  // const [listado, setListado] = useState(getLocalItems());
  const [reporte, setReporte] = useState<number[] | null>([]);
  const [mes, setMes] = useState<string>("");

  const { data, loading, error } = useQuery(GASTOS_CATEGORIA_MES_REPORTE, {
    fetchPolicy: "no-cache",
  });

  const labels = [
    "super",
    "bondi",
    "metro",
    "bar",
    "boludeces",
    "ropa",
    "otros",
    "cafe",
  ];

  const options = {
    labels,
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

  const handleChange = (e: SelectChangeEvent) => {
    const gasto = data.gastosPorCategoriaYMes.find((objeto: any) => objeto.mes === e.target.value.toString())
    setReporte(gasto)
    setMes(e.target.value)
  }

  const gastos = {
    datasets: [
      {
        label: "Gastos",
        data: reporte,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  useEffect(() => {
    setReporte(data === undefined ? [] : data.gastosPorCategoriaYMes);
  }, [data, loading, error]);

  return (
    <div>
      <br></br>
      {loading ? (
        <CircularProgress />
      ) : (
        <div>
          <Select label="Categorias" size="small" value={mes} onChange={handleChange}>
            {meses.map((mes, i) => (
              <MenuItem selected key={i} value={mes.id}>
                {mes.mes}
              </MenuItem>
            ))}
          </Select>

          <Bar options={options} data={gastos} />
        </div>
      )}
    </div>
  );
}
