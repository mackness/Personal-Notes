# [Reset](https://www.atlassian.com/git/tutorials/undoing-changes/git-reset)

There are three internal state management mechanisms that git uses to track changes to files:

1. working directory
2. staged snapshot
3. commit history

git revert has three main command line arguments `--soft, --mixed, --hard` each of the three arguments correspond to one of git's internal state management stages; the commit tree (head), staging, the staging index, and the working directory.

### The working directory

The working directory is in sync with the file system and will track all changed files in the local repository.

### The staging index

The staging index tracks working directory changes that have been promoted with `git add`. We can add a file and use the command `git ls-files -s` to show some interesting information about the change:

```bash
git ls-files -s
100644 e69de29bb2d1d6434b8b29ae775ad8c2e48c5391 0 reset_lifecycle_file
```

The first value is the staged change's mode bits, the second value is a SHA-1 hash of the file contents. The Commit History stores its own object SHA's for identifying pointers to commits and refs and the Staging Index has its own object SHA's for tracking versions of files in the index.

At this point we can add the file to the staging index like this:

```bash
$ git add reset_lifecycle_file
$ git status
On branch master Changes to be committed:
(use "git reset HEAD ..." to unstage)
modified: reset_lifecycle_file
```

now we can inspect staging index again with `git ls-files -s`

Should be noted that `git status` is not a real represntation of the staging index. The git status command output displays changes between the Commit History and the Staging Index. Let us examine the Staging Index content at this point.

```bash
$ git ls-files -s
100644 d7d77c1b04b5edd5acfc85de0b592449e5303770 0 reset_lifecycle_file
```

### Commit history

The final stage is the commit history. The `git commit` command adds changes to a permanent snapshot that lives in the commit history. The snapshot also includes the state of the staging index at the time of the commit.

```bash
$ git commit -am"update content of reset_lifecycle_file"
[master dc67808] update content of reset_lifecycle_file
1 file changed, 1 insertion(+)
$ git status
On branch master
nothing to commit, working tree clean
```

At this point we have added changes to the commit history and we can inspect changes with `git log`. At this point now that we have an entry in commit history we can begin to utilize `git reset`

### How git reset works

At a surface level, `git reset` is similar to `git checkout`. Where `git checkout` solely operates on the HEAD ref pointer, `git reset` will move the HEAD ref pointer and the current branch ref pointer. To better demonstrate this consider the following example:

```
(a) -> (b) -> (c) -> (d) -> [head ,master]
```

The example show a series of commits to master branch. The head ref and master branch currently point to commit d. Now lets execute and compare both `git checkout b` and `git reset b`

git checkout b

```
(a) -> (b) -> (c) -> (d) -> [master]
        |
        [head]
```

The repo is not in a detached HEAD state because the HEAD ref points to b but the master branch ref points to d.

git reset b

```
(a) -> (b)  (c) -> (d)
        |
        [head, master]
```

comparatively `git reset` moves the head and branch refs to the specified commit.

In addition to updating the commit ref pointers, `git reset` will modify the state of the three trees. The ref pointer modification always happens and is an update the commit history tree. The command line args `--soft --mixed --hard` direct how to modify the staging index and working directory trees.

### Main options

By default `git reset` has implicit arguments of `--mixed HEAD`, meaning by default you're executing `git reset --mixed HEAD`. In this form HEAD is the specified commit, in it's place any SHA-1 commit hash can be used.

`--mixed` effects staged snapshot and commit history trees

`--soft` effects just commit history tree

`--hard` effects all three working directory staged snapshot and commit history trees

### `--hard`

hard is the most direct dangerous and frequently used option. When passed hard the commit history ref pointers are updated to the specified commit. Then, the staging index and working directory are changed to match that of the specified commit. Any pending changes to the staging index and working directory get updated to match the state of the commit tree at the specified commit. This means any pending work in staging or working will be lost.

We can demo with the example repo:

```bash
$ echo 'new file content' > new_file
$ git add new_file
$ echo 'changed content' >> reset_lifecycle_file
```

With these changes in place lets run `git status`

```bash
$ git status
On branch master
Changes to be committed:
(use "git reset HEAD ..." to unstage)
new file: new_file
Changes not staged for commit:
(use "git add ..." to update what will be committed)
(use "git checkout -- ..." to discard changes in working directory)
modified: reset_lifecycle_file
```

We can observe that there is a new file called `new_file` and the contents of `reset_lifecycle_file` has been updated. We can take a closer look with `git ls-files -s`

```bash
$ git ls-files -s
100644 8e66654a5477b1bf4765946147c49509a431f963 0 new_file
100644 d7d77c1b04b5edd5acfc85de0b592449e5303770 0 reset_lifecycle_file
```

At this point we can execute `git reset --hard` and observe what happens:

```
$ git reset --hard
HEAD is now at dc67808 update content of reset_lifecycle_file
$ git status
On branch master
nothing to commit, working tree clean
```

Output of `git status` tells us that there are no longer any staged changes and the working directory is clean. This means that git has destroyed our changes and reset the state of all three trees to current HEAD ref.

### `--mixed`

Mixed is the default operating mode. The ref pointers are updated. The staging index is reset to the state of the specified commit. Any changes that have been undone from the staging index are are moved to the working directory.
