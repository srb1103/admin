export function setDate(date){
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    let sp = date.split('/')
    let n = sp[1]
    let dt = `${sp[0]} ${months[n-1]}, ${sp[2]}`
    return dt
}
export function setDate1(date){
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    let sp = date.split('-')
    let n = sp[1]
    let dt = `${sp[0]} ${months[n-1]}, ${sp[2]}`
    return dt
}
export function setNum(num){
    let n = parseInt(num)
    n = n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return n
}
export function makeDate(date){
    let d = date.split('-')
    let day = d[0]
    let month = d[1]
    let year = d[2]
    if(day<9){day = `0${day}`}
    if(month<9){month = `0${month}`}
    return new Date(`${year}-${month}-${day}`)
}
export function formatTime(obj){
    let {seconds} = obj
    let d = new Date(seconds * 1000).toLocaleString(undefined, {timeZone: 'Asia/Kolkata'});
    let str = JSON.stringify(d).split(' ')
    let day = str[0].replace('"','')
    let month = str[1]
    let date = str[2]
    let time = str[3].split(':')
    // let year = str[4]
    let hr = parseInt(time[0])
    let mn = time[1]
    let am = 'AM'
    if(hr>11){am = 'PM'}
    if(hr == 0){hr = 12}
    return `${day}, ${month} ${date} (${hr}:${mn} ${am})`
}