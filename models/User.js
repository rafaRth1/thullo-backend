import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = mongoose.Schema(
	{
		name: {
			type: String,
			require: true,
			trim: true,
		},

		password: {
			type: String,
			require: true,
			trim: true,
		},

		email: {
			type: String,
			require: true,
			trim: true,
			unique: true,
		},

		img: {
			type: String,
			trim: true,
		},

		colorImg: {
			type: String,
		},

		token: {
			type: String,
		},

		confirm: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

UserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.checkPassword = async function (passwordForm) {
	return await bcrypt.compare(passwordForm, this.password);
};

const User = mongoose.model('User', UserSchema);

export default User;
