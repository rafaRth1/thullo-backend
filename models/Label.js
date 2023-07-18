import mongoose from 'mongoose';

export const LabelSchema = mongoose.Schema({
	nameLabel: {
		type: String,
		required: true,
	},

	nameColor: {
		type: String,
		required: true,
	},

	color: {
		type: String,
		required: true,
	},

	colorLight: {
		type: String,
		required: true,
	},
});

const Label = mongoose.model('Label', LabelSchema);

export default Label;
