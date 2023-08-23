import cloudinary from 'cloudinary';
import { request, response } from 'express';
import Project from '../models/Project.js';
import User from '../models/User.js';
import Image from '../models/Image.js';

const getProjects = async (req = request, res = response) => {
	const projects = await Project.find({
		$or: [{ collaborators: { $in: req.user } }, { creator: { $in: req.user } }],
	})
		.select('-createdAt -updatedAt -__v')
		.populate({ path: 'collaborators', select: '_id name email colorImg img' });
	res.json(projects);
};

const getProject = async (req = request, res = response) => {
	const { id } = req.params;
	const project = await Project.findById(id).select('-createdAt -updatedAt -lists -__v').populate({
		path: 'collaborators',
		select: '_id name colorImg img',
	});

	if (!project) {
		const error = new Error('No encontrado');
		return res.status(404).json({ msg: error.message });
	}

	if (
		project.creator.toString() !== req.user._id.toString() &&
		!project.collaborators.some((collaborator) => collaborator._id.toString() === req.user._id.toString())
	) {
		const error = new Error('Acción no valida');
		return res.status(404).json({ msg: error.message });
	}

	res.json(project);
};

const createNewProject = async (req = request, res = response) => {
	const project = new Project(req.body);
	project.creator = req.user._id;

	try {
		const projectStore = await project.save();

		res.json({
			_id: projectStore._id,
			name: projectStore.name,
			name_img: projectStore.name_img,
			type: projectStore.type,
			collaborators: projectStore.collaborators,
			creator: projectStore.creator,
		});
	} catch (error) {
		console.log(error);
	}
};

const editProject = async (req = request, res = response) => {
	const { id } = req.params;
	const project = await Project.findById(id);

	if (!project) {
		const error = new Error('No encontrado');
		return res.status(404).json({ msg: error.message });
	}

	if (project.creator.toString() !== req.user._id.toString()) {
		const error = new Error('Acción no valida');
		return res.status(404).json({ msg: error.message });
	}

	project.name = req.body.name || project.name;
	project.name_img = req.body.name_img || project.name_img;
	project.description = req.body.description || project.description;
	project.type = req.body.type || project.type;

	try {
		const projectStore = await project.save();

		res.json({
			_id: projectStore._id,
			name: projectStore.name,
			description: projectStore.description,
			type: projectStore.type,
		});
	} catch (error) {
		console.log(error);
	}
};

const deleteProject = async (req = request, res = response) => {
	const { id } = req.params;
	const project = await Project.findById(id);

	// const lists = await List.find().where('project').equals(project._id);

	if (!project) {
		const error = new Error('No encontrado');
		return res.status(404).json({ msg: error.message });
	}

	if (project.creator.toString() !== req.user._id.toString()) {
		const error = new Error('Acción no valida');
		return res.status(404).json({ msg: error.message });
	}

	try {
		await project.delete();
		// await List.deleteMany({ project: project._id });

		res.json({ msg: 'Proyecto Eliminado' });
	} catch (error) {
		console.log(error);
	}
};

const findCollaborator = async (req = request, res = response) => {
	const { email } = req.body;

	const user = await User.findOne({ email }).select('-confirm -createdAt -token -updatedAt -__v -password');

	if (!user) {
		const error = new Error('User not found');
		return res.status(404).json({ msg: error.message });
	}

	res.json(user);
};

const addCollaborator = async (req = request, res = response) => {
	const { id } = req.params;
	const project = await Project.findById(id);

	if (!project) {
		const error = new Error('Project Not Found');
		return res.status(404).json({ msg: error.message });
	}

	if (project.creator.toString() !== req.user._id.toString()) {
		const error = new Error('Valid not action');
		return res.status(404).json({ msg: error.message });
	}

	const { email } = req.body;

	const user = await User.findOne({ email }).select('-confirm -createdAt -token -updatedAt -__v -password');

	if (!user) {
		const error = new Error('User not found');
		return res.status(404).json({ msg: error.message });
	}

	if (project.creator.toString() === user._id.toString()) {
		const error = new Error('El creador no puede agregarse');
		return res.status(404).json({ msg: error.message });
	}

	if (project.collaborators.includes(user._id)) {
		const error = new Error('El usuario ya existe al proyecto');
		return res.status(404).json({ msg: error.message });
	}

	project.collaborators.push(user._id);
	await project.populate('collaborators', 'name _id email colorImg');
	await project.save();
	res.json(project);

	// res.json({ _id: project._id, name: project.name, email: project.email, colorImg: project.colorImg });
};

const deleteCollaborator = async (req = request, res = response) => {
	const project = await Project.findById(req.params.id);

	if (!project) {
		const error = new Error('Project Not Found');
		return res.status(404).json({ msg: error.message });
	}

	if (project.creator.toString() !== req.user._id.toString()) {
		const error = new Error('Valid not action');
		return res.status(404).json({ msg: error.message });
	}

	project.collaborators.pull(req.body.id);
	await project.save();
	res.json({ msg: 'Colaborador Eliminado' });
};

// Image

const handleUploadImage = async (req = request, res = response) => {
	const image = await Image.create(req.body);
	res.json(image);
};

const handleDestroyImage = async (req = request, res = response) => {
	cloudinary.v2.config({
		cloud_name: 'dork20pxe',
		api_key: '661776166657691',
		api_secret: 'wrO7LyqXmxOPk2IH0sMXAphgtKk',
	});

	try {
		await cloudinary.v2.uploader.destroy(req.body.public_id).then((result) => res.json(result));
	} catch (error) {
		console.log(error);
	}
};

export {
	createNewProject,
	getProjects,
	getProject,
	editProject,
	deleteProject,
	addCollaborator,
	findCollaborator,
	deleteCollaborator,
	handleUploadImage,
	handleDestroyImage,
};
