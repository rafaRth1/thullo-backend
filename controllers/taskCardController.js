import { request, response } from 'express';
import List from '../models/List.js';
import Comment from '../models/Comment.js';
import TaskCard from '../models/TaskCard.js';

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
	const task = await TaskCard.findById(id).populate('comments');

	task.nameCard = req.body.nameCard || task.nameCard;
	task.imgUlr = req.body.imgUlr || task.imgUlr;
	task.description = req.body.description || task.description;
	// task.comments = req.body.comments || task.comments;
	task.attachments = req.body.attachments || task.attachments;
	task.labels = req.body.labels || task.labels;
	task.list = req.body.list || task.list;

	try {
		const taskStore = await task.save();
		await taskStore.populate('comments');
		res.json(taskStore);
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

// Comments

const createComment = async (req = request, res = response) => {
	const { taskCard } = req.body;
	const existingTaskCard = await TaskCard.findById(taskCard).populate('comments');

	if (!existingTaskCard) {
		const error = new Error('No encontrado');
		return res.status(404).json({ msg: error.message });
	}

	try {
		const commentStore = await Comment.create(req.body);
		existingTaskCard.comments.push(commentStore._id);
		await existingTaskCard.save();

		res.json({ commentStore, taskCard: existingTaskCard });
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

		res.json(taskCard);
	} catch (error) {
		console.log(error);
	}
};

export { createTaskCard, updateCard, deleteCard, getCardsToIds, createComment, editComment, deleteComment };
