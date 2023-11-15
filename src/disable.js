//doc_obs.disconnect();
style_node.removeChild(css_node);
//document.body.innerHTML = doc_body;
chrome.runtime.sendMessage({ from: 'toggle', enabled: false });
