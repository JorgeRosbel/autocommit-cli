## 📦 `batch`

### 📌 Description

**Command:** `gitzen batch` (Use -i to ignore `gitzen.config.json` if needed)

Use this command when you've made many unrelated changes and want to split them into multiple meaningful commits for better understanding and project clarity.

Gitzen uses AI to automatically analyze your **unstaged changes**, group them into logical blocks (e.g., new features, refactors, dependency updates), assign them a priority, and generate a separate commit for each group **in order of importance**.

### ⚙️ How it Works

1. **Unstaged file detection**

   * Scans for all files modified in the working directory that haven't been staged yet.

2. **Grouping and prioritization**

   * Groups changes using AI into categories like `feat`, `fix`, `refactor`, `chore`, etc.
   * Sorts them by relevance (e.g., features before refactors).

3. **Commit message generation**

   * For each group, generates a commit message based on your selected style (e.g., Conventional Commits).

4. **Summary and confirmation**

   * Shows a summary of each group, including affected files, line changes, and suggested messages.
   * Asks for confirmation: `Proceed? (Yes/No)`.

5. **Sequential execution**

   * If confirmed, runs the following per group:

     ```bash
     git add <files-in-group>
     git commit -m "<emoji> <type>: generated description"
     ```

### ✅ Benefits

* Eliminates the need for manual staging and message writing.
* Keeps your Git history clean, structured, and easy to understand.
* Encourages small, meaningful commits for better collaboration and review.
