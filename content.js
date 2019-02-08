var $j = jQuery.noConflict();

function getTable() {
    var root = document.activeElement;
    return $j(root.closest('table'))[0];
}

function getColumnIdx() {
    var root = document.activeElement;
    var parent = $j(root.closest('tr'));

    var containsRoot = parent.children().map((i, td) => {
        return td.contains(root);
    });
    return containsRoot.toArray().indexOf(true);
}

function getColumnByIdx(table, idx) {
    return $j(table).find(`tr td:nth-child(${idx + 1})`);
}

function getIdxOfCurrentElement(column) {
    var root = document.activeElement;

    var found = column.map((i, tr) => {
        return tr.contains(root);
    }).toArray();

    return found.indexOf(true);
}

// function getRowsWithInputs(column) {
//     return column.map((i, tr) => {
//         return $j(tr).has('input').length > 0;
//     }).toArray();
// }

function setInputInTd(td, val) {
    var input = $j(td).find('input')[0];
    
    if (input) {
        $j(input).val(val);
    }
}

chrome.extension.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action == 'do_paste') {
        var columnNo = getColumnIdx();
        var table = getTable();
        var column = getColumnByIdx(table, columnNo);
        var currentCellIdx = getIdxOfCurrentElement(column);

        column = column.slice(currentCellIdx);

        for (var i = 0; i < msg.data.length; i++) {
            setInputInTd(column[i], msg.data[i]);
        }
    } 
});