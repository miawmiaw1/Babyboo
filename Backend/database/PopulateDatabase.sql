-- Populate Country table
INSERT INTO Country (country) VALUES
('United States'),
('Canada'),
('United Kingdom'),
('Germany'),
('France'),
('Denmark');

-- Populate MemberType table
INSERT INTO MemberType (type) VALUES
('User'),
('Admin'),
('Worker');

-- Populate Status table
INSERT INTO Status (statusname) VALUES
('Placed'),
('Processed'),
('Shipped'),
('Delivered');

-- Populate Category table
INSERT INTO Category (categoryname, categoryimage, categorydescription) VALUES
('Electronics', '/images/Electronics.jpg', 'Devices and gadgets including phones and computers'),
('Clothing', '/images/Clothing.jpg', 'Apparel and accessories'),
('Kitchen', '/images/HomeKitchen.jpg', 'Products for home improvement and cooking'),
('Drinks', '/images/Drinks.jpg', 'Drinks of all kinds');

-- Populate Color table
INSERT INTO Color (colorname) VALUES
('Red'),
('Blue'),
('Green'),
('Black'),
('White'),
('Orange'),
('Yellow'),
('Purple'),
('Pink'),
('Brown'),
('Gray'),
('Cyan'),
('Magenta'),
('Violet'),
('Indigo'),
('Teal'),
('Lavender'),
('Beige'),
('Coral'),
('Turquoise'),
('Default');

-- Populate Sizes table
INSERT INTO Sizes (sizename) VALUES
('Small'),
('Medium'),
('Large'),
('Default');

-- Populate Payment table
INSERT INTO Payment (paymentname) VALUES
('Credit'),
('PayPal'),
('Debit');

-- Populate Address table
INSERT INTO Address (address, postalcode, city, countryid) VALUES
('Guldsmedevej 41', 2610, 'Rødovre', 6),
('Guldsmedevej 41', 2610, 'Rødovre', 5),
('Guldsmedevej 41', 2610, 'Rødovre', 5);

-- Populate Users table
-- Admin login. Password unhashed "ahmedahmed"
INSERT INTO Users (username, firstname, lastname, password, email, phonenumber, addressid, membertypeid) VALUES
('Admin23', 'John', 'Doe', '$2b$10$QchNQgSuLuqjpmBkOmhEOOHyVuZhjnoxtI5ZmeQIBgBsMGYQfzYiW', 'miaw@gmail.com', 1234567890, 1, 2),
('User23', 'Jens', 'Jensen', '$2b$10$QchNQgSuLuqjpmBkOmhEOOHyVuZhjnoxtI5ZmeQIBgBsMGYQfzYiW', 'eupkontakt@gmail.com', 1234567890, 2, 1),
('Worker23', 'Micheal', 'Moe', '$2b$10$QchNQgSuLuqjpmBkOmhEOOHyVuZhjnoxtI5ZmeQIBgBsMGYQfzYiW', 'Worker@gmail.com', 1234567890, 3, 3);


-- Populate Product table
INSERT INTO Product (name, description, manufacturer, features, link, købspris_ex_moms, salgpris_ex_moms, indgående_moms, udgående_moms, tags, barcode) VALUES
('Smartphone', 'A samsung smartphone for daily use. Easy to operate and have alot of gb and ram.', 'Samsung', '100% energy effecient, Robust phone, UI is user friendly, Fast cpu', 'https://www.google.com/', 80, 96, 20, 24, 'electronics, smartphone', 1234567890123),
('Router', 'Asus router for your internet use. The newest router in the asus brand that is fit for both commerciel and industrial use.', 'Asus', 'Many internet ports, Supports 1000mb speed, Very long wifi range', 'https://www.google.com/', 200, 240, 50, 60, 'Internet, Router', 1234567890124),
('Network Cable', 'Network cable for electrical devices and routers. This network cable is the latest within the digital world', 'Cisco', 'Supports high data usage, Very strong material, Supports fiber net speeds', 'https://www.google.com/', 320, 384, 80, 96, 'Network, cable', 1234567890125),
('Coffee', 'A coffee drink that is light and beany. It is enjoyed very good with some milk and cream. Fit for every caffeine hungry person', 'Cofeees', 'Good coffee beans, 100% natural farmed, Very high in antioxidents', 'https://www.google.com/', 8, 9.6, 2, 2.4, 'Coffee, plant', 532343243444);


-- Populate ProductColor table
INSERT INTO ProductColorSize (productid, colorid, sizeid, quantity) VALUES
(1, 1, 1, 1), -- Smartphone, Red, Small, Quantity: 1
(1, 1, 2, 1), -- Smartphone, Red, Medium, Quantity: 1
(1, 1, 3, 1), -- Smartphone, Red, Large, Quantity: 1
(1, 2, 1, 1), -- Smartphone, Blue, Small, Quantity: 1
(1, 2, 2, 1), -- Smartphone, Blue, Medium, Quantity: 1
(1, 2, 3, 1), -- Smartphone, Blue, Large, Quantity: 1
(1, 3, 1, 1), -- Smartphone, Green, Small, Quantity: 1
(1, 3, 2, 1), -- Smartphone, Green, Medium, Quantity: 1
(1, 3, 3, 1), -- Smartphone, Green, Large, Quantity: 1
(1, 4, 1, 1), -- Smartphone, Black, Small, Quantity: 1
(1, 4, 2, 1), -- Smartphone, Black, Medium, Quantity: 1
(1, 4, 3, 1), -- Smartphone, Black, Large, Quantity: 1
(1, 5, 1, 1), -- Smartphone, White, Small, Quantity: 1
(1, 5, 2, 1), -- Smartphone, White, Medium, Quantity: 1
(1, 5, 3, 1), -- Smartphone, White, Large, Quantity: 1
(2, 1, 1, 1), -- Router, Red, Small, Quantity: 1
(2, 1, 2, 1), -- Router, Red, Medium, Quantity: 1
(2, 1, 3, 1), -- Router, Red, Large, Quantity: 1
(2, 2, 1, 1), -- Router, Blue, Small, Quantity: 1
(2, 2, 2, 1), -- Router, Blue, Medium, Quantity: 1
(2, 2, 3, 1), -- Router, Blue, Large, Quantity: 1
(2, 3, 1, 1), -- Router, Green, Small, Quantity: 1
(2, 3, 2, 1), -- Router, Green, Medium, Quantity: 1
(2, 3, 3, 1), -- Router, Green, Large, Quantity: 1
(2, 4, 1, 1), -- Router, Black, Small, Quantity: 1
(2, 4, 2, 1), -- Router, Black, Medium, Quantity: 1
(2, 4, 3, 1), -- Router, Black, Large, Quantity: 1
(2, 5, 1, 1), -- Router, White, Small, Quantity: 1
(2, 5, 2, 1), -- Router, White, Medium, Quantity: 1
(2, 5, 3, 1), -- Router, White, Large, Quantity: 1
(3, 1, 1, 1), -- Network Cable, Red, Small, Quantity: 1
(3, 1, 2, 1), -- Network Cable, Red, Medium, Quantity: 1
(3, 1, 3, 1), -- Network Cable, Red, Large, Quantity: 1
(3, 2, 1, 1), -- Network Cable, Blue, Small, Quantity: 1
(3, 2, 2, 1), -- Network Cable, Blue, Medium, Quantity: 1
(3, 2, 3, 1), -- Network Cable, Blue, Large, Quantity: 1
(3, 3, 1, 1), -- Network Cable, Green, Small, Quantity: 1
(3, 3, 2, 1), -- Network Cable, Green, Medium, Quantity: 1
(3, 3, 3, 1), -- Network Cable, Green, Large, Quantity: 1
(3, 4, 1, 1), -- Network Cable, Black, Small, Quantity: 1
(3, 4, 2, 1), -- Network Cable, Black, Medium, Quantity: 1
(3, 4, 3, 1), -- Network Cable, Black, Large, Quantity: 1
(3, 5, 1, 1), -- Network Cable, White, Small, Quantity: 1
(3, 5, 2, 1), -- Network Cable, White, Medium, Quantity: 1
(3, 5, 3, 1), -- Network Cable, White, Large, Quantity: 1
(4, 1, 1, 1), -- Coffee, Red, Small, Quantity: 1
(4, 1, 2, 1), -- Coffee, Red, Medium, Quantity: 1
(4, 1, 3, 1), -- Coffee, Red, Large, Quantity: 1
(4, 2, 1, 1), -- Coffee, Blue, Small, Quantity: 1
(4, 2, 2, 1), -- Coffee, Blue, Medium, Quantity: 1
(4, 2, 3, 1), -- Coffee, Blue, Large, Quantity: 1
(4, 3, 1, 1), -- Coffee, Green, Small, Quantity: 1
(4, 3, 2, 1), -- Coffee, Green, Medium, Quantity: 1
(4, 3, 3, 1), -- Coffee, Green, Large, Quantity: 1
(4, 4, 1, 1), -- Coffee, Black, Small, Quantity: 1
(4, 4, 2, 1), -- Coffee, Black, Medium, Quantity: 1
(4, 4, 3, 1), -- Coffee, Black, Large, Quantity: 1
(4, 5, 1, 1), -- Coffee, White, Small, Quantity: 1
(4, 5, 2, 1), -- Coffee, White, Medium, Quantity: 1
(4, 5, 3, 1); -- Coffee, White, Large, Quantity: 1

-- Populate ProductCategory table
INSERT INTO ProductCategory (productid, categoryid) VALUES
(1, 1),  -- Smartphone in Electronics
(2, 2),  -- Jeans in Clothing
(3, 3),  -- Blender in Kitchen
(4, 4);  -- Coffee in Drinks

-- Populate UserPayment table
INSERT INTO UserPayment (userid, paymentid) VALUES
(1, 1),
(1, 2);

-- Populate ProductImages table
INSERT INTO ProductImages (productid, image_url, description) VALUES 
(1, '/images/image_1730713160019.jpg', 'Front view of product 1'),
(2, '/images/image_1730713160019.jpg', 'Side view of product 1'),
(3, '/images/image_1730713160019.jpg', 'Front view of product 2'),
(4, '/images/image_1730713160019.jpg', 'Front view of product 2');

-- Populate visit table
INSERT INTO visitors (visit)
VALUES (1)
ON CONFLICT (id)
DO UPDATE SET visit = visitors.visit + 1;