
function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];

    var url = tab.url;

    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

}

function renderStatus(statusText) {
  document.getElementById('status').innerHTML = statusText;
}

function callback_url(url) {
  renderStatus("Ola mundo! pegamos a URL da Tab ativa! <br />URL: " + url); 
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(callback_url);
});