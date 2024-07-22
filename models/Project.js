import mongoose from 'mongoose';

const ProjectSchema = mongoose.Schema(
	{
		name_board: {
			type: String,
			require: true,
			trim: true,
		},

		name_img: {
			type: String,
		},

		type: {
			type: String,
			require: true,
			trim: true,
			enum: ['private', 'public'],
		},

		description: {
			type: String,
			trim: true,
		},

		creator: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},

		lists: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'List',
			},
		],

		collaborators: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
	},
	{
		timestamps: true,
	}
);

const Project = mongoose.model('Project', ProjectSchema);

export default Project;
