const express=require('express');
const app=express();
const dotenv=require('dotenv');
const jwt=require('jsonwebtoken');
app.use(express.json());
dotenv.config();


const Posts=[
    {

        username:'Jim',
        title:'data'
    },
    {

        username:'tina',
        title:'cloud'
    }
]
app.get('/post',authenticateToken,(req,res)=>{
const filterPosts=Posts.filter(post=>post.username===req.user.name);
res.status(200).json(filterPosts);

})

//authenticate function
function authenticateToken(req,res,next){
    const authHeader=req.headers['authorization'];
    const token=authHeader && authHeader.split(' ')[1];
    if (token===null) return res.status(401).json("Wrong Header");
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
       if (err) return res.status(403).json("error Verifying Token");
       req.user=user;
       next();

    });

}
app.listen(4000,()=>{


    console.log("Running");
})
