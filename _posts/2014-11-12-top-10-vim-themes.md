---
layout: post
title: Top 10 Themes for Vim
comments: true
tags: [top 10, vim]
---

Download the theme.vim file and add it to `~/.vim/colors/theme.vim`.
Then add the code block to your `~/.vimrc` file.


### 1. [Molokai](https://github.com/tomasr/molokai) [(download)](/assets/vim/molokai.vim)

```
colorscheme molokai
let g:molokai_original = 1
let g:rehash256 = 1
```

### 2. Monokai

```
colorscheme monokai
```

### 3. [Solarized](http://ethanschoonover.com/solarized)

```
colorscheme solarized
set background=dark
let g:solarized_termcolors= 256
let g:solarized_termtrans = 1
```

### 4. IR Black

```
colorscheme ir_black
```

### 5. Jellybeans

```
colorscheme jellybeans
```

### 6. Mustang

```
colorscheme mustang
```

---

*Tip - To set background to transparent*

```
hi Normal          ctermfg=252 ctermbg=none
```
