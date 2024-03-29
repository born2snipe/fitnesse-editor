var editorId = "ace_editor";
var editor;
var editorView;
var editorToolbar;
var formatter = new WikiFormatter();
var shouldFormatTextOnSave = false;

$(function() {
  hideTheDefaultEditorWindow();
  insertEditorView();
  insertTheNewEditorWindow();
  insertToolbar();
  updateTheSave();
  updateTheFormat();
  $(editor).focus();
  chrome.extension.sendRequest({method: "formatOnSave"}, function(response) {
    shouldFormatTextOnSave = response.value == "true";
  });
});

function updateTheFormat() {
  $("#toolbar_Format").click(function() {
    formatText();
    $(editor).focus();
  });
}

function updateTheSave() {
  $("#toolbar_Save").click(function() {
    if (shouldFormatTextOnSave)  {
      formatText();
    }   

    $("textarea").text(editor.getSession().getValue());
    $("form").submit();
  });
}

function formatText() {
  var formattedText = formatter.format(editor.getSession().getValue());
  editor.getSession().setValue(formattedText);
}

function insertEditorView() {
  editorView = document.createElement("div");
  editorView.setAttribute("id", "editor_view");
  editorView.setAttribute("style", "width: 640px; height: 480px; margin: 110px auto auto 140px;");
  $("body").append(editorView);
}

function insertToolbar() {
  editorToolbar = document.createElement("div");
  editorToolbar.setAttribute("id", "editor_toolbar");
  editorToolbar.setAttribute("style", "background-color:#DDDDDD;border-top:1px solid #999999;border-bottom:1px solid #999999;padding:5px 10px 5px 10px;");
  $(editorView).prepend(editorToolbar);

  toolbarButton("Save");
  toolbarButton("Format");
}

function toolbarButton(text) {
  var button = document.createElement("a");
  button.setAttribute("id", "toolbar_"+text);
  button.innerHTML = text;
  button.setAttribute("style", "color: #000000;padding:2px;background-color:#DDDDDD;border-top:1px solid #BBBBBB;border-left:1px solid #BBBBBB;border-right:1px solid #999999;border-bottom:1px solid #999999;margin-right:10px;font-family:verdana;font-size:10pt;cursor:pointer;");
  $(editorToolbar).append(button);
  $(button).hover(function() {
    $(this).css("background-color", "#EEEEEE");
  }, function() {
    $(this).css("background-color", "#DDDDDD");
  });
}

function insertTheNewEditorWindow() {
  var editorElement = document.createElement("div");
  editorElement.setAttribute("id", editorId);
  editorElement.innerHTML = $(pageContentId).html();
  editorElement.setAttribute("style", "width: 640px; height: 480px;");
  $(editorView).append(editorElement);
 
  editor = ace.edit(editorId);

  chrome.extension.sendRequest({method: "theme"}, function(response) {
    editor.setTheme(response.value);
  });
  loadKeybinding(editor);
}

function hideTheDefaultEditorWindow() {
  $("textarea").css("display", "none");
  $(".edit_buttons").css("display", "none");
  $(".edit_options").css("display", "none");
  $(".hints").css("display", "none");
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
