BEGIN TRANSACTION;

INSERT into users (name, email, entries, joined) values ('root', 'root@gmail.com', 5, '2019-01-01');
INSERT into login (hash, email) values ('$2a$10$AtQK1ZwZuPuCt4B2VLktwutASGUvnjSChv5Pv9VcCn5A6SR7Q0fVS', 'root@gmail.com');

COMMIT;