import { gql } from "@apollo/client";

export const GASTOS_CATEGORIA = gql`
query GastosPorCategoria($categoria: String!) {
  gastosPorCategoria(categoria: $categoria) {
    id
    monto
    categoria
    fecha
    estado
  }
}`

export const QUERY = gql`
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

export const GASTOS_CATEGORIA_MES = gql`
  query GastosPorCategoriaYMes {
    gastosPorCategoriaYMes {
      id
      mes
      super
      bondi
      metro
      bar
      boludeces
      ropa
      otros
      cafe
      total
    }
}`

export const GASTOS_CATEGORIA_MES_REPORTE = gql`
  query GastosPorCategoriaYMes {
    gastosPorCategoriaYMes {
      mes
      super
      bondi
      metro
      bar
      boludeces
      ropa
      otros
      cafe
    }
}`

export const REMOVE_ALL = gql`
  query Query {
    removeAll
  }
`;

export const GASTOS_DIARIOS = gql`
  query GastosDiarios {
    gastosDiarios {
      suma
      fecha
      mes
    }
}`