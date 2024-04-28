const startsWithNumberAndPeriod = (line) => {
    const pattern = /^\*\*([0-9]+)\. (.*)\*\*$/;
    const match = line.match(pattern);
    if (match) {
        const number = match[1]?.trim('*');
        const questionType = match[2]?.trimEnd('*');
        return { number, questionType };
    } else {
        return null;
    }
};

const getQuestionType = (line) => {
    const pattern = /^\*\*Question ([0-9]+):\*\* (.*)$/;
    const match = line.match(pattern);
     if (match) {
        const number = match[1]?.trim('*');
        const questionType = match[2]?.trimEnd('*');
        return { number, questionType };
     } else {
        return null;
    }
}
export const parseQuiz = (text) => {
    const quiz = [];
    const lines = text.split('\n');
    let currentQuiz = {};
    let parseQuestions = false;
    let parseAnswers = false;
    let isNextLineAQuestion = false;
    let isNextLineAnOption = false;
    let isNextLineAnAnswer = false;
    let isMCQ = false;
    let isTrueFalse = false;

    lines.forEach((line, _) => {
        if (line.trim() !== '') {
            if (line.startsWith('**Answer')) {
                parseAnswers = true;
                parseQuestions = false;
            } else if (line.startsWith('**Question ')) {
                parseQuestions = true;
                parseAnswers = false;
                isNextLineAnAnswer = false;
            }

           if (parseQuestions) {
                let res = getQuestionType(line);
                if (res) {
                    currentQuiz = {
                        id: res.number,
                        questionType: res.questionType,
                        correctAnswer: ''
                    }
                    quiz.push(currentQuiz)
                    isNextLineAQuestion = true;
                    isNextLineAnOption = false;
                    isMCQ = currentQuiz.questionType?.startsWith('MCQ')
                    isTrueFalse = currentQuiz.questionType?.startsWith('True')
                } else {
                    if (!isMCQ) {
                        currentQuiz.question = line;
                        parseAnswers = true;
                    } else if (!isNextLineAnOption && isMCQ) {
                        currentQuiz.question = line;
                        isNextLineAnOption = true;
                    } else if (isNextLineAnOption) {
                        if (!currentQuiz?.options) {
                            currentQuiz.options = [];
                        }
                        currentQuiz.options.push(line)
                        if (currentQuiz?.options?.length === 4) {
                            isNextLineAnOption = false;
                            parseAnswers = true;
                        }
                    }
                    if (isTrueFalse) {
                        currentQuiz.options = ["True", "False"]
                        isTrueFalse = false;
                        parseAnswers = true;
                    }
                    isNextLineAQuestion = false;
                }
            } else if(parseAnswers) {
                isNextLineAnAnswer = true;
                parseAnswers = false;
            } else if (isNextLineAnAnswer) {
                currentQuiz.correctAnswer += `${line}`;
            }

           if (parseAnswers || isNextLineAnAnswer) {
               parseQuestions = false;
           }
        }
    });

    console.log(quiz);
    return quiz;
};