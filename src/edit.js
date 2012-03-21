var editorId = "ace_editor";
var editor;

$(function() {
  hideTheDefaultEditorWindow();
  insertTheNewEditorWindow();
  updateTheSave();
});

function updateTheSave() {
  $("form").submit(function () { 
    $("textarea").text(editor.getSession().getValue());
    return true; 
  });
}

function insertTheNewEditorWindow() {
  var editorElement = document.createElement("div");
  editorElement.setAttribute("id", editorId);
  editorElement.innerHTML = $(pageContentId).html();
  editorElement.setAttribute("style", "width: 640px; height: 480px; margin: 110px auto auto 140px;");
  $("body").prepend(editorElement);
 
  //var keybindings = require("ace/keyboard/keybinding/vim").Vim;

  editor = ace.edit(editorId);
  editor.setTheme("ace/theme/clouds");
  //editor.setKeyboardHandler(keybindings);
}

function hideTheDefaultEditorWindow() {
  $("textarea").css("visibility", "hidden");
}
