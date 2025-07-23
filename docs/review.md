## review

* **Command:** `gitzen review -l <language>`

* **Description:** The `-l` (language) parameter specifies the **natural language** in which the AI feedback will be delivered. If omitted, the CLI will use the language defined in your `gitzen.config.json` file. This command performs an **AI‑powered code review** of the changes in the **staging area** only, offering actionable feedback on code quality, style, and best practices.

* **Workflow**:
  - ```bash
    git add .
    gitzen review
    ```
  - ```bash
    git add .
    gitzen review -l es
    ```
  - ```bash
    git add .
    gitzen review -l english
    ```
