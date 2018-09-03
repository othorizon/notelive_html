// 读写数据
let note;
let saveStatus = 1;
let content_obj = $("#content");
let title_obj = $("#title");
let tip_obj = $('#tip');

$(document).ready(function () {
    content_obj = $("#content");
    title_obj = $("#title");
    tip_obj = $('#tip');

    init();
    content_obj.blur(function () {
        console.log('on blur to save data');
        save();
    });
    content_obj.bind('input propertychange',
        _.throttle(function () {
            save();
        }, 10000, {leading: false})
    );
    content_obj.bind('input propertychange', status2unsave);
    title_obj.blur(function () {
        loadNote(title_obj.val());
    });
});

function status2saved() {
    if (saveStatus === 0) {
        tip_obj.html('已保存');
        saveStatus = 1;
    }
}

function status2unsave() {
    if (saveStatus === 1) {
        tip_obj.html('未保存');
        saveStatus = 0;
    }
}

function status2error(msg) {
    tip_obj.html("<p style='color:red'>" + msg + "</p>");
    saveStatus = 0;
}

function status2notConnect() {
    status2error('保存失败，服务器连接失败');
}

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
                    console.error(response);
                    status2error('读取数据错误,' + response.getMsg());
                }

            }
        },
        error: function (error) {
            console.error(error);
            status2error('读取数据失败,服务器连接失败');
        }
    });
}


function save(force) {
    if (force!==true&&saveStatus === 1) {
        console.log('do not need save');
        return;
    }

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
                let response = new Response(data);
                if (response.getCode() !== 200) {
                    console.error(response);
                    status2error('保存失败，'+response.getMsg());
                } else {
                    status2saved();
                    note = response.getNote();
                }
            }
        },
        error: function (error) {
            console.error(error);
            status2notConnect();
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
                let response = new Response(data);
                if (response.getCode() !== 200) {
                    status2error('保存失败，'+response.getMsg());
                } else {
                    status2saved();
                    console.log('update data');
                }
            }
        },
        error: function (error) {
            console.error(error);
            status2notConnect();
        }
    });
}

function deleteNote(title) {
    $.ajax({
        type: "GET",
        url: SERVER_PATH.deleteOne,
        data: {title: title},
        success: function (data) {
            if (data) {
                let response = new Response(data);
                if (response.getCode() !== 200) {
                    status2error('保存失败，'+response.getMsg());
                } else {
                    status2saved();
                    note.setId(null);
                }
            }
        },
        error: function (error) {
            console.error(error);
            status2notConnect();
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
