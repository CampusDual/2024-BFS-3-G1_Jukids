ALTER TABLE categories ADD COLUMN codigo VARCHAR(150);

UPDATE categories SET codigo = 'cat_ChildrensToys' WHERE name = 'Juguetes infantiles';
UPDATE categories SET codigo = 'cat_Board' WHERE name = 'Juegos de mesa y puzzles';
UPDATE categories SET codigo = 'cat_Plushies' WHERE name = 'Peluches';
UPDATE categories SET codigo = 'cat_Dolls' WHERE name = 'Muñecas';
UPDATE categories SET codigo = 'cat_ActionToys' WHERE name = 'Juguetes de acción';
UPDATE categories SET codigo = 'cat_Videogames' WHERE name = 'Videojuegos y consolas';
UPDATE categories SET codigo = 'cat_Crafts' WHERE name = 'Manualidades y construcción';
UPDATE categories SET codigo = 'cat_Pedagogical' WHERE name = 'Juegos pedagógicos';
UPDATE categories SET codigo = 'cat_Sport' WHERE name = 'Deportes';
UPDATE categories SET codigo = 'cat_Electronic' WHERE name = 'Electrónicos';
UPDATE categories SET codigo = 'cat_Figures' WHERE name = 'Figuras';
UPDATE categories SET codigo = 'cat_Collectibles' WHERE name = 'De colección';
UPDATE categories SET codigo = 'cat_Antiques' WHERE name = 'Antigüedades';
UPDATE categories SET codigo = 'cat_Cards' WHERE name = 'Cartas y cromos';
UPDATE categories SET codigo = 'cat_Others' WHERE name = 'Otros';

