var defaultSettings = {
    highlightGoodTor: true,
    GoodHighlightColor: "#60cc60",
    GoodKeyword: [],
    GoodUploader: [],
    includeOther: true,
    affectx256: true,
    x256Color: "#7585fd",
    hidex265InsteadOfHighlight: false,
    affectOther: true,
    otherColor: "#aad1f3",
    hideOtherInsteadOfHighlight: false,
    OtherKeyword: ["hdrip", "webrip", "web-dl", "WEB", "hdtv"],
    affectNonRetail: true,
    NonRetailColor: "#841d1d",
    hideNonRetailInsteadOfHighlight: true,
    NonRetailKeyword: ["cam", "hdcam", "camrip", "telesync", "ts", "hdts", "hd-ts",
                       "hardcoded", "hc", "hdtc", "dvdscr", "screener", "dvdscreener",
                       "TRUEFRENCH", "dublado", "upscale", "korsub"],
    includeUnwanted: true,
    affectUnwantedKeyword: true,
    UnwantedHighlightColor: "#d73838",
    hideUnwantedKeywordInsteadOfHighlight: false,
    UnwantedKeyword: [],
    affectUnwantedUploader: true,
    UnwantedUserHighlightColor: "#d73838",
    hideUnwantedUploaderInsteadOfHighlight: true,
    UnwantedUploader: [],
    hideNonMovies: false,
    nonMovies: ["music videos", "movie clips", "3D", "porn"],
    affectPotentialFakes: true,
    trustedTorrentsOnly: false,
    maxSeedsWithoutTrust: 999,
    dontHideJustHighlightPotentialFakes: true,
    includeUntrustedTorrentsWithoutComments: false,
    markNewTorrents: false,
    stretchWidth: true,
    detDescColor: "#1f2223",
    displaySearch: false,
    showSubscene: false,
    showYoutube: false,
    showIMDb: false
}

function saveOptions(e) {
    all_forms = document.querySelectorAll('#options_form label *');
    for (i = 0; i < all_forms.length; i++) {
        if (all_forms[i].type === 'checkbox') {
            id = all_forms[i].id;
            state = document.querySelector('#' + id).checked;
            setting = chrome.storage.local.set({ [all_forms[i].id]: state });
        } else if (all_forms[i].type === 'color') {
            id = all_forms[i].id;
            state = document.querySelector('#' + id).value;
            setting = chrome.storage.local.set({ [all_forms[i].id]: state });
        } else if (all_forms[i].type === 'text') {
            id = all_forms[i].id;
            state = document.querySelector('#' + id).value.split(',');
            setting = chrome.storage.local.set({ [all_forms[i].id]: state });
        } else if (all_forms[i].type === 'number') {
            id = all_forms[i].id;
            state = parseInt(document.querySelector('#' + id).value);
            setting = chrome.storage.local.set({ [all_forms[i].id]: state });
        }
    }
  e.preventDefault();
}

function restoreDefaults() {
    for (key in defaultSettings) {
        element = document.querySelector('#' + key);
        if (element.type === 'checkbox') {
            element.checked = defaultSettings[element.id]
        } else {
            element.value = defaultSettings[element.id]
        }
    }
    alert('Default settings restored!');
}

function getOptions() {
    chrome.storage.local.get(null, function(results) {
        for (key in results) {
            element = document.querySelector('#' + key);
            if (element == null) {
				continue;
			} else if (element.type === 'checkbox') {
              element.checked = results[element.id]
            } else {
              element.value = results[element.id]
            }
        }
        hideOrNotToHide1();
        hideOrNotToHide2();
        hideOrNotToHide3();
    });
}

function hideOrNotToHide1() {
    includeOtherCheck = document.getElementById('includeOther');
    hiddenPelt = document.getElementById('hidden-settings');
    hideThis = document.querySelector('#hideOrNotToHide');

    if (includeOtherCheck.checked == true) {
        hideThis.style = 'display: unset;'
        hiddenPelt.style = 'display: none;'
    } else {
        hideThis.style = 'display: none;'
        hiddenPelt.style = 'display: block;'
    }
}
function hideOrNotToHide2() {
    includeUnwantedCheck = document.getElementById('includeUnwanted');
    hiddenPelt2 = document.getElementById('hidden-settings2');
    hideThis2 = document.querySelector('#hideOrNotToHide2');

    if (includeUnwantedCheck.checked == true) {
        hideThis2.style = 'display: unset;'
        hiddenPelt2.style = 'display: none;'
    } else {
        hideThis2.style = 'display: none;'
        hiddenPelt2.style = 'display: block;'
    }
}

function hideOrNotToHide3() {
    displaySearchCheck = document.getElementById('displaySearch');
    hiddenPelt3 = document.getElementById('hidden-settings3');
    hiddenPelt4 = document.getElementById('hidden-settings4');
    hideThis3 = document.querySelector('#hideOrNotToHide3');

    if (displaySearchCheck.checked == true) {
        hideThis3.style = 'display: unset;'
        hiddenPelt3.style = 'display: block;'
        hiddenPelt4.style = 'display: none;'
    } else {
        hideThis3.style = 'display: none;'
        hiddenPelt3.style = 'display: none;'
        hiddenPelt4.style = 'display: block;'
    }
}

function checkChecked() {
    checkBoxes = document.querySelectorAll('#hideOrNotToHide3 .input_label *');
    totalChecked = 0;
    for (i = 0; i < checkBoxes.length; i++) {
        if (checkBoxes[i].checked == true) {
            totalChecked++;
        }
    }
    if (totalChecked == 0) {
        document.getElementById('displaySearch').checked = false;
		hideOrNotToHide3();		
    }
}

function setCheck() {
    searchCheck = document.getElementById('displaySearch');
	checkBoxes = document.querySelectorAll('#hideOrNotToHide3 .input_label *'); 
	
	if (searchCheck.checked == true) {
	    checkBoxes.forEach(function(check){
            check.checked = true;
        });	
	} else {
		checkBoxes.forEach(function(check){
            check.checked = false;
        });	
	}
}

checkBoxes = document.querySelectorAll('#hideOrNotToHide3 .input_label');
for (i = 0; i < checkBoxes.length; i++) {
	checkBoxes[i].addEventListener('change', checkChecked)
}
document.addEventListener('DOMContentLoaded', getOptions);

document.getElementById('includeOther').addEventListener('change', hideOrNotToHide1);
document.getElementById('includeUnwanted').addEventListener('change', hideOrNotToHide2);

document.getElementById('displaySearch').addEventListener('change', hideOrNotToHide3);
document.getElementById('displaySearch').addEventListener('change', setCheck);

document.querySelector('#options_form').addEventListener('change', saveOptions);

document.querySelector('#restore_default').addEventListener('click', restoreDefaults);
document.querySelector('#restore_default').addEventListener('click', checkChecked);
document.querySelector('#restore_default').addEventListener('click', hideOrNotToHide1);
document.querySelector('#restore_default').addEventListener('click', hideOrNotToHide2);
// document.querySelector('#restore_default').addEventListener('click', hideOrNotToHide3);
document.querySelector('#restore_default').addEventListener('click', saveOptions);