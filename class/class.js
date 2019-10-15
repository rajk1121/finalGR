function getMymail(to, from, url) {
    this.to = to;
    this.url = url;

    this.from = from;
    this.getSender = function () {
        return "Sender is " + this.from;
    }
}
var myNewmail = new getMymail("abc@gmail.com", "def@fbsbhk.com", "lhis@fbirk.com");
var anotherNewmail = new getMymail("ksgibj@ddfhksnl.com", "chifeu22@skfhibj.com", "hofbiwf@gmail.com");
console.log("" + myNewmail);
console.log(anotherNewmail);
console.log(myNewmail.getSender());
class createMail {
    constructor(to, from, url) {
        this.to = to;
        this.url = url;
        this.from = from;
    }
    getSender() {
        return "Sender is " + this.from;
    }

}
var newamil = new createMail("ksgibj@ddfhksnl.com", "chifeu22@skfhibj.com", "hofbiwf@gmail.com")
