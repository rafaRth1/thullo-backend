import { request, response } from 'express';
import Project from '../models/Project.js';

const handleSearch = async (req = request, res = response) => {
	const { search } = req.body;
	const projects = await Project.find({ name: search });

	console.log(projects);

	try {
		// res.json({ result: [] });
	} catch (error) {
		console.log(error);
	}
};

export { handleSearch };
