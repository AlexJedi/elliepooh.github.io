'use strict';

class Quiz {
    constructor(game) {
        this.game = game;
        this.width = this.game.width;
        this.height = this.game.height;
        this.speed = 50;
        this.questCount = 0;

        this.fontSize = parseInt(window.getComputedStyle(document.body).fontSize);

        this.quizBox = [{
            question: 'the owner of "JavaScript" trademark',
            answers: ['Oracle', 'W3C', 'MIT', 'Nombas', 'Netscape'],
            correct: 'Oracle'
        }, {
            question: 'the year JS first appeared',
            answers: ['1995', '1990', '1992', '2001', '1985'],
            correct: '1995'
        }, {
            question: 'JS typing discipline',
            answers: ['duck', 'camel', 'eagle', 'owl', 'wolf'],
            correct: 'duck'
        }, {
            question: 'not JS framework is',
            answers: ['Django', 'Ember', 'Polymer', 'Vue', 'Backbone'],
            correct: 'Django'
        }, {
            question: 'choose the best :) backend language',
            answers: ['JS', 'PHP', 'Ruby', 'Python', 'Java'],
            correct: 'JS'
        }, {
            question: 'typeof "null"',
            answers: ['string', 'null', 'NaN', 'object', 'undefined'],
            correct: 'string'
        }];

        this.quizBox = shuffleArray(this.quizBox);
        this.question = '';
        this.qWidth = 0;
        this.answers = [];
        this.aWidth = 0;
        this.correct = '';

    }

    newQuest() {
        let num = this.questCount;

        if (this.questCount > this.quizBox.length) {
            this.game.gameOver();
        }

        let quest = this.quizBox[num];
        this.question = new Block(quest.question, this.width / 2, 0);

        this.correct = quest.correct;
        quest.answers = shuffleArray(quest.answers);

        // devide the canvas into 7 paths and draw answers in each of them
        for (let i = 0; i < quest.answers.length; i++) {
            let wordWidth = quest.answers[i].length * this.fontSize,
                maxX = (i + 2) * this.width / 7 - wordWidth,
                minX = (i + 1) * this.width / 7 + wordWidth,
                x = Math.random() * (maxX - minX) + minX;
            this.answers[i] = new Block(quest.answers[i], x, 0);
        };

        this.questCount++;
    }

    update(delta) {
        if (isNaN(delta) || delta <= 0) {
            return;
        }

        if (this.question.y < (this.height - this.fontSize * 3)) {
            this.question.y += Math.floor(delta * this.speed * 2);
        } else {
            for (let i = 0; i < this.answers.length; i++) {
                let answer = this.answers[i];
                answer.y += Math.floor(delta * this.speed);
                this.checkAnswer(answer);
            }
        }
    }

    render(ctx) {
        ctx.fillStyle = '#fff';
        ctx.font = 'small-caps 3em Righteous';
        this.qWidth = ctx.measureText(this.question.text).width;
        ctx.fillText(this.question.text, this.question.x - this.qWidth / 2, this.question.y);
        for (let i = 0; i < this.answers.length; i++) {
            let answer = this.answers[i];
            ctx.save();
            ctx.fillStyle = '#fff';
            ctx.font = 'small-caps 2em Righteous';
            this.aWidth = ctx.measureText(answer.text).width;
            ctx.fillText(answer.text, answer.x, answer.y - this.fontSize);
            ctx.restore();
        };
    }

    checkAnswer(answer) {
        if ((this.game.cursor.x > answer.x) &&
            (this.game.cursor.x < answer.x + this.aWidth) &&
            (this.game.cursor.y > answer.y) &&
            (this.game.cursor.y < answer.y + this.fontSize)) {
            let progress = answer.text === this.correct ? true : false;
            this.game.getProgress(progress);
            this.newQuest();
        };

        //	If the answers have moved from the bottom of the screen, spawn new quest.
        if (answer.y > this.height) {
            this.newQuest();
        }
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)),
            temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

class Block {
    constructor(text, x, y) {
        this.text = text;
        this.x = Math.floor(x);
        this.y = Math.floor(y);
    }
}
