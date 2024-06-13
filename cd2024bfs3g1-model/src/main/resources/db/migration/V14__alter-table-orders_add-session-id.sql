ALTER TABLE orders ADD COLUMN session_id VARCHAR(150);
UPDATE orders SET session_id = '0';