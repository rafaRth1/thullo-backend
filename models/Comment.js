import mongoose from 'mongoose';

export const CommentSchema = mongoose.Schema(
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
