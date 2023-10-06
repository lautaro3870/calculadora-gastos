const sumar = (items: any): number => {
    let suma = 0;
    items.map((i: any) => {
      suma = suma + i.monto;
    });
    console.log(suma);
    return suma
}

export default sumar;