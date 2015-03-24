---
layout: post
title: Force push in GIT
comments: true
tags: [git]
---

Ever mess up pretty bad on a project and wish you could just go back a few commits and
forget about all the latest commits, without rebasing?

Heres a nice tip to get out of a sticky situation, even if you already pushed your commits
to a remote repo.

First, go back to the commit you would like to restart from. Use a `git log` to get the
commit hash you would like. Then checkout that commit:

```
git checkout 8d8e8ba8f
```

Then, reset to that commit. This will delete any local changes, so make sure to stash them
if you dont want to lose them.

```
git reset --hard 8d8e8ba8f
```

After that, make changes and commits as you normally would and when you are satisfied, you
should see a message similar to this in your `git status`

```
On branch samplebranch
Your branch and 'origin/samplebranch' have diverged,
and have 8 and 3 different commits each, respectively.
  (use "git pull" to merge the remote branch into yours)
  nothing to commit, working directory clean
```

This is basically saying, your branch has split and the remote commits do not align with the
local ones--like 2 seperate branches. You dont want this. You want to wipe all those commits
that are existing on the remote server away. So now we are going to use git force push in
this syntax `git push <remote> <branch> -f`. For example:

```
git push origin samplebranch -f
```

This will strip all those previous commits from remote and replace them with the new ones.
Make sure not to do this if others are working on your branch as you will run into merge
issues.

[More info here](http://stackoverflow.com/questions/10510462/force-git-push-to-overwrite-remote-files)

#### SIDE NOTE:

A more nondescructive way would be to `git revert` changes. This effectivly creates a commit
with the reverse patch to cancel them out. If you want to go this route, `git log` and find
all the commits you would like to revert...for example:

```
# This will create three separate revert commits:
git revert a867b4af 25eee4ca 0766c053

# It also takes ranges. This will revert the last two commits:
git revert HEAD~2..HEAD

# Reverting a merge commit
git revert -m 1 <merge_commit_sha>

# To get just one, you could use `rebase -i` to squash them afterwards
# Or, you could do it manually (be sure to do this at top level of the repo)
# get your index and work tree into the desired state, without changing HEAD:
git checkout 0d1d7fc32 .

# Then commit. Be sure and write a good message describing what you just did
git commit
```

#### ANOTHER SIDE NOTE:

If you've commited and not pushed to remote, you can reset to the previous
commit using:

```
git reset --soft HEAD~1
```

HEAD~1 is a shorthand for the commit before head. Alternatively you can refer to
the SHA-1 of the hash you want to reset to. --soft option will delete the commit
but it will leave all your changed files "Changes to be committed", as git
status would put it.

**If you want to get rid of any changes to tracked files in the working tree since
the commit before head use --hard instead.**

Now if you already pushed and someone pulled which is usually my case, you can't
use git reset. You can however do a git revert,

```
git revert HEAD
```

This will create a new commit that reverses everything introduced by the
accidental commit.

