const CLIENT_ID = "CLIENT_ID";
let tokenClient;

// DOM Elements
const signinOldAccount = document.getElementById("signin-old");
const signinNewAccount = document.getElementById("signin-new");
const notifications = document.getElementById("notifications");
const transfer = document.getElementById("transfer");
const oldData = document.getElementById("old-data");
const completed = document.getElementById("completed");
const remaining = document.getElementById("remaining");
const already = document.getElementById("already");
const stats = document.getElementById("stats");
const exportBtn = document.getElementById("export-subs");
const importBtn = document.getElementById("import-subs");
const importFile = document.getElementById("import-file");
const retryBtn = document.getElementById("retry-failed");
const selectAllBtn = document.getElementById("select-all");
const deselectAllBtn = document.getElementById("deselect-all");
const channelList = document.getElementById("channel-list");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");
const quotaDisplay = document.getElementById("quota-display");
const quotaBar = document.getElementById("quota-bar");

// Polyfill for older browsers
if (!Promise.allSettled) {
  Promise.allSettled = function (promises) {
    return Promise.all(
      promises.map((p) =>
        Promise.resolve(p).then(
          (value) => ({ state: "fulfilled", value }),
          (reason) => ({ state: "rejected", reason })
        )
      )
    );
  };
}

// User data structure
const USER_DATA = {
  oldSubscriptions: {},
  currentSubscriptions: {},
  alreadyInAccount: {},
  completedTransfers: {},
  failedTransfers: {},
  newSubscriptionsCount: 0,
  quotaUsed: 0,
  maxQuota: 10000,
};

// LocalStorage keys
const STORAGE_KEYS = {
  OLD_SUBS: "yt_old_subscriptions",
  CURRENT_SUBS: "yt_current_subscriptions",
  COMPLETED: "yt_completed_transfers",
  FAILED: "yt_failed_transfers",
  QUOTA: "yt_quota_used",
  QUOTA_RESET: "yt_quota_reset_date",
};

// Quota costs (YouTube API units)
const QUOTA_COSTS = {
  LIST: 1,
  INSERT: 50,
};

// Utility Functions
const notify = (msg, type = "info") => {
  notifications.textContent = msg;
  notifications.className = `alert alert-${type} mt-3`;
};

const updateProgress = (current, total) => {
  const percent = Math.round((current / total) * 100);
  progressBar.style.width = `${percent}%`;
  progressBar.setAttribute("aria-valuenow", percent);
  progressText.textContent = `${current} / ${total} (${percent}%)`;
};

const updateQuota = (cost) => {
  USER_DATA.quotaUsed += cost;
  saveToStorage(STORAGE_KEYS.QUOTA, USER_DATA.quotaUsed);

  const percent = Math.round((USER_DATA.quotaUsed / USER_DATA.maxQuota) * 100);
  quotaBar.style.width = `${percent}%`;
  quotaBar.setAttribute("aria-valuenow", percent);

  let quotaClass = "bg-success";
  if (percent >= 90) quotaClass = "bg-danger";
  else if (percent >= 70) quotaClass = "bg-warning";

  quotaBar.className = `progress-bar ${quotaClass}`;
  quotaDisplay.textContent = `API Quota: ${USER_DATA.quotaUsed} / ${USER_DATA.maxQuota} units (${percent}%)`;

  if (percent >= 90) {
    notify("⚠️ Approaching quota limit! Consider pausing and resuming tomorrow.", "warning");
  }
};

const checkQuotaReset = () => {
  const resetDate = loadFromStorage(STORAGE_KEYS.QUOTA_RESET);
  const today = new Date().toDateString();

  if (resetDate !== today) {
    // Reset quota on new day
    USER_DATA.quotaUsed = 0;
    saveToStorage(STORAGE_KEYS.QUOTA, 0);
    saveToStorage(STORAGE_KEYS.QUOTA_RESET, today);
  } else {
    // Load existing quota
    USER_DATA.quotaUsed = loadFromStorage(STORAGE_KEYS.QUOTA) || 0;
  }
  updateQuota(0);
};

// LocalStorage helpers
const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save to localStorage:", e);
  }
};

const loadFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error("Failed to load from localStorage:", e);
    return null;
  }
};

const clearStorage = () => {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  notify("Progress cleared!", "success");
};

// Export subscriptions to JSON file
const exportSubscriptions = () => {
  const data = {
    oldSubscriptions: USER_DATA.oldSubscriptions,
    exportDate: new Date().toISOString(),
    totalCount: Object.keys(USER_DATA.oldSubscriptions).length,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `youtube-subscriptions-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  notify("✅ Subscriptions exported successfully!", "success");
};

// Import subscriptions from JSON file
const importSubscriptions = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      USER_DATA.oldSubscriptions = data.oldSubscriptions || {};
      saveToStorage(STORAGE_KEYS.OLD_SUBS, USER_DATA.oldSubscriptions);

      oldData.textContent = `| ${Object.keys(USER_DATA.oldSubscriptions).length} subscriptions (imported) |`;
      renderChannelList();
      signinNewAccount.classList.remove("d-none");

      notify(`✅ Imported ${Object.keys(USER_DATA.oldSubscriptions).length} subscriptions!`, "success");
    } catch (err) {
      notify("❌ Failed to import file. Invalid format.", "danger");
    }
  };
  reader.readAsText(file);
};

// Render channel list with checkboxes
const renderChannelList = () => {
  channelList.innerHTML = "";
  const completedIds = Object.keys(USER_DATA.completedTransfers);
  const currentIds = Object.keys(USER_DATA.currentSubscriptions);

  for (let [id, name] of Object.entries(USER_DATA.oldSubscriptions)) {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";

    const isCompleted = completedIds.includes(id);
    const alreadyExists = currentIds.includes(id);

    let badge = "";
    let disabled = false;

    if (isCompleted) {
      badge = '<span class="badge badge-success">✓ Completed</span>';
      disabled = true;
    } else if (alreadyExists) {
      badge = '<span class="badge badge-info">Already subscribed</span>';
      disabled = true;
    }

    li.innerHTML = `
      <div class="form-check">
        <input class="form-check-input channel-checkbox" type="checkbox"
               value="${id}" id="ch-${id}" ${disabled ? "" : "checked"} ${disabled ? "disabled" : ""}>
        <label class="form-check-label" for="ch-${id}">${name}</label>
      </div>
      ${badge}
    `;

    channelList.appendChild(li);
  }

  document.getElementById("channel-selection").classList.remove("d-none");
};

// Select/Deselect all channels
selectAllBtn.onclick = () => {
  document.querySelectorAll(".channel-checkbox:not(:disabled)").forEach((cb) => {
    cb.checked = true;
  });
};

deselectAllBtn.onclick = () => {
  document.querySelectorAll(".channel-checkbox:not(:disabled)").forEach((cb) => {
    cb.checked = false;
  });
};

// Google API initialization
function gapiInit() {
  gapi.client.init({}).then(function () {
    gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest");
  });
}

function gapiLoad() {
  gapi.load("client", gapiInit);
}

function gisInit() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: "https://www.googleapis.com/auth/youtube",
    callback: "",
  });

  // Check quota reset and load saved progress
  checkQuotaReset();
  loadSavedProgress();
}

// Load saved progress from localStorage
const loadSavedProgress = () => {
  const oldSubs = loadFromStorage(STORAGE_KEYS.OLD_SUBS);
  const completed = loadFromStorage(STORAGE_KEYS.COMPLETED);
  const failed = loadFromStorage(STORAGE_KEYS.FAILED);

  if (oldSubs) {
    USER_DATA.oldSubscriptions = oldSubs;
    oldData.textContent = `| ${Object.keys(oldSubs).length} subscriptions (restored) |`;
    signinNewAccount.classList.remove("d-none");
  }

  if (completed) USER_DATA.completedTransfers = completed;
  if (failed) USER_DATA.failedTransfers = failed;

  if (oldSubs && (completed || failed)) {
    notify("📥 Previous progress restored! Sign in to continue.", "info");
  }
};

// Get subscriptions with retry logic
const getSubscriptions = async (type, pageToken = null, callback = () => {}) => {
  notify(`Fetching your ${type} subscriptions...`, "info");

  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const userData = type === "old" ? USER_DATA.oldSubscriptions : USER_DATA.currentSubscriptions;

      const response = await gapi.client.youtube.subscriptions.list({
        part: "snippet",
        mine: true,
        maxResults: 50,
        pageToken: pageToken || undefined,
        order: "alphabetical",
      });

      updateQuota(QUOTA_COSTS.LIST);

      response.result.items.forEach((element) => {
        userData[element.snippet.resourceId.channelId] = element.snippet.title;
      });

      const nextPage = response.result.nextPageToken;
      if (nextPage) {
        await getSubscriptions(type, nextPage, callback);
      } else {
        notify(`✅ ${Object.keys(userData).length} ${type} subscriptions fetched successfully!`, "success");
        saveToStorage(type === "old" ? STORAGE_KEYS.OLD_SUBS : STORAGE_KEYS.CURRENT_SUBS, userData);
      }

      callback();
      return;

    } catch (err) {
      retries++;
      console.error(`Error fetching subscriptions (attempt ${retries}):`, err);

      if (retries >= maxRetries) {
        const errorMsg = err.result?.error?.errors?.[0]?.reason || "Unknown error";
        throw new Error(errorMsg);
      }

      // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, 1000 * retries));
    }
  }
};

// Transfer subscriptions with retry logic
const transferSubscriptions = async (selectedChannels = null) => {
  notify("🚀 Starting transfer...", "info");

  const channelsToTransfer = selectedChannels || Object.keys(USER_DATA.oldSubscriptions);
  const results = [];
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < channelsToTransfer.length; i++) {
    const id = channelsToTransfer[i];
    const name = USER_DATA.oldSubscriptions[id];

    // Skip if already completed or already in account
    if (USER_DATA.completedTransfers[id] || USER_DATA.currentSubscriptions[id]) {
      continue;
    }

    updateProgress(i + 1, channelsToTransfer.length);

    const result = await subscribeToChannel(id, name);
    results.push(result);

    if (result.status === "fulfilled") {
      successCount++;
      USER_DATA.completedTransfers[id] = name;
      saveToStorage(STORAGE_KEYS.COMPLETED, USER_DATA.completedTransfers);
    } else {
      failCount++;
      USER_DATA.failedTransfers[id] = name;
      saveToStorage(STORAGE_KEYS.FAILED, USER_DATA.failedTransfers);
    }

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  return results;
};

// Subscribe to a single channel with retry logic
const subscribeToChannel = async (channelId, channelName, retries = 3) => {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      await gapi.client.youtube.subscriptions.insert({
        part: "snippet",
        resource: {
          snippet: {
            resourceId: {
              kind: "youtube#channel",
              channelId: channelId,
            },
          },
        },
      });

      updateQuota(QUOTA_COSTS.INSERT);
      return { status: "fulfilled", value: { id: channelId, name: channelName } };

    } catch (err) {
      console.error(`Failed to subscribe to ${channelName} (attempt ${attempt + 1}):`, err);

      if (attempt === retries - 1) {
        return { status: "rejected", reason: { id: channelId, name: channelName, error: err } };
      }

      // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }
};

// Event Handlers
signinOldAccount.onclick = async () => {
  tokenClient.callback = (resp) => {
    if (resp.error !== undefined) {
      notify(`❌ Authentication error: ${resp.error}`, "danger");
      return;
    }

    signinOldAccount.remove();
    getSubscriptions("old", null, () => {
      oldData.textContent = `| ${Object.keys(USER_DATA.oldSubscriptions).length} subscriptions |`;
      renderChannelList();
      signinNewAccount.classList.remove("d-none");
      exportBtn.classList.remove("d-none");
    });
  };
  tokenClient.requestAccessToken();
};

signinNewAccount.onclick = async () => {
  tokenClient.callback = (resp) => {
    if (resp.error !== undefined) {
      notify(`❌ Authentication error: ${resp.error}`, "danger");
      return;
    }

    signinNewAccount.remove();
    getSubscriptions("current", null, () => {
      // Update channel list to show already subscribed
      renderChannelList();
      transfer.classList.remove("d-none");
      document.getElementById("progress-container").classList.remove("d-none");
    });
  };
  tokenClient.requestAccessToken();
};

const addSubscriptionToDom = (name, el, className = "") => {
  const li = document.createElement("li");
  li.className = `list-group-item ${className}`;
  li.textContent = name;
  el.appendChild(li);
};

transfer.onclick = async () => {
  try {
    // Get selected channels
    const selectedCheckboxes = document.querySelectorAll(".channel-checkbox:checked");
    const selectedChannels = Array.from(selectedCheckboxes).map((cb) => cb.value);

    if (selectedChannels.length === 0) {
      notify("⚠️ Please select at least one channel to transfer.", "warning");
      return;
    }

    transfer.disabled = true;
    transfer.textContent = "Transferring...";

    const results = await transferSubscriptions(selectedChannels);

    // Display results
    completed.innerHTML = "";
    remaining.innerHTML = "";
    already.innerHTML = "";

    Object.values(USER_DATA.completedTransfers).forEach((name) => {
      addSubscriptionToDom(name, completed, "list-group-item-success");
    });

    Object.values(USER_DATA.failedTransfers).forEach((name) => {
      addSubscriptionToDom(name, remaining, "list-group-item-danger");
    });

    Object.entries(USER_DATA.oldSubscriptions)
      .filter(([id]) => USER_DATA.currentSubscriptions[id])
      .forEach(([id, name]) => addSubscriptionToDom(name, already, "list-group-item-info"));

    stats.classList.remove("d-none");
    stats.classList.add("d-flex");

    const successCount = Object.keys(USER_DATA.completedTransfers).length;
    const failCount = Object.keys(USER_DATA.failedTransfers).length;

    if (failCount === 0) {
      notify(`🎉 Transfer complete! Successfully transferred ${successCount} subscriptions.`, "success");
      transfer.remove();
    } else {
      notify(
        `⚠️ Transfer partially complete. ${successCount} succeeded, ${failCount} failed. You may have hit quota limits.`,
        "warning"
      );
      retryBtn.classList.remove("d-none");
      transfer.textContent = "Initiate Transfer";
      transfer.disabled = false;
    }

  } catch (err) {
    notify(`❌ Error: ${err.message}`, "danger");
    transfer.disabled = false;
    transfer.textContent = "Initiate Transfer";
  }
};

// Retry failed subscriptions
retryBtn.onclick = async () => {
  const failedIds = Object.keys(USER_DATA.failedTransfers);

  if (failedIds.length === 0) {
    notify("✅ No failed subscriptions to retry!", "success");
    return;
  }

  notify(`🔄 Retrying ${failedIds.length} failed subscriptions...`, "info");
  retryBtn.disabled = true;

  // Clear failed transfers to retry
  USER_DATA.failedTransfers = {};
  saveToStorage(STORAGE_KEYS.FAILED, {});

  await transferSubscriptions(failedIds);

  retryBtn.disabled = false;

  const remainingFailed = Object.keys(USER_DATA.failedTransfers).length;
  if (remainingFailed === 0) {
    notify("🎉 All subscriptions transferred successfully!", "success");
    retryBtn.remove();
  }
};

// Export button
exportBtn.onclick = exportSubscriptions;

// Import button
importBtn.onclick = () => importFile.click();
importFile.onchange = importSubscriptions;
