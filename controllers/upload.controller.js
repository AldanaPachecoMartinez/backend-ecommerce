
const multer = require("multer");
const { v4: uuid } = require('uuid');
const fs = require('fs');
const { responseCreator } = require("../utils/utils");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, `public/upload/products`)
  },
  filename: (req, file, callback) => {
    const fileExt = file.originalname.split('.').at(-1);
    const newName = `${uuid()}.${fileExt}`;
    if(req.body.images){
      let newImage = (typeof(req.body.images)==="string") ? JSON.parse(req.body.images) : req.body.images
      newImage.push(newName)
      req.body.images= newImage
    }else{
    req.body.images=[newName]
    req.body.thumbnail = newName;
    }
    callback(null,newName)
  }
})

const uploadMulter = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 16 },
  fileFilter: (req, file, cb) => {
    const fileType = file.mimetype.split("/")[0];
    fileType === "image" ? cb(null, true) : cb(null, false);
  },
});

  const uploadProductImage= uploadMulter.any('file')

  const deleteImageProduct = (req,res) =>{
    const imgToDelete = req.params.img
    fs.readdir('./public/upload/products',(err,files)=>{
      files.forEach((img,i)=>{
        if(img===imgToDelete){
          fs.unlinkSync(`./public/upload/products/${img}`, (err)=>{
            if(err) {
          return
            }else{
              return
            }
          })
        }else {
        return

        }
      })
    })
    responseCreator(res,200,'Se eliminó la imagen con éxito',true)

return
  }

  const userStorage = multer.diskStorage({
    destination: (req, file, callback) => {


      callback(null, `public/upload/users`)
    },
    filename: (req, file, callback) => {
    
      const fileExt = file.originalname.split('.').at(-1);
      const newName = `${req.user._id}.${fileExt}`;
        req.user.image=newName
      callback(null,newName)
    }
  })
  
  const uploadMulterUser = multer({
    storage:userStorage,
    limits: { fileSize: 1024 * 1024 * 20 },
    fileFilter: (req, file, cb) => {
      const fileExt = file.originalname.split('.').at(-1);

      fs.readdir('./public/upload/users',(err,files)=>{
        files.forEach((img,i)=>{
          if(img.split('.')[0]===req.user._id && img !== `${req.user._id}.${fileExt}`){
            fs.unlinkSync(`./public/upload/users/${img}`)
          }
        })
      })
      const fileType = file.mimetype.split("/")[0];
      fileType === "image" ? cb(null, true) : cb("formato invalido", false);
    },
  });
  
    const uploadUserImage= uploadMulterUser.single('file')


module.exports = {
  uploadProductImage,
  uploadUserImage,
  deleteImageProduct
};
