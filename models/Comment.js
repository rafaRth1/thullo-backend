import mongoose from 'mongoose';

const CommentSchema = mongoose.Schema(
	{
		author: {
			type: String,
		},

		name: {
			type: String,
		},

		colorImg: {
			type: String,
		},

		comment: {
			type: String,
			trim: true,
		},

		taskCard: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'TaskCard',
		},

		dateCurrent: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Comment = mongoose.model('Comment', CommentSchema);

export default Comment;
