console.log('yo')

kuromoji.builder({ dicPath: "dict" }).build(function (err, tokenizer) {
    // tokenizer is ready
    var path = tokenizer.tokenize("すもももももももものうち");
    console.log(path);
});