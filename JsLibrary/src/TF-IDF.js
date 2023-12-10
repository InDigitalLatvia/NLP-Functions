//=== TF, IDF, TF-IDF, BAG OF WORDS ============================================
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