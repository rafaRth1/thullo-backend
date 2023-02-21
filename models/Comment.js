import mongoose from 'mongoose';

const CommentSchema = mongoose.Schema({
	comment: {
		type: String,
		trim: true,
	},

	taskCard: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'TaskCard',
	},
});

const Comment = mongoose.model('Comment', CommentSchema);

export default Comment;
