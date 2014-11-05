/**
 * Created by v.stokolosa on 10/31/14.
 */
function LBlock() {
    'use strict';

    this.position_1 = [ [1, 0],
                        [1, 0],
                        [1, 1] ];

    this.position_2 = [ [0, 0, 1],
                        [1, 1, 1] ];

    this.position_3 = [ [1, 1],
                        [0, 1],
                        [0, 1] ];

    this.position_4 = [ [1, 1, 1],
                        [1, 0, 0] ];

    this.positions = [this.position_1, this.position_2, this.position_3, this.position_4];

    this.curPosition = 0;
    this.color = 0;
    this.gridx = 4;
    this.gridy = -3;
}

function ReverseLBlock() {
    'use strict';

    this.position_1 = [ [0, 1],
                        [0, 1],
                        [1, 1] ];

    this.position_2 = [ [1, 1, 1],
                        [0, 0, 1] ];

    this.position_3 = [ [1, 1],
                        [1, 0],
                        [1, 0] ];

    this.position_4 = [ [1, 0, 0],
                        [1, 1, 1] ];

    this.positions = [this.position_1, this.position_2, this.position_3, this.position_4];

    this.curPosition = 0;
    this.color = 0;
    this.gridx = 4;
    this.gridy = -3;
}

function RecBlock() {
    'use strict';

    this.position_1 = [ [1, 1],
                        [1, 1] ];

    this.positions = [this.position_1];

    this.curPosition = 0;
    this.color = 0;
    this.gridx = 4;
    this.gridy = -2;
}

function LineBlock() {
    'use strict';

    this.position_1 = [ [1],
                        [1],
                        [1],
                        [1] ];

    this.position_2 = [ [1, 1, 1, 1] ];

    this.positions = [this.position_1, this.position_2];

    this.curPosition = 0;
    this.color = 0;
    this.gridx = 5;
    this.gridy = -4;
}

function TBlock() {
    'use strict';

    this.position_1 = [ [1, 1, 1],
                        [0, 1, 0] ];

    this.position_2 = [ [1, 0],
                        [1, 1],
                        [1, 0] ];

    this.position_3 = [ [0, 1, 0],
                        [1, 1, 1] ];

    this.position_4 = [ [0, 1],
                        [1, 1],
                        [0, 1] ];

    this.positions = [this.position_1, this.position_2, this.position_3, this.position_4];

    this.curPosition = 0;
    this.color = 0;
    this.gridx = 4;
    this.gridy = -2;
}

function ZBlock() {
    'use strict';

    this.position_1 = [ [1, 1, 0],
                         [0, 1, 1] ];

    this.position_2 = [ [0, 1],
                        [1, 1],
                        [1, 0] ];

    this.positions = [this.position_1, this.position_2];

    this.curPosition = 0;
    this.color = 0;
    this.gridx = 4;
    this.gridy = -2;
}

function ReverseZBlock() {
    'use strict';

    this.position_1 = [ [0, 1, 1],
                        [1, 1, 0] ];

    this.position_2 = [ [1, 0],
                        [1, 1],
                        [0, 1] ];

    this.positions = [this.position_1, this.position_2];

    this.curPosition = 0;
    this.color = 0;
    this.gridx = 4;
    this.gridy = -2;
}

function RandomBlock() {
    'use strict';

    var result = Math.floor(Math.random() * 7),
        block;

    switch (result) {
    case 0:
        block = new LBlock();
        break;
    case 1:
        block = new RecBlock();
        break;
    case 2:
        block = new ZBlock();
        break;
    case 3:
        block = new TBlock();
        break;
    case 4:
        block = new ReverseLBlock();
        break;
    case 5:
        block = new ReverseZBlock();
        break;
    case 6:
        block = new LineBlock();
        break;
    }

    block.color = Math.floor(Math.random() * 7);
    return block;
}
