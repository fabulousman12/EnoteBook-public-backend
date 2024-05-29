const express = require('express')
const router = express.Router()
const fetchuser = require('../middleware/fetchuser')
const Notes = require('../models/Notes')
const { body, validationResult } = require('express-validator');

// const nodemailer = require('nodemailer');

// async function sendEmail(ipAddress) {
//   // Create a transporter object using SMTP transport
//   let transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'worldkrishna36@gmail.com',
//       pass: ''
//     }
//   });

//   // Setup email data
//   let mailOptions = {
//     from: 'your-email@gmail.com',
//     to: 'recipient-email@example.com',
//     subject: 'User IP Address',
//     text: `The user's IP address is: ${ipAddress}`
//   };

//   // Send email
//   let info = await transporter.sendMail(mailOptions);

//   console.log('Message sent: %s', info.messageId);
// }

//#####################################################
//33333333333333333333333333333333333333333333333333333333333
//Route 1 GET ALL NOTES USING get "/api/auth/getuser" require auth
router.get('/fetchallnotes',fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({user:req.user.id})
res.json(notes)
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send("Internal Server Error");
    
  }   



  
});


//#####################################################
//33333333333333333333333333333333333333333333333333333333333
//Route 2 Add a new note USING post "/api/auth/getuser" require auth
router.post('/addnote',fetchuser, [
  body('title', 'Enter a valid title').isLength({ min: 3 }),
  body('description', 'description must be longer than 6 characters').isLength({ min: 6 }),
 
],async (req, res) => {
try{
  const{title,description,tag} = req.body;
  const errors = validationResult(req);
  
  // If there are validation errors, return bad request and errors
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const newnote = new Notes({
    title,description,tag,user:req.user.id,
  })
  const savenote = await newnote.save()
     
  const notes = await Notes.find({user:req.user.id})
  res.json(notes)
}catch(error){
  console.error('Error creating user:', error);
  res.status(500).send("Internal Server Error");
}
    
  });

  //#####################################################
//33333333333333333333333333333333333333333333333333333333333
//Route 3 Edit ALL NOTES USING put "/api/auth//updateNotes/:id" require auth
router.put('/updateNotes/:id',fetchuser, async (req, res) => {
  const{title,description,tag} = req.body;
  const newnote = {};
  if(title){
    newnote.title = title;
  } if(description){
    newnote.description = description;
  } if(tag){
    newnote.tag = tag;
  }
//find the note to be updated 
var note = await Notes.findById(req.params.id);
if(!note){
  return res.status(401).send("Not found")
}
if(note.user.toString()!== req.user.id){
  const ip = req.ip
  // sendEmail(ip)
  // .then(() => {
  //   res.send('Email sent successfully!');
  // })
  // .catch((error) => {
  //   console.error('Error sending email:', error);
  //   res.status(500).send('Internal Server Error');
  // });

  return res.status(404).send("haha you really tried to hack this nigga",  ip)
}

note = await Notes.findByIdAndUpdate(req.params.id,{$set:newnote},{new:true})
res.json({note})

})

  //#####################################################
//33333333333333333333333333333333333333333333333333333333333
//Route 4 delete  NOTES USING delete "/api/auth/deletenote/:id" require auth
router.delete('/deletenote/:id',fetchuser, async (req, res) => {
try{

  const{title,description,tag} = req.body;
 
//find the note to be delete
var note = await Notes.findById(req.params.id);
if(!note){
  return res.status(404).send("Not found")
}
//allow deletion
if(note.user.toString()!== req.user.id){
  const ip = req.ip
  // sendEmail(ip)
  // .then(() => {
  //   res.send('Email sent successfully!');
  // })
  // .catch((error) => {
  //   console.error('Error sending email:', error);
  //   res.status(500).send('Internal Server Error');
  // });

  return res.status(401).send("haha you really tried to hack this nigga" + ip)
}

note = await Notes.findByIdAndDelete(req.params.id)
res.json({ message: "Success: Note has been deleted", note: note });

}catch(error){
  res.status(500).send("Internal Server Error");
}

})

module.exports = router;
