import mongoose, { mongo } from 'mongoose';

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

	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment',
		},
	],
	attachments: [],
	labels: [],
});

const TaskCard = mongoose.model('TaskCard', TaskCardSchema);

export default TaskCard;
