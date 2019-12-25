new Promise((resolve,reject)=>{
    setTimeout(()=>{
        console.log('2')
        resolve(1)
    })
})
.then(res=>{
    console.log('res', res)
    console.log(3)
    return 999
},reason=>{
   console.log('reason', reason)
   console.log(4)
}).then(res=>{
    console.log('resres',res)
    return '000000'
},reason=>{
    console.log('reasonreason',reason)
}).then(res=>{
    console.log('resresres3',res)
},reason=>{
    console.log('reasonreasonreason3',reason)
})
