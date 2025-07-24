## 📝 `commit`

### 📌 Description

**Command:** `gitzen commit`

This command uses AI to generate a commit message based on your **staged changes**, following your configured settings. Gitzen helps you create clear, meaningful commit messages while keeping your workflow efficient.

By default, the AI-suggested commit message is shown to the user for confirmation before proceeding.

### ⚙️ Options

* `-y`, `--yes`: ✅ Automatically accept and apply the generated commit message without asking for confirmation.
* `-e`, `--edit`: ✏️ Opens the generated commit message in your default Git editor so you can edit it before committing.

> ⚠️ These options are **mutually exclusive** and cannot be used together.

### 📋 Requirements

* ✅ Staged files are required for this command to work.

### ✅ Examples

```bash
# Show suggested message and wait for confirmation
$ git add .
$ gitzen commit

# Commit instantly with the AI-generated message
$ gitzen commit -y

# Edit the message in Git editor before committing
$ gitzen commit -e
```

Gitzen ensures your commit history stays clean and informative with minimal effort.
