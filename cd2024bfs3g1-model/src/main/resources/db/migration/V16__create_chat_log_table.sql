CREATE TABLE public.chat_log (
	id serial4 NOT NULL,
	customer_id int4 NOT NULL,
	owner_id int4 NOT NULL,
	toy_id int4 NOT NULL,
	msg varchar(255) NOT NULL,
	inserted_date timestamp NOT NULL,
	CONSTRAINT chat_log_toy_id_fkey FOREIGN KEY (toy_id) REFERENCES public.toys(toyid)
);