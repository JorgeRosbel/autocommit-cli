## 📝 `commit`

### 📌 Description

**Command:** `gitzen commit`

Generates a commit message using the configured AI model and creates a Git commit **only after user confirmation**. Gitzen analyzes your **staged changes** and generates a clear, concise message based on your configuration settings.

### ⚙️ How it Works

1. You stage the changes with `git add ...`.
2. You run `gitzen commit`.
3. Gitzen:

   * Reads the staged diff.
   * Uses your selected AI model to generate a commit message.
   * Shows you the proposed commit for approval.
   * Only if you confirm, it runs `git commit -m "<message>"`.

### 🧪 Workflow Example

```ts
git add .
gitzen commit
```

This command helps you keep your Git history clear, consistent, and AI-enhanced without manual message crafting.
