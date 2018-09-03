
let title = location.hash;
if (title === undefined || title == null || title === "") {
    console.log("hash not exist");
} else {
    console.log("load from hash:" + title);
    title = title.substr(1);

    //替换标题
    document.title = document.title + "-" + title;

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
                        document.getElementById("content").innerHTML = markdown.toHTML(note.getContent());
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
