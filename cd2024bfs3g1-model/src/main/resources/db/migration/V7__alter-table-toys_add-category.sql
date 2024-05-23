ALTER TABLE toys ADD COLUMN category VARCHAR(150);

CREATE TABLE categories (
    categoryId SERIAL PRIMARY KEY,
    name VARCHAR (150) NOT NULL
);

INSERT INTO categories (categoryId, name) VALUES (1, 'Juguetes infantiles');
INSERT INTO categories (categoryId, name) VALUES (2, 'Juegos de mesa y puzzles');
INSERT INTO categories (categoryId, name) VALUES (3, 'Peluches');
INSERT INTO categories (categoryId, name) VALUES (4, 'Muñecas');
INSERT INTO categories (categoryId, name) VALUES (5, 'Juguetes de acción');
INSERT INTO categories (categoryId, name) VALUES (6, 'Videojuegos y consolas');
INSERT INTO categories (categoryId, name) VALUES (7, 'Manualidades y construcción');
INSERT INTO categories (categoryId, name) VALUES (8, 'Juegos pedagógicos');
INSERT INTO categories (categoryId, name) VALUES (9, 'Deportes');
INSERT INTO categories (categoryId, name) VALUES (10, 'Electrónicos');
INSERT INTO categories (categoryId, name) VALUES (11, 'Figuras');
INSERT INTO categories (categoryId, name) VALUES (12, 'De colección');
INSERT INTO categories (categoryId, name) VALUES (13, 'Antigüedades');
INSERT INTO categories (categoryId, name) VALUES (14, 'Cartas y cromos');
INSERT INTO categories (categoryId, name) VALUES (15, 'Otros');
