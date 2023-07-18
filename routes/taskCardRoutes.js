import express from 'express';
import checkAuth from '../middleware/checkAuth.js';
import {
	createTaskCard,
	updateTaskCard,
	deleteTaskCard,
	createComment,
	editComment,
	deleteComment,
	getCardsToIds,
	findMemberInTaskcard,
	assignMemberToTaskCard,
	createLabeltoTaskCard,
	deleteLabelToTaskCard,
	findMemberToTaskCard,
} from '../controllers/taskCardController.js';

const router = express.Router();

router.post('/', createTaskCard);
router.route('/:id').get(getCardsToIds).put(updateTaskCard).delete(deleteTaskCard);

// Comments
router.post('/comment', createComment);
router.put('/comment/:id', editComment);
router.post('/comment-delete/:id', deleteComment);

// Members
router.get('/member/:idProject', findMemberInTaskcard);
router.post('/member/:id', assignMemberToTaskCard);
router.post('/member-taskcard/:id', findMemberToTaskCard);

// Labels
router.post('/label/:id', createLabeltoTaskCard);
router.post('/label-delete/:id', deleteLabelToTaskCard);

export default router;
