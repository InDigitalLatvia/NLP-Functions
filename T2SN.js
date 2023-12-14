//=== T2SN (Text To Semantic Neighbours ========================================
// Function is looking for "context" word semantic "neighbours".
// Function is ranking "most frequent" neighbours.
// Function compares context words by neighbours returning "common context".
// 
// Function can return anything from:
// 
//                  a) most ranked neighbours for each/all context word/s
//                  b) unique neighbours for each/all context word/s
//                  c) common neighbours for each/all context word/s
//                  
// Function can be adjusted with "neighbourCount" for more/less accurate context.
// Function stopwords can be used to filter dataset in specific cases.
// Function is optimized for best performance.
// Function does not use Neyral Networks but can be used further to train them.

    var stopWords = [ // Example stopwords
        'a', 'the', 'is', 'are', 'and', 'or', 'but', 'of',
        'at', 'in', 'on', 'it', 'this', 'that', 'these', 'those', 'it',
        'they', 'we', 'you', 'us', 'them', 'his', 'her', 'their', 'our',
        'my', 'your', 'i', 'me', 'mine', 'yours', 'his', 'hers', 'ours',
        'theirs', 'who', 'what', 'where', 'when', 'why', 'how', 'which',
        'whose', 'whom', 'to', 'for', 'with', 'without', 'has', 'was',
        'as', 'be', 'not', 'am', 'no', 'yes', 'by', 'an'];

    var dataSet = [ // Example dataset
        "this morning the small country dog is ready to hunt foxes",
        "at noon the big dog runs through the field",
        "in the afternoon the beautiful orange fox hunts mice",
        "at dusk the tiny cat sleeps on the windowsill",
        "during the night the huge dog sleeps on the grass near the house",
        "at dawn the flying bird chirps on the tree",
        "yesterday the cunning fox jumped like crazy",
        "last night the silly John programmed intelligence",
        "this evening the grey dog bites the neighbor",
        "tonight the blue fox catches stars",
        "right now the green fox runs wherever it can",
        "earlier the playful cat chased its tail",
        "later the brown dog will play fetch in the park",
        "soon the quick bird will fly high in the sky",
        "tomorrow the white fox will sneak through the snow",
        "next week the brave dog will guard the house",
        "in a while the red bird will sing a beautiful song",
        "in a moment the black cat will prowl the night",
        "in the future the yellow fox will bask in the sun",
        "every day the loyal dog waits for its owner"
    ];

    console.log('Processing dataset with ' + dataSet.length + ' sentences.');

    var contextWords = ["fox", "dog"]; // Example context words (can be 1/many)
    var neighbourCount = 1; // How much words to return as one neighbour
    var direction = 0; // 0 = both, 1 = left only, 2 = right only

    function T2SN(contextWords, stopWords, dataSet, neighbourCount, direction) {

        function getRightWords(contextPhrase, contextWord, count) {
            var regex = new RegExp(`${contextWord}(\\s\\S+){0,${count}}`);
            var match = contextPhrase.match(regex);
            return (match && match[0]) ? match[0].substring(contextWord.length).trim() : '';
        }

        function getLeftWords(contextPhrase, contextWord, count) {
            var regex = new RegExp(`((\\S+\\s){0,${count}})${contextWord}`);
            var match = contextPhrase.match(regex);
            return (match && match[1]) ? match[1].trim() : '';
        }

        function removeStopwords(dataSet, stopWords) {
            var stopwordsSet = new Set(stopWords);
            var filteredDataset = dataSet.map(sentence => {
                var contextWords = sentence.split(' ');
                var filteredWords = contextWords.filter(word => !stopwordsSet.has(word));
                return filteredWords.join(' ');
            });
            return filteredDataset;
        }

        dataSet = removeStopwords(dataSet, stopWords);

        function WordProcessor(contextWords, dataSet, neighbourCount, direction) {
            var similarNeighbours = {};
            for (let cp = 0; cp < dataSet.length; cp++) {
                var contextPhrase = dataSet[cp];
                for (let cw = 0; cw < contextWords.length; cw++) {
                    var contextWord = contextWords[cw];
                    var contextIndex = contextPhrase.indexOf(contextWord);
                    if (contextIndex === -1) {
                        continue;
                    }
                    if (direction === 0) {
                        var neighbour = getRightWords(contextPhrase, contextWord, neighbourCount);
                        if (neighbour !== '') {
                            var weight = 1;
                            if (!similarNeighbours[neighbour]) {
                                similarNeighbours[neighbour] = { weight, count: 1 };
                            } else {
                                similarNeighbours[neighbour].weight += weight;
                                similarNeighbours[neighbour].count += 1;
                            }
                        }
                        var neighbour = getLeftWords(contextPhrase, contextWord, neighbourCount);
                        if (neighbour !== '') {
                            var weight = 1;
                            if (!similarNeighbours[neighbour]) {
                                similarNeighbours[neighbour] = { weight, count: 1 };
                            } else {
                                similarNeighbours[neighbour].weight += weight;
                                similarNeighbours[neighbour].count += 1;
                            }
                        }
                    }
                    if (direction === 1) {
                        var neighbour = getLeftWords(contextPhrase, contextWord, neighbourCount);
                        if (neighbour !== '') {
                            var weight = 1;
                            if (!similarNeighbours[neighbour]) {
                                similarNeighbours[neighbour] = { weight, count: 1 };
                            } else {
                                similarNeighbours[neighbour].weight += weight;
                                similarNeighbours[neighbour].count += 1;
                            }
                        }
                    }
                    if (direction === 2) {
                        var neighbour = getRightWords(contextPhrase, contextWord, neighbourCount);
                        if (neighbour !== '') {
                            var weight = 1;
                            if (!similarNeighbours[neighbour]) {
                                similarNeighbours[neighbour] = { weight, count: 1 };
                            } else {
                                similarNeighbours[neighbour].weight += weight;
                                similarNeighbours[neighbour].count += 1;
                            }
                        }
                    } 
                }

            }
            console.log('Preparing statistics for context word: ' + contextWord);
            var sortedSimilarWords = Object.keys(similarNeighbours).sort((a, b) => {
                var weightDiff = similarNeighbours[b].weight - similarNeighbours[a].weight;
                if (weightDiff === 0) {
                    return similarNeighbours[b].count - similarNeighbours[a].count;
                }
                return weightDiff;
            });
            return { similarNeighbours, sortedSimilarWords };
        }

        function CompareNeighbours(contextWords, dataSet, neighbourCount, direction) {
            const similarWordsList = contextWords.map(word => {
                const { similarNeighbours, sortedSimilarWords } = WordProcessor([word], dataSet, neighbourCount, direction);
                return { word, similarNeighbours, sortedSimilarWords: new Set(sortedSimilarWords) };
            });
            const commonWords = similarWordsList.reduce((common, { sortedSimilarWords }) => {
                if (common.size === 0) {
                    return sortedSimilarWords;
                } else {
                    return new Set([...common].filter(word => sortedSimilarWords.has(word)));
                }
            }, new Set());
            const wordsSet = new Set(contextWords);
            const datasetSet = new Set(dataSet);
            const uniqueWordsList = similarWordsList.map(({ word, similarNeighbours, sortedSimilarWords }) => {
                const uniqueWords = new Set([...sortedSimilarWords].filter(word => !commonWords.has(word) && !wordsSet.has(word) && !datasetSet.has(word)));
                return { word, similarNeighbours, sortedSimilarWords: Array.from(sortedSimilarWords), uniqueWords: Array.from(uniqueWords) };
            });
            return {
                commonWords: Array.from(commonWords),
                uniqueWordsList
            };
        }

        return CompareNeighbours(contextWords, dataSet, neighbourCount, direction);
    }

    function printResults(results) {
        results.uniqueWordsList.forEach(({ word, similarNeighbours, sortedSimilarWords, uniqueWords }) => {
            console.log(`Neighbour words for "${word}" (${sortedSimilarWords.length}): ${sortedSimilarWords.map(word => word + ' (' + similarNeighbours[word].count + ')').join(', ')}`);
            console.log(`Unique words for "${word}" (${uniqueWords.length}): ${uniqueWords.map(word => word + ' (' + similarNeighbours[word].count + ')').join(', ')}`);
        });
        console.log(`Common words (${results.commonWords.length}): ${results.commonWords.map(word => word + ' (' + results.uniqueWordsList[0].similarNeighbours[word].count + ')').join(', ')}`);
    }

    var results = T2SN(contextWords, stopWords, dataSet, neighbourCount, direction);

    printResults(results);