---
layout: post
title: MySQL Cheatsheet
comments: true
tags: [cheatsheet, mysql]
---

A few helpful hints for MySQL

### Create DB

```
create database dbname;
```

### Select Record

```
SELECT field1, field2 table_name1, table_name2 WHERE id=whatever;
```

### Update Record

```
UPDATE table_name SET field1=new-value1, field2=new-value2 WHERE id=whatever;
```

### Insert Record

```
INSERT INTO table_name ( field1, field2, fieldN ) VALUES ( value1, value2, valueN );
```

### Delete Record

```
DELETE FROM table_name WHERE id=whatever;
```

### Copy Records

```
INSERT INTO table_b (id, title, description, params) (SELECT "someotherID#", title, description, params FROM table_a WHERE id IN (id1, id2, id3, id4, id5));
```

### Inner Join

```
SELECT a.column_a, b.column_b, c.column_c 
FROM table_a a 
INNER JOIN table_b b ON a.column_a = a.id 
INNER JOIN table_c c ON a.column_a = c.id 
WHERE c.column_c = ?;
```

### Create/Assign User to DB

```
CREATE USER 'newuser'@'localhost' IDENTIFIED BY 'password';
grant all on dbname.* to username@localhost;
grant SELECT on dbname.* to username@localhost;
set password for username@localhost = password(‘yourpassword‘);

OR TO GRANT ALL PRIVLEGES....
GRANT ALL PRIVILEGES ON * . * TO 'newuser'@'localhost';
FLUSH PRIVILEGES;
```

### SCP SSH File Transfer

```
scp data.sql vivek@example.cyberciti.biz:/home/vivek
```

Terminal commands.

### Start SQL

```
sudo /usr/local/mysql/support-files/mysql.server start
```

### Version

```
/usr/local/mysql/bin/mysql -v
```

### Login

```
mysql -u root -p
```

### Import SQL data file

```
mysql -u username -p -h localhost DATA-BASE-NAME &lt; data.sql ``` ### SQL Dump ``` mysqldump -u root -p[root_password] [database_name] &amp;gt; dumpfilename.sql
```

### SQL Dump

```
mysqldump -u root -p[root_password] [database_name] &gt; dumpfilename.sql
```