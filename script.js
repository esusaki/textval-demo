//function translate(){
 //   text_area = document.getElementById('text_area');
 //   const word = text_area.value;
 //   alert(word);
//}

const ok_button = document.getElementById('ok_button');

ok_button.addEventListener(
    "click",function(){
        const text_area = document.getElementById('text_area');
        var w = text_area.value

        kuromoji.builder({ dicPath: "dict" }).build(function (err, tokenizer) {
            var path = tokenizer.tokenize(w);
           console.log(path);
         });
    }
)

