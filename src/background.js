'use strict';

const storage = chrome.storage.local;

const title_apply  = 'Apply Better Text View';
const title_remove = 'Remove Better Text View';

const tabs          = new Set();
const disabled_tabs = new Set();

browser.runtime.onInstalled.addListener(details => {

	if (details.reason === 'install') {

		const defaults = {
			'globalStr': 0,
			'size': 14,
			'sizeThreshold': 18,
			'weight': 400,
			'brightness': 50,
			'contrast': 0,
			'skipColoreds': true,
			'skipWhites': true,
			'forceIInv': true,
			'normalInc': true,
			'normalInc2': false,
			'enableEverywhere': true
		};

		storage.set(defaults);

		browser.tabs.create({ url: 'Welcome.html' });
		return;
	}
});

browser.browserAction.onClicked.addListener(async (tab) => {
	toggle(await browser.browserAction.getTitle({ tabId: tab.id }), tab.id);
});

browser.runtime.onMessage.addListener( async (request, sender, sendResponse) => {

	if (request.from !== 'toggle')
		return;

	let title;
	let path;

	if (request.enabled) {
		title = title_remove;
		path = 'assets/icons/on.png';

		tabs.add(sender.tab.id);
		disabled_tabs.delete(sender.tab.id);
	} else {
		title = title_apply;
		path  = 'assets/icons/off.png';

		tabs.delete(sender.tab.id);
		disabled_tabs.add(sender.tab.id);
	}

	chrome.browserAction.setTitle({ tabId: sender.tab.id, title: title });
	chrome.browserAction.setIcon({ tabId: sender.tab.id, path: path });
});

browser.tabs.onUpdated.addListener((tabId, change_info, tab) => {

	browser.pageAction.show(tab.id);

	if (change_info.status !== 'complete')
		return;

	const url = tab.url;
	let hostname = '';

	if (url.startsWith('file://')) {
		hostname = url;
	} else {
		const matches = url.match(/\/\/(.+?)\//);

		if (matches)
			hostname = matches[1];
	}

	const data = [
		'whitelist',
		'blacklist',
		'enableEverywhere',
	];

	storage.get(data, items => {

		const blacklist = items.blacklist || [];

		if (blacklist.find(o => o.url === hostname)) {
			chrome.browserAction.setIcon({ tabId: tabId, path: 'assets/icons/off.png' });
			chrome.browserAction.setTitle({ title: title_apply, tabId: tabId });
			return;
		}

		const options = {
			file: 'src/enable.js',
			runAt: 'document_end',
			allFrames: true,
			matchAboutBlank: true
		};

		if (items.enableEverywhere && !disabled_tabs.has(tabId)) {
			chrome.tabs.executeScript(tabId, options);
			return;
		}

		const whitelist = items.whitelist || [];

		if (whitelist.find(x => x.url === hostname))
			chrome.tabs.executeScript(tabId, options);
	});
});

browser.commands.onCommand.addListener(async (command) => {


	const tabs = await browser.tabs.query({ currentWindow: true, active: true });
	const id   = tabs[0].id;

	toggle(await browser.browserAction.getTitle({ tabId: id }), id);
});

browser.tabs.onRemoved.addListener(tab => {
	tabs.delete(tab.id);
	disabled_tabs.delete(tab.id);
});

function toggle(title, tab_id)
{
return;
	let new_title = title_remove;
	let file      = 'src/enable.js';
	let icon_path = 'assets/icons/on.png';

        if (title === title_remove) {
                new_title = title_apply;
                file      = 'src/disable.js';
                icon_path = 'assets/icons/off.png';
        }

	chrome.browserAction.setIcon({ tabId: tab_id, path: icon_path });
	chrome.browserAction.setTitle({ title: new_title, tabId: tab_id });
	chrome.tabs.executeScript(tab_id, { allFrames: true, file: file, runAt: 'document_end',matchAboutBlank: true  });
}
