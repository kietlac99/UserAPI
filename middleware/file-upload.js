import multer from 'multer'
import path from 'path'

const upload =  multer ({
    storage : multer.diskStorage ({
        destination: (req, file, cb) =>{
            cb (null, '../AxiosAPIPracticeSource/public/uploads')
        },
        filename: function (req, file, callback) {
            callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
        }
    })
})

export { upload }