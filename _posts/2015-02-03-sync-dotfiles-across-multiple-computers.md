---
layout: post
title: Sync your Preferences Across Multiple Computers with GIT
comments: true
tags: [git, vim]
---

Here's quick trick for syncing your dotfiles across multiple computers with GIT.
This way, you can always have the most up to date copy of your bash profile or
vimrc without having to worry about manually copying them.

First, create a dotfiles folder in your home directory. This is where all your
preferences and settings that will be backed up in version control will go.

```
mkdir ~/.dotfiles
```

Next, move all the files you would like to have the ability to sync into your
new `.dotfiles` folder. Remember, these files will be public (unless you plan
on using Bitbucket) so make sure there's nothing personal in them.

In this example, I just plan on syncing my bashrc, VIM settings and
GIT settings.

```
cd ~
mv .bash_profile .dotfiles/.bashrc
mv .gitconfig .dotfiles/.gitconfig
mv .vim .dotfiles/.vim
mv .vimrc .dotfiles/.vimrc
```

Now we are going to create symlinks to link to the new location in the
`.dotfiles` folder that way your computer knows where to find them when it
looks in the default locations.

```
cd ~
ln -s .dotfiles/.bashrc .bashrc
ln -s .dotfiles/.gitconfig .gitconfig
ln -s .dotfiles/.vim .vim
ln -s .dotfiles/.vimrc .vimrc
```

Next, we need to initialize the GIT repo, add the remote and push up the changes.
(Make sure to have already created a new repo on GitHub or Bitbucket)

```
cd ~/.dotfiles
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/youruser/dotfiles.git
git push -u origin master
```

Now you have version control on your dotfiles! To sync them with another server or
computer, ssh or access terminal on another machine and remove all your old settings
(make sure to backup any settings if there are important to you).

```
ssh youruser@yourmachine
cd ~
rm .bash_profile .vimrc .gitconfig
rm -rf .vim
```

Clone your dotfiles repo and pull down the changes

```
git clone https://github.com/youruser/dotfiles.git
mv dotfiles .dotfiles
cd ~/.dotfiles
git pull
```

Finally, create the symlinks similar to what you did on your local computer.

```
cd ~
ln -s .dotfiles/.bashrc .bashrc
ln -s .dotfiles/.gitconfig .gitconfig
ln -s .dotfiles/.vim .vim
ln -s .dotfiles/.vimrc .vimrc
```

Now, when you make a change on any computer all you have to do is commit and push
your changes and your preferences can not only synced across multiple servers or
computers but also be in version control.

One last thing to note. If you happen to have some personal or computer specific
things in your bash profile, one way you manage this is by placing these
rules inside a local .bashrc file (like `~/.bashrc-local`) file. This way you can keep
the majority of your bash settings synced, while more specific things such as
alias can be separated and not public.

You can do this by creating a local bash file:

```
touch .bash-local
```

Then, adding this to your `.bashrc` file:

```
# Load local .bashrc if it exists
test -f ~/.bashrc-local && source ~/.bashrc-local
```

#Automating wih a shell script

This is all great but can become a huge PITA if you do this on every computer
you work on. You can use a simple bash script to automate the process. In your
`~/.dotfiles` folder create a `make.sh` file.

```
vi ~/.dotfiles/make.sh
```

In this file add the following:

```
#!/bin/bash
############################
# .make.sh
# This script creates symlinks from the home directory to any desired dotfiles in ~/.dotfiles
############################

# variables
dir=~/.dotfiles                    		# dotfiles directory
olddir=~/dotfiles_old             		# old dotfiles backup directory
files="bashrc vimrc vim gitconfig"    	# list of files/folders to symlink in homedir

# move dotfiles to .dotfiles hidden folder
mv ~/dotfiles $dir

# create dotfiles_old in homedir
echo "Creating $olddir for backup of any existing dotfiles in ~"
mkdir -p $olddir
echo "...done"

# change to the dotfiles directory
echo "Changing to the $dir directory"
cd $dir
echo "...done"

# move any existing dotfiles in homedir to dotfiles_old directory, then create symlinks
for file in $files; do
	echo "Moving any existing dotfiles from ~ to $olddir"
	mv ~/.$file ~/dotfiles_old/
	echo "Creating symlink to $file in home directory."
	ln -s $dir/.$file ~/.$file
done
```

Basically what this script does is everything I've described about in a quick
script you can run each time you jump to a new computer. You can read through
the comments to see what each step does.

For further dotfile examples, you can take a look at [my dotfiles
repo](https://github.com/cdmedia/dotfiles) or see plenty of [others here on
Github](https://dotfiles.github.io/).
