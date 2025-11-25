import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Không có file được upload'
      });
    }

    // Determine file type
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp)$/i;
    const videoExtensions = /\.(mp4|mov|avi|wmv|flv|webm)$/i;
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    
    let loai = 'anh';
    if (videoExtensions.test(fileExt)) {
      loai = 'video';
    } else if (!imageExtensions.test(fileExt)) {
      loai = 'anh'; // default to image
    }

    // Create URL - adjust based on your server setup
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Upload file thành công',
      data: {
        url: fileUrl,
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        loai: loai
      }
    });
  } catch (error) {
    next(error);
  }
};

export const uploadMultipleFiles = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có file được upload'
      });
    }

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp)$/i;
    const videoExtensions = /\.(mp4|mov|avi|wmv|flv|webm)$/i;

    const uploadedFiles = req.files.map(file => {
      const fileExt = path.extname(file.originalname).toLowerCase();
      let loai = 'anh';
      if (videoExtensions.test(fileExt)) {
        loai = 'video';
      }

      return {
        url: `${baseUrl}/uploads/${file.filename}`,
        filename: file.filename,
        originalname: file.originalname,
        size: file.size,
        loai: loai
      };
    });

    res.json({
      success: true,
      message: 'Upload files thành công',
      data: uploadedFiles
    });
  } catch (error) {
    next(error);
  }
};

