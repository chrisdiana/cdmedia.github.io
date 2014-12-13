---
layout: post
title: Hidden Directories in Localhost Yosemite
comments: true
tags: [htaccess, yosemite]
---

Here is a way to fix hidden directories on localhost with Yosemite,
a common problem when dealing with Wordpress and .htaccess files
with the subdirectory.

Set your user.conf file to below:

```
sudo vi /etc/apache2/users/yourusername.conf
```

```
<Directory "/Users/yourusername/Sites/">
	Options Indexes FollowSymLinks Multiviews
	AllowOverride All
	Require all granted
</Directory>
```
