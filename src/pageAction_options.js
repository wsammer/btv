const storage = chrome.storage.local;

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const url_text = $('#url');
const refreshBtn = $("#refreshBtn");

let url_visible = false;

function init(tabs)
{
	const strSlider       = $("#strSlider");
	const strLabel        = $("#strLabel");

	const sizeSlider      = $("#sizeSlider");
	const sizeLabel       = $("#sizeLabel");

	const thresholdSlider = $("#thresholdSlider");
	const thresholdLabel  = $("#thresholdLabel");

	const brt_slider      = $('#brt-slider');
	const brt_label       = $('#brt-label');
	const con_slider      = $('#con-slider');
	const con_label       = $('#con-label');

	const weight_slider   = $('#weightSlider');
	const weight_label    = $('#weightLabel');

	const WLcheck         = $("#addWL");
	const BLcheck         = $("#addBL");

	const skipColoreds    = $("#skipColoreds");
	const skipHeadings    = $("#skipHeadings");
	const advDimming      = $("#advDimming");
	const input_border    = $("#outline");
	const forcePlhdr      = $("#forcePlhdr");
	const forceIInv       = $("#forceIInv");
	const forceOpacity    = $("#forceOpacity");
	const skipWhites      = $("#skipWhites");
	const makeCaps        = $("#makeCaps");
	const start3          = $("#start3");
	const skipLinks       = $("#skipLinks");
	const customCss       = $("#customCss");
	const customCssText   = $("#customCssText");
	const normalInc       = $("#normalInc");
	const normalInc2      = $("#normalInc2");
	const ssrules         = $("#ssrules");
	const skipNavSection  = $("#skipNavSection");
	const skipHeights     = $("#skipHeights");

	const optionsBtn      = $("#optionsBtn");
	const LightDark       = $("#LightDark");

	let url = tabs[0].url;

	let hostname = '';

	browser.storage.local.get(["lightness"]).then((result) => {
			LightDark.textContent = 'Site lightness = '+result.lightness.toFixed(2);
	});
	browser.storage.local.get(["default_size"]).then((result) => {
		if (result.default_size)
			LightDark.textContent += '  Browser font size = '+result.default_size;
	});

	if (url.startsWith('file://')) {
		hostname = url;
	} else {
		hostname = url.match(/\/\/(.+?)\//)[1];

		if (!url.startsWith('http'))
			showRefreshBtn();
	}

	url_text.innerText = hostname;

	strSlider.oninput = () => { strLabel.innerText = strSlider.value; if (!WLcheck.checked) { WLcheck.click(); } else { WLcheck.click();WLcheck.click(); } }
	sizeSlider.oninput = () => { sizeLabel.innerText = sizeSlider.value; if (!WLcheck.checked) { WLcheck.click(); } else { WLcheck.click();WLcheck.click(); } }
	thresholdSlider.oninput = () => { thresholdLabel.innerText = thresholdSlider.value; if (!WLcheck.checked) { WLcheck.click(); } else { WLcheck.click();WLcheck.click(); } }
	brt_slider.oninput = () => {
		brt_label.innerText = (parseInt(brt_slider.value)+50);
		browser.storage.local.set( { abrightness:  (parseInt(con_slider.value)+100)+'%', acontrast:  (parseInt(brt_slider.value)+50)+'%' } );
		if (!WLcheck.checked) { WLcheck.click(); } else { WLcheck.click();WLcheck.click(); }
	}
	con_slider.oninput = () => {
		con_label.innerText = (parseInt(con_slider.value)+100);
		browser.storage.local.set( { abrightness:  (parseInt(con_slider.value)+100)+'%', acontrast:  (parseInt(brt_slider.value)+50)+'%' } );
		if (!WLcheck.checked) { WLcheck.click(); } else { WLcheck.click();WLcheck.click(); }
	}
	weight_slider.oninput = () => { weight_label.innerText = weight_slider.value; if (!WLcheck.checked) { WLcheck.click(); } else { WLcheck.click();WLcheck.click(); } }
 	customCssText.oninput = () => { if (!WLcheck.checked) { WLcheck.click(); } else { WLcheck.click();WLcheck.click(); } }

	optionsBtn.onclick = () =>  {
		if (chrome.runtime.openOptionsPage)
			chrome.runtime.openOptionsPage();
		else
			window.open(chrome.runtime.getURL('options.html'));
	};

	const settings = [
		"whitelist",
		"blacklist",
		"globalStr",
		"size",
		"sizeThreshold",
		"weight",
		"strength",
		"skipColoreds",
		"skipHeadings",
		"advDimming",
		"brightness",
		"contrast",
		"forcePlhdr",
		"forceIInv",
		"forceOpacity",
		"normalInc",
		"normalInc2",
		"ssrules",
		"skipWhites",
		"makeCaps",
		"start3",
		"skipLinks",
		"skipNavSection",
		"skipHeights",
		"underlineLinks",
		"input_border",
		"customCss",
		"customCssText"
	];

	const start = settings =>
	{
		let whitelist = settings.whitelist || [];
		let blacklist = settings.blacklist || [];

		let item = settings;

		if (blacklist.findIndex(o => o.url === hostname) > -1) {
			BLcheck.checked = true;
		} else {
			const idx = whitelist.findIndex(o => o.url === hostname);

			if (idx > -1) {
				item = whitelist[idx];

				WLcheck.checked = true;
				BLcheck.checked = false;
			}
		}

		strSlider.value          = item.strength || item.globalStr;
		strLabel.innerText       = item.strength || item.globalStr;
		sizeSlider.value         = item.size || 0;
		sizeLabel.innerText      = item.size || 0;
		thresholdSlider.value    = item.threshold || item.sizeThreshold || 0;
		thresholdLabel.innerText = item.threshold || item.sizeThreshold || 0;
		weightSlider.value       = item.weight;
		weightLabel.innerText    = item.weight;
		brt_slider.value         = item.brightness || 50;
		brt_label.innerText      = (parseInt(item.brightness)+50) || 100;
		con_slider.value         = item.contrast || 0;
		con_label.innerText      = (parseInt(item.contrast)+100) || 100;

		skipHeadings.checked     = item.skipHeadings;
		skipColoreds.checked     = item.skipColoreds;
		advDimming.checked       = item.advDimming;
		input_border.checked     = item.input_border;
		forcePlhdr.checked       = item.forcePlhdr;
		forceIInv.checked        = item.forceIInv;
		forceOpacity.checked     = item.forceOpacity;
		skipWhites.checked       = item.skipWhites;
		makeCaps.checked         = item.makeCaps;
		start3.checked           = item.start3;
		skipLinks.checked        = item.skipLinks;
		normalInc.checked        = item.normalInc;
		normalInc2.checked       = item.normalInc2;
		ssrules.checked          = item.ssrules;
		skipNavSection.checked   = item.skipNavSection;
		skipHeights.checked      = item.skipHeights;
		underlineLinks.checked   = item.underlineLinks;
		customCss.checked        = item.customCss;
		customCssText.value      = item.customCssText || '';

		if(!advDimming.checked && !forcePlhdr.checked) {
			$('#brt-div').style.display ='none';
			$('#con-div').style.display ='none';
		}
		if (!forcePlhdr.checked) {
			$('#iinv-div').style.display = 'none';
			$('#norm-div').style.display = 'none';
		}
		if (!start3.checked)
			$('#skiplinks-div').style.display = 'none';
		else
			$('#skiplinks-div').style.display = 'block';
		if (!customCss.checked) {
			$('#custom-text-div').style.display = 'none';
		} else {
			$('#custom-text-div').style.display = 'block';
			$('#customCssText').value = customCssText.value;
		}

		const getOptions = () => {
			const wl_item = {
				url:            hostname,
				strength:       strSlider.value,
				size:           sizeSlider.value,
				threshold:      thresholdSlider.value,
				weight:         weightSlider.value,
				brightness:     brt_slider.value,
				contrast:       con_slider.value,
				skipHeadings:   skipHeadings.checked,
				skipColoreds:   skipColoreds.checked,
				advDimming:     advDimming.checked,
				forcePlhdr:     forcePlhdr.checked,
				forceIInv:      forceIInv.checked,
				forceOpacity:   forceOpacity.checked,
				normalInc:      normalInc.checked,
				normalInc2:     normalInc2.checked,
				ssrules:        ssrules.checked,
				skipWhites:     skipWhites.checked,
				makeCaps:       makeCaps.checked,
				start3:         start3.checked,
				skipLinks:      skipLinks.checked,
				skipNavSection: skipNavSection.checked,
				skipHeights:    skipHeights.checked,
				underlineLinks: underlineLinks.checked,
				input_border:   input_border.checked,
				customCss:      customCss.checked,
				customCssText:  customCssText.value
			}

			return wl_item;
		}

		WLcheck.onclick = () => {
			const is_checked = WLcheck.checked;

			whitelist = updateList(getOptions(), true, is_checked);

			if (is_checked) {
				let idx = blacklist.findIndex(o => o.url === hostname);

				if(idx > -1)
					blacklist = updateList({ url: hostname }, false, false);
			}
		};

		BLcheck.onclick = () => {
			const is_checked = BLcheck.checked;

			blacklist = updateList({ url: hostname }, false, is_checked);

			if (is_checked) {
				const idx = whitelist.findIndex(o => o.url === hostname);

				if(idx > -1)
					whitelist = updateList(getOptions(), true, false);
			}
		};

		$$('.option').forEach(checkbox => {
			checkbox.onclick = () => {
				if (checkbox.id === 'WL') {
					if (WLcheck.checked) {
						WLcheck.checked = false;
					} else {
						WLcheck.checked = true;
					}
					WLcheck.onclick();
					return;
				}
				if (checkbox.id === 'BL') {
					if (BLcheck.checked) {
						BLcheck.checked = false;
					} else {
						BLcheck.checked = true;
					}
					BLcheck.onclick();
					return;
				}
				if (checkbox.id  === 'skiplinks') {
					const skiplinks_div = document.querySelector('#skiplinks-div');

					if (start3.checked)
						skiplinks_div.style.display = 'block';
					else
						skiplinks_div.style.display = 'none';
				}

				if (checkbox.id  === 'custom-div') {
					const customText_div = document.querySelector('#custom-text-div');

					if (customCss.checked) {
						customText_div.style.display = 'block';
						$('#customCssText').value = customCssText.value;

					} else {
						customText_div.style.display = 'none';
					}
				}

				if (checkbox.id  === 'forceRev') {
					const iinv_div = document.querySelector('#iinv-div');
					const norm_div = document.querySelector('#norm-div');
					const brt_div = document.querySelector('#brt-div');
					const con_div = document.querySelector('#con-div');

					if (forcePlhdr.checked) {
						iinv_div.style.display = 'block';
						norm_div.style.display = 'block';
						brt_div.style.display = 'flex';
						con_div.style.display = 'flex';
					} else if (!advDimming.checked && !forcePlhdr.checked) {
						iinv_div.style.display = 'none';
						norm_div.style.display = 'none';
						brt_div.style.display = 'none';
						con_div.style.display = 'none';
					} else if (advDimming.checked) {
						iinv_div.style.display = 'none';
						norm_div.style.display = 'none';
						brt_div.style.display = 'flex';
						con_div.style.display = 'flex';
					}
				}

				if (checkbox.id === 'adv-mode') {
					const brt_div = document.querySelector('#brt-div');
					const con_div = document.querySelector('#con-div');

					if (!advDimming.checked)
						ssrules.checked = false;

					if (advDimming.checked || forcePlhdr.checked) {
						brt_div.style.display = 'flex';
						con_div.style.display = 'flex';
					} else {
						brt_div.style.display = 'none';
						con_div.style.display = 'none';
					}
				}
				whitelist = updateList(getOptions(), true, true);

				if (BLcheck.checked)
					blacklist = updateList({ url: hostname }, false, false);
			}
		});

		const updateList = (item, is_wl, add) => {
			let list;
			let list_name;
			let check;

			if (is_wl) {
				list = whitelist;
				list_name = 'whitelist';
				check = WLcheck;
			} else {
				list = blacklist;
				list_name = 'blacklist';
				check = BLcheck;
			}

			let idx = list.findIndex(o => o.url === item.url);

			if (add) {
				if (idx > -1)
					list[idx] = item;
				else
					list.push(item);

				check.checked = true;
			}
			else if (idx > -1) {
				list.splice(idx, 1);

				check.checked = false;
			}

			storage.set({ [list_name]: list });

			showRefreshBtn();

			return list;
		};
	}

	storage.get(settings, start);
};

chrome.tabs.query({ active: true, currentWindow: true }, init);

function showRefreshBtn()
{
	if (url_visible)
		return;

	url_text.style.opacity = 0;
	url_text.style.zIndex = "2";

	refreshBtn.style.opacity = 1;
	refreshBtn.style.zIndex = "3";
	refreshBtn.style.cursor = "pointer";

	refreshBtn.onclick = () => browser.tabs.reload();

	url_visible = true;
}
