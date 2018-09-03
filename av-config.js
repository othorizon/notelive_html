const SERVER_PREFIX = 'http://live.api.rizon.top';

const SERVER_PATH = {
    renderPrefix: SERVER_PREFIX + "/render/",
    queryOne: SERVER_PREFIX + "/server/queryOne",
    updateOne: SERVER_PREFIX + "/server/updateOne",
    insertOne: SERVER_PREFIX + "/server/insertOne",
    deleteOne: SERVER_PREFIX + "/server/deleteOne"
};

class Note {
    constructor(obj) {
        if (obj) {
            this.id = obj.id;
            this.title = obj.title;
            this.password = obj.password;
            this.content = obj.content;
            this.contentType = obj.contentType;
        }
        return this;
    }

    getId() {
        return this.id;
    }

    setId(id) {
        this.id = id;
        return id;
    }

    getTitle() {
        return this.title;
    }

    getContent() {
        return this.content;
    }

    getPassword() {
        return this.password;
    }

    getContentType() {
        return this.contentType;
    }

    setTitle(title) {
        this.title = title;
        return this;
    }

    setContent(content) {
        this.content = content;
        return this;
    }

    setPassword(password) {
        this.password = password;
        return this;
    }

    setcontentType(contentType) {
        this.contentType = contentType;
        return this;
    }
}

class Response {
    constructor(obj) {
        if (obj) {
            this.code = obj.code;
            this.msg = obj.msg;
            this.data = obj.data;
        }
        return this;
    }

    getCode() {
        return this.code;
    }

    getMsg() {
        return this.msg;
    }

    getData() {
        return this.data;
    }

    getNote() {
        return new Note(this.data);
    }
}