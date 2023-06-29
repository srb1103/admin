import { SET_STAFF, UPDATE_STAFF, REMOVE_STAFF, ADD_STAFF, REMOVE_SUBJECT_ALLOTTED, SET_DATA, ALLOT_SUBJECT, ADD_CLASS, REMOVE_CLASS, UPDATE_CLASS, ADD_SUBJECT, REMOVE_SUBJECT, UPDATE_SUBJECT, REMOVE_ANNOUNCEMENT, ADD_ANNOUNCEMENT, UPDATE_ANNOUNCEMENT, REMOVE_STUDENT, UPDATE_STUDENT, ADD_STUDENT, ADD_PERIOD, UPDATE_PERIOD, REMOVE_PERIOD, SET_UID, LOG_OUT,ADD_SESSION, REMOVE_SESSION, UPDATE_SESSION, CHANGE_SESSION, UPDATE_APPLICATION, ADD_FEE, REMOVE_FEE, ADD_APPLICATION, ADD_ATTENDANCE } from "./actions"
import Teacher,{NT_Staff, Staff_category} from "../models/staff"
import Subject from "../models/subject"
import Announcement from "../models/announcement"
import Cls from '../models/class'
import Student from "../models/student"
const initialState = {
    user: {
        name:'',
        uid:'',
        logoURL:'',
        mail:'',contact:'',label:''
    },
    subjects: [],
    classes: [],
    announcements:[],
    students: [],
    timetable:[],
    staff: {
        teaching: [],
        non_teaching: []
    },
    sessions:[],
    session:null,
    leave_applications:[],
    fee_collection:[],
    attendance:[],
    results:[], teacher_attendance:[],staff_attendance:[]
}

export default(state=initialState, action)=>{
    switch (action.type){
        case SET_UID:
            let {uid,iname,url,mail,contact,label} = action
            return{...state,user:{
                name:iname,uid,logoURL:url,mail,contact,label
            }}
        case LOG_OUT:
            let u = {
                name:'',
                uid:'',
                logoURL:''
            }
            return{...state,user:u}
        case ADD_ATTENDANCE:
            let {cat,attn} = action
            let obj = {id:attn.id,date:attn.date,attendance:attn.attendance}
            let str = cat == 'teaching'?'teacher_attendance':'staff_attendance'
            let array = cat == 'teaching' ? state.teacher_attendance.concat(obj) : state.staff_attendance.concat(obj)
            return {...state,[str]:array}
        case SET_STAFF:
            let {teachers, non_teaching_staff, teaching_category, non_teaching_category} = action.data
            uid = state.user.uid
            return{
                ...state,
                staff:{
                    teaching: teachers.filter(e=>e.instituteID == uid).map(itm=>new Teacher(itm.id, itm.name, itm.phone, itm.email,itm.joiningDate, itm.category,  itm.subjects_allotted, itm.img_url,itm.last_login,itm.pushToken)),
                    non_teaching: non_teaching_staff.filter(e=>e.instituteID == uid).map(itm=>new NT_Staff(itm.id, itm.name, itm.phone, itm.email,itm.joiningDate, itm.category, itm.img_url)),
                }
            }
        case ADD_STAFF:
            let user = action.data
            let tsa = state.staff.teaching
            let ntsa = state.staff.non_teaching
            let sal = []
            obj = null
            if(user.type == 'teaching'){
                obj = new Teacher(user.id,user.name,user.phone,user.email,user.joiningDate,user.category,sal,user.img_url)
                tsa = tsa.concat(obj)
            }else{
                obj = new NT_Staff(user.id,user.name,user.phone,user.email,user.joiningDate,user.category,user.img_url)
                ntsa = ntsa.concat(obj)
            }
            let st1 = {...state.staff, teaching: tsa, non_teaching: ntsa}
            return{
                ...state,
                staff: st1
            }
        case REMOVE_SUBJECT_ALLOTTED:
            let {teacher_id, subject_id} = action.data
            let tchrs = state.staff.teaching
            let t_ind = tchrs.findIndex(e=>e.id == teacher_id)
            let tchr = tchrs.find(e=>e.id == teacher_id)
            let sbj = tchr.subjects_allotted.filter(s=>s!== subject_id)
            tchrs[t_ind].subjects_allotted = sbj
            return{
                ...state,
                staff:{
                    ...state.staff,
                    teaching: tchrs
                }
            }
        case ALLOT_SUBJECT:
            let {tid, subject} = action.data
            tchrs = state.staff.teaching
            t_ind = tchrs.findIndex(e=>e.id == tid)
            tchr = tchrs.find(e=>e.id == tid)
            sbj = tchr.subjects_allotted.concat(subject)
            tchrs[t_ind].subjects_allotted = sbj
            return{
                ...state,
                staff:{
                    ...state.staff,
                    teaching: tchrs
                }
            }
        case REMOVE_STAFF:
            let {t_id, type} = action.data
            let t = state.staff.teaching
            let nt = state.staff.non_teaching
            type == 'teaching' ? t = t.filter(e=>e.id !== t_id) : nt = nt.filter(e=>e.id !== t_id)
            let st2 = {...state.staff, teaching: t, non_teaching: nt}
            return{
                ...state,
                staff:st2
            }
        case UPDATE_STAFF:
            let {id,name, phone,email, tag,category, img_url} = action.data
            let ts = state.staff.teaching
            let nts = state.staff.non_teaching
            let ind = tag == 'teaching' ? ts.findIndex(t=>t.id == id) : nts.findIndex(t=>t.id == id)
            if(tag == 'teaching'){
                ts[ind].name = name
                ts[ind].phone = phone
                ts[ind].email = email
                ts[ind].category = category
                ts[ind].img_url = img_url
            }else{
                nts[ind].name = name
                nts[ind].phone = phone
                nts[ind].email = email
                nts[ind].category = category
                nts[ind].img_url = img_url
            }
            let st = {...state.staff, teaching: ts, non_teaching: nts}
            return{
                ...state,
                staff: st
            }
        case SET_DATA:
            let {subjects, classes, announcements, students,timetable,sessions,session,applications,fee_collection,attendance,results,teacher_attendance,staff_attendance} = action.data
            let subject_list = subjects.map(itm=>new Subject(itm.id,itm.name,itm.class_id))
            let class_list = classes.map(itm=>new Cls(itm.id, itm.name,itm.fee))
            let ance = announcements.map(itm=>new Announcement(itm.id,itm.title,itm.text,itm.date,itm.to))
            let stn = students.map(itm=>new Student(itm.id,itm.name,itm.admissionNo,itm.rollNo,itm.guardian,itm.phone,itm.email,itm.address,itm.classId,itm.img_url,itm.last_login,itm.pushToken))
            return{
                ...state,
                subjects: subject_list,
                classes: class_list,
                announcements: ance,
                students: stn,
                timetable:timetable,
                session,sessions,leave_applications:applications,fee_collection,attendance,results,teacher_attendance,staff_attendance
            }
        case ADD_CLASS:
            let cl_det = action.data
            let new_cl = new Cls(cl_det.id,cl_det.name,cl_det.fee)
            return{
                ...state,
                classes: state.classes.concat(new_cl)
            }
        case REMOVE_CLASS:
            let cl_id = action.id
            let cls = state.classes.filter(e=>e.id !== cl_id)
            tchrs = state.staff.teaching
            tchrs.forEach(t=>{
                let so = t.subjects_allotted
                t.subjects_allotted = so.filter(e=>e.class_id !== cl_id)
            })
            sbj = state.subjects.filter(e=>e.class_id !== cl_id)
            st = {...state.staff,teaching: tchrs}
            stn = state.students
            stn.forEach(s=>{
                if(s.classId == cl_id){s.classId = ''}
            })
            return{...state,classes: cls,staff: st,subjects: sbj,students: stn}
        case UPDATE_CLASS:
            id = action.id
            name = action.name
            let fee = action.fee
            ind = state.classes.findIndex(e=>e.id == id)
            cls = state.classes
            cls[ind].name = name
            cls[ind].fee = fee
            tchrs = state.staff.teaching
            tchrs.forEach(t=>{
                let t_ind = t.subjects_allotted.findIndex(e=>e.class_id == id)
                t_ind > -1 && (t.subjects_allotted[t_ind].class_name = name)
            })
            sbj = state.subjects
            sbj.forEach(s=>{
                if(s.class_id == id){s.class_name = name}
            })
            st = {...state.staff,teaching: tchrs}
            return{...state,classes: cls, staff: st, subjects: sbj}
        case ADD_SUBJECT:
            let sbj_data = action.data
            id = sbj_data.id
            name = sbj_data.name
            let {class_name, class_id} = sbj_data
            let new_sbj = new Subject(id,name,class_name,class_id)
            let sbjs = state.subjects.concat(new_sbj)
            return{...state,subjects: sbjs}
        case REMOVE_SUBJECT:
            id = action.id
            sbjs = state.subjects
            sbjs = sbjs.filter(e=>e.id !== id)
            tchrs = state.staff.teaching
            tchrs.forEach(t=>{
                t.subjects_allotted.filter(e=>e.id !== id)
            })
            st = {...state.staff,teaching: tchrs}
            return{...state,subjects: sbjs,staff: st}
        case UPDATE_SUBJECT:
            sbj = state.subjects
            tchrs = state.staff.teaching
            ind = sbj.findIndex(e=>e.id == action.id)
            sbj[ind].title=action.name
            sbj[ind].class_id=action.class_id
            sbj[ind].class_name=action.class_name
            tchrs.forEach(t=>{
                let t_ind = t.subjects_allotted.findIndex(e=>e.id == action.id)
                t_ind > -1 && (t.subjects_allotted[t_ind].title = action.name)
            })
            st = {...state.staff,teaching: tchrs}
            return{...state,staff: st, subjects: sbj}
        case REMOVE_ANNOUNCEMENT:
            id = action.id
            let anc = state.announcements
            anc = anc.filter(e=>e.id !== id)
            return{...state,announcements: anc}
        case ADD_ANNOUNCEMENT:
            let data = action.data
            obj = new Announcement(data.id,data.title,data.text,data.date,data.to)
            anc = state.announcements.concat(obj)
            return{...state,announcements: anc}
        case UPDATE_ANNOUNCEMENT:
            id = action.id
            title = action.title
            text = action.text
            to = action.to
            let c = state.announcements
            ind = c.findIndex(i=>i.id == id)
            c[ind].title = title
            c[ind].text = text
            c[ind].to = to
            return{
                ...state,
                announcements: c
            }
        case REMOVE_STUDENT:
            id = action.id
            stn = state.students
            stn = stn.filter(s=>s.id !== id)
            return{...state,students: stn}
        case ADD_STUDENT:
            st = action.data
            obj = new Student(st.id,st.name,st.admissionNo,st.rollNo,st.guardian,st.phone,st.email,st.address,st.classId,st.img_url)
            stn = state.students.concat(obj)
            return{...state,students: stn}
        case UPDATE_STUDENT:
            st = action.data
            let {guardian,classId,address,admissionNo,rollNo} = st
            name = st.name
            phone = st.phone
            email = st.email
            let st_id = st.id
            stn = state.students
            let i = stn.findIndex(e=>e.id == st_id)
            stn[i].name = name
            stn[i].phone = phone
            stn[i].email = email
            stn[i].classId = classId
            stn[i].address = address
            stn[i].guardian = guardian
            stn[i].admissionNo = admissionNo
            stn[i].rollNo = rollNo
            stn[i].img_url = st.img_url
            return{...state,students: stn}
        case ADD_PERIOD:
            let period = action.data
            let periods = state.timetable.concat(period)
            return{...state,timetable:periods}
        case UPDATE_PERIOD:
            period = action.data
            periods = state.timetable
            ind = periods.findIndex(e=>(e.id== period.id && e.classID == period.classID))
            periods[ind] = period
            return{...state,timetable:periods}
        case REMOVE_PERIOD:
            id = action.id
            let classID = action.classID
            periods = state.timetable.filter(e=>(e.id !== id && e.classID !== classID))
            return{...state,timetable:periods}
        case ADD_SESSION:
            let sess = action.data
            let iid = state.user.uid
            sess = {...sess,instituteID:iid}
            return{
                ...state,
                sessions: state.sessions.concat(sess)
            }
        case REMOVE_SESSION:
            let sessID = action.id
            sessions = state.sessions.filter(e=>e.id !== sessID)
            return{...state,sessions}
        case UPDATE_SESSION:
            sessID = action.id
            let title = action.title
            sessions = state.sessions
            ind = sessions.findIndex(e=>e.id == sessID)
            sessions[ind].title = title
            return{...state,sessions}
        case CHANGE_SESSION:
            sessID = action.id
            return{...state,session:sessID}
        case UPDATE_APPLICATION:
            id = action.id
            let {status,message} = action
            let app = state.leave_applications
            i = app.findIndex(e=>e.id == id)
            app[i].status = status
            app[i].message = message
            return {...state,leave_applications:app}
        case ADD_APPLICATION:
            data = action.data
            id = data.id
            app = state.leave_applications
            let isThere = app.find(e=>e.id == id)
            if(!isThere){
                app = app.concat(data)
            }
            return {...state,leave_applications:app}
        case ADD_FEE:
            sess = action.data
            fee = state.fee_collection
            fee = fee.concat(sess)
            return{
                ...state,fee_collection:fee
            }
        case REMOVE_FEE:
            let feeID = action.id
            fee_collection = state.fee_collection.filter(e=>e.id !== feeID)
            return{...state,fee_collection}
        }
    return state
}