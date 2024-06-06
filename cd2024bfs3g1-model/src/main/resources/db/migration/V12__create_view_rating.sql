create view v_average_surveys as
   SELECT
   		u.usr_id ,u.usr_name,u.usr_photo ,AVG(s.rating) rating
   from surveys  s
   join usr_user u on
   		s.seller_id  = u.usr_id
   group by
   		u.usr_id,s.seller_id ;

ALTER TABLE surveys ADD CONSTRAINT surveys_toyid_fk FOREIGN KEY (toy_id) REFERENCES toys(toyid);
ALTER TABLE surveys
    ADD CONSTRAINT buyer_id_fk FOREIGN KEY (buyer_id) REFERENCES usr_user(usr_id),
    ADD CONSTRAINT seller_id_fk FOREIGN KEY (seller_id) REFERENCES usr_user(usr_id);