// 1) Catálogo de productos
const catalogo = [
  { id: 1, nombre: 'Samsung Galaxy S24', precio: 899999, stock: 8 },
  { id: 2, nombre: 'Lenovo IdeaPad 5', precio: 750000, stock: 5 },
  { id: 3, nombre: 'Sony WH-1000XM5', precio: 420500, stock: 12 },
  { id: 4, nombre: 'Xiaomi Watch S3', precio: 185000, stock: 20 },
  { id: 5, nombre: 'Cable USB-C', precio: 80, stock: 25 },
  { id: 6, nombre: 'Teclado Mecánico Redragon K552', precio: 120000, stock: 0 },
];

// 2) Formato de precio estilo es-AR
const precio = (n) => {
  const valor = Number(n);
  if (!Number.isFinite(valor)) return 'Precio inválido';
  return `$ ${valor.toLocaleString('es-AR')}`;
};

console.log(precio(catalogo[0].precio));
console.table(catalogo.map((producto) => ({ ...producto, precio: precio(producto.precio) })));

// 3) Separar productos disponibles y agotados
const disponibles = [];
const agotados = [];

for (const producto of catalogo) {
  if (producto.stock > 0) {
    disponibles.push(producto);
  } else {
    agotados.push(producto);
  }
}

console.log('Disponibles:', disponibles);
console.log('Agotados:', agotados);

// 4) Nombres de productos con precio > 100 en mayúsculas
const nombresCaros = catalogo.filter((p) => p.precio > 100).map((p) => p.nombre.toUpperCase());

console.log(nombresCaros);

// 5) Total facturable y total con IVA (21%)
const totalFacturable = catalogo.reduce((acumulado, producto) => acumulado + producto.precio * producto.stock, 0);

console.log(`Total facturable: ${precio(totalFacturable)}`);
console.log(`Total con IVA (21%): ${precio(totalFacturable * 1.21)}`);
