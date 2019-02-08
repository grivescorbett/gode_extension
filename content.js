var $j = jQuery.noConflict();

function getTable() {
    var root = document.activeElement;
    return $j(root.closest('table'))[0];
}

function getIdxToHeading(table) {
    var firstRow = $j(table).find('tr')[0];
    var cols = $j(firstRow).find('td');
    var idxToHeading = {};
    cols.map((i, col) => {
        idxToHeading[i] = col.innerText;
    });
    return idxToHeading;
}

function getDataValue(data, attr, col) {
    for (var i = 0; i < data.length; i++) {
        var row = data[i];
        if (row['attr'] == attr) {
            return row[col.trim().toLowerCase()];
        }
    }
}

chrome.extension.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action == 'do_paste') {
        var table = getTable();
        var idxToHeading = getIdxToHeading(table);

        var cells = $j(table).find('input');

        cells.map((i, cell) => {
            var cellRow = $j(cell.closest('tr'))
            var cellRowName = cellRow.find('td')[0].innerText.trim().toLowerCase();
            
            var cellTd = cell.closest('td');
            var cellRowIdx = cellRow.children().toArray().indexOf(cellTd);
            var cellColumn = idxToHeading[cellRowIdx].trim().toLowerCase();
            
            var dataValue = getDataValue(msg.data, cellRowName, cellColumn);

            $j(cell).val(dataValue);
        })
    } 
});