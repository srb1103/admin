import {non_teaching_category} from '../data/staff'
import { fetch_data } from '../firebase/functions'
export const ADD_STAFF = 'ADD_STAFF'
export const UPDATE_STAFF = 'UPDATE_STAFF'
export const REMOVE_STAFF = 'REMOVE_STAFF'
export const SET_STAFF = 'SET_STAFF'
export const SET_DATA = 'SET_DATA'
export const REMOVE_SUBJECT_ALLOTTED = 'REMOVE_SUBJECT_ALLOTTED'
export const ALLOT_SUBJECT = 'ALLOT_SUBJECT'
export const ADD_CLASS = 'ADD_CLASS'
export const REMOVE_CLASS = 'REMOVE_CLASS'
export const UPDATE_CLASS = 'UPDATE_CLASS'
export const ADD_SESSION = 'ADD_SESSION'
export const REMOVE_SESSION = 'REMOVE_SESSION'
export const UPDATE_SESSION = 'UPDATE_SESSION'
export const ADD_SUBJECT = 'ADD_SUBJECT'
export const UPDATE_SUBJECT = 'UPDATE_SUBJECT'
export const REMOVE_SUBJECT = 'REMOVE_SUBJECT'
export const ADD_ANNOUNCEMENT = 'ADD_ANNOUNCEMENT'
export const UPDATE_ANNOUNCEMENT = 'UPDATE_ANNOUNCEMENT'
export const REMOVE_ANNOUNCEMENT = 'REMOVE_ANNOUNCEMENT'
export const ADD_STUDENT = 'ADD_STUDENT'
export const UPDATE_STUDENT = 'UPDATE_STUDENT'
export const REMOVE_STUDENT = 'REMOVE_STUDENT'
export const ADD_PERIOD = 'ADD_PERIOD'
export const UPDATE_PERIOD = 'UPDATE_PERIOD'
export const REMOVE_PERIOD = 'REMOVE_PERIOD'
export const SET_UID = 'SET_UID'
export const LOG_OUT = 'LOG_OUT'
export const CHANGE_SESSION = 'CHANGE_SESSION'
export const UPDATE_APPLICATION = 'UPDATE_APPLICATION'
export const ADD_APPLICATION = 'ADD_APPLICATION'
export const ADD_FEE = 'ADD_FEE'
export const ADD_ATTENDANCE = 'ADD_ATTENDANCE'
export const REMOVE_FEE = 'REMOVE_FEE'


export const setUID = (id,name,url,mail,contact,label)=>{
    return async dispatch=>{
        dispatch({type: SET_UID,uid:id,iname:name,url,mail,contact,label})
    }
}
export const setStaffData = (state)=>{
    return async dispatch=>{
        let tchr = await fetch_data('teachers')
        let ntchr = await fetch_data('staff')
        dispatch({
            type: SET_STAFF,
            data: {
                teachers:tchr,
                non_teaching_staff:ntchr,
            }
        })
    }
}
export const logOut = ()=>{
    return async dispatch=>{
        dispatch({type:LOG_OUT})
    }
}
export const setData = (iid)=>{
    return async dispatch=>{
        let institutions = await fetch_data('institutions')
        let students = await fetch_data('students')
        let fee = await fetch_data('fee-collection')
        let classes = await fetch_data('classes')
        let sessions = await fetch_data('sessions')
        let applications = await fetch_data('applications')
        let subjects = await fetch_data('subjects')
        let timetable = await fetch_data('timetable')
        let attendance = await fetch_data('attendance')
        let results = await fetch_data('results')
        let announcements = await fetch_data('admin-announcements')
        let teacher_attendance = await fetch_data('teacher-attendance')
        let staff_attendance = await fetch_data('staff-attendance')
        let i = institutions.find(e=>e.iid == iid)
        let session = i.sessionID
        announcements = announcements.filter(e=>e.instituteID == iid && e.session == session)
        attendance = attendance.filter(e=>e.instituteID == iid && e.session == session)
        teacher_attendance = teacher_attendance.filter(e=>e.instituteID == iid && e.sessionID == session)
        staff_attendance = staff_attendance.filter(e=>e.instituteID == iid && e.sessionID == session)
        fee = fee.filter(e=>e.instituteID == iid && e.session == session)
        students = students.filter(e=>e.instituteID == iid)
        results = results.filter(e=>e.instituteID == iid)
        classes = classes.filter(e=>e.instituteID == iid)
        applications = applications.filter(e=>e.instituteID == iid && e.session == session)
        sessions = sessions.filter(e=>e.instituteID == iid)
        subjects = subjects.filter(e=>e.instituteID == iid)
        timetable = timetable.filter(e=>e.instituteID == iid && e.session == session)
        dispatch({
            type: SET_DATA,
            data:{
                subjects,
                classes,
                announcements,
                students,
                timetable,sessions,session,applications,fee_collection:fee,attendance,results,teacher_attendance,staff_attendance
            }
        })
    }
}
export const removeSubjectAllotted = (teacher_id, subject_id)=>{
    return async dispatch =>{
        dispatch({
            type: REMOVE_SUBJECT_ALLOTTED,
            data:{
                teacher_id, subject_id
            }
        })
        
    }
}
export const removeStaff = (id, type)=>{
    return async dispatch=>{
        dispatch({
            type: REMOVE_STAFF,
            data:{
                t_id:id, type
            }
        })
    }
}
export const updateStaff = (data)=>{
    return async dispatch=>{
        dispatch({
            type: UPDATE_STAFF,
            data
        })
    }
}
export const addNewStaff = (data)=>{
    return async dispatch=>{
        dispatch({
            type: ADD_STAFF,
            data
        })
    }
}
export const allotSubject =(tid, subject)=>{
    return async dispatch =>{
        dispatch({
            type: ALLOT_SUBJECT,
            data:{
                tid, subject
            }
        })
        
    }
}
export const addSubject = (data)=>{
    return async dispatch=>{
        dispatch({
            type: ADD_SUBJECT,
            data
        })
    }
}
export const addClass = (data)=>{
    return async dispatch=>{
        dispatch({
            type: ADD_CLASS,
            data
        })
    }
}
export const removeClass = (id)=>{
    return async dispatch=>{
        dispatch({
            type: REMOVE_CLASS, id
        })
    }
}
export const removeSubject = (id)=>{
    return async dispatch=>{
        dispatch({
            type: REMOVE_SUBJECT, id
        })
    }
}
export const updateClass = (data)=>{
    let {id,name,fee} = data
    return async dispatch=>{
        dispatch({type: UPDATE_CLASS,id,name,fee})
    }
}
export const updateSubject = (id, name, class_id)=>{
    return async dispatch=>{
        dispatch({type: UPDATE_SUBJECT,id,name,class_id})
    }
}
export const removeAnnouncement = (id)=>{
    return async dispatch=>{
        dispatch({type: REMOVE_ANNOUNCEMENT,id})
    }
}
export const addAnnouncement = (data)=>{
    return async dispatch=>{
        dispatch({type: ADD_ANNOUNCEMENT,data})
    }
}
export const addPeriod = (data)=>{
    return async dispatch=>{
        dispatch({type: ADD_PERIOD,data})
    }
}
export const updatePeriod = (data)=>{
    return async dispatch=>{
        dispatch({type: UPDATE_PERIOD,data})
    }
}
export const removePeriod = (id,classID)=>{
    return async dispatch=>{
        dispatch({type: REMOVE_PERIOD,id,classID})
    }
}
export const updateAnnouncement = (id,title,text,to)=>{
    return async dispatch=>{
        dispatch({type: UPDATE_ANNOUNCEMENT,id,title,text,to})
    }
}
export const removeStudent = (id)=>{
    return async dispatch=>{
        dispatch({type: REMOVE_STUDENT,id})
    }
}
export const updateStudent = (data)=>{
    return async dispatch=>{
        dispatch({type: UPDATE_STUDENT,data})
    }
}
export const addStudent = (data)=>{
    return async dispatch=>{
        dispatch({type: ADD_STUDENT,data})
    }
}
export const addFee = (data)=>{
    return async dispatch=>{
        dispatch({type: ADD_FEE,data})
    }
}
export const addSession = (data)=>{
    return async dispatch=>{
        dispatch({
            type: ADD_SESSION,
            data
        })
    }
}
export const removeSession = (id)=>{
    return async dispatch=>{
        dispatch({
            type: REMOVE_SESSION, id
        })
    }
}
export const removeFee = (id)=>{
    return async dispatch=>{
        dispatch({
            type: REMOVE_FEE, id
        })
    }
}
export const updateSession = (id, title)=>{
    return async dispatch=>{
        dispatch({type: UPDATE_SESSION,id,title})
    }
}
export const changeSession = (id)=>{
    return async dispatch=>{
        dispatch({type:CHANGE_SESSION,id})
    }
}
export const updateApplication = (id,status,message)=>{
    return async dispatch=>{
        dispatch({type: UPDATE_APPLICATION,id,status,message})
    }
}
export const addApplication = (data)=>{
    return async dispatch=>{
        dispatch({type: ADD_APPLICATION,data})
    }
}
export const addAttendance = (cat,attn)=>{
    return async dispatch=>{
        dispatch({type:ADD_ATTENDANCE,cat,attn})
    }
}