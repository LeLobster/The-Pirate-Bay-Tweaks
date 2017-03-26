let userDefined = chrome.storage.local.get(null, function(userPref) {

    document.querySelectorAll('#searchResult tbody tr td a.detLink').forEach(function(elt) {
       elt.style.color = userPref['detDescColor'];
    });

    document.querySelectorAll('#searchResult tbody tr td .detDesc').forEach(function(elt) {
       elt.style.color = userPref['detDescColor'];
    });

    document.styleSheets[0].insertRule('#searchResult tr:hover {filter: brightness(105%);}', 0);
    document.styleSheets[0].insertRule('#searchResult tr:nth-child(even) {filter: invert(2.5%);}', 0);
	
	if (userPref['stretchWidth']) {
	    document.styleSheets[0].insertRule('#main-content {margin-left: 50px !important;}', 0);
	    document.styleSheets[0].insertRule('#main-content {margin-right: 50px !important;}', 0);
    }

    document.querySelectorAll('#searchResult tbody tr').forEach(function(elt) {
        if (elt.childNodes.length != 1) {

            var torrentTitle = elt.children[1].firstElementChild.innerText;
            var userName = elt.children[1].lastElementChild.innerText;
			
            if (userPref['markNewTorrents']) {
                newImg = chrome.extension.getURL("src/new.png");
                trimmedElt = elt.children[1].lastElementChild.innerText.replace(/^((?!day|min).)*$/g, '');
                if (trimmedElt.length != 0) {
                    trimmedAgain = trimmedElt.replace(/^(Uploaded )\b/, '');
                    trimmedThrice = trimmedAgain.replace(/(?=, Size).+/, '');
                    if (trimmedThrice.search(/(Today|Y-day|ago)/) != -1) {
                        elt.children[1].style.backgroundImage = 'url(' + newImg + ')';
                        elt.children[1].style.backgroundRepeat =  'no-repeat';
                        elt.children[1].style.backgroundPosition = '98% 3px';
                        elt.children[1].style.backgroundSize = '40px';
                    }
                }
            }

            if (userPref['highlightGoodTor']) {
                if (userPref['GoodKeyword'].toString() != "" && torrentTitle.search(
                    new RegExp('\\b' + userPref['GoodKeyword'].join('\\b|\\b') + '\\b', 'i')) != -1) {
                    elt.style.backgroundColor = userPref['GoodHighlightColor'];
                }
                if (userPref['GoodUploader'].toString() != "" && userName.search(
                    new RegExp(userPref['GoodUploader'].join('|'))) != -1) {
                    elt.style.backgroundColor = userPref['GoodHighlightColor'];
                }
            }

            if (userPref['includeOther']) {
                if (userPref['hideAllOtherInsteadOfHighlight']) {
                    elt.remove(elt);
                } else {
                    if (userPref['affectOther']) {
                        if (userPref['OtherKeyword'].toString() != "" && torrentTitle.search(
                            new RegExp('\\b' + userPref['OtherKeyword'].join('\\b|\\b') + '\\b', 'i')) != -1) {
                            if (userPref['hideOtherInsteadOfHighlight']) {
                                elt.remove(elt);
                            } else {
                                elt.style.backgroundColor = userPref['otherColor'];
                            }
                        }
                    }
                    if (userPref['affectx256']) {
                        if (torrentTitle.search(
                            new RegExp(/\bx265\b|\bHEVC\b|\bH265\b|\bH.265\b/ig)) != -1) {
                            if (userPref['hidex265InsteadOfHighlight']) {
                                elt.remove(elt);
                            } else {
                                elt.style.backgroundColor = userPref['x256Color'];
                            }
                        }
                    }
                    if (userPref['affectNonRetail']) {
                        nonRetailTorrent = torrentTitle.search(
                            new RegExp('\\b' + userPref['NonRetailKeyword'].join('\\b|\\b') + '\\b', 'i'));
                        if (userPref['hideNonRetailInsteadOfHighlight']) {
                            if (userPref['NonRetailKeyword'].toString() != "" && nonRetailTorrent != -1) {
                                elt.remove(elt);
                            }
                        } else {
                            if (userPref['NonRetailKeyword'].toString() != "" && nonRetailTorrent != -1) {
                                elt.style.backgroundColor = userPref['NonRetailColor'];
                            }
                        }
                    }
                }
            }

            if (userPref['includeUnwanted']) {
                if (userPref['affectUnwantedKeyword']) {
                    unwantedTorrent = torrentTitle.search(
                        new RegExp('\\b' + userPref['UnwantedKeyword'].join('\\b|\\b') + '\\b', 'i'));
                    if (userPref['UnwantedKeyword'].toString() != "" && userPref['hideUnwantedKeywordInsteadOfHighlight']) {
                        if (unwantedTorrent != -1) {
                            elt.remove(elt);
                        }
                    } else {
                        if (userPref['UnwantedKeyword'].toString() != "" && unwantedTorrent != -1) {
                            elt.style.backgroundColor = userPref['UnwantedHighlightColor'];
                        }
                    }
                }

                if (userPref['affectUnwantedUploader']) {
                    unwantedUser = userName.search(
                        new RegExp(userPref['UnwantedUploader'].join('|')));
                    if (userPref['hideUnwantedUploaderInsteadOfHighlight']) {
                        if (userPref['UnwantedUploader'].toString() != "" && unwantedUser != -1) {
                            elt.remove(elt);
                        }
                    } else {
                        if (userPref['UnwantedUploader'].toString() != "" && unwantedUser != -1) {
                            elt.style.backgroundColor = userPref['UnwantedUserHighlightColor'];
                        }
                    }
                }

                if (userPref['hideNonMovies']) {
                    torrentCategory = elt.children[0].innerText;
                    if (userPref['nonMovies'].toString() != "" && torrentCategory.search(
                        new RegExp(userPref['nonMovies'].join('\\b|\\b') + '\\b', 'i')) != -1) {
                        elt.remove(elt);
                    }
                }
            }

            if (userPref['affectPotentialFakes']) {
                torrentSeeds = parseInt(elt.children[2].innerText);
                warningImg = chrome.extension.getURL("src/warning.png");

                function displayWarning() {
                    elt.children[0].style.background = 'url(' + warningImg + ') no-repeat 98% 50%';
                    elt.children[0].style.backgroundSize = '24px';
                    elt.style.opacity = '.65';
                }

                if (elt.children[1].innerHTML.search(
                    new RegExp('(VIP|Trusted|Moderator|Helper|style="text-align:center;")', 'i')) == -1) {
                    if (userPref['trustedTorrentsOnly']) {
                        elt.remove(elt);
                    } else {
                        if (userPref['includeUntrustedTorrentsWithoutComments']) {
                            if (torrentSeeds >= userPref['maxSeedsWithoutTrust']
                                || elt.children[1].innerHTML.search('icon_comment.gif') == -1 ) {
                                if (userPref['dontHideJustHighlightPotentialFakes']) {
                                    displayWarning();
                                } else {
                                    elt.remove(elt);
                                }
                            }
                        } else {
                            if (torrentSeeds >= userPref['maxSeedsWithoutTrust']) {
                                if (userPref['dontHideJustHighlightPotentialFakes']) {
                                    displayWarning();
                                } else {
                                    elt.remove(elt);
                                }
                            }
                        }
                    }
                }
            }
        }
    });
})