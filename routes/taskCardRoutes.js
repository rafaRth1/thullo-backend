import express from 'express';
import checkAuth from '../middleware/checkAuth.js';
import {
	createComment,
	createTaskCard,
	deleteCard,
	editComment,
	deleteComment,
	getCardsToIds,
	updateCard,
	findMemberInTaskcard,
	assignMemberToTaskCard,
	createLabeltoTaskCard,
	deleteLabelToTaskCard,
	findMemberToTaskCard,
} from '../controllers/taskCardController.js';

const router = express.Router();

router.post('/', createTaskCard);
router.route('/:id').get(getCardsToIds).put(updateCard).delete(deleteCard);
// router.post('/name-card/:id').put();

// Comments
router.post('/comment', createComment);
router.route('/comment/:id').delete(deleteComment).put(editComment);

// Members
router.get('/member/:idProject', findMemberInTaskcard);
router.post('/member/:id', assignMemberToTaskCard);
router.post('/member-taskcard/:id', findMemberToTaskCard);

// Labels
router.post('/label/:id', createLabeltoTaskCard);
router.post('/label-delete/:id', deleteLabelToTaskCard);

export default router;
