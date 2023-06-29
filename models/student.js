export default class Student{
    constructor(id,name,admissionNo,rollNo,guardian,phone,email,address,classId,img_url,last_login,token){
        this.id = id;
        this.name = name;
        this.admissionNo = admissionNo;
        this.rollNo = rollNo;
        this.guardian = guardian;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.classId = classId;
        this.img_url = img_url;
        this.last_login = last_login;
        this.token = token
    }
}