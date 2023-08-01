import { Box, Stack } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useState, useEffect, SetStateAction } from "react";
import getLocalItems from "../funciones/GetLocalItems";
import Swal from "sweetalert2";

const getReporteMensual = () => {
  let list = localStorage.getItem("reporteMensual");
  if (list === null) {
    return [];
  }

  if (list) {
    return JSON.parse(localStorage.getItem("reporteMensual") ?? "");
  }
};

export default function ReporteMensual() {
  const [listado, setListado] = useState(getLocalItems());
  const [datos, setDatos] = useState<any[]>(getReporteMensual());

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

  function sumarGastosPorCategoria(objeto: any) {
    const sumasPorCategoria: any = [];

    for (const categoria in objeto) {
      if (
        objeto.hasOwnProperty(categoria) &&
        Array.isArray(objeto[categoria])
      ) {
        const sumaCategoria = objeto[categoria].reduce(
          (total: any, item: any) => total + item.gasto,
          0
        );
        const objetoRetorno: any = {
          valor: sumaCategoria,
          categoria: categoria,
        };
        sumasPorCategoria.push(objetoRetorno);
        //sumasPorCategoria[categoria] = sumaCategoria;
      }
    }

    return sumasPorCategoria;
  }

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

      const sumaGastos = sumarGastos(final);
      const sumasGastosPorCategoria = sumarGastosPorCategoria(final);

      const mes = key;
      const objetoDestino: any = {
        id: Math.floor(Math.random() * 1000),
        Super: 0,
        Bondi: 0,
        Otros: 0,
        Tren: 0,
        Bar: 0,
        Boludeces: 0,
        mes: mes,
        total: sumaGastos.toFixed(1),
      };
      for (const key in sumasGastosPorCategoria) {
        const valor = sumasGastosPorCategoria[key];
        objetoDestino[valor.categoria] += valor.valor;
      }
      listadoFinal.push(objetoDestino);
      setDatos(listadoFinal);
      localStorage.setItem("reporteMensual", JSON.stringify(listadoFinal));
      //return objetoDestino;
    }
  };

  // useEffect(() => {
  //   localStorage.setItem("reporteMensual", JSON.stringify(datos));
  // }, []);

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
      >
        <button
          onClick={() => {
            //reporte()
            console.log(datos);
            // let nueva: any[] = []
            // const objeto = reporte();
            // nueva.push(objeto)
            // setDatos(nueva);
            reporte()
            //localStorage.setItem("reporteMensual", JSON.stringify(datos));
            Swal.fire({
              icon: "success",
              title: "Guardado",
              text: "Lista guardada",
            });
          }}
          className="btn btn-primary"
        >
          Guardar
        </button>
      </Stack>
      <Box>
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
      </Box>
    </div>
  );
}
