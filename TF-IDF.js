//=== TF, IDF, TF-IDF, BOW, VECTORS, ONE-HOT ===================================
function computeTF(wordDict, bow) {
    let tfDict = {};
    let bowCount = bow.length;
    for (let [word, count] of Object.entries(wordDict)) {
        tfDict[word] = count / bowCount;
    }
    return tfDict;
}

function computeIDF(docList) {
    let idfDict = {};
    let N = docList.length;

    for (let doc of docList) {
        for (let [word, val] of Object.entries(doc)) {
            if (val > 0) {
                if (word in idfDict) {
                    idfDict[word] += 1;
                } else {
                    idfDict[word] = 1;
                }
            }
        }
    }

    for (let word in idfDict) {
        idfDict[word] = Math.log(N / idfDict[word]);
    }

    return idfDict;
}

function computeTFIDF(tfBow, idfs) {
    let tfidf = {};
    for (let [word, val] of Object.entries(tfBow)) {
        tfidf[word] = val * idfs[word];
    }
    return tfidf;
}

function docsToVectors(docs) {
    const dict = {};
    docs.forEach((doc, i) => {
        doc.split(' ').forEach((word) => {
            if (!dict[word]) {
                dict[word] = Array(docs.length).fill(0);
            }
            dict[word][i]++;
        });
    });

    // Aprēķinām TF un IDF
    const tf = {};
    const idf = {};
    for (const word in dict) {
        tf[word] = dict[word].map((count, i) => count / docs[i].split(' ').length);
        idf[word] = Math.log(docs.length / dict[word].filter(Boolean).length);
    }

    // Aprēķinām TF-IDF
    const tfidf = {};
    for (const word in tf) {
        tfidf[word] = tf[word].map((tfVal) => tfVal * idf[word]);
    }

    // Pārveidojam TF-IDF vektorus par dokumentu sarakstu
    const vectors = docs.map((doc, i) => {
        const vector = [];
        for (const word in tfidf) {
            vector.push(tfidf[word][i]);
        }
        return vector;
    });

    return {vectors, dict, tfidf};
}

function vectorsToDocs(vectors, dict, tfidf) {
    // Pārveidojam vektorus par dokumentu sarakstu
    const docs = vectors.map((vector, i) => {
        const doc = [];
        let index = 0;
        for (const word in dict) {
            const count = Math.round(vector[index] / tfidf[word][i]);
            for (let j = 0; j < count; j++) {
                doc.push(word);
            }
            index++;
        }
        return doc.join(' ');
    });

    return docs;
}

function W2vDictionary(strings) {
    let dictionary = {};
    strings.forEach(document => {
        let words = document.split(' ');
        words.forEach(word => {
            if (!dictionary.hasOwnProperty(word)) {
                dictionary[word] = Object.keys(dictionary).length;
            }
        });
    });
    return dictionary;
}

function WordToIndex(word, dictionary) {
    return dictionary[word];
}

function cbowPairs(strings, windowSize) {
    if (!Array.isArray(strings) || typeof windowSize !== 'number' || windowSize < 1) {
        console.error('Nepareizi parametri funkcijai.');
        return;
    }
    let globalData = [];
    strings.forEach(document => {
        let words = document.split(' ');
        for (let i = 0; i < words.length; i++) {
            let target = words[i];
            let context = [];

            for (let j = -windowSize; j <= windowSize; j++) {
                if (j === 0) continue;

                let contextIndex = i + j;
                if (contextIndex >= 0 && contextIndex < words.length) {
                    context.push(words[contextIndex]);
                }
            }
            globalData.push({ context, target });
        }
    });
    // Izvada pārus konsolē
//    globalData.forEach(pair => {
//        console.log(`🎯 Target: ${pair.target}, ➡️ Context: ${pair.context.join(', ')}`);
//    });
    return globalData;
}

function cbowOneHotEncode(context, dictionary) {
    let vector = new Array(Object.keys(dictionary).length).fill(0);
    context.forEach(word => {
        if (dictionary.hasOwnProperty(word)) {
            vector[dictionary[word]] = 1;
        }
    });
    return vector;
}

function sgOneHotEncode(words, dictionary) {
    let vectors = [];
    for (let word of words) {
        let vector = new Array(Object.keys(dictionary).length).fill(0);
        let index = dictionary[word];
        vector[index] = 1;
        vectors.push(vector);
    }
    return vectors.flat();
}

function SkipGramPairs(strings, windowSize) {
    let globalPairs = [];
    strings.forEach(document => {
        let pairs = [];
        let words = document.split(' ');
        for (let i = 0; i < words.length; i++) {
            let target = words[i];

            for (let j = -windowSize; j <= windowSize; j++) {
                if (j !== 0 && i + j >= 0 && i + j < words.length) {
                    let context = words[i + j];
                    pairs.push({ target, context });
                }
            }
        }
        globalPairs.push(...pairs);
    });
    // Izvada pārus konsolē
//    globalPairs.forEach(pair => {
//        console.log(`🎯 Target: ${pair.target} ➡️ Context: ${pair.context}`);
//    });
    return globalPairs;
}