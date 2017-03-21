let userDefined = chrome.storage.local.get(null, function(userPref) {

    document.querySelectorAll('#searchResult tbody tr td a.detLink').forEach(function(elt) {
       elt.style.color = userPref['detDescColor'];
    });
    document.querySelectorAll('#searchResult tbody tr td .detDesc').forEach(function(elt) {
       elt.style.color = userPref['detDescColor'];
    });

    document.querySelectorAll('#searchResult tbody tr').forEach(function(elt) {
        var torrentTitle = elt.children[1].firstElementChild.innerText;
        var userName = elt.children[1].lastElementChild.innerText;

        if (userPref['highlightGoodTor']) {
            if (userPref['GoodKeyword'].toString() != "" && torrentTitle.search(
                new RegExp('\\b' + userPref['GoodKeyword'].join('\\b|\\b') + '\\b', 'i')) != -1) {
                elt.style.background = userPref['GoodHighlightColor'];
            }
            if (userPref['GoodUploader'].toString() != "" && userName.search(
                new RegExp(userPref['GoodUploader'].join('|'))) != -1) {
                elt.style.background = userPref['GoodHighlightColor'];
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
                            elt.style.background = userPref['otherColor'];
                        }
                    }
                }
                if (userPref['affectx256']) {
                    if (torrentTitle.search(
                        new RegExp(/\bx265\b|\bHEVC\b|\bH265\b|\bH.265\b/ig)) != -1) {
                        if (userPref['hidex265InsteadOfHighlight']) {
                            elt.remove(elt);
                        } else {
                            elt.style.background = userPref['x256Color'];
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
                            elt.style.background = userPref['NonRetailColor'];
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
                        elt.style.background = userPref['UnwantedHighlightColor'];
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
                        elt.style.background = userPref['UnwantedUserHighlightColor'];
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
                elt.children[1].style.background = 'url(' + warningImg + ') no-repeat 95%';
                elt.children[1].style.backgroundSize = '26px';
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
    });
})