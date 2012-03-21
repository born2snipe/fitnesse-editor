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
 
  editor = ace.edit(editorId);

  chrome.extension.sendRequest({method: "theme"}, function(response) {
    editor.setTheme(response.value);
  });
  loadKeybinding(editor);
}

function hideTheDefaultEditorWindow() {
  $("textarea").css("visibility", "hidden");
}

function loadKeybinding(editor) {
  chrome.extension.sendRequest({method: "keybinding"}, function(response) {
    if (response.value != null) {
      var required = require(response.value);
      if (response.value.indexOf('vim') != -1) {
        editor.setKeyboardHandler(required.Vim);
      } else {
        editor.setKeyboardHandler(required.Emacs);
      }
    } else {
      editor.setKeyboardHandler(null);
    }
  });
}
