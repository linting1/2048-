function showNumberAnimation(i, j, num) {
    var numberCell = $('#number-cell-' + i + '-' + j);
    numberCell.css('background-color', getNumberBgColor(board[i][j]));
    numberCell.css('color', getNumberColor(board[i][j]));
    numberCell.text(board[i][j]);

    numberCell.animate({
        width: gridWidth + 'px',
        height: gridWidth + 'px',
        top: getPos(i),
        left: getPos(j)
    }, 50);
}

// 移动函数
function showMoveAnimation(fromx, fromy, tox, toy) {
    var numberCell = $('#number-cell-' + fromx + '-' + fromy);
    numberCell.animate({
        top: getPos(tox),
        left: getPos(toy)
    })
}