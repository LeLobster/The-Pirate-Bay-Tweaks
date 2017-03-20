var defaultSettings = {
    highlightGoodTor: true,
    GoodHighlightColor: "#60cc60",
    GoodKeyword: [],
    GoodUploader: [],
    includeOther: true,
    hideAllOtherInsteadOfHighlight: false,
    affectx256: true,
    x256Color: "#7585fd",
    hidex265InsteadOfHighlight: false,
    affectOther: true,
    otherColor: "#aad1f3",
    hideOtherInsteadOfHighlight: false,
    OtherKeyword: ["hdrip", "webrip", "web-dl", "WEB"],
    affectNonRetail: true,
    NonRetailColor: "#841d1d",
    hideNonRetailInsteadOfHighlight: true,
    NonRetailKeyword: ["cam", "hdcam", "camrip", "telesync", "ts", "hdts", "hd-ts", "hardcoded", "hc",
                       "hdtc", "dvdscr", "screener", "dvdscreener", "TRUEFRENCH", "dublado", "upscale"],
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
    nonMovies: ["music videos", "movie clips", "3D"],
    affectPotentialFakes: true,
    trustedTorrentsOnly: false,
    maxSeedsWithoutTrust: 999,
    dontHideJustHighlightPotentialFakes: true,
    includeUntrustedTorrentsWithoutComments: false,
    detDescColor: "#1f2223"
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
  console.log('TPB Tweaks Web-Ext: Settings saved!');
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
    console.log('TPB Tweaks Web-Ext: Default settings restored!');
    alert('Default settings restored!');
}

function getOptions() {
    chrome.storage.local.get(null, function(results) {
        for (key in results) {
            element = document.querySelector('#' + key);
            if (element.type === 'checkbox') {
              element.checked = results[element.id]
            } else {
              element.value = results[element.id]
            }
        }
        console.log('TPB Tweaks Web-Ext: Settings loaded!');
        hideOrNotToHide();
    });
}

function hideOrNotToHide() {
    includeOtherCheck = document.getElementById('includeOther');
    includeUnwantedCheck = document.getElementById('includeUnwanted');
    hiddenPelt = document.getElementById('hidden-settings');
    hiddenPelt2 = document.getElementById('hidden-settings2');
    hideThis = document.querySelector('#hideOrNotToHide');
    hideThis2 = document.querySelector('#hideOrNotToHide2');
    if (includeOtherCheck.checked === true) {
        hideThis.style = 'display: unset;'
        hiddenPelt.style = 'display: none;'
        console.log('TPB Tweaks Web-Ext: includeOther section is not hidden.');
    } else {
        hideThis.style = 'display: none;'
        hiddenPelt.style = 'display: block;'
        console.log('TPB Tweaks Web-Ext: includeOther section is hidden.');
    }
    if (includeUnwantedCheck.checked === true) {
        hideThis2.style = 'display: unset;'
        hiddenPelt2.style = 'display: none;'
        console.log('TPB Tweaks Web-Ext: includeUnwanted section is not hidden.');
    } else {
        hideThis2.style = 'display: none;'
        hiddenPelt2.style = 'display: block;'
        console.log('TPB Tweaks Web-Ext: includeUnwanted section is hidden.');
    }
}

document.addEventListener('DOMContentLoaded', getOptions);
document.getElementById('includeOther').addEventListener('change', hideOrNotToHide);
document.getElementById('includeUnwanted').addEventListener('change', hideOrNotToHide);
document.querySelector('#options_form').addEventListener('submit', saveOptions);
document.querySelector('#options_form').addEventListener('change', saveOptions);
document.querySelector('#restore_default').addEventListener('click', restoreDefaults);
document.querySelector('#restore_default').addEventListener('click', saveOptions);
document.querySelector('#restore_default').addEventListener('click', hideOrNotToHide);