import express from 'express';
import CommonService from '../../Services/Common/CommonService';
import upload from '../../utils/multer';

const router = express.Router();

router.get('/combo-user-with-key', CommonService.comboUserWithKey);
router.post('/upload-file', upload.single('image'), CommonService.uploadFile);


export default router;
