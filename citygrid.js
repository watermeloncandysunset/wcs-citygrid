const CARDS = {
    0: {"suit": 0, "type": 0, "cssclass":"spades", "suittext":"♠"}, // house spades
    1: {"suit": 1, "type": 0, "cssclass":"clubs", "suittext":"♣"}, // house clubs
    2: {"suit": 2, "type": 0, "cssclass":"hearts", "suittext":"♥"}, // house hearts
    3: {"suit": 3, "type": 0, "cssclass":"diamonds", "suittext":"♦"}, // house diamonds
    4: {"suit": 4, "type": 0, "cssclass":"stars", "suittext":"★"}, // house stars
    5: {"suit": 5, "type": 0, "cssclass":"suns", "suittext":"☼"}, // house suns
    6: {"suit": 6, "type": 0, "cssclass":"moons", "suittext":"☾"}, // house moons
    10: {"suit": 10, "type": 1, "cssclass":"power", "suittext": "⚡"}, // utilities
    20: {"suit": 20, "type": 2, "cssclass":"rail", "suittext": "🚆"}, // train stations
}

const DECK_STANDARD = {
    0: 3,
    1: 3,
    2: 3,
    3: 3,
    4: 3,
    5: 2,
    6: 2,
    10: 2,
    20: 4
}

const END_MESSAGES = {
    0: "Better luck next time!",
    1: "Better luck next time!",
    2: "Better luck next time!",
    3: "Getting closer!",
    4: "Almost there!",
    5: "Congraulations!"
}

class Tile {
    constructor(id) {
        this.id = id

        this.suit = null;
        this.type = null;

        this.check1 = false;
        this.check2 = true;

        this.state = 0; // 0: unavailable, 1: available, 2: occupied
        
        this.center = (id > 5 && id < 20 && id % 5 >= 1 && id % 5 <= 3);
        this.setBackgroundClass();
        this.resetTileImg();
    }

    validate() {
        return this.check1 && this.check2;
    }

    makeAvailable() {
        if (this.state == 0) {
            this.state = 1;
            this.setBackgroundClass();
        }
    }

    makeCheck(check, type, suit=null) {
        let agreement = false;
        if (this.type == type) {
            if (this.type == 0) {
                agreement = (this.suit == suit);
            } else {
                agreement = true;
            }
        }

        if (agreement) {
            if (check == 1) {
                this.check1 = true;
            } else {
                this.check2 = false;
            }
        }

        return agreement;
    }

    placeCard(card) {
        if (this.state == 1) {
            const card_data = CARDS[card];
            this.suit = card_data.suit;
            this.type = card_data.type;
            this.state = 2;
            return true;
        }
        return false;
    }

    previewCard(card, render=false) {
        if (card != null && this.state == 1) {
            const card_data = CARDS[card];
            this.suit = card_data.suit;
            this.type = card_data.type;

            this.resetTileImg();

            if(render) {
                this.render();
            }
        }

        return (this.state == 1);
    }

    unpreviewCard(render=false) {
        if (this.state == 1) {
            this.suit = null;
            this.type = null;

            this.resetTileImg();

            if(render) {
                this.render();
            }
        }

        return (this.state == 1);
    }

    resetTileImg() {
        document.getElementById("img" + this.id).src = "";
        document.getElementById("img" + this.id).className = "tileImg";
        document.getElementById("suit" + this.id).innerHTML = "";
    }

    setBackgroundClass() {
        const tileElement = document.getElementById("tile" + this.id);
        tileElement.classList.remove("tileValid");
        tileElement.classList.remove("tileInvalid");
        if (this.center) {
            if (this.state) {
                tileElement.classList.remove("tileCenterInactive");
                tileElement.classList.add("tileCenterActive");
            } else {
                tileElement.classList.add("tileCenterInactive");
            }
        } else {
            if (this.state) {
                tileElement.classList.remove("tileRegularInactive");
                tileElement.classList.add("tileRegularActive");
            } else {
                tileElement.classList.add("tileRegularInactive");
            }
        }
    }

    setValidationClass() {
        const tileElement = document.getElementById("tile" + this.id);
        if (this.center) {
            tileElement.classList.remove("tileCenterActive");
        } else {
            tileElement.classList.remove("tileRegularActive");
        }

        if (this.validate()) {
            tileElement.classList.add("tileValid");
        } else {
            tileElement.classList.add("tileInvalid");
        }
    }

    render(end=false) {
        const imgElement = document.getElementById("img" + this.id);
        const textElement = document.getElementById("suit" + this.id);
        switch(this.type) {
            case 0:
                imgElement.src = "imgs/card_house.png";
                imgElement.classList.add(CARDS[this.suit].cssclass);
                textElement.innerHTML = CARDS[this.suit].suittext;
                break;
            case 1:
                imgElement.src = "imgs/card_power.png";
                if (this.validate()) {
                    imgElement.classList.add(CARDS[this.suit].cssclass);
                }
                textElement.innerHTML = "";
                break;
            case 2:
                imgElement.src = "imgs/card_rail.png";
                imgElement.classList.add(CARDS[this.suit].cssclass);
                textElement.innerHTML = "";
                break;
        }
    }
}

class Rail {
    constructor(id) {
        this.id = id;
        this.state = 0 // 0: hidden, 1: unconnected, 2: connected
    }

    open() {
        if (this.state % 10 == 0) {
            this.state = 1;
        }
    }

    connect() {
        if (this.state % 10 == 1) {
            this.state = 2;
        }
    }

    previewRail() {
        if (this.state < 2) {
            this.state += 10;
            this.render();
        }
    }

    unpreviewRail() {
        if (this.state >= 10) {
            this.state -= 10;
            this.render();
        }
    }

    render() {
        const railElement = document.getElementById("rail" + this.id);
        switch(this.state) {
            case 0:
                railElement.classList.remove("tileValid");
                railElement.classList.add("subInvisible");
                break;
            case 1:
                railElement.classList.remove("tileValid");
                railElement.classList.remove("subInvisible");
                break;
            case 2:
                railElement.classList.add("tileValid");
                break;
            case 10:
                railElement.classList.remove("tileValid");
                railElement.classList.remove("subInvisible");
                break;
            case 11:
                railElement.classList.add("tileValid");
                break;
        }
    }
}

class Game {
    constructor() {
        this.state = 0; // 0: Not Active, 1: In Progress, 2: Ended

        this.board = []
        for (let i = 0; i < 5; i++) {
            const row = []
            for (let j = 0; j < 5; j++) {
                row.push(new Tile(5*i+j));
            }
            this.board.push(row);
        }
        this.preview = new Tile("P");

        this.railHrz = [];
        this.railVrt = [];
        for (let i = 0; i < 5; i++) {
            this.railHrz.push(new Rail(i));
            this.railVrt.push(new Rail(i+5));
        }

        this.deck = [];
        for (const key in DECK_STANDARD) {
            const copies = DECK_STANDARD[key];
            for (let i = 0; i < copies; i++) {
                this.deck.push(key);
            }
        }
        this.deck_index = 0;
        this.deck_contents = Object.assign({}, DECK_STANDARD);

        this.temp_agreement_val = false;
    }

    backToTitle() {
        this.state = 0;
        this.render();
    }

    resetBoard() {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                this.board[i][j] = new Tile(5*i+j);
            }
        }

        for (let i = 0; i < 5; i++) {
            this.railHrz[i] = new Rail(i);
            this.railVrt[i] = new Rail(i + 5);
        }
    }

    // shuffle deck
    shuffleDeck() {
        for (let i = 24; i > 0; i--) {
            const r = Math.floor((i+1) * Math.random());
            const temp = this.deck[i];
            this.deck[i] = this.deck[r];
            this.deck[r] = temp;
        }

        if (CARDS[this.deck[0]].type == 2 && CARDS[this.deck[1]].type == 2) {
            this.shuffleDeck();
        }

        this.deck_index = 0;
        this.deck_contents = Object.assign({}, DECK_STANDARD);
    }

    startGame() {
        this.state = 1;

        this.resetBoard();
        this.shuffleDeck();

        this.board[2][2].makeAvailable();
        this.placeCard(2,2);

        this.preview.makeAvailable();
        this.preview.previewCard(this.previewCard());

        this.initialRender();
        this.render();
    }

    previewCard() {
        return this.deck[this.deck_index];
    }

    makeTileAvailable(x, y) {
        this.board[y][x].makeAvailable();
    }

    coordFunction(func, x, y, params) {
        if (x < 0 || x >= 5 || y < 0 || y >= 5) {
            return;
        }
        const boundFunc = func.bind(this);
        boundFunc(x, y);
    }

    makeTileCheck(x, y, checkType, tileType, tileSuit=null) {
        if (x < 0 || x >= 5 || y < 0 || y >= 5) {
            return false;
        }
        return this.board[y][x].makeCheck(checkType, tileType, tileSuit);
    }

    toggleTAV(result) {
        if (result) {
            this.temp_agreement_val = true;
        }
    }

    hoverOnCard(x, y) {
        const card = this.previewCard();
        const didPreview = this.board[y][x].previewCard(card, true);
        if (didPreview && CARDS[card].type == 2) {
            this.railHrz[y].previewRail();
            this.railVrt[x].previewRail();
        }
    }

    hoverOffCard(x, y) {
        const card = this.previewCard();
        const didUnpreview = this.board[y][x].unpreviewCard(true);
        if (didUnpreview && CARDS[card].type == 2) {
            this.railHrz[y].unpreviewRail();
            this.railVrt[x].unpreviewRail();
        }
    }

    // place card
    placeCard(x, y) {
        const card = this.previewCard();
        const result = this.board[y][x].placeCard(card);
        if (!result) {
            return;
        }

        this.deck_index += 1;
        this.deck_contents[card] -= 1;

        this.coordFunction(this.makeTileAvailable, x-1, y);
        this.coordFunction(this.makeTileAvailable, x+1, y);
        this.coordFunction(this.makeTileAvailable, x, y-1);
        this.coordFunction(this.makeTileAvailable, x, y+1);

        switch(CARDS[card].type) {
            case 0: // house
                const suit = CARDS[card].suit;
                // confirm adj houses
                this.toggleTAV(this.makeTileCheck(x-1, y, 1, 0, suit));
                this.toggleTAV(this.makeTileCheck(x+1, y, 1, 0, suit));
                this.toggleTAV(this.makeTileCheck(x, y-1, 1, 0, suit));
                this.toggleTAV(this.makeTileCheck(x, y+1, 1, 0, suit));
                // confirm self
                if (this.temp_agreement_val) {
                    this.makeTileCheck(x, y, 1, 0, suit);
                    this.temp_agreement_val = false;
                }
                break;
            case 1: // power
                if (x >= 1 && x <= 3 && y >= 1 && y <= 3) {
                    this.makeTileCheck(x, y, 1, 1);
                }
                break;
            case 2: // station
                // open rails
                this.railHrz[y].open();
                this.railVrt[x].open();

                // de-confirm adj stations
                this.toggleTAV(this.makeTileCheck(x-1, y, 2, 2));
                this.toggleTAV(this.makeTileCheck(x+1, y, 2, 2));
                this.toggleTAV(this.makeTileCheck(x, y-1, 2, 2));
                this.toggleTAV(this.makeTileCheck(x, y+1, 2, 2));
                // de-confirm self
                if (this.temp_agreement_val) {
                    this.makeTileCheck(x, y, 2, 2);
                    this.temp_agreement_val = false;
                }
                // confirm seen stations
                for (let i=-4; i<0; i++) {
                    if (this.makeTileCheck(x+i, y, 1, 2)) {
                        this.toggleTAV(true);
                        this.railHrz[y].connect();
                    }
                }
                for (let i=1; i<=4; i++) {
                    if (this.makeTileCheck(x+i, y, 1, 2)) {
                        this.toggleTAV(true);
                        this.railHrz[y].connect();
                    }
                }
                for (let j=-4; j<0; j++) {
                    if (this.makeTileCheck(x, y+j, 1, 2)) {
                        this.toggleTAV(true);
                        this.railVrt[x].connect();
                    }
                }
                for (let j=1; j<=4; j++) {
                    if (this.makeTileCheck(x, y+j, 1, 2)) {
                        this.toggleTAV(true);
                        this.railVrt[x].connect();
                    }
                }
                // confirm self
                if (this.temp_agreement_val) {
                    this.makeTileCheck(x, y, 1, 2);
                    this.temp_agreement_val = false;
                }
                break;
        }

        if (this.deck_index < 25) {
            this.preview.previewCard(this.previewCard());
            this.render();
        } else {
            this.state = 2;
            this.render(true);
        }
    }

    validate() {
        let score = 0;
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (this.board[i][j].validate()) {
                    score += 1;
                }
            }
        }
        return score;
    }

    initialRender() {
        for (const key in CARDS) {
            document.getElementById('countSuit' + key).innerHTML = CARDS[key].suittext + " :";
            document.getElementById('countCon' + key).classList.add(CARDS[key].cssclass + "BG");
            document.getElementById('countNum' + key).classList.add(CARDS[key].cssclass + "BG");
        }

        document.getElementById("menu").classList.add("hide");
        document.getElementById("cardP").classList.remove("hide");
        document.getElementById("results").classList.add("hide");
    }

    render() {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                this.board[i][j].render(this.state==2);
            }
        }

        for (let i = 0; i < 5; i++) {
            this.railHrz[i].render();
            this.railVrt[i].render();
        }

        for (const key in this.deck_contents) {
            document.getElementById('countNum' + key).innerHTML = this.deck_contents[key];
        }

        switch(this.state) {
            case 0:
                document.getElementById("menu").classList.remove("hide");
                document.getElementById("cardP").classList.add("hide");
                document.getElementById("results").classList.add("hide");
            case 1:
                this.preview.render('P');
                break;
            case 2:
                for (let i = 0; i < 5; i++) {
                    for (let j = 0; j < 5; j++) {
                        this.board[i][j].setValidationClass();
                    }

                    const score = this.validate();
                    
                    document.getElementById("endScore").innerHTML = score;
                    const scoreColorElement = document.getElementById("endScoreColor");
                    if (score < 25) {
                        scoreColorElement.classList.remove("panelValid");
                        scoreColorElement.classList.add("panelInvalid");
                    } else {
                        scoreColorElement.classList.remove("panelInvalid");
                        scoreColorElement.classList.add("panelValid");
                    }

                    document.getElementById("endMessage").innerHTML = END_MESSAGES[Math.floor(score / 5)];
                    document.getElementById("cardP").classList.add("hide");
                    document.getElementById("results").classList.remove("hide");
                }
                break;
        }
    }
}

const cggame = new Game();
// cggame.startGame();