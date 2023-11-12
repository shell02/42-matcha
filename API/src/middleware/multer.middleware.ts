import multer = require('multer')
import fs = require('fs')
import path = require('path')
import { uploadPath } from '../app'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'dist/src/uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now().toString())
  },
})

export const upload = multer({ storage: storage })

export const deleteFile = (fileName: string) => {
  const filePath = path.join(uploadPath, fileName)
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err)
      return
    }
  })
}
