import mongoose from 'mongoose';
import { request, response } from 'express';
import Project from '../models/Project.js';
import List from '../models/List.js';
import Comment from '../models/Comment.js';
import TaskCard from '../models/TaskCard.js';
import User from '../models/User.js';
import Label from '../models/Label.js';

const createTaskCard = async (req = request, res = response) => {
	const { list } = req.body;
	const existingList = await List.findById(list);

	if (!existingList) {
		const error = new Error('No encontrado');
		return res.status(404).json({ msg: error.message });
	}

	try {
		const cardStore = await TaskCard.create(req.body);
		existingList.taskCards.push(cardStore._id);

		await existingList.save();

		res.json(cardStore);
	} catch (error) {
		console.log(error);
	}
};

const updateCard = async (req = request, res = response) => {
	const { id } = req.params;
	const task = await TaskCard.findById(id).select('nameCard imgUlr description');

	task.nameCard = req.body.nameCard || task.nameCard;
	task.imgUlr = req.body.imgUlr;
	task.description = req.body.description || task.description;

	try {
		const taskCardStore = await task.save();
		res.json(taskCardStore);
	} catch (error) {
		console.log(error);
	}
};

const deleteCard = async (req = request, res = response) => {
	const { id } = req.params;
	const card = await TaskCard.findById(id);

	try {
		await card.delete();
		res.json({
			msg: 'Card Delete',
		});
	} catch (error) {
		console.log(error);
	}
};

const getCardsToIds = async (req = request, res = response) => {
	const { id } = req.params;
	const lists = await List.findById(id).populate('taskCards');

	res.json(lists);
};

// Name Card
// const editNameCard = async (req = request, res = response) => {
// 	const { id } = req.params;
// 	const  taskCard = await TaskCard.findById(id);

// 	taskCard.
// }

// Comments

const createComment = async (req = request, res = response) => {
	const { taskCard } = req.body;
	const existingTaskCard = await TaskCard.findById(taskCard);

	if (!existingTaskCard) {
		const error = new Error('No encontrado');
		return res.status(404).json({ msg: error.message });
	}

	try {
		const commentStore = await Comment.create(req.body);
		existingTaskCard.comments.push(commentStore._id);
		await existingTaskCard.save();

		res.json(commentStore);
	} catch (error) {
		console.log(error);
	}
};

const editComment = async (req = request, res = response) => {
	const { id } = req.params;
	const comment = await Comment.findById(id);
	// const taskCard = await TaskCard.findById(comment.taskCard);

	comment.comment = req.body.bodyComment || comment.comment;

	try {
		const commentStore = await comment.save();
		res.json(commentStore);
	} catch (error) {
		console.log(error);
	}
};

const deleteComment = async (req = request, res = response) => {
	const { id } = req.params;
	const comment = await Comment.findById(id);
	const taskCard = await TaskCard.findById(comment.taskCard).populate('comments');

	try {
		taskCard.comments.pull(id);
		await Promise.allSettled([await taskCard.save(), await comment.delete()]);

		res.json({ msg: 'TaskCard Eliminado' });
	} catch (error) {
		console.log(error);
	}
};

// Members

const findMemberToTaskCard = async (req = request, res = response) => {
	// const { email, projectId } = req.body;
	// const user = await User.findOne({ email }).select('_id name colorImg');
	// const project = await Project.findById(projectId);
	// if (!user) {
	// 	const error = new Error('User not found');
	// 	return res.status(404).json({ msg: error.message });
	// }
	// if (project.collaborators.includes(email._id)) {
	// 	const error = new Error('User not found in Project');
	// 	return res.status(404).json({ msg: error.message });
	// }
	// const taskCard = await TaskCard.findById(req.params.id);
	// taskCard.members.push(email._id);
	// try {
	// 	const taskCardStore = await taskCard.save();
	// 	await taskCardStore.populate({ path: 'members', select: '_id name colorImg' });
	// 	res.json(taskCardStore.members);
	// } catch (error) {
	// 	console.log(error);
	// }
};

const findMemberInTaskcard = async (req = request, res = response) => {
	const { idProject } = req.params;
	const project = await Project.findById(idProject).populate({
		path: 'collaborators',
		select: '_id name colorImg',
	});

	try {
		res.json(project.collaborators);
	} catch (error) {
		console.log(error);
	}
};

const assignMemberToTaskCard = async (req = request, res = response) => {
	const { id } = req.params;
	const taskCard = await TaskCard.findById(id);

	req.body.members.map((member) => {
		if (taskCard.members.includes(member._id)) {
			return;
		} else {
			taskCard.members.push(member._id);
		}
	});

	try {
		const taskCardStore = await taskCard.save();
		await taskCardStore.populate({ path: 'members', select: '_id name colorImg' });
		res.json(taskCardStore.members);
	} catch (error) {
		console.log(error);
	}
};

// Labels

const createLabeltoTaskCard = async (req = request, res = response) => {
	const taskCard = await TaskCard.findById(req.params.id);
	const label = await Label.create(req.body);

	taskCard.labels.push(label._id);

	try {
		await taskCard.save();
		res.json(label);
	} catch (error) {
		console.log(error);
	}
};

const deleteLabelToTaskCard = async (req = request, res = response) => {
	const taskCard = await TaskCard.findById(req.params.id);
	const label = await Label.findById(req.body.idLabel);

	taskCard.labels.pull(req.body.idLabel);

	try {
		await Promise.allSettled([await taskCard.save(), label.deleteOne()]);
		res.json({ msg: 'Label eliminado' });
	} catch (error) {
		console.log(error);
	}
};

export {
	createTaskCard,
	updateCard,
	deleteCard,
	getCardsToIds,
	createComment,
	editComment,
	deleteComment,
	findMemberInTaskcard,
	assignMemberToTaskCard,
	findMemberToTaskCard,
	createLabeltoTaskCard,
	deleteLabelToTaskCard,
};
