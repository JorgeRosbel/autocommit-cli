## summarize

* **Command:** `gitzen summarize -l <language>` 

* **Description:** The `-l` (language) parameter is optional. If omitted, the `CLI` will use the language defined in your `gitzen.config.json` file. This command provides a **summary** of the changes made in both the **staging** area and the **working** directory. You can use the language code or directly the language name.

* **workflow**:
  - ```ts
    git add .
    gitzen summarize
    ```
  - ```ts
    git add .
    gitzen summarize -l es
    ```
  - ```ts
    git add .
    gitzen summarize -l english
    ```
