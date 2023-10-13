import { Box, Stack } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GASTOS_CATEGORIA_MES } from "../graphql/Query";
import CircularProgress from "@mui/material/CircularProgress";

export default function ReporteMensual() {
  const { data, loading, error } = useQuery(GASTOS_CATEGORIA_MES);

  const [datos, setDatos] = useState<any[]>(
    data === undefined ? [] : data.gastosPorCategoriaYMes
  );

  const getMonthName = (monthNumber: any) => {
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    return months[monthNumber - 1];
  };

  const rendondear = (valor: number) => {
    return valor.toFixed(2);
  };

  useEffect(() => {
    setDatos(data === undefined ? [] : data.gastosPorCategoriaYMes);
    console.log(datos);
  }, [data, loading, error]);

  const columns: GridColDef[] = [
    {
      field: "super",
      headerName: "Super",
      width: 140,
      valueGetter: (param) => rendondear(param.row.super),
    },
    {
      field: "bar",
      headerName: "Bar",
      width: 140,
      valueGetter: (param) => rendondear(param.row.bar),
    },
    {
      field: "metro",
      headerName: "Metro",
      width: 140,
      valueGetter: (param) => rendondear(param.row.metro),
    },
    {
      field: "boludeces",
      headerName: "Boludeces",
      width: 140,
      valueGetter: (param) => rendondear(param.row.boludeces),
    },
    {
      field: "bondi",
      headerName: "Bondi",
      width: 120,
      valueGetter: (param) => rendondear(param.row.bondi),
    },
    {
      field: "ropa",
      headerName: "Ropa",
      width: 120,
      valueGetter: (param) => rendondear(param.row.ropa),
    },
    {
      field: "cafe",
      headerName: "Cafe",
      width: 120,
      valueGetter: (param) => rendondear(param.row.cafe),
    },
    {
      field: "otros",
      headerName: "Otros",
      width: 120,
      valueGetter: (param) => rendondear(param.row.otros),
    },
    {
      field: "mes",
      headerName: "Mes",
      width: 150,
      valueGetter: (param) => getMonthName(param.row.mes),
    },
    {
      field: "total",
      headerName: "Total",
      width: 150,
      valueGetter: (param) => rendondear(param.row.total),
    },
  ];

  return (
    <div>
      <br />
      <Stack
        direction="row"
        spacing={{ xs: 1, sm: 2, md: 4 }}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      ></Stack>
      <Box>
        {loading ? (
          <CircularProgress />
        ) : (
          <div>
            <br />
            <br />
            <DataGrid
              rows={datos}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[5, 10]}
            />
          </div>
        )}
      </Box>
    </div>
  );
}
