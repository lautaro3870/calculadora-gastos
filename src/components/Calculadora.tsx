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

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "gasto", headerName: "Gasto", width: 160 },
  { field: "categoria", headerName: "Categoria", width: 160 },
  { field: "fecha", headerName: "Fecha", width: 200 },
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
        type="text"
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
        label="Age"
        size="small"
        value={categoria}
        onChange={handleChange}
      >
        {categorias.map((i) => {
          return (
            <MenuItem key={i} value={i}>
              {i}
            </MenuItem>
          );
        })}
      </Select>
      <Button onClick={calcular} variant="contained" style={{marginLeft:"20px"}}>
        Ingresar
      </Button>
      <Button variant="outlined" color="error"style={{marginLeft:"20px"}} onClick={() => {
        localStorage.setItem("gastos", JSON.stringify([]));
        setListado([])
        setTotal(0);
      }}>
        Limpiar
      </Button>
      <label style={{ marginLeft: "20px" }}>Total: {total.toFixed(2)}</label>
      <br />
      <br />
      <DataGrid
        rows={listado}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
  );
}
