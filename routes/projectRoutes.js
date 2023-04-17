import express from 'express';
import {
	createNewProject,
	getProjects,
	getProject,
	editProject,
	deleteProject,
	findCollaborator,
	addCollaborator,
	deleteCollaborator,
	handleUploadImage,
	handleDestroyImage,
} from '../controllers/projectController.js';
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

// Route Project Parent
router.route('/').get(checkAuth, getProjects).post(checkAuth, createNewProject);
router.route('/:id').get(checkAuth, getProject).put(checkAuth, editProject).delete(checkAuth, deleteProject);

router.post('/collaborator', findCollaborator);
router.route('/collaborator/:id').post(checkAuth, addCollaborator);
router.post('/delete-collaborator/:id', checkAuth, deleteCollaborator);
// Route Project Task Children
// router.route('/task').post(checkAuth, createNewTaskCard);

// Route Image
router.post('/image', handleUploadImage);
router.post('/image-delete', handleDestroyImage);

export default router;
