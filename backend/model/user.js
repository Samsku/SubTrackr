const validator = require('validator')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
           required:true,
           trim:true,
           unique:true,
        lowercase:true,
        validate:{
            validator(value){
                if(!validator.isEmail(value)){
                    throw new Error('email is invalid')
                }
            }
        }
    },
    password:{
        type:String,
      required:true,
      minlength:7,
      trim:true,
      validate:{
        validator(value){
          if(value.toLowerCase().includes('password')){
            throw new Error('password cannot contail"password"')
          }
        }
      }
    },
    tokens:[{
      token:{
      type:String,
      required:true
      }
    
    }]

    })

userSchema.methods.toJSON =  function(){
     const user = this 
     const userObject = user.toObject()
     delete userObject.password
      console.log(userObject)
     return userObject;

}

userSchema.methods.generateauthtoken = async  function(){
  const user = this
  const token = jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
  user.tokens=user.tokens.concat({token})
  await user.save()
  return token
}

/* when we are working with model insatnce lik when we have user data or single insatnce of it
then to use methods but when we are working directly in model or when we 
call function in side model or when we are finding model with function then to use statics*/

userSchema.statics.findbycredential =async function(email,password){
        
       const user = await User.findOne({email})
   
       if(!user){
        throw new Error('Unable to find user')
       }
       const isMatch = await bcrypt.compare(password,user.password);
       if(!isMatch){
        throw new Error('unable to login')
       }

       return user
}


userSchema.pre('save', async function (next){
  const user = this ;
   if (user.isModified('password') ){
       user.password = await bcrypt.hash(user.password, 8)
   }

   next()
})

const User = mongoose.model('User', userSchema)

module.exports = User;