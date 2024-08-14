function revealTitle() {
  $("#hidden_title").hide()
  $("#hidden_content").hide()
  $("#original_title").show()
  $("#original_content").show()
}

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
    url: "https://en.wikipedia.org/w/api.php?action=query&list=random&format=json&rnnamespace=0",
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

  $("#original_title").hide()
  $("#original_content").hide()
  $("#original_title").html(title);
  $("#original_content").html(body);

  var filtered_title = ''
  var words = title.split(' ')

  words.forEach(function(word) {
    replacement = '_'.repeat(word.length)
    // remove ',' '(' and ')' from word before regexing it away
    word = word.replace(/[,()]/g, '');
    var pattern = new RegExp(word, 'gi');

    body = body.replace(pattern, replacement);
    filtered_title = filtered_title + ' ' + replacement
  })

  $("#hidden_title").html(filtered_title);
  $("#hidden_content").html(body);
  $("#hidden_title").show()
  $("#hidden_content").show()
}

getRandomArticle();
