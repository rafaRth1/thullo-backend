import mongoose from 'mongoose';
import { LabelSchema } from './Label.js';
import { CommentSchema } from './Comment.js';

const TaskCardSchema = mongoose.Schema({
	nameCard: {
		type: String,
		require: true,
		trim: true,
	},

	imgUlr: {
		type: String,
		trim: true,
	},

	description: {
		type: String,
		trim: true,
	},

	list: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'List',
	},

	labels: [LabelSchema],

	comments: [CommentSchema],

	members: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	],

	attachments: [],
});

const TaskCard = mongoose.model('TaskCard', TaskCardSchema);

export default TaskCard;
