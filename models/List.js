import mongoose from 'mongoose';

const ListSChema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},

		color_header: {
			primary_color: {
				type: String,
			},
			secondary_color: {
				type: String,
			},
		},

		taskCards: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'TaskCard',
			},
		],

		project: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Project',
		},
	},
	{
		timestamps: true,
	}
);

const List = mongoose.model('List', ListSChema);

export default List;
