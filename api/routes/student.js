const express = require('express');
const router = express.Router();
const Student = require('../model/student');
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'db4t3j0zf',
    api_key: '547366357617399',
    api_secret: 'un3ZafahYCnppI2xit65zqqa7H4'
});

// Fetch all students (with auth)
router.get('/', (req, res) => {
    Student.find()
        .then(result => {
            res.status(200).json({ studentData: result });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err });
        });
});

// Create a new student
router.post('/', (req, res) => {
    console.log('Body:', req.body);
    console.log('Files:', req.files);

    const { name, gender, course, city, age } = req.body;
    const file = req.files?.photos;

    if (!file || !name) {
        return res.status(400).json({ error: 'Missing required fields or file' });
    }

    cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
        if (err) {
            console.error('Cloudinary error:', err);
            return res.status(500).json({ error: err });
        }

        const student = new Student({
            _id: new mongoose.Types.ObjectId(),
            name,
            gender,
            course,
            city,
            age,
            imagePath: result.url
        });

        student.save()
            .then(saved => res.status(200).json({ newStudent: saved }))
            .catch(saveErr => {
                console.error(saveErr);
                res.status(500).json({ error: saveErr });
            });
    });
});

// Get specific student
router.get('/:id', (req, res) => {
    Student.findById(req.params.id)
        .then(result => {
            res.status(200).json({ student: result });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err });
        });
});

// Delete student
// router.delete('/', (req, res) => {
//     const imageUrl=req.query.imageUrl;
//     const urlArray=imageUrl.split('/');
//     console.log(urlArray)
//     const image= urlArray[urlArray.length-1]
//     console.log(image)
//     const imageName=image.split('.')[0]
//     console.log(imageName)
//     Student.deleteOne({ _id: req.query.id })
//         .then(result => {
//             cloudinary.uploader.destroy(imageName,(error,result)=>{
//                 console.log(error,result);
//             })
//             res.status(200).json({
//                 message: 'Student deleted',
//                 result: result
//             });
//         })
//         .catch(err => {
//             res.status(500).json({ error: err });
//         });
// });

router.delete('/', (req, res) => {
    const { imageUrl, id } = req.query;

    if (!imageUrl || !id) {
        return res.status(400).json({ error: 'Missing imageUrl or student id' });
    }

    const urlArray = imageUrl.split('/');
    const image = urlArray[urlArray.length - 1];
    const imageName = image.split('.')[0];

    Student.deleteOne({ _id: id })
        .then(result => {
            cloudinary.uploader.destroy(imageName, (error, result) => {
                console.log(error, result);
            });
            res.status(200).json({
                message: 'Student deleted',
                result: result
            });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});


// Update student
router.put('/:id', (req, res) => {
    const { name, gender, course, city, age } = req.body;

    Student.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { name, gender, course, city, age } },
        { new: true }
    )
        .then(result => {
            res.status(200).json({ updated_student: result });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err });
        });
});

module.exports = router;
