---
layout: post
title: Setting Up Debian Wheezy as a Web Server
comments: true
tags: [server]
---

Here is quick guide to a Debian Wheezy web server up and running.

###1. Load Debian Image

Flash the Linux image to a hard drive or flash drive. First download the `.img` or `.raw`
Linux image file. Then, navigate into the directory with the image.

```
cd ~/Downloads/Debian/
```

View all the disks on the drive

```
diskutil list
```

Check the name of the device you are going to flash

```
mount
```

It should look something like:

```
/dev/disk2s1 on /Volumes/SYSTEM (msdos, local, nodev, nosuid, noowners)
```

Unmount that disk

```
sudo diskutil unmountDisk /dev/disk2
```

WARNING. Make sure to double check before you run this command or you could wipe
your entire hard drive if you select the wrong one!

```
sudo dd if=Debian_2.2_wheezy_3.14.14.raw of=/dev/rdisk2 bs=4096
```

This will take some time to flash and won't show any progress but you can press Ctrl+T to send to SIGNINFO
and it will output it's process.


###2. Setup Static Network Configuration

Make a backup of the network configuration file just in case:

```
sudo cp /etc/network/interfaces /etc/network/interfaces.bak
```

Change `iface eth0 inet6 dhcp` to shown below and change these IP addresses
to fit you config

Tip: To find you default gateway, try `route -n get default`

```
face eth0 inet static
    address 192.168.2.105
    netmask 255.255.255.0
    gateway 192.168.2.1
```

Restart networking

```
/etc/init.d/networking restart
```

Make sure your adapter is UP and if not bring it up

```
ip a
iwconfig
ip link set wlan0 up
```

---

**NOTE**
If you are setting up a for wireless instead of ethernet, set this in your
`/etc/network/interfaces` file:

First in terminal, find your wireless device:

```
iwconfig
OR
iwconfig | grep wlan0
```

For DHCP

```
auto wlan0
iface wlan0 inet dhcp
    wpa-ssid network-name
    wpa-psk pre-shared-key
```

For Static

```
face wlan0 inet static
    address 192.168.2.105
    netmask 255.255.255.0
    gateway 192.168.2.1
    wpa-ssid network-name
    wpa-psk pre-shared-key
```

Then in terminal, bring up the wlan or restart networking:

```
ifup wlan0
OR
/etc/init.d/networking restart
```

Check that its working:

```
ifconfig
ping google.com
```

---

Here is a sample `/etc/network/interface` file:

```
# The loopback network interface
auto lo
iface lo inet loopback

# The primary network interface
auto eth0
iface eth0 inet static
        address 192.168.1.5
        netmask 255.255.255.0
        network 192.168.1.0
        gateway 192.168.1.1

# The wireless network interface with dhcp
auto wlan0
iface wlan0 inet dhcp
    wpa-ssid nixcraft
    wpa-key-mgmt WPA-PSK
    wpa-group TKIP CCMP
    wpa-psk YOYR-PASSWORD-HERE
```

**Troubleshooting**
Check the logs if issues arise:

```
tail -f /var/log/wpa_supplicant.wlan0.log
grep 'something' /var/log/wpa_supplicant.wlan0.log
```

while your at it....set your servers date and time

```
date --set 1998-11-02
date --set 21:08:00
```

###3. Add a user

```
adduser someuser
```

Grant sudo privileges to new user

```
gpasswd -a someuser sudo
```

OR

```
sudo visudo
```

```
# User privilege specification
root        ALL=(ALL:ALL) ALL
someuser    ALL=(ALL:ALL) ALL
```

###4. Harden SSH

If you don't have SSH installed, install it:

```
sudo apt-get install openssh-client openssh-server
```

Edit the `/etc/ssh/sshd_config` file

```
PermitRootLogin no
X11Forwarding no
AllowUsers youruser
```

Then, restart ssh service using `systemctl restart ssh.service`

###5. Add a hostname

Edit your `/etc/hostname` to your liking

```
servername
```

and now your `/etc/hosts` file so it resolves correctly

```
127.0.0.1   localhost servername
::1         localhost servername ip6-localhost ip6-loopback
```

Add your gateway into the `/etc/resolv.conf` if it isn't generated

```
domain Belkin
search Belkin
nameserver 192.168.2.1
```


###6. Install Apache, MySQL, NodeJS and PHP

```
sudo apt-get install apache2
sudo apt-get install mysql-server
sudo apt-get install php5 php-pear php5-mysql php5-curl
```

Then install NodeJS

```
apt-get install curl
curl -sL https://deb.nodesource.com/setup | bash -
apt-get install -y nodejs
```

Setup apache


Start it

```
sudo apachectl start
```

If you run into isses like 'No such file or directory: apache2: could not open
error log file', create the folder. This may have not been created when apache
was installed.

```
mkdir /var/log/apache2/
sudo chown www-data:www-data /var/log/apache2/
```


Setup apache permissions

```
#Make sure the group is www-data on '/var/www'
sudo chgrp www-data /var/www

#Make '/var/www' writable for the group
sudo chmod 775 /var/www

#Set the GID for www-data for all sub-folders
sudo chmod g+s /var/www

# Your directory should look like this on an ls -l output.
# drwxrwsr-x

#Last, add your username to the www-data group (secondary group)
sudo usermod -a -G www-data [YOURUSERNAME]
```


###7. Create Virtual Hosts

First, make sure that vhost is enable in apache configuraton. Check to see if this is
uncommented in `/etc/apache2/apache2.conf`

```
Include sites-enabled/
```

Next, create a file like `/etc/apache2/sites-available/example.com.conf` and use this template:

```
<VirtualHost *:80>
    ServerAdmin webmaster@example.com
    ServerName example.com
    ServerAlias www.example.com
    DocumentRoot /var/www/example.com/public_html/
    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

Now you need to enable the site. You can use the shorcut command `sudo a2ensite example.com.conf`
or to do it manually run this command to setup a link to your new available site:

```
sudo ln -s /etc/apache2/sites-available/example.com.conf /etc/apache2/sites-enabled/example.com.conf
```

Now reload apache using:

```
sudo /etc/init.d/apache2 reload
```

If you end up getting an error like "apache2: Could not reliably determine the servers fully qualified domain name, using ::1 for ServerName"
you can fix this error by editing `/etc/apache2/apache2.conf` and adding this:

```
ServerName localhost
```

Finally, make sure to add your new site to `/etc/hosts` like:

```
127.0.0.1   localhost example.com
```

###8. Fix permission issues

If you want to work on your site and not be logged in as root, run this to fix
your sites permissions:

```
sudo chown -R $USER:$USER /var/www/example.com
```

Also, youll want to make sure everyone is able to read your files:

```
sudo chmod -R 775 /var/www
```

###9. Harden Apache

By default apache lists all the content of the directory in absence of an index file.
Edit or add this to your `/etc/apache2/apache2.conf` or `httpd.conf` and

```
<Directory /var/www/html>
    Options -Indexes
</Directory>
```

You will also want to turn off server version on server-generated
pages.

```
ServerSignature Off
```

Now, reload apache:

```
sudo /etc/init.d/apache2 reload
```

###10. Create a Firewall

If your server isnt sitting behind a router or firewall, I highly
suggest setting up a firewall to protect your server from attacks.

Check current firewall rules using:

```
sudo iptables -L
```

If you havent created any firewall rules, you should see something
similar to this:

```
Chain INPUT (policy ACCEPT)
target     prot opt source               destination

Chain FORWARD (policy ACCEPT)
target     prot opt source               destination

Chain OUTPUT (policy ACCEPT)
target     prot opt source               destination
```

Create a file to hold your firewall rules using:

```
sudo nano /etc/iptables.firewall.rules
```

Use this as a default firewall. These rules allow traffic on ports:
HTTP(80), HTTPS(443), SSH(22) and ping. All other ports will be
blocked.

```
*filter

#  Allow all loopback (lo0) traffic and drop all traffic to 127/8 that doesnt use lo0
-A INPUT -i lo -j ACCEPT
-A INPUT -d 127.0.0.0/8 -j REJECT

#  Accept all established inbound connections
-A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

#  Allow all outbound traffic - you can modify this to only allow certain traffic
-A OUTPUT -j ACCEPT

#  Allow HTTP and HTTPS connections from anywhere (the normal ports for websites and SSL).
-A INPUT -p tcp --dport 80 -j ACCEPT
-A INPUT -p tcp --dport 443 -j ACCEPT

#  Allow SSH connections
#
#  The -dport number should be the same port number you set in sshd_config
#
-A INPUT -p tcp -m state --state NEW --dport 22 -j ACCEPT

#  Allow ping
-A INPUT -p icmp --icmp-type echo-request -j ACCEPT

#  Log iptables denied calls
-A INPUT -m limit --limit 5/min -j LOG --log-prefix "iptables denied: " --log-level 7

#  Drop all other inbound - default deny unless explicitly allowed policy
-A INPUT -j DROP
-A FORWARD -j DROP

COMMIT
```

Next, activate the firewall rules by entering:

```
sudo iptables-restore < /etc/iptables.firewall.rules
```

Finally recheck your firewall rules using `sudo iptables -L` and
the output should look like:

```
Chain INPUT (policy ACCEPT)
    target     prot opt source               destination
    ACCEPT     all  --  anywhere             anywhere
    REJECT     all  --  anywhere             127.0.0.0/8          reject-with icmp-port-unreachable
    ACCEPT     all  --  anywhere             anywhere             state RELATED,ESTABLISHED
    ACCEPT     tcp  --  anywhere             anywhere             tcp dpt:http
    ACCEPT     tcp  --  anywhere             anywhere             tcp dpt:https
    ACCEPT     tcp  --  anywhere             anywhere             state NEW tcp dpt:ssh
    ACCEPT     icmp --  anywhere             anywhere
    LOG        all  --  anywhere             anywhere             limit: avg 5/min burst 5 LOG level debug prefix "iptables denied: "
    DROP       all  --  anywhere             anywhere

Chain FORWARD (policy ACCEPT)
    target     prot opt source               destination
    DROP       all  --  anywhere             anywhere

Chain OUTPUT (policy ACCEPT)
    target     prot opt source               destination
    ACCEPT     all  --  anywhere             anywhere
```

To make sure that the firewall rules are activated everytime you
restart your box, create a new script using:

```
sudo nano /etc/network/if-pre-up.d/firewall
```

and enter this into that file:

```
#!/bin/sh
/sbin/iptables-restore < /etc/iptables.firewall.rules
```

Finally, set the scripts permissions using:

```
sudo chmod +x /etc/network/if-pre-up.d/firewall
```

###11. Extra security measures

Install mod_security, fail2ban and/or psad

```
sudo apt-get install libapache2-modsecurity
apt-get install fail2ban
apt-get install psad
sudo a2enmod mod-security
sudo /etc/init.d/apache2 force-reload
```

###12. Generate SSH Key

Check for SSH keys

```
ls -al ~/.ssh
```

If none exist, run keygen to generate a new ssh key

```
ssh-keygen -t rsa -C "your_email@example.com"
```

then copy it to use

```
cat ~/.ssh/id_rsa.pub
```


---

### Extra:

Upgrade to a simple desktop environment

```
apt-get -y install xorg lightdm xfce4 xfce4-goodies tango-icon-theme gnome-icon-theme
reboot
```

Install VNC Server for remote viewing

```
sudo apt-get update
sudo apt-get install tightvncserver
```

Now start the server

```
vncserver
```

This will create a file in `~/.vnc/` similar to ``. The trailing number is the number
after the port used to connect to your desktop. For instance, if your IP is
192.168.0.101, you would connect to VNC using 192.168.0.101:5901. If the you create
a second desktop it should 2, 3 and so on. The port will change depending on that
(5902, 5903, etc).


You can stop the server by this command. Change the `:1` depending on what vnc instance
you have running similar to above.

```
vncserver -kill :1
```


---

Additional resources:

* [How to setup apache virtual hosts on Debian 7](https://www.digitalocean.com/community/tutorials/how-to-set-up-apache-virtual-hosts-on-debian-7)
* [LAMP Server on Debian Wheezy](https://www.linode.com/docs/websites/lamp/lamp-server-on-debian-7-wheezy)
* [Debian Wheezy Dedicated Web Server](http://www.pontikis.net/blog/debian-wheezy-web-server-setup)
* [Apache Security Tips](http://www.tecmint.com/apache-security-tips/)
* [Securing your Server](https://www.linode.com/docs/security/securing-your-server)
* [How to setup mod_security on Debian](https://www.digitalocean.com/community/tutorials/how-to-set-up-mod_security-with-apache-on-debian-ubuntu)
* [Apache Security Tips](http://www.tecmint.com/apache-security-tips/)
* [Tighten Apache](http://www.thegeekstuff.com/2011/03/apache-hardening/)
* [Debian Stable Web Server Step-by-step](http://nickj.org/Debian_stable_Web_Server_step-by-step)
* [What steps do you take to secure a debian server?](http://serverfault.com/questions/11659/what-steps-do-you-take-to-secure-a-debian-server)
* [Debian Wifi](https://wiki.debian.org/WiFi/HowToUse)
* [Setup a Bluetooth keyboard on Rasberry Pi](http://www.ctheroux.com/2012/08/a-step-by-step-guide-to-setup-a-bluetooth-keyboard-and-mouse-on-the-raspberry-pi/)
* [Cubox-i Debian SD image](http://www.igorpecovnik.com/2014/08/19/cubox-i-hummingboard-debian-sd-image/)
* [Flash an image](http://wiki.solid-run.com/Flash_an_image)
* [Wireless network setup](http://www.cyberciti.biz/faq/debian-linux-wpa-wpa2-wireless-wifi-networking/)
* [TightVNC](http://www.penguintutor.com/linux/tightvnc)


