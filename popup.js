
function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];

    var url = tab.url;

    console.assert(typeof url == 'string', 'tab.url should be a string');


    // busca texto selecionado no tab
    chrome.tabs.executeScript(tab.id, {
      code: "window.getSelection().toString();"
    }, function(result){

      // text selected
      if( (text = result[0]) != "" ){

        translate(text, function(translated){
          renderStatus(translated);
        });

      }
      else{
        renderStatus("Selecione um texto primeiro");
      }

    });

  });

}

function AdapterTranslatorYandexAPI(){
  this.key = "";
  this.urlApi = "https://translate.yandex.net/api/v1.5/tr.json/translate?key={key}&text={q}&lang={s}&format=plain";

  this.translate = function(text, callback, options){

    var url = this.urlApi.replace("{key}", this.key)
      .replace("{q}", text)
      .replace("{s}", options.current_lang)
      .replace("{t}", options.for_lang);
    var method = "GET";
    
    var request = new XMLHttpRequest();
    request.responseType = "json";

    request.onreadystatechange = function(){

      if(this.readyState == 4 && this.status == 200){
        callback(request.response.text[0]);
      }
    }

    request.open(method, url, true);
    request.send();

  }

}

function AdapterTranslatorGoogleAPI(){

  this.key = "";
  this.urlApi = "https://www.googleapis.com/language/translate/v2?key={key}&q={q}&source={s}&target={t}";

  this.translate = function(text, callback, options){
    // traduzir texto

    var url = this.urlApi.replace("{key}", this.key)
      .replace("{q}", text)
      .replace("{s}", options.current_lang)
      .replace("{t}", options.for_lang);
    var method = "get";

    
    var request = new XMLHttpRequest();
    request.responseType = "json";
    request.onreadystatechange = function(){

      // requisicao finalizada
      if(this.readyState == 4){
        callback({
          data: text_translated
        })

      }

    }
    request.open(method, url, true);
    request.send();
  }
}



function translator(className){

  var translator = null;

  switch(className){
    case "GoogleAPI": translator = new AdapterTranslatorGoogleAPI();
    break;
    case "YandexAPI": translator = new AdapterTranslatorYandexAPI();
    break;
  }

  return translator;
}



function translate(text, callback, options){

  var default_options =  {
    "current_lang": "pt", 
    "for_lang": "en"
  };


  translator("YandexAPI").translate(text, callback, default_options);
}


function renderStatus(statusText) {
  document.getElementById('status').innerHTML = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl();
});