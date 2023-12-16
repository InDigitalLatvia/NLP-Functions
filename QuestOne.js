//================== Quest One (Interactive Dialog Prototype) ==================
//
// This is JavaScript prototype, which is intended to create an interactive quiz
// or dialogue system that can be integrated in Your own web application.
// The quiz questions and answers are structured in an array named QuestData.
//
// Array have specific but simple structure.
//
// This source QuestData contains example with the history quiz.
// You can create Your own QuestData and modify functionality for Your needs.
//
// Overall, this code sets up a simple interactive quiz system where users can
// answer questions, receive feedback, and progress through the quiz based on
// their answers. The implementation relies on jQuery for DOM manipulation.
//
// "ConvInObj" Should be changed to Your conversation Input element.
// "ConvOutObj" Should be changed to Your conversation Output element.
// "QuestOne.getStatistics();" Conversation history (Q number: A number/answer).
// "QuestOne.clearStatistics();" To clear conversation history/statistics.
// "maxWrongAnswers" How many times user can enter wrong answer.
// "maxDeadend" How many times QuestData can lead to non existent question.
//
//========================= AUTHOR GATIS KAULINSH ==============================

function QuestOne(questData, startQuestionNumber, maxWrongAnswers, maxDeadend) {
    this.questData = questData;
    this.currentQuestion = 0;
    this.startQuestionNumber = startQuestionNumber;
    this.maxWrongAnswers = maxWrongAnswers;
    this.wrongAnswers = 0;
    this.maxDeadend = maxDeadend;
    this.dialogHistory = [];
}

QuestOne.prototype.start = function() {
    var startQuestions = this.questData.filter(function(question) {
        return question.startsWith(this.startQuestionNumber + ":");
    }.bind(this));
    var startQuestion = startQuestions[Math.floor(Math.random() * startQuestions.length)];
    this.currentQuestion = this.questData.indexOf(startQuestion);
    this.askQuestion();
};

QuestOne.prototype.askQuestion = function() {
    var questionParts = this.questData[this.currentQuestion].split(":");
    var questionText = questionParts[1];
    var answers = questionParts[2].split(";");
    var answerText = answers.map(function(answer) {
        return answer.split("=")[0];
    }).join(", ").replace(/, (\S*)$/, "$1");
    $(ConvOutObj).append("<br>" + questionText + " (" + answerText + ")");
    return true;
};

QuestOne.prototype.checkAnswer = function(userAnswer) {
    var questionParts = this.questData[this.currentQuestion].split(":");
    var questionNumber = questionParts[0];
    var answers = questionParts[2].split(";");
    for (var i = 0; i < answers.length; i++) {
        var answerParts = answers[i].split("=");
        if (userAnswer === answerParts[0].toLowerCase()) {
            this.dialogHistory.push({ question: questionNumber, answer: answerParts[1] });
            if (answerParts[1] === "exit") {
                $(ConvOutObj).append("<br>Jautājumi ir beigušies! Paldies par dialogu!");
                return true;
            }
            var nextQuestions = this.questData.filter(function(question) {
                return question.startsWith(answerParts[1] + ":");
            });
            var nextQuestion = nextQuestions[Math.floor(Math.random() * nextQuestions.length)];
            if (nextQuestion) {
                $(ConvOutObj).append("<br>Atbilde (" + userAnswer + ") ir pareiza.");
                this.currentQuestion = this.questData.indexOf(nextQuestion);
                this.askQuestion();
            } else {
                if (this.maxDeadend > 0) {
                    this.maxDeadend--;
                    $(ConvOutObj).append("<br>Nevaru atrast jautājumu ar numuru (" + answerParts[1] + ").");
                    this.askQuestion();
                } else {
                    $(ConvOutObj).append("<br>Šādu sekojošo jautājumu nav masivā! Izeju no programmas.");
                    return true;
                }
            }
            return true;
        }
    }
    this.dialogHistory.push({ question: questionNumber, answer: userAnswer });
    this.wrongAnswers++;
    if (this.wrongAnswers > this.maxWrongAnswers) {
        $(ConvOutObj).append("<br>Pārāk daudz nepareizu atbilžu!");
        return true;
    }
    $(ConvOutObj).append("<br>Atbilde (" + userAnswer + ") nav pareiza!");
    return false;
};

QuestOne.prototype.getStatistics = function() {
    return this.dialogHistory;
};

QuestOne.prototype.clearStatistics = function() {
    this.dialogHistory = [];
};

$(document).on("keyup", ConvInObj, function(e) {
    if(e.keyCode === 13) {
        e.preventDefault();
        var userAnswer = $(ConvInObj).val().toLowerCase();
        if (!QuestOne.checkAnswer(userAnswer)) {
            QuestOne.askQuestion();
        }
        $(ConvInObj).val("");
    }
});

var QuestData = [
    "1:What year is the birth of Christ?:0=2;1=3;I don't know=4;Repeat=1;",
    "1:Who is the first US president?:George Washington=5;Abraham Lincoln=6;I don't know=4;Repeat=1;",
    "1:What year is the start of the French Revolution?:1789=7;1914=8;I don't know=4;Repeat=1;",
    "1:What year is the birth of Napoleon Bonaparte?:1769=10;1804=11;I don't know=4;Repeat=1;",
    "1:In which battle was Napoleon Bonaparte finally defeated?:Waterloo=12;Austerlitz=13;I don't know=4;Repeat=1;",
    "1:What year is World War I?:1914=14;1939=15;I don't know=4;Repeat=1;",
    "1:What year is World War II?:1939=16;1914=17;I don't know=4;Repeat=1;",
    "1:Who is the first person to land on the Moon?:Neil Armstrong=18;Yuri Gagarin=19;I don't know=4;Repeat=1;",
    "1:What year did the American Civil War start?:1861=21;1812=22;I don't know=4;Repeat=1;",
    "1:Who discovered America?:Christopher Columbus=23;Leif Erikson=24;I don't know=4;Repeat=1;",
    "2:Yes, the birth year of Christ is 0.:Continue=20;Repeat=1;",
    "3:No, the birth year of Christ is not 1, it is 0.:Continue=20;Repeat=1;",
    "4:No problem, we can learn together!:Continue=20;Repeat=1;",
    "5:Yes, the first US president was George Washington.:Continue=20;Repeat=1;",
    "6:No, the first US president was not Abraham Lincoln, it was George Washington.:Continue=20;Repeat=1;",
    "7:Yes, the start of the French Revolution was in 1789.:Continue=20;Repeat=1;",
    "8:No, the start of the French Revolution was not in 1914, it was in 1789.:Continue=20;Repeat=1;",
    "10:Yes, Napoleon Bonaparte was born in 1769.:Continue=20;Repeat=1;",
    "11:No, Napoleon Bonaparte was not born in 1804, he was born in 1769.:Continue=20;Repeat=1;",
    "12:Yes, Napoleon Bonaparte was finally defeated in the Battle of Waterloo.:Continue=20;Repeat=1;",
    "13:No, Napoleon Bonaparte was not defeated in the Battle of Austerlitz, he was defeated in the Battle of Waterloo.:Continue=20;Repeat=1;",
    "14:Yes, World War I started in 1914.:Continue=20;Repeat=1;",
    "15:No, World War I did not start in 1939, it started in 1914.:Continue=20;Repeat=1;",
    "16:Yes, World War II started in 1939.:Continue=20;Repeat=1;",
    "17:No, World War II did not start in 1914, it started in 1939.:Continue=20;Repeat=1;",
    "18:Yes, the first person to land on the Moon was Neil Armstrong.:Continue=20;Repeat=1;",
    "19:No, the first person to land on the Moon was not Yuri Gagarin, it was Neil Armstrong.:Continue=20;Repeat=1;",
    "21:Yes, the American Civil War started in 1861.:Continue=20;Repeat=1;",
    "22:No, the American Civil War did not start in 1812, it started in 1861.:Continue=20;Repeat=1;",
    "23:Yes, Christopher Columbus discovered America.:Continue=20;Repeat=1;",
    "24:No, Christopher Columbus did not discover America, it was Leif Erikson.:Continue=20;Repeat=1;",
    "20:Do you want to learn another history fact?:Yes=1;No=exit;Repeat=1;"
];

var QuestOne = new QuestOne(QuestData, "1", 3, 3);
QuestOne.start();