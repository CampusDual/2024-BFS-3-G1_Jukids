ALTER TABLE toys ADD COLUMN status VARCHAR(150);

CREATE TABLE status (
    statusId SERIAL PRIMARY KEY,
    name VARCHAR (150) NOT NULL,
    code VARCHAR (150)
);

INSERT INTO status (statusId, name, code) VALUES (1, 'Nuevo', 'sta_new');
INSERT INTO status (statusId, name, code) VALUES (2, 'Como nuevo', 'sta_semiNew');
INSERT INTO status (statusId, name, code) VALUES (3, 'Buen estado', 'sta_wellWorn' );
INSERT INTO status (statusId, name, code) VALUES (4, 'Usado', 'sta_worn');
INSERT INTO status (statusId, name, code) VALUES (5, 'Incompleto', 'sta_incomplete');