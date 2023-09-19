import { request, response } from 'express';
import Project from '../models/Project.js';
import List from '../models/List.js';
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

const updateTaskCard = async (req = request, res = response) => {
	const { id } = req.params;
	const task = await TaskCard.findById(id).select('nameCard imgUlr description');

	if (!task) {
		const error = new Error('TaskCard no existe');
		return res.status(403).json({ msg: error.message });
	}

	task.nameCard = req.body.nameCard || task.nameCard;
	task.imgUlr = req.body.imgUlr || task.imgUlr;
	task.description = req.body.description || task.description;

	try {
		const taskCardStore = await task.save();
		res.json(taskCardStore);
	} catch (error) {
		console.log(error);
		res.status(403).json({ msg: 'Error' });
	}
};

const deleteTaskCard = async (req = request, res = response) => {
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

// Comment
const createComment = async (req = request, res = response) => {
	const taskCard = await TaskCard.findById(req.body.taskCard);
	const comment = taskCard.comments.create(req.body);

	taskCard.comments.push(comment);

	try {
		await taskCard.save();
		res.json(comment);
	} catch (error) {
		console.log(error);
	}
};

const editComment = async (req = request, res = response) => {
	const { id } = req.params;
	const savedTaskCard = await TaskCard.findOneAndUpdate(
		{ _id: id, 'comments._id': req.body.idComment },
		{
			$set: { 'comments.$.comment': req.body.bodyComment },
		},
		{
			returnDocument: 'after',
		}
	);

	const lastSavedComment = savedTaskCard.comments.find(
		(comment) => comment._id.toString() === req.body.idComment.toString()
	);

	try {
		res.json(lastSavedComment);
	} catch (error) {
		console.log(error);
	}
};

const deleteComment = async (req = request, res = response) => {
	const { id } = req.params;
	const { idComment } = req.body;
	const taskCard = await TaskCard.findById(id);

	taskCard.comments.pull({ _id: idComment });

	try {
		await taskCard.save();
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
	const members = req.body.members;
	const taskCard = await TaskCard.findById(id);

	members.map((member) => {
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
	const label = taskCard.labels.create(req.body);

	taskCard.labels.push(label);

	try {
		await taskCard.save();
		res.json(label);
	} catch (error) {
		console.log(error);
	}
};

const deleteLabelToTaskCard = async (req = request, res = response) => {
	const { id } = req.params;
	const { idLabel } = req.body;
	const taskCard = await TaskCard.findById(id);

	taskCard.labels.id(idLabel).remove();

	try {
		await taskCard.save();
		res.json({ msg: 'Label eliminado' });
	} catch (error) {
		console.log(error);
	}
};

export {
	createTaskCard,
	updateTaskCard,
	deleteTaskCard,
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

// if (!existingTaskCard) {
// 	const error = new Error('No encontrado');
// 	return res.status(404).json({ msg: error.message });
// }
