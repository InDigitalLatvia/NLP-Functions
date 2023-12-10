//=== Word2SemNear =============================================================
// Function is looking for "context" word semantic "neighbours".
// Function is ranking "most frequent" neighbours.
// Function is increasing ranking for neighbours by "context frequency".
// Function compares "words" by neighbours returning "common context".
// 
// Function can return anything from:
// 
//                  a) most ranked neighbours for each/all context word/s
//                  b) unique neighbours for each/all context word/s
//                  c) common neighbours for each/all context word/s
//                  
// Function can be adjusted with "neighbourSize" for more/less accurate context.
// Function does not use Neyral Networks but can be used further to train them.

    const dataset = [ // Example dataset
        "šodien mazais lauku suns lapsa medī gati",
        "šodien lielais suns skrien pa lauku",
        "šodien oranžā skaistā lapsa medī peles",
        "šodien sīkais kaķis guļ uz palodzes",
        "šodien milzīgais suns guļ zālē pie mājas",
        "šodien lidojošais putns čivina uz koka",
        "šodien slīpētā lapsa lēkā kā nelaba",
        "šodien muļķa gatis programmē intelektu",
        "šodien pelēkais suns kož kaimiņam",
        "šodien zilā lapsa ķer zvaigznes",
        "šodien zaļā lapsa skrien kur pagadās"
    ];

    const words = ["lapsa", "suns"]; // Example context words (can be 1/many)
    const windowSize = 1; // How far we are loking for neighbours
    const neighbourSize = 1; // How much words to return as one neighbour
    const direction = 0; // 0 = both, 1 = left only, 2 = right only

function Word2SemNear(words, dataset, windowSize, neighbourSize, direction) {
    
    function WordProcessor(words, dataset, window, neighbourSize, direction) {
    const similarWords = {};
    dataset.forEach(sentence => {
        const sentenceWords = sentence.split(' ');
        words.forEach(contextPhrase => {
            const contextWords = contextPhrase.split(' ');
            contextWords.forEach((contextWord, wordIndex) => {
                const contextIndex = sentenceWords.findIndex(word => word === contextWord);
                if (contextIndex === -1) {
                    return;
                }
                const start = (direction === 2) ? contextIndex + 1 : Math.max(0, contextIndex - window);
                const end = (direction === 1) ? contextIndex : Math.min(sentenceWords.length - neighbourSize + 1, contextIndex + window + 1);
                for (let i = start; i < end; i++) {
                    const group = sentenceWords.slice(i, i + neighbourSize).join(' ');
                    const distance = Math.abs(i - contextIndex);
                    if (distance <= window && !contextPhrase.includes(group)) {
                        const weight = 1 / (distance + 1);
                        if (!similarWords[group]) {
                            similarWords[group] = { weight, count: 1 };
                        } else {
                            similarWords[group].weight += weight;
                            similarWords[group].count += 1;
                        }
                    }
                }
            });
        });
    });
    const sortedSimilarWords = Object.keys(similarWords).sort((a, b) => {
        const weightDiff = similarWords[b].weight - similarWords[a].weight;
        if (weightDiff === 0) {
            return similarWords[b].count - similarWords[a].count;
        }
        return weightDiff;
    });
    return sortedSimilarWords;
}


    function CompareContexts(words, dataset, windowSize, neighbourSize, direction) {
        const similarWordsList = words.map(word => {
            const similarWords = WordProcessor([word], dataset, windowSize, neighbourSize, direction);
            return { word, similarWords };
        });

        const commonWords = similarWordsList.reduce((common, { similarWords }) => {
            return common.length === 0 ? similarWords : common.filter(word => similarWords.includes(word));
        }, []);

        const uniqueWordsList = similarWordsList.map(({ word, similarWords }) => {
            const uniqueWords = similarWords.filter(word => !commonWords.includes(word) && !words.includes(word) && !dataset.includes(word));
            return { word, similarWords, uniqueWords };
        });

        return {
            commonWords,
            uniqueWordsList
        };
    }

    return CompareContexts(words, dataset, windowSize, neighbourSize, direction);
}

function printResults(comparisonResult) {
    dataset.forEach(pair => {
    console.log(`➡️ ${pair}`);
    });
    comparisonResult.uniqueWordsList.forEach(({ word, similarWords, uniqueWords }) => {
        console.log(`Neighbour words for "${word}": ${similarWords.join(', ')}`);
        console.log(`Unique words for "${word}": ${uniqueWords.join(', ')}`);
    });
    console.log(`Common words: ${comparisonResult.commonWords.join(', ')}`);
}

const comparisonResult = Word2SemNear(words, dataset, windowSize, neighbourSize, direction);

printResults(comparisonResult);