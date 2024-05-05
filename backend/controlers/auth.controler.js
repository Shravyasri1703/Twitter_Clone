import { User } from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import { generateTokenAndSetCookie } from "../lib/utils/generateTokens.js"
export const signup = async (req, res)=>{
   try{
         const { fullname, username, email, password } = req.body
      
         const emailRegex = /^[^\$@]+@[^\$@]+\.[^\$@]+$/

         if(!emailRegex.test(email)) {
            return res.status(400).json({ error : 'Email is Not Defined'})
         }

         const existingUser = await User.findOne({ username })
         if(existingUser) return res.status(400).json({ error: 'Username Already Exists'})

        const existEmail = await User.findOne({ email })  
        if(existEmail){
            return res.status(400).json({ error: 'Email already exits'})
        }

        if(password.length < 6){
            res.status(400).json({
                error: 'Password must be atleast 6 char long'
            })
        }
        
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullname: fullname,
            username: username,
            email: email,
            password: hashedPassword
        })

        if(newUser){
              generateTokenAndSetCookie(newUser._id,res)
              await newUser.save()
              
              res.status(200).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg
              })
        }else{
           res.status(400).json({ error: 'Invalid user data'})
        }

   }
   catch(err){
     console.log('Error in signup controler', err.message)
     res.status(500).json({ error : 'Internal Server Error'})
   }
}

export const login = async (req, res)=>{
   try{
        const { username, password } = req.body
        const user = await User.findOne({username})
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")

        if(!user || !isPasswordCorrect){
            res.status(400).json({ error: 'Invalid username or Password'})

        }

        generateTokenAndSetCookie(user._id, res)
        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg
        })

        console.log('fetched')
   }
   catch(err){
     console.log('error in login controller', err.message)
     res.status(500).json({
        error: 'Internal Server Error'
     })
   }
}

export const logout = async (req, res)=>{
     try{
           res.cookie('jwt',"",{maxAge:0})
           res.status(200).json({
            message: 'Successfully Logged Out'
           })
     }
     catch(err){
        console.log('Error in Logout Controler', err.message)
        res.status(500).send('Inetrnal Server Error')

     }   
}

export const getMe = async (req, res) => {
    try{
         const user = await User.findById(req.user._id).select('-password')
         res.status(200).json(user)
    }
    catch(err){
        console.log('Error in getme Controler', err.message)
        res.status(500).send('Inetrnal Server Error')

    }
}