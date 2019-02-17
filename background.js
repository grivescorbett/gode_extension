function getClipboard() {
    bg = chrome.extension.getBackgroundPage();        // get the background page
    bg.document.body.innerHTML= "";                   // clear the background page

    // add a DIV, contentEditable=true, to accept the paste action
    var helperdiv = bg.document.createElement("div");
    document.body.appendChild(helperdiv);
    helperdiv.contentEditable = true;

    // focus the helper div's content
    var range = document.createRange();
    range.selectNode(helperdiv);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    helperdiv.focus();    

    // trigger the paste action
    bg.document.execCommand("Paste");

    // read the clipboard contents from the helperdiv
    return helperdiv.innerHTML;
}

function parseClipboardHTML(html) {
    var data = $(html).find('tr'); // Get all the rows

     var rows = data.map((i, row) => {
        return $(row).find('td')[0].innerText.trim();
    });
    
    var cols = $(data[0]).find('td').map((i, col) => {
        return col.innerText.trim();
    });
    
    var output = data.slice(1).map((i, row) => {
        var rowData = {};
        $(row.children).map((i, name) => {
            if (i == 0) {
                rowData['attr'] = name.innerText.toLowerCase().replace(/\n|\r/g, "").replace(/  /g, ' ');
            } else if (name.innerText.trim()) {
                rowData[cols[i].toLowerCase()] = name.innerText.toLowerCase();
            }
            console.log(rowData);
        });
        return rowData;
    });
    return output;
}

function godePasteHandler(info, tab) {
    var rawData = getClipboard();
    var parsedData = parseClipboardHTML(rawData);
    chrome.tabs.sendMessage(tab.id, {action: 'do_paste', data: parsedData}, (response) => {});
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create(
        {"title" : "Paste to Almaris",
        "id" : "GodePaste_context_menu",
        "contexts" : ["editable"],
        'documentUrlPatterns': ['http://almaris.com/assess*']
        });
});

chrome.contextMenus.onClicked.addListener(godePasteHandler);