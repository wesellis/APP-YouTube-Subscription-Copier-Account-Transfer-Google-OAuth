# YouTube Subscription Copier v2.0

A feature-rich browser-based tool for transferring YouTube subscriptions between Google accounts with **progress persistence**, **quota tracking**, and **selective transfer**.

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![OAuth](https://img.shields.io/badge/OAuth-2.0-4285F4?style=flat-square&logo=google&logoColor=white)](https://developers.google.com/identity/protocols/oauth2)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Stars](https://img.shields.io/github/stars/wesellis/youtube-subscription-copier?style=flat-square)](https://github.com/wesellis/youtube-subscription-copier/stargazers)
[![Last Commit](https://img.shields.io/github/last-commit/wesellis/youtube-subscription-copier?style=flat-square)](https://github.com/wesellis/youtube-subscription-copier/commits)

## Overview

A powerful, privacy-first browser tool for transferring YouTube subscriptions between Google accounts. Built with vanilla JavaScript, this client-side application uses Google OAuth 2.0 and the YouTube Data API to seamlessly copy subscriptions while maintaining full user privacy.

**New in v2.0:** Progress persistence, export/import, quota tracking, selective transfer, auto-retry, and much more!

## What It Does

**Core Functionality:**
- ✅ Authenticates with two Google accounts using OAuth 2.0
- ✅ Fetches all subscriptions from the source account
- ✅ Selectively transfer chosen channels to destination account
- ✅ Automatically skips channels you're already subscribed to
- ✅ Shows real-time progress with visual progress bars
- ✅ All processing happens client-side - your data never leaves your browser

**v2.0 Features:**
- 💾 **Progress Persistence** - Resume transfers after hitting quota limits
- 📥 **Export/Import** - Backup subscriptions to JSON files
- 📊 **Quota Tracking** - Real-time API usage monitoring
- ☑️ **Selective Transfer** - Choose specific channels with checkboxes
- 🔄 **Auto-Retry** - Failed transfers retry automatically (3x with backoff)
- 🎯 **Smart Detection** - Tracks completed transfers, prevents duplicates

## Use Cases

- Migrating to a new Google account
- Consolidating multiple YouTube accounts
- Setting up a new account with existing subscriptions
- Transferring subscriptions after account changes

## How It Works

This is a single-page web application that runs entirely in your browser:

1. You authenticate with your source account (OAuth)
2. The app fetches your subscription list
3. You authenticate with your destination account
4. The app copies subscriptions one by one
5. Results are displayed in real-time

**Note**: All data stays in your browser. Nothing is sent to external servers.

## Setup Instructions

### 1. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Enable the **YouTube Data API v3**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure the OAuth consent screen
6. Choose **Web application** as the application type
7. Add authorized JavaScript origins:
   - `http://localhost`
   - `http://127.0.0.1`
   - Or your hosting domain
8. Copy your **Client ID**

### 2. Configure the Application

1. Clone or download this repository
2. Open `main.js` in a text editor
3. Replace `CLIENT_ID` on line 2 with your OAuth Client ID:
   ```javascript
   const CLIENT_ID = "YOUR_CLIENT_ID_HERE.apps.googleusercontent.com";
   ```

### 3. Run the Application

**Option 1: Local File**
- Open `index.html` directly in your browser
- Some browsers may block OAuth from file:// URLs

**Option 2: Local Server (Recommended)**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (with http-server)
npx http-server -p 8000
```
Then open `http://localhost:8000` in your browser.

**Option 3: GitHub Pages**
- Host the repository on GitHub Pages
- Add your GitHub Pages URL to OAuth authorized origins

## Usage

### Basic Transfer

1. Open the application in your browser
2. Click **"Choose your old account"**
3. Sign in with the account you want to copy FROM
4. (Optional) **Export subscriptions** to JSON for backup
5. **Select channels** you want to transfer (or select all)
6. Click **"Choose your new account"**
7. Sign in with the account you want to copy TO
8. Click **"Initiate transfer"**
9. Monitor progress with the real-time progress bar and quota tracker
10. If any fail, click **"Retry Failed"** to try again

### Import/Export

- **Export**: After fetching your subscriptions, click "Export Subscriptions" to save to JSON
- **Import**: Click "Import Subscriptions" and select a previously exported JSON file
  - This allows you to transfer without re-authenticating or when quota is exhausted

### Resuming After Quota Limits

If you hit the API quota limit:
1. Your progress is automatically saved to browser localStorage
2. Come back tomorrow (quota resets daily)
3. Simply reload the page - your progress will be restored
4. Sign in with your new account again
5. Click "Initiate Transfer" to continue where you left off

## Limitations

### YouTube API Quota

The YouTube Data API has daily quota limits. Each subscription costs quota points:

- **Default quota**: 10,000 units per day
- **Subscribe operation**: ~50 units each
- **Practical limit**: ~80-100 subscriptions per day

If you hit the quota limit, you'll see a 403 error. Wait 24 hours and resume.

### Known Issues

- **401 Error**: Usually means incorrect Client ID in `main.js`
- **403 Error**: YouTube API quota exhausted (try again tomorrow)
- **Rate Limiting**: Large transfers may be slow to avoid throttling
- **Channel Availability**: Some channels may not be transferable

## Features

### Core Features
- **OAuth 2.0 Security**: No passwords stored or shared
- **Client-Side Processing**: All operations happen in your browser
- **Progress Persistence**: Your progress is saved! Resume anytime after quota limits
- **Selective Transfer**: Choose exactly which channels to transfer with checkboxes
- **Export/Import**: Backup subscriptions to JSON and import later

### Smart Features
- **Quota Tracking**: Real-time API quota usage with visual progress bar
- **Auto-Retry**: Failed subscriptions automatically retry with exponential backoff (3 attempts)
- **Smart Detection**: Automatically skips channels you're already subscribed to
- **Duplicate Prevention**: Completed transfers are tracked and won't be retried

### UI/UX
- **Progress Bar**: Real-time visual feedback during transfers
- **Quota Warning**: Get warned at 70% and 90% quota usage
- **Batch Selection**: Select all / deselect all channels with one click
- **Status Badges**: See completion status for each channel
- **Better Errors**: Detailed error messages for easier troubleshooting

## Technical Details

### Stack

- Vanilla JavaScript (ES6)
- Google Identity Services (OAuth 2.0)
- YouTube Data API v3
- Bootstrap 4 for styling

### API Calls

The application makes these YouTube API calls:
- `subscriptions.list` - Fetch subscriptions (both accounts)
- `subscriptions.insert` - Add subscriptions (destination account)

### Browser Compatibility

Works in all modern browsers that support:
- ES6 JavaScript
- Google Identity Services
- Promises and async/await

## Privacy & Security

- **No data storage**: Nothing is saved to servers
- **Client-side only**: All processing in your browser
- **OAuth tokens**: Temporary and never stored
- **Open source**: Code is fully auditable
- **No tracking**: No analytics or third-party scripts

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Check Client ID in `main.js` is correct |
| 403 Forbidden | API quota exceeded, wait 24 hours |
| Subscriptions not transferring | Check destination account authentication |
| OAuth popup blocked | Allow popups in browser settings |
| Transfer incomplete | Resume tomorrow due to quota limits |

## Development

### Project Structure

```
youtube-subscription-copier/
├── index.html          # Main HTML page
├── main.js             # Application logic
├── .gitignore          # Git ignore rules
├── LICENSE             # MIT license
├── README.md           # This file
├── CHANGELOG.md        # Version history
└── CONTRIBUTING.md     # Contribution guidelines
```

### Local Development

1. Clone the repository
2. Add your OAuth Client ID to `main.js`
3. Run a local server
4. Open in browser and test

### Contributing

Contributions are welcome! Please:
- Test your changes thoroughly
- Follow existing code style
- Update documentation as needed
- Submit pull requests with clear descriptions

## Limitations & Disclaimers

- Subject to YouTube API quota limits
- Large subscription lists may take multiple days
- Some channels may be unavailable or restricted
- Requires Google Cloud project setup
- Not affiliated with Google or YouTube

## License

MIT License - See [LICENSE](LICENSE) file for details.

## Acknowledgments

- Google for YouTube Data API
- Bootstrap for UI styling
- Community contributors

---

**Note**: This is a personal project for educational purposes. Use responsibly and respect YouTube's Terms of Service and API usage limits.
