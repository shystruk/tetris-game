/**
 * Created by v.stokolosa on 10/31/14.
 */
/*jslint browser:true */
/*jslint plusplus:true */

/**
 * Cross-Browser requestAnimationFrame
 */
var requestAnimFrame = (function () {
    'use strict';

    return (
        window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        }
    );
}());


/**
 * Canvas
 */
var canvas = document.getElementById('tetris-canvas'),
    ctx = canvas.getContext('2d'),
    lineSpan = document.getElementById('line');
canvas.width = 320;
canvas.height = 640;


/**
 * Variables
 */
var Rows = 20,
    Cols = 10,
    Size = 32,
    blockImg,
    curBlock,
    gameData,
    imgLoader,
    prevTime,
    curTime,
    isGameOver,
    curLines;

window.onload = imageLoad;


/**
 * Update Game
 */
function update() {
    'use strict';

    curTime = new Date().getTime();

    if (curTime - prevTime > 500) {
        if (checkMove(curBlock.gridx, curBlock.gridy + 1, curBlock.curPosition)) {
            curBlock.gridy += 1;
        } else {
            copyData(curBlock);
            curBlock = RandomBlock();
        }

        prevTime = curTime;
    }

    ctx.clearRect(0, 0, 320, 640);
    drawBoard();
    drawBlock(curBlock);

    if (isGameOver === false) {
        requestAnimFrame(update);
    } else {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(0, 0, 320, 640);
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.font = "50px Georgia";
        ctx.fillText("Game Over", 40, 320);
    }
}


/**
 * Init Game
 */
function initGame() {
    'use strict';

    var rows, cols;

    curLines = 0;
    isGameOver = false;

    if (gameData === undefined) {
        gameData = new Array();

        for (rows = 0; rows < Rows; rows++) {
            gameData[rows] = new Array();

            for (cols = 0; cols < Cols; cols++) {
                gameData[rows].push(0);
            }
        }
    } else {
        for (rows = 0; rows < Rows; rows++) {
            for (cols = 0; cols < Cols; cols++) {
                gameData[rows][cols] = 0;
            }
        }
    }

    curBlock = RandomBlock();

    lineSpan.innerHTML = curLines.toString();

    requestAnimFrame(update);
}


/**
 * Check Move
 */
function checkMove(xPos, yPos, newPosition) {
    'use strict';

    var result = true,
        newX = xPos,
        newY = yPos,
        len_2,
        len,
        rows,
        cols;

    for (rows = 0, len = curBlock.positions[newPosition].length; rows < len; rows++) {
        for (cols = 0, len_2 = curBlock.positions[newPosition][rows].length; cols < len_2; cols++) {
            if (newX < 0 || newX >= Cols) {
                result = false;
                cols = len_2;
                rows = len;
            }

            if (gameData[newY] !== undefined && gameData[newY][newX] !== 0 &&
                curBlock.positions[newPosition][rows] !== undefined &&
                curBlock.positions[newPosition][rows][cols] !== 0) {
                result = false;
                cols = len_2;
                rows = len;
            }

            newX += 1;
        }

        newX = xPos;
        newY += 1;

        if (newY > Rows) {
            rows = len;
            result = false;
        }
    }

    return result;
}


/**
 * Check KEY
 */
function keyPress(e) {
    'use strict';

    var newPosition;

    if (!e) {
        var e = window.event;
    }

    e.preventDefault();

    if (!isGameOver) {
        switch (e.keyCode) {
        case 37:
            if (checkMove(curBlock.gridx - 1, curBlock.gridy, curBlock.curPosition)) {
                curBlock.gridx--;
            }
            break;

        case 38:
            newPosition = curBlock.curPosition - 1;
            if (newPosition < 0) {
                newPosition = curBlock.positions.length - 1;
            }
            if (checkMove(curBlock.gridx, curBlock.gridy, newPosition)) {
                curBlock.curPosition = newPosition;
            }
            break;

        case 39:
            if (checkMove(curBlock.gridx + 1, curBlock.gridy, curBlock.curPosition)) {
                curBlock.gridx++;
            }
            break;

        case 40:
            if (checkMove(curBlock.gridx, curBlock.gridy + 1, curBlock.curPosition)) {
                curBlock.gridy++;
            }
            break;
        }
    } else {
        initGame();
    }
}


/**
 * Image Load
 */
function imageLoad() {
    'use strict';

    imgLoader = new BulkImageLoader();
    imgLoader.addImage('images/pieces.png', 'pieces');
    imgLoader.onReadyCallback = onImagesLoaded;
    imgLoader.loadImages();

    prevTime = curTime = 0;
    document.onkeydown = keyPress;
}


/**
 * Start Game
 */
function onImagesLoaded() {
    'use strict';

    blockImg = imgLoader.getImageAtIndex(0);
    initGame();
}


/**
 * Restart Game
 */
function restartGame() {
    'use strict';

    document.getElementById('start').addEventListener('click', function () {
        initGame();
    });
}


/**
 * Copy Data
 */
function copyData(pos) {
    'use strict';

    var xPos = pos.gridx,
        yPos = pos.gridy,
        position = pos.curPosition,
        len,
        len_2,
        rows,
        cols;

    for (rows = 0, len = pos.positions[position].length; rows < len; rows++) {
        for (cols = 0, len_2 = pos.positions[position][rows].length; cols < len_2; cols++) {
            if (pos.positions[position][rows][cols] === 1 && yPos >= 0) {
                gameData[yPos][xPos] = (pos.color + 1);
            }

            xPos += 1;
        }

        xPos = pos.gridx;
        yPos += 1;
    }

    checkLines();

    if (pos.gridy < 0) {
        isGameOver = true;
    }
}


/**
 * Check Line
 */
function checkLines() {
    'use strict';

    var lineFound = false,
        fullRow = true,
        rows = Rows - 1,
        cols = Cols - 1;

    while (rows >= 0) {
        while (cols >= 0) {
            if (gameData[rows][cols] === 0) {
                fullRow = false;
                cols = -1;
            }

            cols--;
        }

        if (fullRow === true) {
            zeroRow(rows);
            rows++;
            lineFound = true;
            curLines++;
        }

        fullRow = true;
        cols = Cols - 1;
        rows--;
    }

    if (lineFound) {
        lineSpan.innerHTML = curLines.toString();
    }
}


/**
 * Now found row
 */
function zeroRow(row) {
    'use strict';

    var rows = row,
        cols = 0;

    while (rows >= 0) {
        while (cols < Cols) {
            if (rows > 0) {
                gameData[rows][cols] = gameData[rows - 1][cols];
            } else {
                gameData[rows][cols] = 0;
            }

            cols++;
        }

        cols = 0;
        rows--;
    }
}


/**
 * Draw Board
 */
function drawBoard() {
    'use strict';

    var i, j, rows, cols,
        step;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.3';
    ctx.fillRect(0, 0, 320, 640);
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.moveTo(0, 0);
    ctx.lineTo(320, 1);
    ctx.moveTo(0, 640);
    ctx.lineTo(0, 0);
    ctx.moveTo(640, 640);
    ctx.lineTo(0, 640);
    ctx.moveTo(320, 0);
    ctx.lineTo(320, 640);
    for (i = 0, step = 0; i < 10; i++, step += 32) {
        ctx.moveTo(step, 0);
        ctx.lineTo(step, 640);
    }
    for (j = 0, step = 0; j < 20; j++, step += 32) {
        ctx.moveTo(0, step);
        ctx.lineTo(320, step);
    }
    ctx.lineWidth = 1;
    ctx.stroke();

    for (rows = 0; rows < Rows; rows++) {
        for (cols = 0; cols < Cols; cols++) {
            if (gameData[rows][cols] !== 0) {
                ctx.drawImage(blockImg, (gameData[rows][cols] - 1) * Size, 0, 32, 32, cols * Size, rows * Size, Size, Size);
            }
        }
    }
}


/**
 * Draw Block
 */
function drawBlock(pos) {
    'use strict';

    var drawX = pos.gridx,
        drawY = pos.gridy,
        position = pos.curPosition,
        len,
        len_2,
        rows,
        cols;

    for (rows = 0, len = pos.positions[position].length; rows < len; rows++) {
        for (cols = 0, len_2 = pos.positions[position][rows].length; cols < len_2; cols++) {
            if (pos.positions[position][rows][cols] === 1 && drawY >= 0) {
                ctx.drawImage(blockImg, pos.color * Size, 0, Size, Size, drawX * Size, drawY * Size, Size, Size);
            }

            drawX += 1;
        }

        drawX = pos.gridx;
        drawY += 1;
    }
}
