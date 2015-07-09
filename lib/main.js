var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var data = require("sdk/self").data;
var ui   = require("sdk/ui");
var base64 = require("sdk/base64");
var { ActionButton } = require("sdk/ui/button/action");

links = [];

var button1 = ui.ActionButton({
  id: "loglink",
  label: "log flicker link",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onClick: handleClick1
});


var button2 = ui.ActionButton({
  id: "savelog",
  label: "save log",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onClick: handleClick2
});



function handleClick1(state) {
    var tab = tabs.activeTab;
        links.push(tab.url);

    tab.attach({
        contentScript: "self.postMessage(document.getElementById('image-src').href);",
        onMessage: function(data){
        url = data.split("_").slice(0,-1).join("_")+"_b.jpg";
        tab.url = url;
        console.log(url);
    }
    });
}

function handleClick3(state) {
    var worker = tabs.activeTab.attach({
        contentScriptFile: data.url("content-script.js")
    });
    console.log(JSON.stringify(links));
    worker.port.emit("sendin_base64",JSON.stringify(links));
    
}

function stringify(a){
    var ret="";
    for(var i=0;i<a.length;i++){
        ret=a[i]+"\n"+ret;
    }
    return ret;
}

function handleClick2(state) {
    
    var windows = require("sdk/windows").browserWindows;
    windows.open('data:application/octet-stream;base64,'+base64.encode(stringify(links)));    
}


//window.open('data:application/octet-stream;base64,'+base64.encode(JSON.stringify(links),'utf-8'))"

