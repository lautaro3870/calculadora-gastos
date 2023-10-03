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
import { ChangeEvent } from "react";
import Swal from "sweetalert2";
import { Box } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import getLocalItems from "../funciones/GetLocalItems";
import sumar from "../funciones/Sumar";
import filtrar from "../funciones/Filtrar";
import categorias from "../Categorias";
import { useQuery, gql, useMutation } from "@apollo/client";
import { ADD_GASTO, DELETE_GASTO } from "../graphql/Mutaciones";

const query = gql`
  query Gastos {
    gastos {
      id
      monto
      categoria
      estado
      fecha
    }
  }
`;

const obtenerFecha = (): string => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;
  console.log(formattedDate);
  return formattedDate;
};

const Item = styled(Paper)(({ theme }: any) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function Calculadora() {
  //let suma: number = 0;

  const { data, loading, error } = useQuery(query);
  const [mutate] = useMutation(ADD_GASTO);
  const [deleteGasto] = useMutation(DELETE_GASTO);

  const totalAGastar = 400;
  const [total, setTotal] = useState<number>(0);

  const [gasto, setGasto] = useState<string>("");
  const [categoria, setCategoria] = useState<string>("");

  const [listado, setListado] = useState(
    data == undefined ? getLocalItems() : data.gastos
  );

  const columns: GridColDef[] = [
    { field: "monto", headerName: "Gasto", width: 120 },
    { field: "categoria", headerName: "Categoria", width: 140 },
    { field: "fecha", headerName: "Fecha", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => {
        const onClick = async () => {
          const id = params.api.getCellValue(params.id, "id");
          //const listado = JSON.parse(localStorage.getItem("gastos") ?? "");

          const response = await deleteGasto({
            variables: {
              removeGastoId: id,
            },
          });

          // setListado((oldList: any[]) => [...oldList, response.data]);

          const nuevoArrelgo = listado.filter((i: any) => i.id !== response.data.removeGasto.id);
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
    // localStorage.setItem("gastos", JSON.stringify(listado));
    const suma = sumar(listado);
    setTotal(suma);
  }, [listado]);

  useEffect(() => {
    setListado(data == undefined ? [] : data.gastos);
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
      <Button
        variant="outlined"
        size="small"
        style={{ marginLeft: "5px" }}
        onClick={filtrar}
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
      <label>Total para gastar: {totalAGastar}</label>
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
          ""
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
