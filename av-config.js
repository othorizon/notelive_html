const SERVER_PREFIX = 'http://t.rizon.top/notelive/server';

const SERVER_PATH = {
    queryOne:SERVER_PREFIX+"/queryOne",
    updateOne:SERVER_PREFIX+"/updateOne",
    insertOne:SERVER_PREFIX+"/insertOne",
    deleteOne:SERVER_PREFIX+"/deleteOne",
};
class Note {
    constructor(obj) {
        if (obj) {
            this.id = obj.id;
            this.title = obj.title;
            this.password = obj.password;
            this.content = obj.content;
        }
        return this;
    }

    getId(){
        return this.id;
    }

    setId(id){
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
    getNote(){
        return new Note(this.data);
    }
}