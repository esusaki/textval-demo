//function translate(){
 //   text_area = document.getElementById('text_area');
 //   const word = text_area.value;
 //   alert(word);
//}

const ok_button = document.getElementById('ok_button');

ok_button.addEventListener(
    "click",function(){
        console.log('hey')
    }
)

//kuromoji.builder({ dicPath: "dict" }).build(function (err, tokenizer) {
    // tokenizer is ready
//    var path = tokenizer.tokenize(word);
 //   console.log(path);
//});