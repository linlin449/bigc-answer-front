export  function checkEmail(data){
    let reg=/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(?:\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/
    return reg.test(data)?true:false
}
export  function checkPassword(data){
    let reg=/^[\w]{6,16}$/
    return reg.test(data)?true:false
}
export  function checkUsername(data){//20 40 10 312
    let reg=/^[1-9][0-9]{8}$/
    return reg.test(data)?true:false
}
export  function checkname(data){//20 40 10 312
    let reg=/^^[\u4E00-\u9FA5·]{2,16}$/
    return reg.test(data)?true:false
}