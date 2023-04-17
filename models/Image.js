import mongoose from 'mongoose';

const ImageSchema = mongoose.Schema({
	publicId: {
		type: String,
		required: true,
	},

	url: {
		type: String,
		required: true,
	},

	createdAt: {
		type: String,
	},

	resourceType: {
		type: String,
		required: true,
	},
});

const Image = mongoose.model('Image', ImageSchema);

export default Image;
