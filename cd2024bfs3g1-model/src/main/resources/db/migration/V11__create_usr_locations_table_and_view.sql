CREATE TABLE public.usr_locations (
	id serial4 NOT NULL,
	longitude float8 NOT NULL,
	latitude float8 NOT NULL,
	inserted_date timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT usr_locations_pkey PRIMARY KEY (id)
);

CREATE OR REPLACE VIEW public.v_toy_distances
AS SELECT t.toyid,
    ul.id,
    6371::double precision * acos(cos(radians(ul.latitude)) * cos(radians(t.latitude)) * cos(radians(t.longitude) - radians(ul.longitude)) + sin(radians(ul.latitude)) * sin(radians(t.latitude))) AS distance
   FROM toys t,
    usr_locations ul
  ORDER BY (6371::double precision * acos(cos(radians(ul.latitude)) * cos(radians(t.latitude)) * cos(radians(t.longitude) - radians(ul.longitude)) + sin(radians(ul.latitude)) * sin(radians(t.latitude))));