const express = require('express')
const cors = require('cors')
require('./DB/mongoose')
const User = require('./model/user')
const port = process.env.PORT || 3000
const app = express()
const auth = require('./middleware/auth')
const Bill = require('./model/bills')

app.use(express.json())
app.use(cors())


app.get('/home',(req,res)=>{
    res.send("hello from server")
})

app.post('/user/signin',async (req,res)=>{
  try{

   
    const user = new User(req.body);

     
    

    await user.save();
    const token =await user.generateauthtoken()
    
    res.send({user,token})
  }catch(e){
    res.status(500).send(e)
  }
})

app.post('/user/login', async (req,res)=>{
    console.log('hello')
  try{
        
    
         const user = await User.findbycredential(req.body.email,req.body.password)     
         const token = await user.generateauthtoken() 
         await user.save()
      res.send({user,token})
  }catch(e){
console.log('hello')
    res.status(404).send(e)
  }

})

app.post('/bill', auth , async (req,res)=>{
  
  console.log('hello')
  try{
        const bill = new  Bill({
          ...req.body,
          owner:req.user._id
        })

        await bill.save()

        res.send(bill)
  }catch(e){
    res.status(400).send(e)
  }
})

app.get('/bill/me', auth, async (req,res)=>{
    try{
          
          const bill = await Bill.find({owner:req.user._id})

          if(!bill){
            res.status(404).send()
          }

          res.send(bill)
    }catch(e){
      res.status(400).send(e)
    }
})
app.delete('/bill/:id', auth, async(req, res)=>{
  try{
    const bill = await Bill.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });
    if(!bill){
      return res.status(404).send();
    }
    res.send(bill);
  }catch(e){
    res.status(400).send(e)
  }
})

app.listen((port),()=>{
    console.log('hello from server')
})


