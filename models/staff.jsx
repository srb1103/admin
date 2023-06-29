export default class Teacher{
    constructor(id, name, phone, email, joiningDate, category, subjects_allotted, img_url,last_login,token){
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.joiningDate = joiningDate;
        this.category = category;
        this.subjects_allotted = subjects_allotted;
        this.img_url = img_url;
        this.last_login = last_login;
        this.token = token
    }
}
export class NT_Staff{
    constructor(id, name, phone, email, joiningDate, category, img_url){
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.joiningDate = joiningDate;
        this.category = category;
        this.img_url = img_url;
    }
}
export class Staff_category{
    constructor(id, name){
        this.key = id;
        this.value = name
    }
}
