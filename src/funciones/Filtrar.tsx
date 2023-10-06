import Swal from "sweetalert2";

const filtrar = async (categorias: any) => {
  const { value: categoria } = await Swal.fire({
    title: "Filtar",
    input: "select",
    inputOptions: {
      Super: "Super",
      Otros: "Otros",
      Metro: "Metro",
      Bondi: "Bondi",
      Bar: "Bar",
      Boludeces: "Boludeces",
      Café: "Café",
      Ropa: "Ropa"
    },
    inputPlaceholder: "Categorias",
    showDenyButton: true,
    denyButtonText: `Limpiar`,
  });

  if (categoria) {
    let suma = 0;
    const nuevoArreglo = categorias.filter((i: any) => i.categoria === categoria);
    nuevoArreglo.map((i: any) => {
      suma = suma + i.monto;
    });
    Swal.fire("Subtotal: " + suma.toString());
  }
};

export default filtrar;
