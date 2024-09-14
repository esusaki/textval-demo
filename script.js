text_area = document.getElementById('text_area');

function translate(){
    const word = text_area.value;
    kuromoji.builder({ dicPath: "dict" }).build(function (err, tokenizer) {
        // tokenizer is ready
        var path = tokenizer.tokenize(word);
        console.log(path);
    });
}

