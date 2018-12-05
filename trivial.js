
function handleArticleId(data){
  console.log("test");
  getArticleByID(data["query"]["random"][0]["id"]);
};

function getArticleByID(id){
  $.ajax({
    url: "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&pageids=" + id,
    dataType: "jsonp",
    success: generateCallback(id)
  });
};

function getRandomArticle() {
  $.ajax({
    url: "http://en.wikipedia.org/w/api.php?action=query&list=random&format=json&rnnamespace=0",
    dataType: "jsonp",
    success: handleArticleId
  });

};

function generateCallback(id) {
  return function (data) {
    displayData(data, id);
  }
};

function displayData(data , id){
  console.log("here!");
  var container = data["query"]["pages"][id];
  console.log(container);
  console.log(container["title"]);
  var title = container["title"];
  var body = container["extract"];

  var filler = '_______';
  var pattern = new RegExp(title, 'gi');
  body = body.replace(pattern, filler);

  $("#title").html(filler);
  $("#content").html(body);
}

getRandomArticle();
