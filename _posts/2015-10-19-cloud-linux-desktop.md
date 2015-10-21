---
layout: post
title: Start using a Cloud Desktop
comments: true
tags: [cloud, xfce, desktop, linux]
---

Why use a Cloud Desktop?

* Setup your own, customized environment and access it anywhere.
* You only need a browser to access your desktop.


Here are the tools we are going to be using to accomplish this:


If you are starting fresh from a bare-bones linux install (no GUI) then install
xfce.


Next, we need to install a VNC server to access our desktop. Traditionally, you
could just access your desktop via any VNC client, but we are taking it a step
further to have access from ANY browser.

```
sudo apt-get install tightvncserver
```

Download noVNC

```
git clone git://github.com/kanaka/noVNC
```

Install Websockify.

```
sudo apt-get install websockify
```



Start TightVNC

```
vncserver
```

Now let's start noVNC. Move to the directory where you downloaded noVNC and
run the start command.

```
cd ~/noVNC/
./utils/websockify --web ./ 8787 localhost:5901
```

Now you are able to connect to you VNC server using the link it provides.

Go to http://yourdomain.com/noVNC/noVNC/vnc.html
Host: YOUR_USER_NAME.kd.io
Port: 8787
Password: YOUR VNC PASSWORD
Hit "Connect"


http://blog.terminal.com/sending-your-desktop-to-live-in-a-cloud/
