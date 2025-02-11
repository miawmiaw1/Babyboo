CREATE TABLE Country (
    countryid SERIAL PRIMARY KEY,
    country VARCHAR(255) NOT NULL
);

CREATE TABLE MemberType (
    membertypeid SERIAL PRIMARY KEY,
    type VARCHAR(255) NOT NULL
);

CREATE TABLE Status (
    statusid SERIAL PRIMARY KEY,
    statusname VARCHAR(255) NOT NULL
);

CREATE TABLE Category (
    categoryid SERIAL PRIMARY KEY,
    categoryname VARCHAR(255) NOT NULL UNIQUE, -- Make categoryname unique
    categoryimage VARCHAR(255) NOT NULL,
    categorydescription TEXT
);

CREATE TABLE Color (
    colorid SERIAL PRIMARY KEY,
    colorname VARCHAR(255) NOT NULL
);

CREATE TABLE Sizes (
    sizeid SERIAL PRIMARY KEY,
    sizename VARCHAR(255) NOT NULL
);

CREATE TABLE Address (
    addressid SERIAL PRIMARY KEY,
    address VARCHAR(255) NOT NULL,
    postalcode INT NOT NULL,
    city VARCHAR(255) NOT NULL,
    countryid INT,  -- One-to-one relationship
    FOREIGN KEY (countryid) REFERENCES Country(countryid) ON DELETE SET NULL
);

CREATE TABLE Payment (
    paymentid SERIAL PRIMARY KEY,
    paymentname VARCHAR(255) NOT NULL
);

CREATE TABLE Users (
    userid SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phonenumber BIGINT,
    addressid INT UNIQUE,  -- One-to-one relationship
    membertypeid INT,  -- One-to-many relationship
    FOREIGN KEY (addressid) REFERENCES Address(addressid) ON DELETE SET NULL,
    FOREIGN KEY (membertypeid) REFERENCES MemberType(membertypeid) ON DELETE SET NULL
);

CREATE TABLE Product (
    productid SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    manufacturer VARCHAR(255) NOT NULL,
    features TEXT NOT NULL,
    link TEXT NOT NULL,
    købspris_ex_moms DECIMAL(10,2), -- Pris uden moms ved køb
    salgpris_ex_moms DECIMAL(10,2), -- Pris uden moms ved salg
    indgående_moms DECIMAL(10,2), -- Købsmoms (25% af købspris)
    udgående_moms DECIMAL(10,2), -- Salgsmoms (25% af salgspris)
    tags TEXT NOT NULL,
    barcode BIGINT NOT NULL
);

CREATE TABLE Orders (
    orderid SERIAL PRIMARY KEY,
    order_date VARCHAR(255) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phonenumber BIGINT,
    address VARCHAR(255) NOT NULL,
    postalcode INT NOT NULL,
    city VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    parcel VARCHAR(255) NOT NULL,
    ishomedelivery BOOLEAN NOT NULL DEFAULT TRUE,
    totalprice NUMERIC(10, 2) NOT NULL,
    stripepaymentid VARCHAR(255) NOT NULL,
    userid INT NOT NULL,  -- The user who made the order (One-to-many relationship)
    statusid INT NOT NULL, -- The status of the order 
    paymentid INT NOT NULL, -- The payment of the order
    FOREIGN KEY (statusid) REFERENCES Status(statusid),  -- Link to Status
    FOREIGN KEY (paymentid) REFERENCES Payment(paymentid)  -- Link to Payment
);

CREATE TABLE Orders_Product (
    order_product_id SERIAL PRIMARY KEY, -- Unique identifier for each row
    orderid INT NOT NULL,
    productid INT NOT NULL,
    productname VARCHAR(255) NOT NULL,
    colorname VARCHAR(255) NOT NULL,
    sizename VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    købspris_ex_moms DECIMAL(10,2), -- Pris uden moms ved køb
    salgpris_ex_moms DECIMAL(10,2), -- Pris uden moms ved salg
    indgående_moms DECIMAL(10,2), -- Købsmoms (25% af købspris)
    udgående_moms DECIMAL(10,2), -- Salgsmoms (25% af salgspris)
    FOREIGN KEY (orderid) REFERENCES Orders(orderid) ON DELETE CASCADE,
    FOREIGN KEY (productid) REFERENCES Product(productid)
);

CREATE TABLE ProductColorSize (
    productid INT NOT NULL,
    colorid INT NOT NULL,
    sizeid INT NOT NULL,
    quantity INT NOT NULL,
    PRIMARY KEY (productid, colorid, sizeid),
    FOREIGN KEY (productid) REFERENCES Product(productid) ON DELETE CASCADE,
    FOREIGN KEY (colorid) REFERENCES Color(colorid) ON DELETE CASCADE,
    FOREIGN KEY (sizeid) REFERENCES Sizes(sizeid) ON DELETE CASCADE
);

CREATE TABLE ProductCategory (
    productid INT NOT NULL,
    categoryid INT NOT NULL,
    PRIMARY KEY (productid, categoryid),
    FOREIGN KEY (productid) REFERENCES Product(productid) ON DELETE CASCADE,
    FOREIGN KEY (categoryid) REFERENCES Category(categoryid) ON DELETE CASCADE
);

CREATE TABLE UserPayment (
    userid INT NOT NULL,
    paymentid INT NOT NULL,
    PRIMARY KEY (userid, paymentid),
    FOREIGN KEY (userid) REFERENCES Users(userid) ON DELETE CASCADE,
    FOREIGN KEY (paymentid) REFERENCES Payment(paymentid) ON DELETE CASCADE
);

CREATE TABLE ProductImages (
    imageid SERIAL PRIMARY KEY,
    productid INT REFERENCES Product(productid) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE visitors (
    id SERIAL PRIMARY KEY,
    visit INT NOT NULL DEFAULT 0
);