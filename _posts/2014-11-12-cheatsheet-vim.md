---
layout: post
title: Vim Cheatsheet
comments: true
tags: [cheatsheet, vim]
---

VIM
Cursor movement

    h - move cursor left
    j - move cursor down
    k - move cursor up
    l - move cursor right
    w - jump forwards to the start of a word
    W - jump forwards to the start of a word (words can contain punctuation)
    e - jump forwards to the end of a word
    E - jump forwards to the end of a word (words can contain punctuation)
    b - jump backwards to the start of a word
    B - jump backwards to the start of a word (words can contain punctuation)
    0 - jump to the start of the line
    ^ - jump to the first non-blank character of the line
    $ - jump to the end of the line
    G - go to the last line of the document
    5G - go to line 5

	^D ^U - scroll half a page up, down
	^F ^B - scroll page up, down

Tip Prefix a cursor movement command with a number to repeat it. For example, 4j moves down 4 lines.
Insert mode - inserting/appending text

    i - insert before the cursor
    I - insert at the beginning of the line
    a - insert (append) after the cursor
    A - insert (append) at the end of the line
    o - append (open) a new line below the current line
    O - append (open) a new line above the current line
    ea - insert (append) at the end of the word
    Esc - exit insert mode

Editing

    r - replace a single character
    J - join line below to the current one
    cc - change (replace) entire line
    cw - change (replace) to the end of the word
    c$ - change (replace) to the end of the line
    s - delete character and substitute text
    S - delete line and substitute text (same as cc)
    xp - transpose two letters (delete and paste)
    u - undo
    Ctrl + r - redo
    . - repeat last command
    (v)= - Fix indentation
    =G - Reindents the current cursor till end of buffer
    == - Fix indentation of current line
    gg=G - Fix indentation of entire file
    < or > - Indent line

Marking text (visual mode)

    v - start visual mode, mark lines, then do a command (like y-yank)
    V - start linewise visual mode
    o - move to other end of marked area
    Ctrl + v - start visual block mode
    O - move to other corner of block
    aw - mark a word
    ab - a block with ()
    aB - a block with {}
    ib - inner block with ()
    iB - inner block with {}
    Esc - exit visual mode

Visual commands

    > - shift text right
    < - shift text left
    y - yank (copy) marked text
    d - delete marked text
    ~ - switch case

Cut and paste

    yy - yank (copy) a line
    2yy - yank (copy) 2 lines
    yw - yank (copy) word
    y$ - yank (copy) to end of line
    p - put (paste) the clipboard after cursor
    P - put (paste) before cursor
    dd - delete (cut) a line
    2dd - delete (cut) 2 lines
    dw - delete (cut) word
    D - delete (cut) to the end of the line
    d$ - delete (cut) to the end of the line
    x - delete (cut) character

Exiting

    :w - write (save) the file, but dont exit
    :wq - write (save) and quit
    :x - write (save) and quit
    :q - quit (fails if there are unsaved changes)
    :q! - quit and throw away unsaved changes

Search and replace

    /pattern - search for pattern
    ?pattern - search backward for pattern
    n - repeat search in same direction
    N - repeat search in opposite direction
    :%s/old/new/g - replace all old with new throughout file
    :%s/old/new/gc - replace all old with new throughout file with confirmations

Working with multiple files

    :e filename - edit a file in a new buffer
    :bnext or :bn - go to the next buffer
    :bprev or :bp - go to the previous buffer
    :bd - delete a buffer (close a file)
    :sp filename - open a file in a new buffer and split window
    :vsp filename - open a file in a new buffer and vertically split window
    Ctrl + ws - split window
    Ctrl + ww - switch windows
    Ctrl + wq - quit a window
    Ctrl + wv - split window vertically

Tabs

    :tabnew filename or :tabn filename - open a file in a new tab
    Ctrl + wt - move the current split window into its own tab
    gt or :tabnext or :tabn - move to the next tab
    gT or :tabprev or :tabp - move to the previous tab
    #gt - move to tab number #
    :tabmove # - move current tab to the #th position (indexed from 0)
    :tabclose or :tabc - close the current tab and all its windows
    :tabonly or :tabo - close all tabs except for the current one

Languages

    en_us
    ja
    fr

Explore

    :Explore - explore file directory
    :Explore! - explore file directory with vertical splitting
    :bd - exit explore
    :Sexplore - split-screen explorer
    :Hexplore - horizontal split-screen explorer
    :Vexplore - vertical slit-screen explorer
    :Texplore - tabbed full-screen explorer
    :gt - switch between tabs
    :tabn - Next tab
    :tabb - Back tab

Other

    :s/foo/bar/g - Change each 'foo' to 'bar' in the current line
    :%s/foo/bar/g - Change each 'foo' to 'bar' in all the lines
    (visual):'<,'>s/foo/bar/g - highlight and replace all selected in visual mode
    Ctrl + z - exit vim (use fg+enter to enter vim again)

VIM Resources

* [A Good Vimrc](http://dougblack.io/words/a-good-vimrc.html)
* [Why Vim is Awesome](http://federicoramirez.name/why-vim-is-awesome/)
* [Vim Colors](http://www.calmar.ws/vim/256-xterm-24bit-rgb-color-chart.html)
