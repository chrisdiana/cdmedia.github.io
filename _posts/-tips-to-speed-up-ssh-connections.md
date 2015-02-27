---
layout: post
title: Tips to Speed Up SSH Connections
comments: true
tags: [ssh]
---

Ever run across laggy SSH connections when trying to type? Here are few tips
to speed up connections.

### 1. Make sure your remote computer is resolving correctly

In your remote `/etc/hosts` file, make sure you have a localhost host entry
with the correct hostname.

```
127.0.0.1   localhost yourcomputer
::1        localhost yourcomputer ip6-localhost ip6-loopback
```

### 2. Make sure your SSH if correctly setup

If you haven't generated an SSH key and setup your SSH keys on your remote computer, follow the guide [here](https://help.github.com/articles/generating-ssh-keys/).

### 3. Add your SSH key to authorized_keys

Add your local SSH public key to the remote authorized_keys file.

On your local machine

```
pbcopy < ~/.ssh/id_rsa.pub
```

On your remote machine

```
vi authorized_keys
# paste in your key - should look similar to "ssh-rsa AAB3Nz1y2..."
```

### 4. Add your remote host to local hosts file

Edit your local computer's `/etc/hosts` file and add the IP and hostname to the file:

```
192.168.0.101	yourcomputer
```

### 5. Update Local Configuration

Edit the local computer's `/etc/ssh_config` file to

```
GSSAPIKeyExchange no
```

### 6. Update Remote Configuration

Edit the `/etc/sshd_config` file to

```
UseDNS no
```

### 7. Try SSH Compression

By default compression is not enabled for outgoing ssh connections.
Very simple compression is no problem for modern CPUs and even on a gigabit network it is faster to compress data first before sending it over the network instead of leaving it uncompressed.
Create an ssh config file if you don't already have one in your home's `.ssh/` folder:

```
vi ~/.ssh/config
```

Then, add this to the file

```
Compression yes
CompressionLevel 6
```

You can play around with the setting till you get one you like.

---

### Once you've tried a few of these tips, restart SSH:

```
/etc/init.d/ssh restart
```
