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
    return data.map((i, row) => {
        return $(row).find('td')[0].innerText; // Get the text from the first col of each row
    });
}

function godePasteHandler(info, tab) {
    console.log(info, tab);
    var rawData = getClipboard();
    var parsedData = parseClipboardHTML(rawData);
    chrome.tabs.sendMessage(tab.id, {action: 'do_paste', data: parsedData}, (response) => {});
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create(
        {"title" : "Paste to Almaris",
        "id" : "GodePaste_context_menu",
        "contexts" : ["editable"]      
        });
});

chrome.contextMenus.onClicked.addListener(godePasteHandler);