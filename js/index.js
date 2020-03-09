var board = new Array();
var score = 0;
var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;
// 用来防止一下子三个格子进行相加
var hasConflicted = new Array();
$(function() {
    newgame();
    var gridWidth = document.querySelector("#grid-cell-0-0").clientWidth;
});
// 点击按钮时初始化函数
function newgame() {
    // 初始化
    init();
    // 生成两个随机数字
    generateOneNumber();
    generateOneNumber();
}
// 初始化的函数
function init() {
    for (var i = 0; i < 4; i++) {
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0;
            hasConflicted[i][j] = 0;
            var gridCell = $("#grid-cell-" + i + "-" + j);
            gridCell.css('top', getPos(i));
            gridCell.css('left', getPos(j));
            hasConflicted[i][j] = false;
        }
    }
    updateNumber();
};

// 生成一个新的div放置数字
function updateNumber() {
    $('.number-cell').remove();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            $('.container').append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>');
            var numberCell = $('#number-cell-' + i + '-' + j);
            // 如果这个框没有值则宽高都为0
            if (board[i][j] == 0) {
                numberCell.css('width', '0px');
                numberCell.css('height', '0px');
                numberCell.css('top', getPos(i) + gridWidth / 2);
                numberCell.css('left', getPos(j) + gridWidth / 2);
            } else {
                numberCell.css('width', gridWidth);
                numberCell.css('height', gridWidth);
                numberCell.css('top', getPos(i));
                numberCell.css('left', getPos(j));
                numberCell.css('background-color', getNumberBgColor(board[i][j]));
                numberCell.css('color', getNumberColor(board[i][j]));
                numberCell.text(board[i][j]);
            }
            hasConflicted[i][j] = false;
        }
    }
}

// 三个步骤：生成一个随机的位置，生成一个随机的2或4数字，在随机位置显示生成的随机数字
function generateOneNumber() {
    // 判定是否有空位置，如果没有则阻止向下执行
    if (nospace(board)) {
        return false;
    };
    // 生成一个随机位置x,y
    var ranx = parseInt(Math.floor(Math.random() * 4));
    var rany = parseInt(Math.floor(Math.random() * 4));
    var timer = 0;
    // 循环50次判断该x,y的位置是否有值，如果有则继续循环，没有便跳出循环
    while (timer < 50) {
        if (board[ranx][rany] == 0) {
            break;
        }
        var ranx = parseInt(Math.floor(Math.random() * 4));
        var rany = parseInt(Math.floor(Math.random() * 4));
        timer++;
    };
    // 如果50次到了则手工生成位置
    if (timer == 50) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (board[i][j] == 0) {
                    ranx = i;
                    rany = j;
                }
            }
        }
    }
    // 随机生成一个数字
    var randomNum = Math.random() < 0.5 ? 2 : 4;
    board[ranx][rany] = randomNum;
    showNumberAnimation(ranx, rany, randomNum);
}

// 判断游戏是否结束
function isgameover() {
    if (nospace(board) && nomove(board)) {
        alert('game over!');
    }
}

// 添加键盘按下事件
$(document).keydown(function(e) {
    switch (e.keyCode) {
        case 37: //left
            if (moveLeft()) {
                setTimeout('generateOneNumber()', 210);
                setTimeout('isgameover()', 310);
            }
            break;
        case 38: //up
            if (moveUp()) {
                setTimeout('generateOneNumber()', 210);
                setTimeout('isgameover()', 310);
            }
            break;
        case 39: //right
            if (moveRight()) {
                setTimeout('generateOneNumber()', 210);
                setTimeout('isgameover()', 310);
            }
            break;
        case 40: //down
            if (moveDown()) {
                setTimeout('generateOneNumber()', 210);
                setTimeout('isgameover()', 310);
            }
            break;
    }
});
// 移动端手指移动事件
document.addEventListener('touchstart', function(e) {
    startx = e.touches[0].pageX;
    starty = e.touches[0].pageY;
})
document.addEventListener('touchend', function(e) {
    endx = e.changedTouches[0].pageX;
    endy = e.changedTouches[0].pageY;
    var deltax = endx - startx;
    var deltay = endy - starty;
    // 如果移动的距离少于某个值，就阻止代码向下执行
    if (Math.abs(deltax) < 0.3 * gridWidth && Math.abs(deltay) < 0.3 * gridWidth) {
        return;
    }
    // 先判断x轴还是y轴移动的距离大，如果是x轴移动的距离大则移动y轴，再判断距离是否大于0，大于0则向右移动，小于则向左
    if (Math.abs(deltax) >= Math.abs(deltay)) {
        // x轴移动
        if (deltax > 0) {
            // 向右移动 
            if (moveRight()) {
                setTimeout('generateOneNumber()', 210);
                setTimeout('isgameover()', 310);
            }
        } else {
            // 向左移动
            if (moveLeft()) {
                setTimeout('generateOneNumber()', 210);
                setTimeout('isgameover()', 310);
            }
        }
    } else {
        // y轴移动
        if (deltay > 0) {
            // 向下移动
            if (moveDown()) {
                setTimeout('generateOneNumber()', 210);
                setTimeout('isgameover()', 310);
            }
        } else {
            // 向上移动
            if (moveUp()) {
                setTimeout('generateOneNumber()', 210);
                setTimeout('isgameover()', 310);
            }
        }
    }

})

// 向左移动
function moveLeft() {
    if (!canMoveLeft(board)) {
        return false;
    }
    // 确定落脚点
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < j; k++) {
                    // 如果左边数字等于0
                    if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    // 如果左边数字与该数字相同
                    else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]) {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] *= 2;
                        board[i][j] = 0;
                        score += board[i][k];
                        $('#scoreNum').text(score);
                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout('updateNumber()', 200);
    return true;
}
// 向右移动
function moveRight() {
    if (!canMoveRight(board)) {
        return false;
    }
    // 确定落脚点
    for (var i = 0; i < 4; i++) {
        for (var j = 2; j >= 0; j--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > j; k--) {
                    // 如果左边数字等于0
                    if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    // 如果左边数字与该数字相同
                    else if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]) {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] *= 2;
                        board[i][j] = 0;
                        score += board[i][k];
                        $('#scoreNum').text(score);
                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout('updateNumber()', 200);
    return true;
}
// 向上移动
function moveUp() {
    if (!canMoveUp(board)) {
        return false;
    }
    // 确定落脚点
    for (var j = 0; j < 4; j++) {
        for (var i = 1; i < 4; i++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < i; k++) {
                    // 如果左边数字等于0
                    if (board[k][j] == 0 && noBlockVertical(j, k, i, board)) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    // 如果左边数字与该数字相同
                    else if (board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) && !hasConflicted[i][k]) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] *= 2;
                        board[i][j] = 0;
                        score += board[i][k];
                        $('#scoreNum').text(score);
                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout('updateNumber()', 200);
    return true;
}
// 向下移动
function moveDown() {
    if (!canMoveDown(board)) {
        return false;
    }
    // 确定落脚点
    for (var j = 0; j < 4; j++) {
        for (var i = 3; i >= 0; i--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > i; k--) {
                    // 如果左边数字等于0
                    if (board[k][j] == 0 && noBlockVertical(j, i, k, board)) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    // 如果左边数字与该数字相同
                    else if (board[k][j] == board[i][j] && noBlockVertical(j, i, k, board) && !hasConflicted[i][k]) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] *= 2;
                        board[i][j] = 0;
                        score += board[i][k];
                        $('#scoreNum').text(score);
                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout('updateNumber()', 200);
    return true;
}