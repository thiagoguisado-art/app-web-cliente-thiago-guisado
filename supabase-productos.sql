create table public.productos (
  id integer primary key,
  nombre text not null,
  precio integer not null,
  categoria text not null,
  stock boolean not null default true,
  stock_cantidad integer,
  imagen text
);

insert into public.productos (id, nombre, precio, categoria, stock, stock_cantidad, imagen) values
  (1, 'Samsung Galaxy S24', 899999, 'Celulares', true, 8, 'https://commons.wikimedia.org/wiki/Special:FilePath/Samsung_Galaxy_S24.jpg'),
  (2, 'Lenovo IdeaPad 5', 750000, 'Informática', true, 5, 'https://cdn.mos.cms.futurecdn.net/gKv6krJwHJ6ozNKhzF3wiW-1200-80.jpg'),
  (3, 'Sony WH-1000XM5', 420500, 'Audio', true, 12, 'https://cdn.mos.cms.futurecdn.net/uFyxeHLkjzqKWUqv6iynH9.jpeg'),
  (4, 'Xiaomi Watch S3', 185000, 'Smartwatch', true, 20, 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-watch-s3.jpg'),
  (5, 'Audífonos Gamer RGB', 89999, 'Audio', true, null, 'https://placehold.co/300x200/ffffff/d32f2f?text=Audifonos+Gamer'),
  (6, 'Teclado Mecánico Redragon', 64500, 'Gaming', true, null, 'https://placehold.co/300x200/ffffff/d32f2f?text=Teclado+Mecanico'),
  (7, 'Mouse Inalámbrico Logitech', 32900, 'Accesorios', true, null, 'https://placehold.co/300x200/ffffff/d32f2f?text=Mouse+Inalambrico'),
  (8, 'Monitor Samsung 27" 144Hz', 389000, 'Informática', true, null, 'https://placehold.co/300x200/ffffff/d32f2f?text=Monitor+27+144Hz'),
  (9, 'Webcam Full HD', 45000, 'Accesorios', true, null, 'https://placehold.co/300x200/ffffff/d32f2f?text=Webcam+Full+HD');

alter table public.productos enable row level security;

create policy "Lectura publica de productos"
  on public.productos
  for select
  to anon, authenticated
  using (true);
