const isValidMobile=function(mobile){
    return /^[6-9]\d{9}$/.test(mobile)
}

const isValidString=function(string){
    return typeof(String)
}

// for email id
const email=function(email){
    if(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email) ) return true
    return false
  }
// password
const password=function(password){
if(/^(?=.[0-9])(?=.[!@#$%^&])[a-zA-Z0-9!@#$%^&]{8,15}$/.test(password) ) return true
        return false
}