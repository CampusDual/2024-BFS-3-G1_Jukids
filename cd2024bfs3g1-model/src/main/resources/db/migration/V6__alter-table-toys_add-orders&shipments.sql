CREATE TABLE orders (
	order_id SERIAL NOT NULL,
	toyid int NOT NULL,
    buyer_id int,
    buyer_email varchar,
	order_date timestamp NULL DEFAULT now(),
	total_price numeric(10,2) NOT NULL,
	CONSTRAINT order_id_pk PRIMARY KEY (order_id),
);

ALTER TABLE orders ADD CONSTRAINT buyer_id_fk FOREIGN KEY (buyer_id) REFERENCES usr_user(usr_id);
ALTER TABLE orders ADD CONSTRAINT toyid_fk FOREIGN KEY (toyid) REFERENCES toys(toyid);


CREATE TABLE shipments (
	shipment_id SERIAL NOT NULL,
	order_id int  NOT NULL,
	shipment_date timestamp NULL DEFAULT now(),
	shipment_company varchar(255) NOT NULL,
	price numeric(10, 2) NOT NULL,
	tracking_number varchar(255) NOT NULL,
	sender_address varchar(255),
	buyer_phone varchar(50) NOT NULL,
	shipping_address varchar(255) NOT NULL,
	CONSTRAINT shipment_id_pk PRIMARY KEY (shipment_id),
);

ALTER TABLE shipments ADD CONSTRAINT order_id_fk FOREIGN KEY (order_id) REFERENCES orders(order_id);

ALTER TABLE toys ADD COLUMN shipping bit NOT NULL;
ALTER TABLE toys ADD COLUMN transaction_status byte NOT NULL DEFAULT(0);;