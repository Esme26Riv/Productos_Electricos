import express from 'express';
import fs from "fs"; // Permite trabajar con file system
import path from "path";
import { fileURLToPath } from "url";

const app = express();
// ¡Muy importante! Middleware para que Express entienda los JSON en el req.body
app.use(express.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Sirve imágenes y estilos desde la carpeta /public
app.use("/public", express.static(path.join(__dirname, "public")));

// Página del catálogo: /tienda o la raíz /
app.get("/tienda", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

const readData = () => {
    try {
        const data = fs.readFileSync("./db.json");
        return JSON.parse(data);
    } catch (err) {
        console.log(err); 
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync("./db.json", JSON.stringify(data, null, 2));
    } catch (error) {
        console.log(error);
    }
};

// MODIFICADO: Ahora la ruta principal muestra tu index.html directamente
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Obtener todos los productos
app.get("/productos", (req, res) => {
    const data = readData();
    res.json(data.productos);
});

// Obtener un producto por ID
app.get("/productos/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const producto = data.productos.find((p) => p.id === id);
    if (!producto) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(producto);
});

// Crear un nuevo producto
app.post("/productos", (req, res) => {
    const data = readData();
    const body = req.body;
    const newProducto = {
        id: data.productos.length + 1,
        ...body,
    };
    data.productos.push(newProducto);
    writeData(data);
    res.json(newProducto);
});

// Actualizar un producto por ID
app.put("/productos/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const body = req.body;

    // Buscamos el índice del producto en el arreglo
    const index = data.productos.findIndex((p) => p.id === id);

    if (index === -1) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Actualizamos manteniendo los datos anteriores y sobreescribiendo los nuevos
    data.productos[index] = {
        ...data.productos[index],
        ...body,
    };

    writeData(data);
    res.json({ message: "Producto modificado con éxito" });
});

app.delete("/productos/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const index = data.productos.findIndex((p) => p.id === id);

    // Validamos si el producto no existe
    if (index === -1) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Si sí existe, lo borramos
    data.productos.splice(index, 1);

    writeData(data);
    res.json({ message: "Producto borrado con éxito" });
});

// MODIFICADO: Puerto dinámico compatible con Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de productos escuchando por el puerto ${PORT}`);
});