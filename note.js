// 读写数据
let note;
let saveStatus = 0;
let content_obj;
let title_obj;
let tip_obj;
let contentType_obj;
let apiUrl_obj;

$(document).ready(function () {
    content_obj = $("#content");
    title_obj = $("#title");
    tip_obj = $('#tip');
    contentType_obj = $('#contentType');
    apiUrl_obj = $('#api_url');

    init();
    //bind save event
    content_obj.blur(function () {
        console.log('on blur to save data');
        save();
    });
    content_obj.bind('input propertychange',
        _.throttle(function () {
            save();
        }, 10000, {leading: true})
    );
    content_obj.bind('input propertychange', status2unsave);
    title_obj.blur(function () {
        loadNote(title_obj.val());
    });
    //bind drop down event
    contentType_obj.change(() => {
        status2unsave();
        note.setcontentType(contentType_obj.val());
        save(true);
    });
});

function status2saved() {
    if (saveStatus === 0) {
        tip_obj.html('已保存');
    }
    saveStatus = 1;
}

function status2unsave() {
    if (saveStatus === 1) {
        tip_obj.html('未保存');
    }
    saveStatus = 0;
}

function status2error(msg) {
    tip_obj.html("<font style='color:red'>" + msg + "</font>");
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
                        tip_obj.val(note.getTitle());
                        content_obj.text(note.getContent());
                        contentType_obj.val(note.getContentType())
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
    if (force !== true && saveStatus === 1) {
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
                    status2error('保存失败，' + response.getMsg());
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
                    status2error('保存失败，' + response.getMsg());
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
                    status2error('保存失败，' + response.getMsg());
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

    //clear
    title_obj.val('');
    content_obj.text('');
    //init
    note = new Note();
    // 从锚链接获取地址
    let title = location.hash;
    if (title === undefined || title == null || title === "") {
        // random
        title = randomString(4);
        note.setTitle(title);
        title_obj.val(title);
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
        title_obj.val(title);
        //update apiUrl
        apiUrl_obj.attr('href', SERVER_PATH.renderPrefix + title);
        apiUrl_obj.text(SERVER_PATH.renderPrefix + title);

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
