---
layout: post
title: Moving a Wordpress site to production
comments: true
tags: wordpress
---
A few tips on moving a Wordpress site to a production environment

1. Copy all files over to subfolder on production server
2. Install WP-Migrate-DB plugin on site you are moving and set the new URL and root folder directory
3. Download a copy of the database and move it to the production server. Copy/Export any other Wordpress or theme settings as they may note transfer
4. Create a new database on the production server
5. Import the newly migrated database into the new database
6. Edit the wp-config.php in the root directory and set the database,host, user and password to connect to MySQL
7. Add these lines in order to test the site in the subdirectory before moving to root directory

```
define('WP_HOME','http://www.yoursite.com/subdir');
define('WP_SITEURL','http://www.yoursite.com/subdir');
```
8. Make changes as needed, import theme settings etc.
9. When ready, move all old Wordpress file into some subdirectory, like "oldsite" and move all new Wordpress files to the root
10. Comment or edit out the 2 lines added above in the wp-config.php file.
11. Restart apache
12. OR lookup doing it with Wordpress in it's own directory method.
