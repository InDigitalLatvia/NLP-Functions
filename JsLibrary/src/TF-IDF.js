//=== TF, IDF, TF-IDF, BAG OF WORDS, VECTORS ===================================
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