import express from 'express';
import {
	createNewList,
	getLists,
	editList,
	deleteList,
	addCardIdToList,
} from '../controllers/listController.js';
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

router.post('/', checkAuth, createNewList);
router.route('/:id').put(checkAuth, editList).delete(checkAuth, deleteList);
router.route('/:idProject').get(checkAuth, getLists);
router.post('/:idCard', addCardIdToList);

export default router;
