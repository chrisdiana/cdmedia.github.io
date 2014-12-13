---
layout: post
title: In-browser Text Editor 
comments: true
tags: browsers 
---

Make any browser a text editor with these cool bookmarklets.

Copy and paste any of these into your browsers URL or save as a bookmarklet to have an instant text
editor anywhere you go.

**Basic notepad**

```
data:text/html, <html contenteditable>
```

**Monospace notepad**

```
// Big text
data:text/html, <body contenteditable style="font: 2rem/1.5 monospace;max-width:60rem;margin:0 auto;padding:4rem;">

// Smaller text
data:text/html,%20<body%20contenteditable%20style="font:%201rem/1%20monospace;max-width:90rem;margin:0%20auto;padding:1rem;">
```

**Sublime-like text editor w/Syntax Highlighting (thanks to ACE)**

```
data:text/html, <style type="text/css">.e{position:absolute;top:0;right:0;bottom:0;left:0;}</style><div class="e" id="editor"></div><script src="http://d1n0x3qji82z53.cloudfront.net/src-min-noconflict/ace.js" type="text/javascript" charset="utf-8"></script><script>var e=ace.edit("editor");e.setTheme("ace/theme/monokai");e.getSession().setMode("ace/mode/ruby");</script>
```

For other language: Instead of  `ace/mode/ruby`, Use

* Markdown -> `ace/mode/markdown`
* Python -> `ace/mode/python`
* C/C++ -> `ace/mode/c_cpp`
* Javscript -> `ace/mode/javascript`
* Java -> `ace/mode/java`
* Scala- -> `ace/mode/scala`
* CoffeeScript -> `ace/mode/coffee`
* and css, html, php, latex, 
tex, sh, sql, lua, clojure, dart, typescript, go, groovy, json, jsp, less, lisp, 
lucene, perl, powershell, scss, textile, xml, yaml, xquery, liquid, diff and many more...

---------------------------------------------------------------------------------------

For other theme: Instead of  `ace/theme/monokai`, Use

* Eclipse -> ace/theme/eclipse
* GitHub -> ace/theme/github
* TextMate -> ace/theme/textmate
* and ambiance, dawn, chaos, chrome, dreamweaver, xcode, vibrant_ink, solarized_dark, solarized_light, tomorrow, tomorrow_night, tomorrow_night_blue, 
twilight, tomorrow_night_eighties, pastel_on_dark and many more..
