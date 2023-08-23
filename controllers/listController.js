import mongoose from 'mongoose';
import { request, response } from 'express';
import List from '../models/List.js';
import Project from '../models/Project.js';
import TaskCard from '../models/TaskCard.js';

const getLists = async (req = request, res = response) => {
	const { idProject } = req.params;

	const lists = await List.find()
		.where('project')
		.equals(idProject)
		.select('-createdAt -updatedAt -__v -project')
		.populate({ path: 'taskCards', populate: { path: 'comments' } })
		.populate({ path: 'taskCards', populate: { path: 'members', select: '_id name colorImg img' } })
		.populate({ path: 'taskCards', populate: { path: 'labels' } });

	res.json(lists);
};

const createList = async (req = request, res = response) => {
	const { project } = req.body;
	const existingProject = await Project.findById(project);

	if (!existingProject) {
		const error = new Error('El proyecto no existe');
		return res.status(404).json({ msg: error.message });
	}

	if (existingProject.creator.toString() !== req.user._id.toString()) {
		const error = new Error('No tienes permisos');
		return res.status(403).json({ msg: error.message });
	}

	const list = await List.create(req.body);

	try {
		res.json({
			_id: list._id,
			name: list.name,
			taskCards: list.taskCards,
			project: list.project,
		});
	} catch (error) {
		console.log(error);
	}
};

const editList = async (req = request, res = response) => {
	const { id } = req.params;
	const list = await List.findById(id)
		.select('-createdAt -updatedAt -__v')
		.populate({ path: 'project', select: 'creator' });

	if (!list) {
		const error = new Error('No encontrado');
		return res.status(404).json({ msg: error.message });
	}

	if (list.project.creator.toString() !== req.user._id.toString()) {
		const error = new Error('Acción no valida');
		return res.status(401).json({ msg: error.message });
	}

	list.name = req.body.name || list.name;

	try {
		const listUdpate = await list.save();

		res.json({
			_id: listUdpate._id,
			name: listUdpate.name,
		});
	} catch (error) {
		console.log(error);
	}
};
const deleteList = async (req = request, res = response) => {
	const { id } = req.params;
	const list = await List.findById(id).populate('project');

	if (!list) {
		const error = new Error('No encontrado');
		return res.status(404).json({ msg: error.message });
	}

	if (list.project.creator.toString() !== req.user._id.toString()) {
		const error = new Error('Acción no valida');
		return res.status(401).json({ msg: error.message });
	}

	try {
		await Promise.allSettled([await list.delete(), await TaskCard.deleteMany({ list: list._id })]);
		res.json({ msg: 'Lista Eliminada' });
	} catch (error) {
		console.log(error);
	}
};

const addCardIdToList = async (req = request, res = response) => {
	const { idCard } = req.params;
	const { listIdNext, listIdPrev } = req.body;
	const card = await TaskCard.findById(idCard);
	const listPrev = await List.findById(listIdPrev);
	const listNext = await List.findById(listIdNext);

	listPrev.taskCards.pull(card._id);
	listNext.taskCards.push(card._id);

	card.list = listIdNext;

	try {
		await Promise.allSettled([await listPrev.save(), await listNext.save(), await card.save()]);

		res.json('Cambio');
	} catch (error) {
		console.log(error);
	}
};

const udpateCardToList = async (req = request, res = response) => {
	const { taskCards, _idTaskCard } = req.body;
	const list = await List.findById(req.params.id);
	const card = await TaskCard.findById(_idTaskCard);

	const newTaskCards = taskCards.map((items) => {
		return new mongoose.Types.ObjectId(items._id);
	});

	card.list = list._id;
	list.taskCards = newTaskCards;

	try {
		await Promise.allSettled([await list.save(), await card.save()]);
	} catch (error) {
		console.log(error);
	}
};

export { createList, getLists, editList, deleteList, addCardIdToList, udpateCardToList };
