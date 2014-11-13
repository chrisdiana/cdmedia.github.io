---
layout: post
title: Best practices for moving a site to live production
comments: true
tags: [site maintenance]
---

Some suggestions on moving a site to live production using subdirectories for zero downtime.

--------------------------
1. Modify .htaccess file

```
RewriteEngine On
RewriteBase /

RewriteCond %{REQUEST_URI} !(\.|/$)
RewriteRule (.*) http://www.site.com/$1/ [R=301,L]

RewriteCond %{REQUEST_URI} !^/subdir
RewriteRule ^(.*)$ subdir/$1 [L]
```
2. In subdirectory of new install, edit configuration.php

```
public $live_site = 'http://www.yoursite.com';
```

### Another Method
--------------------------
1. Set .htaccess to this in root dir

```
RewriteEngine On
RewriteCond %{REQUEST_URI} !^/subdir/.*$
RewriteRule ^(.*)$ /subdir/$1 [QSA,L]
```
2. Set .htaccess to this in sub dir in joomla .htaccess file

```
RewriteBase /subdir
```
3. In subdirectory of new install, edit configuration.php

```
public $live_site = 'http://www.yoursite.com'
```
