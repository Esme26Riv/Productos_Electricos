import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Función que calcula el precio con descuento y usa un callback para procesar el resultado
function calcularDescuento(precio, porcentajeDescuento, callback) {
    const descuento = precio * (porcentajeDescuento / 100);
    const precioFinal = precio - descuento;
    callback(precioFinal, precio, porcentajeDescuento);
}

// Callback que interpreta el resultado del cálculo
function interpretarPrecio(precioFinal, precio, porcentajeDescuento) {
    console.log(`\nPrecio original: $${precio.toFixed(2)} | Descuento: ${porcentajeDescuento}%`);
    console.log(`El precio final con descuento es: $${precioFinal.toFixed(2)}`);

    if (porcentajeDescuento === 0) {
        console.log("Categoría: Precio regular sin rebaja");
    } else if (porcentajeDescuento <= 20) {
        console.log("Categoría: Oferta ligera");
    } else if (porcentajeDescuento <= 50) {
        console.log("Categoría: Gran oferta / Liquidación");
    } else {
        console.log("Categoría: ¡Descuento extremo o error de marcaje!");
    }

    mostrarOrigen();
    rl.close();
}

// Función que muestra información adicional o el origen del concepto
function mostrarOrigen() {
    console.log("\n--- Origen de las ofertas comerciales ---");
    console.log("El concepto de rebajas y descuentos en el comercio minorista");
    console.log("se popularizó a finales del siglo XIX con la llegada de las");
    console.log("grandes tiendas departamentales. Su objetivo principal es");
    console.log("estimular la rotación de inventario y dar acceso a productos");
    console.log("tecnológicos a diferentes segmentos de mercado.");
}

// Preguntamos el precio del producto
rl.question('Ingresa el precio del producto ($): ', (respuestaPrecio) => {
    const precio = parseFloat(respuestaPrecio);

    // Preguntamos el porcentaje de descuento
    rl.question('Ingresa el porcentaje de descuento (ej. 15): ', (respuestaDescuento) => {
        const porcentajeDescuento = parseFloat(respuestaDescuento);

        calcularDescuento(precio, porcentajeDescuento, interpretarPrecio);
    });
});