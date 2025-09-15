# YouTube Subscription Copier
### Seamlessly Copy Your YouTube Subscriptions from One Account to Another

Open YouTube Subscription Copier to use via default keys. However, quota may get exhausted due to API limits, so you can try again the next day (only remaining subscriptions will get transferred) or use your own API keys by following the steps below.

**Steps:**

1. **Create a New Project on Google Cloud:**
   - Go to [Google Cloud Console](http://console.cloud.google.com).
   - Click the project drop-down menu at the top of the page.
   - Click "New Project."
   - Enter a project name and select the appropriate organization and location if necessary.
   - Click "Create" to initialize the new project.

2. **Enable YouTube Data API:**
   - Within the Google Cloud Console, go to the [YouTube Data API page](https://console.cloud.google.com/apis/library/youtube.googleapis.com).
   - Select your new project from the drop-down menu.
   - Click "Enable" to activate the YouTube Data API for the project.

3. **Create a New API Key:**
   - Navigate to the [Credentials page](https://console.cloud.google.com/apis/credentials).
   - Click "Create Credentials" and choose "API key."
   - Copy and securely store the generated API key.

4. **Create an OAuth Consent Screen:**
   - Visit the [OAuth consent screen page](https://console.cloud.google.com/apis/credentials/consent).
   - Select "External" and click "Create."
   - Fill in the required information, including App name, User support email, and Developer contact information.
   - Add your domain under "Authorized domains."
   - Add necessary scopes for your application, such as `https://www.googleapis.com/auth/youtube`.
   - Under "Test users," add the Google accounts you want to test with.
   - Click "Save and Continue."

5. **Create an OAuth Client ID:**
   - Navigate to the [OAuth client ID page](https://console.cloud.google.com/apis/credentials/oauthclient).
   - Click "Create Credentials" and select "OAuth client ID."
   - Choose "Web application" as the application type.
   - Add the following URIs under "Authorized JavaScript origins":
     - `http://localhost:8080`
     - `http://localhost`
   - Add the following URIs under "Authorized redirect URIs":
     - `http://localhost:8080/oauth2callback`
     - `http://localhost/oauth2callback`
   - Click "Create" and copy the generated Client ID.

6. **Clone the Repository:**
   - Open your terminal and run the command to clone the repository:
     ```sh
     git clone https://github.com/wesellis/YouTube-Subscription-Copier.git
     ```

7. **Navigate to the Cloned Directory:**
   - Change your directory to the cloned repository:
     ```sh
     cd YouTube-Subscription-Copier
     ```

8. **Update `main.js` with the New Client ID:**
   - Open `main.js` in a text editor.
   - Find the line where the `CLIENT_ID` is defined and update it with your new Client ID:
     ```javascript
     const CLIENT_ID = 'YOUR_CLIENT_ID_HERE';  // Replace 'YOUR_CLIENT_ID_HERE' with your actual Client ID
     ```

9. **Run a Local Server:**
   - In your terminal, navigate to the directory containing `main.js`.
   - Run the following command to start a local server on port 8080:
     ```sh
     python -m http.server 8080
     ```

10. **Open Application in Browser:**
    - Open your browser and go to `http://localhost:8080`.
    - You will see a warning indicating that the application is in testing. Click "Continue" to proceed.
    - Follow the on-screen instructions to authenticate and copy your subscriptions.

**Usage:**

- **Choose Old Account**: Click the "Choose your old account" button to authenticate and fetch subscriptions from your old YouTube account.
- **Fetch Subscriptions**: The tool fetches your current subscriptions and displays a notification once completed.
- **Choose New Account**: After fetching subscriptions, you'll be prompted to choose your new YouTube account.
- **Copy Subscriptions**: The tool will copy up to 80 subscriptions to your new account. If you have more than 80 subscriptions, repeat this step daily until all subscriptions are copied.
- **Testing Mode**: During the process, you may see a warning indicating that the app is in testing. Simply click "Continue" to proceed.

By following these steps, you will be able to configure your Google Cloud project, set up OAuth, and run your YouTube Subscription Copier application efficiently.
