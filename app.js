const express = require('express');
const app = express();
const studentRoute =require('./api/routes/student')
const facultyRoute =require('./api/routes/faculty')
const mongoose=require('mongoose');
const userRoute =require('./api/routes/user')
const fileUpload = require('express-fileupload');

mongoose.connect('mongodb://localhost:27017/kajal');

mongoose.connection.on('error',err=>{
    console.log('connction failed');
});

mongoose.connection.on('connected',connected=>{
    console.log('connected with database....');
});

// app.use(fileUpload({
//     useTempFiles:true
// }))
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/' // or any directory that exists on your system
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use('/student',studentRoute)

app.use('/faculty',facultyRoute)

app.use('/user',userRoute)


// app.use((req,res,next)=>{
//     res.status(200).json({
//         message:'app is running '
//     })
// })

app.use((req,res,next)=>{
    res.status(404).json({
        error:'bad request'
    })
})

module.exports = app;