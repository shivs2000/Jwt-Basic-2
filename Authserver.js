const express=require('express');
const app=express();
const dotenv=require('dotenv');
const jwt=require('jsonwebtoken');
app.use(express.json());
dotenv.config();
let refreshTokens=[];

app.post('/token',(req,res)=>{
const refreshToken=req.body.token;
if(refreshToken==null) return res.status(401).json("refreshToken NOt recieved");
if(!refreshTokens.includes(refreshToken)) return res.status(403).json("not authenticated");
jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,user)=>{
    if (err) return res.status(403).json("verification failed!!!");
    const accessToken=generateAccessToken({name:user.name});
    res.status(200).json({accessToken:accessToken});
})

});
app.delete('/logout',(req,res)=>{
    refreshTokens=refreshTokens.filter(token=>token!==req.body.token);
    res.status(200).json("logGEd OUT");

});
app.post('/login',(req,res)=>{
    const username=req.body.username;
    const user={name:username}
    const accessToken=generateAccessToken(user);
    const refreshToken=jwt.sign(user,process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);
    res.status(200).json({accessToken:accessToken,refreshToken:refreshToken});

})
//generate function
function generateAccessToken(user){

    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'15s'});
}



app.listen(5000,()=>{
    console.log("AUTHSERVER");
})
