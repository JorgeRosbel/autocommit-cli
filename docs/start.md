## 🚀 Commands

### 📋 Table of Contents

* 🔧 [start](#start)

  * 📌 Description
  * 🧭 Setup Steps
  * 🔐 API Key Configuration
  * ⚙️ Configuration File (`gitzen.config.json`)

    * 🗣️ `language`
    * 🧩 `template`
    * 🧠 `model`
    * 📏 `size`
    * 🛰️ `provider`

---

## 🔧 `start`

### 📌 Description

**Command:** `gitzen start`

Use this command **each time you switch directories** to initialize Gitzen in your new working directory. This is necessary to ensure Gitzen knows where your project is and can use the correct configuration.
⚠️ **Note:** You no longer need to set or configure the API key again after the first setup.

---

### 🧭 Setup Steps

When you run `gitzen start`, the CLI will:

1. Detect the current directory and initialize Gitzen there.
2. If it's your first time, it will guide you through choosing your:

   * **Language**
   * **Commit template**
   * **AI model**
   * **Provider**
3. Automatically create a config file in your project root: `gitzen.config.json`

After the initial setup, future uses of `gitzen start` will not ask for the API key again.

---

### 🔐 API Key Configuration

To use Gitzen with AI providers, you need to set your API key as an environment variable.

#### ✅ One-time setup

During your first `gitzen start`, you will be prompted to enter your API key. After that, it will be stored as an environment variable and reused in future sessions.

#### 🛠️ Manual setup (optional)

If you prefer, you can manually add your API key:

1. Open your terminal and edit your shell config file (e.g., `.bashrc`):

```bash
nano ~/.bashrc
```

2. Add this line (replace `your-api-key`):

```bash
export GITZEN_API_KEY="your-api-key"
```

3. Save and exit (`CTRL+O`, then `CTRL+X`).
4. Apply the changes:

```bash
source ~/.bashrc
```

Once set, your key will be available as the `GITZEN_API_KEY` environment variable.

---

### ⚙️ Configuration File: `gitzen.config.json`

After setup, a config file will be created at the root of your project with default values like:

```json
{
  "language": "en",
  "template": "commitlint",
  "model": "gemini-2.5-flash",
  "size": "36–50 characters",
  "provider": "google"
}
```

You can manually edit this file to customize Gitzen behavior.

#### 🗣️ `language` (`TLang`)

Choose the language for commit message generation:

```ts
'en' | 'es' | 'pt' | 'fr' | 'de' | 'it' | 'zh' | 'ja' | 'ko'
```

#### 🧩 `template` (`TCommitTemplate`)

Select the formatting style of commit messages:

```ts
'commitlint' | 'conventional' | 'angular'
```

#### 🧠 `model` (`TModel`)

Choose the AI model to use:

```ts
'gpt-4.1'
'gpt-4o-2024-08-06'
'gpt-4o-mini'
'gpt-4.1-nano-2025-04-14'
'gpt-4'
'gpt-3.5-turbo'
'gemini-2.5-flash'
'gemini-2.0-flash'
```

Or provide any custom model string.

#### 📏 `size` (`TSize`)

Preferred length for commit messages:

```ts
'16–35 characters'
'36–50 characters'
'51–80 characters'
'81–120 characters'
```

#### 🛰️ `provider` (`TProviders`)

Choose your AI service provider:

```ts
'google' | 'openai' | 'anthropics'
```

---

Once configured, Gitzen will use this setup automatically to generate structured, concise, and consistent commit messages for your project.
