syntax on
syntax enable
colorscheme molokai
let g:molokai_original = 1
let g:rehash256 = 1
hi Normal          ctermfg=252 ctermbg=none
"filetype options
filetype on
filetype plugin on
filetype indent on
"Display current cursor position in lower right corner.
set ruler
"Ever notice a slight lag after typing the leader key + command? This lowers
"the timeout.
set timeoutlen=500
"Set font type and size. Depends on the resolution. Larger screens, prefer h20
set guifont=Menlo:h14
"Show command in bottom right portion of the screen
set showcmd
"Show lines numbers
set number
"Indent stuff
set smartindent
set autoindent
"Better line wrapping 
set wrap
set textwidth=79
set formatoptions=qrn1
"Set incremental searching"
set incsearch
"Highlight searching
set hlsearch
" case insensitive search
set ignorecase
set smartcase
"Enable code folding
set foldenable
"Split windows below the current window.
set splitbelow              
"Map escape key to jj -- much faster
imap jj <esc>
silent! map <F2> :NERDTreeToggle<CR>
