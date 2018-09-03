// 读写数据
let note;
$(document).ready(function () {
    init();
    $("#content").blur(function () {
        save();
    });

    $("#title").blur(function () {
        loadNote($("#title").val());
    });
});


function loadNote(title) {
    $.ajax({
        type: "GET",
        url: SERVER_PATH.queryOne,
        data: {title: title},
        success: function (data) {
            if (data) {
                let response = new Response(data);
                if (response.getCode() === 200) {
                    if (response.getData()) {
                        note = response.getNote();
                        $("#title").val(note.getTitle());
                        $("#content").text(note.getContent());
                    }

                } else {
                    console.error(response)
                }

            }
        },
        error: function (error) {
            console.error('请求失败\n', error);
        }
    });
}


function save() {
    note.setTitle($("#title").val());
    note.setContent($("#content").val());
    if (note.getContent() === "") {
        console.log("del empty content object");
        deleteNote(note.getTitle());
        return;
    }
    if (note.getId()) {
        // exist
        updateNote(note);
    } else {
        //not exist
        if (note.getContent() !== "") {
            insertNote(note);
        }
    }
}

function insertNote(note) {
    $.ajax({
        type: "POST",
        url: SERVER_PATH.insertOne,
        data: note,
        success: function (data) {
            if (data) {
                let response =new Response(data);
                if (new Response(data).getCode() !== 200) {
                    alert("保存失败");
                } else {
                    note = response.getNote();
                }
            }
        },
        error: function (error) {
            console.error(error);
            alert("服务器请求失败");
        }
    });
}

function updateNote(note) {
    $.ajax({
        type: "POST",
        url: SERVER_PATH.updateOne,
        data: note,
        success: function (data) {
            if (data) {
                if (new Response(data).getCode() !== 200) {
                    alert("保存失败")
                }
            }
        },
        error: function (error) {
            console.error(error);
            alert("服务器请求失败");
        }
    });
}

function deleteNote(title) {
    $.ajax({
        type: "GET",
        url: SERVER_PATH.deleteOne,
        data: {title:title},
        success: function (data) {
            if (data) {
                if (new Response(data).getCode() !== 200) {
                    console.error("删除失败");
                } else {
                    note.setId(null);
                }
            }
        },
        error: function (error) {
            console.error(error);
            alert("服务器请求失败");
        }
    });
}

function init() {
    let titleObj = $("#title");
    //clear
    titleObj.val('');
    $("#content").text('');
    //init
    note = new Note();
    // 从锚链接获取地址
    let title = location.hash;
    if (title === undefined || title == null || title === "") {
        // random
        title = randomString(4);
        note.setTitle(title);
        titleObj.val(title);
        console.log("random title:" + title);
        window.location.href = '#' + title;
    } else {
        console.log("load from hash:" + title);
        //替换html链接
        replaceAnchorLink(title);

        title = title.substr(1);

        //替换标题
        document.title = "note live-" + title;

        note.setTitle(title);
        titleObj.val(title);
        loadNote(title);
    }
}

function randomString(len) {
    len = len || 32;
    const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    const maxPos = $chars.length;
    let pwd = '';
    for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

function replaceAnchorLink(title) {
    $("[href$='{anchor}']").attr("href", function (i, origValue) {
        return origValue.replace('{anchor}', title);
    });
}
