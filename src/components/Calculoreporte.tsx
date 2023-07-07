import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  Button,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import getLocalItems from "../funciones/GetLocalItems";
import { Form } from "react-bootstrap";
import sumar from "../funciones/Sumar";
import { Label } from "@mui/icons-material";

export default function CalculoReporte() {
  const [mes, setMes] = useState<string>("");
  const [listado, setListado] = useState(getLocalItems());
  const [subtotal, setSubTotal] = useState<number>(0);

  const columns: GridColDef[] = [
    { field: "gasto", headerName: "Gasto", width: 120 },
    { field: "categoria", headerName: "Categoria", width: 140 },
    { field: "fecha", headerName: "Fecha", width: 150 },
  ];

  const meses = [
    {
      id: 1,
      mes: "Enero",
    },
    {
      id: 2,
      mes: "Febrero",
    },
    {
      id: 3,
      mes: "Marzo",
    },
    {
      id: 7,
      mes: "Julio",
    },
  ];

  const obtenerMes = (fecha: string): number => {
    const dateString = fecha;
    const dateParts = dateString.split("/");
    const month = parseInt(dateParts[1]);

    console.log(month);
    return month;
  };

  // useEffect(() => {
  //   const items = getLocalItems();

  //   const filteredList = items.filter((item: any) => {
  //     const dateParts = item.fecha.split("/");
  //     const month = parseInt(dateParts[1]);
  //     return month === mes; // Filtra los elementos cuyo mes sea 7 (julio)
  //   });
  //   console.log(filteredList);
  // }, []);

  const handleChangeSelect = (event: SelectChangeEvent) => {
    console.log(event.target.value);
    setMes(event.target.value);
    const valor = parseInt(event.target.value);
    const a = getLocalItems();

    const filteredList = a.filter((item: any) => {
      const dateParts = item.fecha.split("/");
      const month = parseInt(dateParts[1]);
      return month === valor; // Filtra los elementos cuyo mes sea 7 (julio)
    });
    setListado(filteredList);
    const resultado = sumar(filteredList);
    setSubTotal(resultado);
  };

  return (
    <div>
      <br />
      <Form>
        <Select
          size="small"
          onChange={handleChangeSelect}
          value={mes}
          label="Mes"
        >
          {meses.map((i: any) => (
            <MenuItem key={i.id} value={i.id}>
              {i.mes}
            </MenuItem>
          ))}
        </Select>
        <Button
          variant="outlined"
          style={{ marginLeft: "20px" }}
          color="error"
          onClick={() => {
            setListado(getLocalItems());
          }}
        >
          Limpiar
        </Button>
        <label style={{ marginLeft: "20px" }}>Subtotal: {subtotal.toFixed(2)}</label>
      </Form>
      <br />
      <Box sx={{ height: "100%", width: "100%" }}>
        <DataGrid
          rows={listado}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10]}
        />
      </Box>
    </div>
  );
}
