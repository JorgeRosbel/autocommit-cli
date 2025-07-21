# Gitzen: AI-powered CLI Tool for Automatic Git Commit Message Generation

**Gitzen** is a command-line tool that uses AI to automatically generate concise and well-formatted git commit messages. It integrates with popular AI providers like Google Gemini and supports customizable templates and languages.


![gitzen](./docs/gitzen.png)


---

## 📦 Installation

You can install Gitzen globally using your preferred package manager:

```bash
npm install -g gitzen
# or
pnpm add -g gitzen
# or
yarn global add gitzen
```

Once installed globally, the `gitzen` command will be available anywhere in your system.

### 🔐 API Key Configuration

During the initial setup, Gitzen will prompt you to provide an API key for your chosen AI provider (e.g., Google Gemini). This key must be stored as an environment variable using the following name:

```bash
GITZEN_API_KEY
```

You can:

* Follow the interactive prompt during `gitzen start` to set it up, or
* Add it manually to your shell configuration:

```bash
export GITZEN_API_KEY="your-api-key-here"
```

If you prefer, you can skip this step during setup and provide the key later.

---

## 🚀 Commands

### `gitzen start`

Initializes the configuration for Gitzen. This command will guide you step-by-step to set up your preferred settings.

It creates a configuration file in your project root called `gitzen.config.json`:

```json
{
  "language": "en",
  "template": "commitlint",
  "model": "gemini-2.5-flash",
  "size": "36–50 characters",
  "provider": "google"
}
```

You can customize:

* **language**: Language for your commit messages (`en`, `es`, etc.)
* **template**: Commit style (`commitlint`, `conventional`, etc.)
* **model**: AI model to use (`gemini-2.5-flash`, etc.)
* **size**: Desired character range for commits
* **provider**: AI service provider (`google`, `openai`, etc.)

---

### `gitzen commit`

Generates a commit message using the configured AI model and creates the git commit automatically.

Gitzen analyzes your staged changes and generates a concise message based on your settings.

---

## 🛠️ Configuration File: `gitzen.config.json`

You can edit this file manually at any time to change:

* The output language
* The formatting template
* The AI model
* The provider
* The length of your commit messages

---

## ✅ Example Workflow

```bash
gitzen start        # Set up your preferences
git add .           # Stage your changes
gitzen commit       # Generate and commit with AI
```

---

## 💡 Tips

* You can use Gitzen in any project with git initialized.
* Ideal for teams seeking consistency and clarity in commits.
* Avoids vague or uninformative commit messages.

---

## 📣 Coming Soon

* Support for custom templates
* Multiple model providers
* Inline commit preview before applying

---

Gitzen simplifies and elevates your Git workflow with the power of AI. 🚀
