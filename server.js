const express=require('express')
const path=require('path')
const fs=require('fs')
const crypto=require('crypto')

const app=express()
const filePath=path.join(__dirname,'data.json')
app.use(express.json())


//1 POST /api/items — Report an item
app.post("/",(req,res)=>{
    try{
        const data=fs.readFileSync(filePath,"utf-8")
        const data1=JSON.parse(data)
        const {itemName,type,place,date,contact}=req.body
        const id=crypto.randomUUID();
        let obj={
            "id":id,
            "itemName":itemName,
            "type":type,
            "place":place,
            "date":date,
            "contact":contact,
            "status":"open"
        }
        data1.push(obj)
        const data2=JSON.stringify(data1)
        fs.writeFileSync(filePath,data2)
        console.log(data2)
        res.send(JSON.parse(data2))
    }catch(err){
        res.send(err)
    }
})

// 2 GET /api/items — List the board
app.get("/api/items",(req,res)=>{
    try{
        const data=fs.readFileSync(filePath,"utf-8")
        console.log(data)
        res.json(JSON.parse(data))
    }catch(err){
        res.send(err)
    }
})

//3 GET /api/items/:id — Single item
app.get("/api/items/:id",(req,res)=>{
    try{
        const data=fs.readFileSync(filePath,"utf-8")
        console.log(data)
        let data1=JSON.parse(data)
        let id=req.params.id
        data1=data1.filter(obj=>obj.id===id)
        if(data1.length===0){
            res.status(404).json({ "error": "Not found" })
        }
        res.status(200).json(data1)
    }catch(err){
        console.log(err);
        res.send(err)
    }
})

//4 PUT /api/items/:id — Edit a report
app.put("/api/items/:id",(req,res)=>{
    try{
        let id1=req.params.id
        const {id,itemName,type,place,date,contact}=req.body
        if(!id || !itemName || !type || !place || !date || !contact){
            res.status(400).send("Invalid body")
        }
        const data=fs.readFileSync(filePath,"utf-8")
        const data1=JSON.parse(data)
        const index=data1.findIndex(obj=>obj.id===id1)
        if(index==-1){
            res.status(404).send("No such id")
        }
        let obj={
            "id":data1[index].id,
            "itemName":itemName,
            "type":type,
            "place":place,
            "date":date,
            "contact":contact,
            "status":data1[index].status
        }
        data1[index]=obj
        fs.writeFileSync(filePath,JSON.stringify(data1))
        res.status(200).json(obj)
    }catch(err){
        console.log(err)
        res.send("Error")
    }
})

// 5 PATCH /api/items/:id/claim — Mark as claimed
app.patch("/api/items/:id/claim",(req,res)=>{
    try{
        let id=req.params.id
        const data=fs.readFileSync(filePath,"utf-8")
        const data1=JSON.parse(data)
        const index=data1.findIndex(obj=>obj.id===id)
        if(index==-1){
            res.status(404).send("No such id")
        }
        if(data1[index].status==="claimed"){
            res.status(409).json({ "error": "Item Already Claimed"})
        }
        data1[index].status="claimed"
        fs.writeFileSync(filePath,JSON.stringify(data1))
        res.status(200).json(data1[index])
    }catch(err){
        console.log(err)
        res.send("Error")
    }
})

app.listen(3000)