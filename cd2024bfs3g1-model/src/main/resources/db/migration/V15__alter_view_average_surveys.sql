DROP VIEW v_average_surveys;

CREATE VIEW v_average_surveys AS
   SELECT
   		u.usr_id, u.usr_name, u.usr_photo, AVG(s.rating) rating, COUNT(*) total_surveys
   FROM surveys  s
   JOIN usr_user u ON
   		s.seller_id  = u.usr_id
   GROUP BY
   		u.usr_id,s.seller_id;