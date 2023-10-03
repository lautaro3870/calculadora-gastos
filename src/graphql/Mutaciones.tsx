import { gql } from "@apollo/client";

export const ADD_GASTO = gql`
  mutation CreateGasto($createGastoInput: CreateGastoInput!) {
    createGasto(createGastoInput: $createGastoInput) {
      id
      monto
      categoria
      fecha
    }
  }
`;

export const DELETE_GASTO = gql`
  mutation RemoveGasto($removeGastoId: ID!) {
    removeGasto(id: $removeGastoId) {
      id
      monto
      categoria
      fecha
      estado
    }
  }
`;
