var kodi;
var elements;
var storageArea = chrome.storage.local;
storageArea.get(["url", "username", "password"], function(items) {
  kodi = new Kodi(items.url, items.username, items.password);
});

function onPlaySucceed() {
  elements.status.className = "success";
  window.setTimeout(function() {
    elements.status.className = "";
    window.close();
  }, 500);
}

function onPlayFailed() {
  elements.status.className = "failure";
  window.setTimeout(function() { elements.status.className = ""; }, 2000);
}

function play(url) {
  elements.status.className = "working";
  kodi.play(url, function(response) {
    if (response == "OK")
      onPlaySucceed();
    else
      onPlayFailed();
  });
}

function onVideoLinkClick(event) {
  play(event.target.href);
}

function onPlayUrlClick() {
  play(elements.url.value);
}

function onVideoListReceived(videos) {
  var list = document.getElementById("videos");

  for (var i = 0; i < videos.length; i++) {
    var item = document.createElement("li");
    item.className = videos[i].type;
    var anchor = document.createElement("a");
    anchor.href = videos[i].url;
    anchor.innerText = videos[i].title;
    anchor.addEventListener("click", onVideoLinkClick);
    item.appendChild(anchor);
    list.appendChild(item);
  }
}

function onLoad() {
  elements = {
    play: document.getElementById("play"),
    status: document.getElementById("status"),
    url: document.getElementById("url")
  };
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, "get_videos", onVideoListReceived);
  });
  elements.play.addEventListener("click", onPlayUrlClick);
}

window.addEventListener('DOMContentLoaded', onLoad);
