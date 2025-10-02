# YouTube Subscription Copier

A browser-based tool for transferring YouTube subscriptions between Google accounts.

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![OAuth](https://img.shields.io/badge/OAuth-2.0-4285F4?style=flat-square&logo=google&logoColor=white)](https://developers.google.com/identity/protocols/oauth2)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Stars](https://img.shields.io/github/stars/wesellis/APP-YouTube-Subscription-Copier-Account-Transfer-Google-OAuth?style=flat-square)](https://github.com/wesellis/APP-YouTube-Subscription-Copier-Account-Transfer-Google-OAuth/stargazers)
[![Last Commit](https://img.shields.io/github/last-commit/wesellis/APP-YouTube-Subscription-Copier-Account-Transfer-Google-OAuth?style=flat-square)](https://github.com/wesellis/APP-YouTube-Subscription-Copier-Account-Transfer-Google-OAuth/commits)

## Overview

A browser-based tool for transferring YouTube subscriptions from one Google account to another. This is a simple, client-side web application that uses Google OAuth for authentication and the YouTube Data API to copy subscriptions.

## What It Does

- Authenticates with two Google accounts using OAuth 2.0
- Fetches all subscriptions from the source account
- Copies subscriptions to the destination account
- Skips channels already subscribed on the destination account
- Shows real-time progress with success/failure tracking
- All processing happens client-side in your browser

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

1. Open the application in your browser
2. Click **"Choose your old account"**
3. Sign in with the account you want to copy FROM
4. Click **"Choose your new account"**
5. Sign in with the account you want to copy TO
6. Click **"Initiate transfer"**
7. Wait for the transfer to complete

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

- **OAuth 2.0 Security**: No passwords stored or shared
- **Client-Side Processing**: All operations happen in your browser
- **Real-Time Feedback**: See progress as subscriptions transfer
- **Smart Detection**: Skips channels already subscribed
- **Error Tracking**: Shows which subscriptions succeeded or failed

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

## Project Status & Roadmap

**Completion: ~90%**

### What Works
- ✅ Google OAuth 2.0 authentication
- ✅ YouTube Data API integration
- ✅ Subscription fetching from source account
- ✅ Subscription copying to destination account
- ✅ Duplicate detection (skips already subscribed channels)
- ✅ Real-time progress tracking
- ✅ Client-side processing (no external servers)
- ✅ Simple single-page application (index.html + main.js)
- ✅ Bootstrap UI
- ✅ Error handling for API failures

### Known Limitations & Missing Features

**API Quota Issues:**
- ⚠️ **Daily Quota Limit**: YouTube API allows ~80-100 subscriptions per day (50 units each)
- ⚠️ **Large Libraries**: Cannot transfer 500+ subscriptions in one session
- ⚠️ **No Resume**: Must restart from beginning if quota exceeded

**Missing Features:**
- ❌ **Progress Persistence**: Cannot save progress and resume later
- ❌ **Selective Transfer**: Cannot choose specific channels to transfer
- ❌ **Batch Grouping**: No way to transfer subscriptions in organized batches
- ❌ **Offline Cache**: No way to cache subscription list for later transfer
- ❌ **Error Recovery**: Failed subscriptions aren't retried automatically

**Usability:**
- ⚠️ **Manual OAuth Setup**: Requires user to create Google Cloud project and get Client ID
- ⚠️ **No Scheduling**: Cannot schedule transfers to spread across multiple days
- ⚠️ **Limited Feedback**: Basic success/failure messages only

### What Needs Work

1. **Progress Persistence** - Save state to localStorage to resume later
2. **Selective Transfer** - Add checkboxes to choose which channels to copy
3. **Quota Management** - Track quota usage and pause/resume automatically
4. **Batch Processing** - Split large transfers across multiple days
5. **Better Error Handling** - Retry failed subscriptions
6. **Export/Import** - Save subscription list for manual transfer later
7. **Scheduling** - Set up automated multi-day transfers
8. **Better UI** - More visual feedback and progress indicators

### Current Status

This is a **simple, functional tool** that does what it claims: copies YouTube subscriptions between accounts. The main limitation is YouTube's API quota (can only transfer ~80-100 channels per day).

For small subscription lists (under 100), it works perfectly. For large lists (500+), you'll need to run it multiple days in a row, which is tedious without progress persistence.

### Contributing

If you'd like to help improve the tool, contributions are welcome. Priority areas:
1. Adding localStorage progress persistence
2. Implementing selective channel transfer
3. Better quota management
4. UI improvements

---

**Note**: This is a personal project for educational purposes. Use responsibly and respect YouTube's Terms of Service and API usage limits.
