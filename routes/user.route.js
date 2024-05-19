import express from 'express';
import { unsubscribeUser } from '../controllers/user.controller.js';

const router = express.Router();

router.put('/lists/:listId/users/:userId/unsubscribe', unsubscribeUser);

export default router;