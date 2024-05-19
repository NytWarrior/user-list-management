import express from 'express';
import multer from 'multer';
import { getList, createList } from '../controllers/list.controller.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/lists/:listId', getList);
router.post('/lists', upload.single('file'), createList);

export default router;
