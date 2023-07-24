import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useState, useEffect, SetStateAction } from "react";
import getLocalItems from "../funciones/GetLocalItems";

export default function ReporteMensual() {
  const [listado, setListado] = useState(getLocalItems());
  const [datos, setDatos] = useState<{ mes: any; total: number }[]>([]);

  const columns: GridColDef[] = [
    { field: "Super", headerName: "Super", width: 140 },
    { field: "Bar", headerName: "Bar", width: 140 },
    { field: "Tren", headerName: "Tren", width: 140 },
    { field: "Boludeces", headerName: "Boludeces", width: 140 },
    { field: "Bondi", headerName: "Bondi", width: 120 },
    { field: "Otros", headerName: "Otros", width: 120 },
    { field: "mes", headerName: "Mes", width: 150 },
    { field: "total", headerName: "Total", width: 150 },
  ];

  function obtenerNombreMes(indiceMes: any) {
    const meses = [
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
    return meses[indiceMes];
  }

  function sumarGastos(objeto: any) {
    let suma = 0;
    for (const prop in objeto) {
      if (objeto.hasOwnProperty(prop) && Array.isArray(objeto[prop])) {
        objeto[prop].forEach((item: any) => {
          if (item.hasOwnProperty("gasto")) {
            suma += item.gasto;
          }
        });
      }
    }
    return suma;
  }

  // Llamada a la función para obtener la suma de la propiedad 'prop'

  const reporte = () => {
    let listadoFinal = [];
    const nuevo = listado.reduce((acc: any, obj: any) => {
      const fechaString = obj.fecha;
      const fecha = new Date(fechaString.split("/").reverse().join("/"));
      const mes = fecha.getMonth();
      const nombreMes = obtenerNombreMes(mes);

      var key = nombreMes;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {});

    console.log(nuevo);
    for (const key in nuevo) {
      const objetos = nuevo[key];
      const final = objetos.reduce((acc: any, obj: any) => {
        var key = obj.categoria;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
      }, {});

      console.log(final);
      const sumaGastos = sumarGastos(final);
      console.log(sumaGastos);

      const mes = key
      const objetoFinal = {
        id: Math.floor(Math.random() * 1000),
        mes: mes,
        total: sumaGastos,
      };

      listadoFinal.push(objetoFinal);
      setDatos(listadoFinal);
    }
  };

  useEffect(() => {
    reporte();
  }, []);

  return (
    <div style={{ display: "flex", placeItems: "center" }}>
      <Box>
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
      </Box>
    </div>
  );
}
