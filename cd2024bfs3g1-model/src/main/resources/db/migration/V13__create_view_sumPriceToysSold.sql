create view v_sum_price_toys_sold as
   SELECT usr_id, SUM(price) price
   FROM toys
   WHERE transaction_status = 4 or transaction_status = 5
   GROUP BY usr_id;