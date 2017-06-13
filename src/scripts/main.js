let userDefined = chrome.storage.local.get(null, function(userPref) {

    document.querySelectorAll('#searchResult tbody tr td a.detLink').forEach(function(elt) {
       elt.style.color = userPref['detDescColor'];
    });

    document.querySelectorAll('#searchResult tbody tr td .detDesc').forEach(function(elt) {
       elt.style.color = userPref['detDescColor'];
    });

    document.styleSheets[0].insertRule('table#searchResult td { border-width: 0px !important; }', 0);
    document.styleSheets[0].insertRule('#searchResult tr:hover { filter: brightness(105%); }', 0);
    document.styleSheets[0].insertRule('#searchResult tr:nth-child(even) { filter: invert(2.5%); }', 0);
    document.styleSheets[0].insertRule('table#searchResult td.vertTh { width: 15% !important; }', 0);
    
    if (userPref['stretchWidth']) {
        document.styleSheets[0].insertRule('#main-content { margin-left: 50px !important; }', 0);
        document.styleSheets[0].insertRule('#main-content { margin-right: 50px !important; }', 0);
    }

    if (userPref['inlineView']) {

        function buildA(elt) {
            newA = document.createElement('a');
            newA.className = 'toggleA';
            newA.href = '#';
            newA.innerText = '(+)';
            newA.style.marginLeft = '5px';
            newA.title = 'Click to display details';
            elt.children[1].insertBefore(newA, elt.children[1].lastChild);
            elt.children[1].lastElementChild.addEventListener('click', function(e) {
                e.preventDefault();
                setFrame(elt);
            });
        }
        
        // Doing this because when there's no <tr> after the last torrent
        // either on top 100's or 1 page search results
        // the setFrame function doesn't work without this... I'm not sure why.
        // According to https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore
        // If "elt.nextSibling" does not have a next sibling, it returns null, (<- is correct)
        // and "insertThis" is inserted at the end of the child node list (<- doesn't happen)
        newTr = document.createElement('tr');
        lastTr = document.querySelector('tbody').lastElementChild;
        document.querySelector('tbody').insertBefore(newTr, lastTr.nextSibling);
        
        function setFrame(elt) {
            if (elt.nextElementSibling.className != 'frameDiv') {
                elt.children[1].lastElementChild.innerText = '(-)';
                elt.children[1].lastElementChild.title = 'Click to hide details';
                
                newDiv = document.createElement('div');
                newDiv.className = 'frameDiv';
                newDiv.style.cssText = 'display: block;width: 662%;height: 300px;padding-bottom: 7px';

                newFrame = document.createElement('iframe');
                newFrame.className = 'actualFrame';
                torLink = elt.children[1].firstElementChild.firstElementChild.href;
                newFrame.sandbox = '';
                newFrame.src = torLink + ' #detailsouterframe';

                if (elt.style.backgroundColor != "") {
                    borderColor = elt.style.backgroundColor;
                } else {
                    borderColor = '#f3EEEC';
                }

                newFrame.style.cssText = 'height: 100%;width: 100%;border: 4px solid ' + borderColor;

                tBody = elt.parentNode;
                insertThis = newDiv.appendChild(newFrame);
                tBody.insertBefore(insertThis.parentNode, elt.nextSibling);

            } else {
                elt.children[1].lastElementChild.innerText = '(+)';
                elt.children[1].lastElementChild.title = 'Click to display details';
                elt.nextElementSibling.remove(elt);
            }
        }
    }

    if (userPref['displaySearch']) {
        dupeThis = document.getElementsByClassName('header');
        clone = dupeThis[0].lastElementChild.cloneNode();
        dupeThis[0].append(clone);
        dupeThis[0].lastElementChild.innerText = 'Search';
        dupeThis[0].lastElementChild.title = 'Search on other websites';
		
		iconsActive = [userPref['showSubscene'], userPref['showYoutube'], userPref['showIMDb'], userPref['showLetterboxd']];
		iconCount = 0
		iconsActive.forEach( function(i) {
			if (i == true) {
				iconCount++
			}
		});
		
        if (iconCount == 3) {
            dupeThis[0].lastElementChild.style = 'width: 7%;';
		} else if (iconCount > 3) {
			dupeThis[0].lastElementChild.style = 'width: 8%;';
		} else {
            dupeThis[0].lastElementChild.style = 'width: 5%;';
        }
		
        document.styleSheets[0].insertRule('#searchIconsTd { display: table; }', 0);
        document.styleSheets[0].insertRule('#searchIconsTd { margin: 13px auto 0px; }', 0);
        document.styleSheets[0].insertRule('#searchIconsTd { padding: 0px !important; }', 0);
        document.styleSheets[0].insertRule('#searchIconsTd { border: none !important; }', 0);

        function createIcon(cont, title, href, icon) {
            a = document.createElement('a');
            a.href = href;
            a.title = title;
            a.setAttribute('target','_blank');
			a.setAttribute('rel', 'noreferrer');
            a.style = 'font-size: 0px;';

            img = document.createElement('img');
            img.src = icon;
            img.setAttribute('height','16');
            img.setAttribute('witdh','16');

            a.appendChild(img);
            cont.appendChild(a);
        }

        function buildIcons(elt) {
            div = elt.insertBefore(document.createElement('div'), elt.lastChild);
            div.id = 'iconDiv';
            torrentCategory = elt.children[0].innerText;

            if (torrentCategory.search(/tv shows|movies|3d/i) != -1 && torrentCategory.search(/porn/i) == -1) {
                fullReleaseName = elt.children[1].firstElementChild.innerText;
                trimmedReleaseName = fullReleaseName.replace(/(?:\()(\d{4})(.*)(?:\))/g, '$1');
                trimmedReleaseName = trimmedReleaseName.replace(/(\()(\D*)(\))|(\[)(\D*)(\])|(\{)(\D*)(\})/, '');

                titleFilter = ['[012678]{3,4}[p|i]{1}.*','bluray','[bdrdvh]{2,3}rip','dvd-rip','mp4','mkv','avi','aac','ac3',
                'xvid','divx','(h\\.|h|x)26(4|5).*','hevc','web(rip|dl|-dl)','(hd|tv)\\S?(tv|rip).*','extras','5\\.1','4K.*',
                '(the)?(\\s|\\.)*(un(cut|rated|censored)|restored|extended|widescreen|director\\S?s)(\\s|\\.)*(version|cut)?'];
                
                trimmedReleaseName = trimmedReleaseName.replace(new RegExp(titleFilter.join('|'),'ig'), ' ');
                trimmedReleaseName = trimmedReleaseName.replace(/(duology|trilogy)/i, ' ')
                trimmedReleaseName = trimmedReleaseName.replace(/\[[\D]+$/ig, '');

                if (torrentCategory.search(/tv shows/i) != -1) {

                    tvFilter = ['(s\\d{1,2}e?\\d{1,2}','(complete)?.season.?\\d?.(complete)?',
                    'ep(isode)?.\\d+','(\\d{1,2}(x|.?of.?)\\d{1,2})','\\d{2,4}\\S\\d{2,4}\\S\\d{2,4})(.*)'];

                    trimmedTitle = trimmedReleaseName.replace(new RegExp(tvFilter.join('|'), 'i'), '');
                    trimmedTitle = trimmedTitle.replace(/(\()(\D*)(\))|(\[)(\D*)(\])|(\{)(\D*)(\})/, '');
                    trimmedTitle = trimmedTitle.replace(/[\/\\#,+\[\]()$\-~%."*?<>{}!]/g, ' ').trim();
                } else {
                    trimmedTitle = trimmedReleaseName.replace(/([0-9]{4}\b)(.*)/, '$1')
                    trimmedTitle = trimmedTitle.replace(/[\/\\#,+\[\]()$\-~%."*?<>{}!]/g, ' ');
                    trimmedTitle = trimmedTitle.replace(/\s{2,}/g, ' ').trim();
                }

                td = div.appendChild(document.createElement('td'));
                    td.id = 'searchIconsTd';

                if (userPref['showSubscene']) {
                    img = chrome.extension.getURL('src/subscene.png');
                    if (torrentCategory.search(/tv shows/i) != -1) {
                        cleanedFullReleaseName = fullReleaseName.replace(/\[[\D]+$/ig, '');
                        createIcon(td, 'Subscene', 'https://subscene.com/subtitles/title?q=' + cleanedFullReleaseName, img);
                    } else {
                        noYearTitle = trimmedTitle.replace(/\d{4}/, '');
                        createIcon(td, 'Subscene', 'https://subscene.com/subtitles/title?q=' + noYearTitle, img);
                    }
                }
                if (userPref['showYoutube']) {
                    img = chrome.extension.getURL('src/youtube.png');
                    createIcon(td, 'Youtube ', 'https://www.youtube.com/results?search_query=' + trimmedTitle, img);
                }
                if (userPref['showIMDb']) {
                    img = chrome.extension.getURL('src/imdb.png');
                    if (torrentCategory.search(/tv shows/i) != -1) {
                        createIcon(td, 'IMDb', 'http://www.imdb.com/find?q=' + trimmedTitle + '&s=tt&ttype=tv', img);
                    } else {
                        createIcon(td, 'IMDb', 'http://www.imdb.com/find?q=' + trimmedTitle + '&s=tt&ttype=ft', img);
                    }
                }
                if (userPref['showLetterboxd']) {
                    img = chrome.extension.getURL('src/letterboxd.png');
					if (torrentCategory.search(/tv shows/i) == -1) {
						createIcon(td, 'Letterboxd', 'https://letterboxd.com/search/' + noYearTitle, img);
					}
                }
            }
        }
    }

    document.querySelectorAll('#searchResult tbody tr').forEach(function(elt) {
        if (elt.childNodes.length != 1 && elt.children[1] != undefined) {

            elt.className = 'tr';

            var torrentTitle = elt.children[1].firstElementChild.innerText;
            var userName = elt.children[1].lastElementChild.innerText;
            
            if (userPref['markNewTorrents']) {
                newImg = chrome.extension.getURL('src/new.png');
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
                        new RegExp('\\b' + userPref['nonMovies'].join('\\b|\\b') + '\\b', 'i')) != -1) {
                        elt.remove(elt);
                    }
                }
            }

            if (userPref['affectPotentialFakes']) {
                torrentSeeds = parseInt(elt.children[2].innerText);
                warningImg = chrome.extension.getURL('src/warning.png');

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

            if (userPref['inlineView']) {
                buildA(elt);
            }

            if (userPref['displaySearch']) {
                buildIcons(elt);
            }
        }
    });
})