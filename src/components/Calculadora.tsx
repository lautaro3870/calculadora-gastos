import { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import {
  Button,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  styled,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { ChangeEvent } from "react";
import Swal from "sweetalert2";
import { Box } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import getLocalItems from "../funciones/GetLocalItems";
import sumar from "../funciones/Sumar";
import filtrar from "../funciones/Filtrar";
import categorias from "../utils/Categorias";
import { useQuery, useMutation } from "@apollo/client";
import { ADD_GASTO, DELETE_GASTO } from "../graphql/Mutaciones";
import { QUERY } from "../graphql/Query";

const formatearFecha = (fecha: string): string => {
  const valorFecha = new Date(fecha);
  const day = String(valorFecha.getDate()).padStart(2, "0");
  const month = String(valorFecha.getMonth() + 1).padStart(2, "0");
  const year = valorFecha.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
};

const Item = styled(Paper)(({ theme }: any) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const totalGasto = (localStorage.getItem("totalAGastar"));

export default function Calculadora() {
  const { data, loading, error, refetch } = useQuery(QUERY);

  const [mutate] = useMutation(ADD_GASTO);
  const [deleteGasto] = useMutation(DELETE_GASTO);

  const [totalAGastar, setTotalAGastar] = useState(parseInt(totalGasto ?? ""));
  const [editing, setIsEditing] = useState(false);

  const [total, setTotal] = useState<number>(0);

  const [gasto, setGasto] = useState<string>("");
  const [categoria, setCategoria] = useState<string>("");

  const [listado, setListado] = useState(
    data == undefined ? getLocalItems() : data.gastos
  );

  const columns: GridColDef[] = [
    { field: "monto", headerName: "Gasto", width: 120 },
    { field: "categoria", headerName: "Categoria", width: 140 },
    {
      field: "fecha",
      headerName: "Fecha",
      width: 150,
      valueGetter: (param) => formatearFecha(param.row.fecha),
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => {
        const onClick = async () => {
          const id = params.api.getCellValue(params.id, "id");

          const response = await deleteGasto({
            variables: {
              removeGastoId: id,
            },
          });

          const nuevoArrelgo = listado.filter(
            (i: any) => i.id !== response.data.removeGasto.id
          );
          console.log(nuevoArrelgo);
          setListado(nuevoArrelgo);
        };
        return (
          <Button onClick={onClick} variant="outlined" color="error">
            <DeleteIcon />
          </Button>
        );
      },
    },
  ];

  const handleChange = (event: SelectChangeEvent) => {
    console.log(event.target.value);
    setCategoria(event.target.value);
  };

  const handleChangeGasto = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    setGasto(event.target.value);
  };

  useEffect(() => {
    const suma = sumar(listado);
    setTotal(suma);
  }, [listado]);

  useEffect(() => {
    setListado(data == undefined ? [] : data.gastos);
    localStorage.setItem(
      "gastos",
      JSON.stringify(data == undefined ? [] : data.gastos)
    );
  }, [loading, error, data]);

  const calcular = async () => {
    if (gasto === "" || categoria === "") {
      Swal.fire({
        icon: "error",
        title: "Ingrese los valores",
      });
      return;
    }

    const r = await mutate({
      variables: {
        createGastoInput: {
          monto: parseFloat(gasto),
          categoria: categoria,
        },
      },
    });

    setListado((oldList: any[]) => [...oldList, r.data.createGasto]);
    setGasto("");
  };

  const [sortModel] = useState<GridSortModel>([
    {
      field: "fecha",
      sort: "desc",
    },
  ]);

  const handleChangeTotal = (event: ChangeEvent<HTMLInputElement>) => {
    const valor = event.target.value.toString()
    setTotalAGastar(parseInt(valor ?? ""));
    localStorage.setItem("totalAGastar", valor);
  };

  const changeEditing = () => {
    setIsEditing(true);
  };

  const handleChangeToFalse = () => {
    setIsEditing(false);
  };

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
        <Item>
          <TextField
            type="number"
            style={{ width: "120px" }}
            size="small"
            id="gasto"
            label="Gasto"
            value={gasto}
            variant="outlined"
            onChange={handleChangeGasto}
          />
        </Item>
        <Item>
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
        </Item>
        <Item>
          <Button
            onClick={calcular}
            variant="contained"
            size="medium"
            style={{ marginLeft: "5px" }}
          >
            Ingresar
          </Button>
        </Item>
      </Stack>
      <br />
      <Button
        variant="outlined"
        color="error"
        size="small"
        style={{ marginLeft: "10px" }}
        onClick={() => {
          Swal.fire({
            title: "¿Limpiar lista?",
            showDenyButton: true,
            showConfirmButton: false,
            showCancelButton: true,
            denyButtonText: `Limpiar`,
          }).then(async (result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isDenied) {
              await fetch(
                "https://melbourne-sea-lion-rrtx.2.sg-1.fl0.io/gastos"
              );
              refetch();
              Swal.fire("Lista limpiada", "", "info");
            }
          });
        }}
      >
        Limpiar
      </Button>
      <Button
        variant="outlined"
        size="small"
        style={{ marginLeft: "5px" }}
        onClick={() => filtrar(listado)}
      >
        Filtrar
      </Button>
      <label style={{ marginLeft: "10px" }}>
        {total > totalAGastar ? (
          <p style={{ color: "red" }}>{total.toFixed(1)}</p>
        ) : (
          total.toFixed(1)
        )}
      </label>
      <br />
      {editing ? (
        <TextField
          value={totalAGastar}
          onChange={handleChangeTotal}
          onBlur={handleChangeToFalse}
        />
      ) : (
        <label onClick={changeEditing}>Total para gastar: {totalAGastar}</label>
      )}

      <br />
      <br />
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <DataGrid
            rows={listado}
            columns={columns}
            sortModel={sortModel}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 30 },
              },
            }}
            pageSizeOptions={[5, 10, 20, 30]}
          />
        )}
      </Box>
    </div>
  );
}
