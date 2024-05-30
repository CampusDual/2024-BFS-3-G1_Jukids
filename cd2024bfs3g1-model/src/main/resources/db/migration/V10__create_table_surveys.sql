CREATE TABLE surveys (
    survey_id SERIAL PRIMARY KEY,
    toy_id int NOT NULL,
    seller_id int NOT NULL,
    buyer_id int NOT NULL,
    rating int NOT NULL,
    comment VARCHAR(255)
)