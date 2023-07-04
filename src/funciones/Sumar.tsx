import getLocalItems from "./GetLocalItems";

const sumar = (): number => {
    let suma = 0;
    const listado = getLocalItems();
    console.log(listado);
    listado.map((i: any) => {
      suma = suma + i.gasto;
    });
    console.log(suma);
    return suma
}

export default sumar;