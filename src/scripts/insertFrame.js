document.querySelectorAll('#searchResult tbody tr').forEach(function(elt) {
    if (elt.childNodes.length != 1) {
        newA = document.createElement('a');
        newA.className = 'toggleA';
        newA.href = '#';
        newA.innerText = '(+)';
        newA.style.marginLeft = '5px';
        elt.children[1].insertBefore(newA, elt.children[1].lastChild);
    }
});

function setFrame(elt) {
    if (elt.nextElementSibling.className != 'frameDiv') {
        elt.children[1].lastElementChild.innerText = '(-)';

        newDiv = document.createElement('div');
        newDiv.className = 'frameDiv';
        newDiv.style.cssText = 'display: block;width: 662%;height: 300px;padding-bottom: 7px'

        newFrame = document.createElement('iframe');
        newFrame.className = 'actualFrame';
        torLink = elt.children[1].firstElementChild.firstElementChild.href;
        newFrame.src = torLink + ' #detailsouterframe';

        if (elt.style.backgroundColor != "") {
            borderColor = elt.style.backgroundColor;
        } else {
            borderColor = '#f3EEEC';
        }

        newFrame.style.cssText = 'height: 100%;width: 100%;border: 4px solid ' + borderColor;

        tBody = elt.parentNode;
        insertThis = newDiv.appendChild(newFrame);
        insertHere = elt.nextElementSibling;
        tBody.insertBefore(insertThis.parentNode, insertHere);

    } else {
        elt.children[1].lastElementChild.innerText = '(+)';
        elt.nextElementSibling.remove(elt);
    }
}

document.querySelectorAll('.toggleA').forEach(function(elt) {
    elt.addEventListener('click', function(e) {
        e.preventDefault();
        setFrame(elt.parentNode.parentNode);
    });
});

document.styleSheets[0].insertRule('table#searchResult td.vertTh { width: 15% !important; }', 0);


function1(someVariable).then(function() { function2(someOtherVariable); });