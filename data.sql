    
    CREATE TABLE user (
       id  int not null AUTO_INCREMENT,
         username varchar(55) not null,
         name varchar(55) not null,
        email varchar(55) not null,
         password varchar(255) not null,
         coverPic varchar(55) not null,
        profilePic varchar(55) not null,
        city varchar(55) not null,
       website varchar(55) not null,
        primary key(id)
     ) 
 ;
    CREATE TABLE post (
    id INT NOT NULL AUTO_INCREMENT,
    description varchar(255) not null,
    userId INT NOT NULL, 
    img varchar(55) not null,
    PRIMARY KEY (id),
    FOREIGN KEY (userId) REFERENCES user(id)
);

    CREATE TABLE comment  (
    id INT NOT NULL AUTO_INCREMENT,
    description varchar(255) not null,
    userId INT NOT NULL, 
    createdAt DATETIME ,
    PRIMARY KEY (id),
    FOREIGN KEY (userId) REFERENCES user(id)
);
    CREATE TABLE story  (
    id INT NOT NULL AUTO_INCREMENT,
    userId INT NOT NULL, 
    img varchar(55) not null,
    PRIMARY KEY (id),
    FOREIGN KEY (userId) REFERENCES user(id)
);
    CREATE TABLE following  (
    id INT NOT NULL AUTO_INCREMENT,
    followerUserId INT NOT NULL, 
    followedUserId INT NOT NULL, 
    PRIMARY KEY (id),
    FOREIGN KEY (followerUserId) REFERENCES user(id),
    FOREIGN KEY (followedUserId) REFERENCES user(id)
);
    CREATE TABLE likes  (
    id INT NOT NULL AUTO_INCREMENT,
    userId INT NOT NULL, 
    postId INT NOT NULL, 
    PRIMARY KEY (id),
    FOREIGN KEY (userId) REFERENCES user(id),
    FOREIGN KEY (postId) REFERENCES post(id)
);
desc user;
ALTER TABLE user
MODIFY COLUMN email VARCHAR(255) NOT NULL;

-- id  int not null AUTO_INCREMENT,
--     uuid varchar(200) not null,
--     name varchar(255) not null,
--     email varchar(255) not null,
--     contactNumber varchar(20) not null, 
--     paymentMethod varchar(50) not null,
--     total int not null,
--     productDetails JSON default null,
--     createdBy varchar(255) not null, 
--     primary key(id)
--     CREATE TABLE post (
--     postId INT NOT NULL AUTO_INCREMENT,
--     description varchar(255) not null,
--     userId INT NOT NULL, 
--     img varchar(55) not null,
--     PRIMARY KEY (postId),
--     FOREIGN KEY (userId) REFERENCES user(id)
-- );




--        id  int not null AUTO_INCREMENT,
--          username varchar(55) not null,
--          name varchar(55) not null,
--         email varchar(55) not null,
--          password varchar(255) not null,
--          coverPic varchar(55) not null,
--         profilePic varchar(55) not null,
--         city varchar(55) not null,
--        website varchar(55) not null,
--         primary key(id)
--      ) 
--  ;