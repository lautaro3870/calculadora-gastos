import { MutableRefObject, useRef, useState, useEffect } from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import {
  Button,
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { ChangeEvent } from "react";
import Swal from "sweetalert2";
import { Box } from "@mui/system";

const columns: GridColDef[] = [
  { field: "gasto", headerName: "Gasto", width: 120 },
  { field: "categoria", headerName: "Categoria", width: 140 },
  { field: "fecha", headerName: "Fecha", width: 150 },
];

const obtenerFecha = (): string => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;
  console.log(formattedDate);
  return formattedDate;
};

const getLocalItems = () => {
  let list = localStorage.getItem("gastos");
  if (list === null) {
    return [];
  }
  console.log(list);
  if (list) {
    return JSON.parse(localStorage.getItem("gastos") ?? "");
  }
};

export default function Calculadora() {
  const categorias: string[] = ["Super", "Otros", "Tren", "Bondi"];
  let suma: number = 0;

  const totalAGastar = 300;

  const [total, setTotal] = useState<number>(0);

  const [gasto, setGasto] = useState<string>("");
  const [categoria, setCategoria] = useState<string>("");

  const [listado, setListado] = useState(getLocalItems());

  const handleChange = (event: SelectChangeEvent) => {
    console.log(event.target.value);
    setCategoria(event.target.value);
  };

  const handleChangeGasto = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    setGasto(event.target.value);
  };

  const sumar = () => {
    console.log(listado);
    listado.map((i: any) => {
      suma = suma + i.gasto;
    });
    console.log(suma);
    setTotal(suma);
  };

  useEffect(() => {
    localStorage.setItem("gastos", JSON.stringify(listado));
    sumar();
  }, [listado]);

  const calcular = () => {
    //console.log(gasto + " " + categoria);
    if (gasto === "" || categoria === "") {
      Swal.fire({
        icon: "error",
        title: "Ingrese los valores",
      });
      return;
    }
    const objeto = {
      id: Math.floor(Math.random() * 1000),
      gasto: parseFloat(gasto),
      categoria: categoria,
      fecha: obtenerFecha(),
    };

    console.log(objeto);
    setListado((oldList: any[]) => [...oldList, objeto]);
    setGasto("");
  };

  return (
    <div>
      <br />
      <TextField
        type="number"
        size="small"
        id="gasto"
        label="Gasto"
        value={gasto}
        variant="outlined"
        onChange={handleChangeGasto}
      />
      <Select
        labelId="demo-simple-select-label"
        id="selectCategoria"
        label="Categorias"
        size="small"
        value={categoria}
        onChange={handleChange}
      >
        {categorias.map((i) => {
          return (
            <MenuItem selected key={i} value={i}>
              {i}
            </MenuItem>
          );
        })}
      </Select>
      <Button
        onClick={calcular}
        variant="contained"
        style={{ marginLeft: "5px" }}
      >
        Ingresar
      </Button>
      <Button
        variant="outlined"
        color="error"
        style={{ marginLeft: "10px" }}
        onClick={() => {
          Swal.fire({
            title: "¿Limpiar lista?",
            showDenyButton: true,
            showConfirmButton: false,
            showCancelButton: true,
            denyButtonText: `Limpiar`,
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isDenied) {
              localStorage.setItem("gastos", JSON.stringify([]));
              setListado([]);
              setTotal(0);
              Swal.fire("Lista limpiada", "", "info");
            }
          });
        }}
      >
        Limpiar
      </Button>
      <label style={{ marginLeft: "10px" }}>
        Total:{" "}
        {total > totalAGastar ? (
          <p style={{ color: "red" }}>{total.toFixed(1)}</p>
        ) : (
          total.toFixed(1)
        )}
      </label>
      <br />
      <label>Total para gastar: {totalAGastar}</label>
      <br />
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
