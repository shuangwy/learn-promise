const Promise = require('./promise')

console.log(1)
new Promise((resolve,reject)=>{
    // reject(1)
    setTimeout(()=>{
        console.log('结束了')
        resolve(2)
        console.log('开始了')
    })
}).then(res=>{
    console.log(111111,res)
    console.log(3)
    return res
}, reason => {
    console.log(222222,reason)
}).then((res)=>{
    console.log('resres',res)
})
console.log(4)
