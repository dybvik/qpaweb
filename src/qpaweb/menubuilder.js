function menubuilder(parent, action, exposeurl) {
    // actionSelect and actionsMenu hard coded
    // lacks proper error handling
    $.ajax({
        url: exposeurl,
        type: "GET",
        dataType: "jsonp",
        jsonpCallback: "capabilities"
    });
};

function capabilities(json) {
    var tmp;
    var menuname;
    var opt;
    var tmpLabel;
    var tmpInputType;
    if (!json.Error) {
        $.each(json.modules, function (idx, val) {
            // Parsing JSON for modules to show in menu
            if (json.modules[idx].showInMenu == 1) {
                tmp = document.createElement("option");
                menuname = JSON.stringify(idx);
                tmp.text = removequotes(menuname);
                tmp.value = tmp.text;
                document.getElementById("actionSelect").appendChild(tmp);
                tmp = null;
                menuname = null;
            }
            if (val.hasOwnProperty("menuItems")) {
                $.each(val, function (idxV, valV) {
                        // Parsing JSON for input fields
                        $.each(valV, function (idxMI, valMI) {
                            menuname = removequotes(JSON.stringify(idxMI));
                            tmpInputType = removequotes(JSON.stringify(valMI));
                            if (tmpInputType.substring(1,7) == "select") {
                                $.each(valMI, function (idxFT, valFT) {
                                    tmp = document.createElement("select");
                                    tmp.id = menuname;
                                    tmp.name = menuname;
                                    tmpLabel = document.createElement("label");
                                    tmpLabel.setAttribute("for", menuname);
                                    tmpLabel.id = "label"+menuname;
                                    $.each(valFT, function (idxSel, valSel) {
                                        opt = document.createElement("option");
                                        opt.text = removequotes(JSON.stringify(idxSel));
                                        opt.value = removequotes(JSON.stringify(valSel));
                                        tmp.appendChild(opt);
                                        opt = null;
                                    });
                                    document.getElementById("actionsMenu").appendChild(tmpLabel);
                                    document.getElementById("label"+menuname).
                                        appendChild(document.createTextNode(menuname));
                                    document.getElementById("actionsMenu").appendChild(tmp);
                                    tmp = null;
                                });
                            } else if (tmpInputType.substring(1,6) == "input") {
                                tmpLabel = document.createElement("label");
                                tmpLabel.setAttribute("for", menuname);
                                tmpLabel.id = "label"+menuname;
                                tmp = document.createElement("input");
                                tmp.setAttribute("type", "text");
                                tmp.setAttribute("id", menuname);
                                tmp.setAttribute("name", menuname);
                                document.getElementById("actionsMenu").appendChild(tmpLabel);
                                document.getElementById("label"+menuname).
                                    appendChild(document.createTextNode(menuname));
                                document.getElementById("actionsMenu").appendChild(tmp);
                                tmpLabel = null;
                                tmp = null;
                            } else {
                                // Input type not supported
                            }
                        });
                        menuname = null;
                    }
                )
            }
        });
    }
}
function removequotes(input) {
    var cleaned;
    cleaned = input.substring(1, input.length - 1);
    return cleaned;
}