let blockedSites = [];

// Fetch the blocked sites list from the txt file
async function loadBlockedSites() {
  try {
    const response = await fetch(chrome.runtime.getURL('blocked_sites.txt'));
    const text = await response.text();
    blockedSites = text.split('\n')
      .map(line => line.trim().toLowerCase())
      .filter(line => line && !line.startsWith('#'));
    console.log('Loaded blocked sites:', blockedSites);
    updateDynamicRules();
  } catch (error) {
    console.error('Failed to load blocked sites:', error);
  }
}

// Update chrome.declarativeNetRequest rules
function updateDynamicRules() {
  const rules = [];
  const oldRuleIds = [1, 2, 3, 4, 5]; // Extend if needed

  blockedSites.forEach((site, index) => {
    rules.push({
      id: index + 100,
      priority: 1,
      action: {
        type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
        redirect: {
          url: chrome.runtime.getURL('blocked.html')
        }
      },
      condition: {
        urlFilter: `*://*.${site}/*`,
        resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME]
      }
    });
    // Also match without subdomain
    rules.push({
      id: index + 1000,
      priority: 1,
      action: {
        type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
        redirect: {
          url: chrome.runtime.getURL('blocked.html')
        }
      },
      condition: {
        urlFilter: `*://${site}/*`,
        resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME]
      }
    });
  });

  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: oldRuleIds.concat(blockedSites.flatMap((_, i) => [i+100, i+1000])),
    addRules: rules
  }, () => {
    if (chrome.runtime.lastError) {
      console.error('Rule update error:', chrome.runtime.lastError);
    } else {
      console.log('Blocking rules updated');
    }
  });
}

// Listen for tab updates to double-check blocking (in case of client-side redirects)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    const url = new URL(changeInfo.url);
    const hostname = url.hostname.replace(/^www\./, '').toLowerCase();
    
    if (blockedSites.some(site => hostname === site || hostname.endsWith(`.${site}`))) {
      chrome.tabs.update(tabId, { url: chrome.runtime.getURL('blocked.html') });
    }
  }
});

loadBlockedSites();