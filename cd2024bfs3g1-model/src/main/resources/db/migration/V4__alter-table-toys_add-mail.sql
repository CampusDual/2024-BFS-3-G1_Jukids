ALTER TABLE toys DROP COLUMN dateadded;
ALTER TABLE toys ADD COLUMN email VARCHAR(255) NOT NULL DEFAULT '';