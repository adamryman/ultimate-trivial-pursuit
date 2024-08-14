let titleHidden = true
let article_id = null
let excluded_words = ["the", "is", "a", "and", "in", "list", "of"]


function toggleTitle() {
  if (titleHidden) {
    console.log("reveal title");
    revealTitle();
  } else {
    hideTitle();
    console.log("hide title");
  }

}

function revealTitle() {
  $("#hidden_title").hide()
  $("#hidden_content").hide()
  $("#original_title").show()
  $("#original_content").show()
  btn = $('#reveal_conceal_button')
  btn.text("Conceal")
  btn.backgroundColor = '#cc3333'
  btn.addClass("toggle_button_off")
  btn.removeClass("toggle_button_on")
  titleHidden = false
}

function hideTitle() {
  $("#original_title").hide()
  $("#original_content").hide()
  $("#hidden_title").show()
  $("#hidden_content").show()
  btn = $('#reveal_conceal_button')
  btn.text("Reveal")
  btn.addClass("toggle_button_on")
  btn.removeClass("toggle_button_off")
  titleHidden = true
}

function handleArticleId(data){
  article_id = data["query"]["random"][0]["id"]
  console.log(article_id)
  getArticleByID(article_id);
};

function getArticleByID(id){
  $("#page_url").val(window.location.origin + window.location.pathname + '?article_id=' + article_id)
  window.history.pushState({}, document.title, window.location.origin + window.location.pathname + '?article_id=' + article_id);
  console.log(id)
  //window.location.search = 'article_id=' + id
  console.log($("#page_url"))
  console.log(id)
  $.ajax({
    url: "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&pageids=" + id,
    dataType: "jsonp",
    success: generateCallback(id)
  });
};

function getRandomArticle() {
  hideTitle()
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

  var hidden_title = ''
  var words = title.split(' ')

  words.forEach(function(word) {
    // remove ',' '(' and ')' from word before regexing it away
    word = word.replace(/[,()]/g, ' ');
    replacement = '_'.repeat(word.length)
    hidden_title = hidden_title + ' ' + replacement


    // if it is excluded return
    if (!excluded_words.includes(word.toLowerCase())) {
      var pattern = new RegExp(word, 'gi');

      body = body.replace(pattern, replacement);
    }
  })

  $("#hidden_title").html(hidden_title);
  $("#hidden_content").html(body);
  $("#hidden_title").show()
  $("#hidden_content").show()
}

function sharePage() {
  copyToClipboard($("#page_url").val())
}

function copyToClipboard(text) {
  console.log(text)
  // Create a temporary element to hold the text
  const tempElement = document.createElement("textarea");
  tempElement.value = text;

  // Prevent the textarea from being visible
  tempElement.style.position = "absolute";
  tempElement.style.left = "-9999px";
  document.body.appendChild(tempElement);

  // Select and copy the text
  tempElement.select();
  document.execCommand("copy");

  // Remove the temporary element from the document
  document.body.removeChild(tempElement);

  // Optional: Show an alert or other notification
  var popup = document.getElementById('popup');
  popup.classList.add('show');

  // Hide the popup after 2 seconds
  setTimeout(function() {
      popup.classList.remove('show');
  }, 2000);
}

//$(document).ready(function() {
const urlParams = new URLSearchParams(window.location.search);
const aid = urlParams.get('article_id');
if (aid == null) {
  getRandomArticle();
} else {

  article_id = aid;
  console.log('article_id is in search / query url')
  console.log(aid);
  getArticleByID(aid);
}
//});
document.getElementById('page_url').addEventListener('click', function() {
  this.select();
});
