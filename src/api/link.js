import service from "../util/service.js"
let link=(url,method,data,params)=>{
    return new Promise((resolve,reject)=>{
        service.request(
            {
                url,
                method,
                data,
                params
            }
        ).then((ok)=>{
            resolve(ok)
        }).catch ((error)=>{
            reject(error);
        })
    })
}
export default link;