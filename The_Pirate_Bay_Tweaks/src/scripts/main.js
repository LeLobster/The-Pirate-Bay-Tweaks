let userDefined = chrome.storage.local.get(null, function(userPref) {

  console.log('TPB Tweaks Web-Ext: User defined preferences succesfully retrieved.');

    $('td .detDesc').css('color', userPref['detDescColor']);
    $('td .detLink').css('color', userPref['detDescColor']);
    
    if (userPref['highlightGoodTor']) {
        $('#searchResult tbody tr').each(function( index ) {
            var torrentTitle = $(this).find('td .detLink').text().search(
                new RegExp('\\b' + userPref['GoodKeyword'].join('\\b|\\b') + '\\b', 'i'));
            var userName = $(this).find('td .detDesc').text().search(
                new RegExp(userPref['GoodUploader'].join('|')));
            if (userPref['GoodKeyword'].toString() != "" && torrentTitle != -1) {
                $(this).css('background', userPref['GoodHighlightColor']);
            } 
            if (userPref['GoodUploader'].toString() != "" && userName != -1) {
                $(this).css('background', userPref['GoodHighlightColor']);
            }
        });
    }

    if (userPref['includeOther']) {
        $('#searchResult tbody tr').each(function( index ) {
            var torrentTitle = $(this).find('td .detLink').text();
            if (userPref['hideAllOtherInsteadOfHighlight']) {
                $(this).hide();
            } else
                if (userPref['affectOther']) {
                    if (userPref['OtherKeyword'].toString() != "" && torrentTitle.search(
                        new RegExp('\\b' + userPref['OtherKeyword'].join('\\b|\\b') + '\\b', 'i')) != -1) {
                        if (userPref['hideOtherInsteadOfHighlight']) {
                            $(this).hide();
                        } else
                            $(this).css('background', userPref['otherColor']);
                    }
                }
            if (userPref['affectx256']) {
                if (torrentTitle.search(
                    new RegExp(/\bx265\b|\bHEVC\b|\bH265\b|\bH.265\b/ig)) != -1) {
                    if (userPref['hidex265InsteadOfHighlight']) {
                        $(this).hide();
                    } else
                        $(this).css('background', userPref['x256Color']);
                }
            }
            if (userPref['affectNonRetail']) {
                var nonRetailTorrent = torrentTitle.search(
                    new RegExp('\\b' + userPref['NonRetailKeyword'].join('\\b|\\b') + '\\b', 'i'));
                if (userPref['hideNonRetailInsteadOfHighlight']) {
                    if (userPref['NonRetailKeyword'].toString() != "" && nonRetailTorrent != -1) {
                        $(this).hide();
                    }
                } else
                    if (userPref['NonRetailKeyword'].toString() != "" && nonRetailTorrent != -1) {
                        $(this).css('background', userPref['NonRetailColor']);
                    }
            }
        });
    }

    if (userPref['includeUnwanted']) {
        $('#searchResult tbody tr').each(function( index ) {
            var torrentTitle = $(this).find('td .detLink').text();
            if (userPref['affectUnwantedKeyword']) {
                var unwantedTorrent = torrentTitle.search(
                    new RegExp('\\b' + userPref['UnwantedKeyword'].join('\\b|\\b') + '\\b', 'i'));
                if (userPref['UnwantedKeyword'].toString() != "" && userPref['hideUnwantedKeywordInsteadOfHighlight']) {
                    if (unwantedTorrent != -1) {
                        $(this).hide();
                    }
                } else
                    if (userPref['UnwantedKeyword'].toString() != "" && unwantedTorrent != -1) {
                        $(this).css('background', userPref['UnwantedHighlightColor']);
                    }
            }
            var userName = $(this).find('td .detDesc').text();
            if (userPref['affectUnwantedUploader']) {
                var unwantedUser = userName.search(
                    new RegExp(userPref['UnwantedUploader'].join('|')));
                if (userPref['hideUnwantedUploaderInsteadOfHighlight']) {
                    if (userPref['UnwantedUploader'].toString() != "" && unwantedUser != -1) {
                        $(this).hide();
                    }
                } else
                    if (userPref['UnwantedUploader'].toString() != "" && unwantedUser != -1) {
                        $(this).css('background', userPref['UnwantedUserHighlightColor']);
                    }
            }
            if (userPref['hideNonMovies']) {
                $('#searchResult tbody tr td.vertTh').each(function( index ) {
                    var category = $(this).text()
                    if (userPref['nonMovies'].toString() != "" && category.search(
                        new RegExp(userPref['nonMovies'].join('\\b|\\b') + '\\b', 'i')) != -1) {               
                        $(this.parentNode).hide();
                    }
                });
            }
        });
    }

    if (userPref['affectPotentialFakes']) {
        $('#searchResult tbody tr:not(:has(img[title="VIP"],img[title="Trusted"],img[title="Moderator"],\
        img[title="Helper"],td[style="text-align:center;"]))').each(function( index ) {
            var torrentSeeds = Number( $(this).children('td:nth-child(3)').text() );
            warningImg = chrome.extension.getURL("src/warning.png");
            TorrentWarning = {"background-image" : "url(" + warningImg + ")",
                              "background-position" : "95%",
                              "background-size" : "24px",
                              "background-repeat" : "no-repeat",
                              "opacity" : ".5"};
            if (userPref['trustedTorrentsOnly']) {
                $(this).hide();
            } else {
                if (userPref['includeUntrustedTorrentsWithoutComments']) {
                    if ( (torrentSeeds >= userPref['maxSeedsWithoutTrust']) || (
                        $(this).has("img[src='//thepiratebay.org/static/img/icon_comment.gif']").length === 0) )  {
                        if (userPref['dontHideJustHighlightPotentialFakes']) {
                            $(this).children('td:nth-child(2)').css(TorrentWarning);
                        } else
                            $(this).hide();
                    }
                } else {
                    if (torrentSeeds >= userPref['maxSeedsWithoutTrust']) {
                        if (userPref['dontHideJustHighlightPotentialFakes']) {
                            $(this).children('td:nth-child(2)').css(TorrentWarning);
                        } else
                            $(this).hide();
                    }
                }
            }
        });
    }
})