-- Remake the new database with no data

-- Delete any existing tables. To create for the first time, don't include this bit
DROP TABLE products_in_orders;
DROP TABLE shipping_and_handling_brackets;
DROP TABLE orders;
DROP TABLE products;
DROP TABLE cart_items;

-- Create the tables

CREATE TABLE products (
    number INT PRIMARY KEY,
    count INT NOT NULL
);

CREATE TABLE cart_items (
    user VARCHAR(100) NOT NULL,
    product_number INT NOT NULL,
    quantity INT NOT NULL,
    PRIMARY KEY (user, product_number)
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mailing_address VARCHAR(200) NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_email_address VARCHAR(100) NOT NULL,
    total_price_charged FLOAT(9,2) NOT NULL,
    card_authorization_code VARCHAR(20) NOT NULL,
    status ENUM('authorized','shipped') NOT NULL DEFAULT 'authorized',
    date_placed TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_shipped TIMESTAMP
);

CREATE TABLE shipping_and_handling_brackets (
    bracket_id INT AUTO_INCREMENT PRIMARY KEY,
    start_weight FLOAT(10,2) NOT NULL,
    end_weight FLOAT(10,2) NOT NULL,
    charge FLOAT(8,2) NOT NULL
);

CREATE TABLE products_in_orders (
    product_number INT NOT NULL,
    order_id INT NOT NULL,
    quantity INT NOT NULL,
    PRIMARY KEY (product_number, order_id),
    FOREIGN KEY (product_number) REFERENCES products(number),
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Add an initial shipping and handling bracket

INSERT INTO shipping_and_handling_brackets (start_weight, end_weight, charge) VALUES (0, 10000000000, 0);