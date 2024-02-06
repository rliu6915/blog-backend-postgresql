CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    uri text NOT NULL,
    title text NOT NULL,
    likes int DEFAULT 0
);

insert into blogs (author, uri, title) values ('John Doe', 'http://www.johndoe.com', 'John Doe''s Blog');
insert into blogs (author, uri, title, likes) values ('Jane Doe', 'http://www.janedoe.com', 'Jane Doe''s Blog', 100);