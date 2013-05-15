function menubuilder(parent, action, exposeurl) {
    $.ajax({
        url: exposeurl + '?callback=?',
        type: "GET",
        dataType: "jsonp",
        jsonpCallback: "callback"
    });
};

function callback(json) {
    if (!json.Error) {
        alert("ok");
        alert(JSON.stringify(json, undefined, 2));
    }
    else {
        alert(json.Message);
    }
}