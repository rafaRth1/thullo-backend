import { request, response } from 'express';
import List from '../models/List.js';
import Project from '../models/Project.js';
import TaskCard from '../models/TaskCard.js';

const getLists = async (req = request, res = response) => {
	const { idProject } = req.params;
	const project = await Project.findById(idProject)
		.populate({ path: 'collaborators', select: '-confirm -createdAt -token -updatedAt -__v -password' })
		.select('-lists');
	const lists = await List.find()
		.where('project')
		.equals(idProject)
		.populate({ path: 'taskCards', populate: { path: 'comments' } });

	res.json({
		project,
		lists,
		length: lists.length,
	});
};

const createNewList = async (req = request, res = response) => {
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

	try {
		const listStore = await List.create(req.body);
		res.json(listStore);
	} catch (error) {
		console.log(error);
	}
};

const editList = async (req = request, res = response) => {
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

	list.name = req.body.name || list.name;

	try {
		await list.save();
		res.json({ msg: 'Lista Actualizada' });
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
	const listPrev = await List.findById(listIdPrev);
	const listNext = await List.findById(listIdNext);
	const card = await TaskCard.findById(idCard);

	const listUpdatePrev = listPrev.taskCards.filter((task) => task.toString() !== idCard);
	listPrev.taskCards = listUpdatePrev;

	card.list = listIdNext;
	listNext.taskCards.push(idCard);

	try {
		listPrev.save();
		listNext.save();
		card.save();

		res.json('Cambio');
	} catch (error) {
		console.log(error);
	}
};

export { createNewList, getLists, editList, deleteList, addCardIdToList };
