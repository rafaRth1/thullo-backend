import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/connectDB.js';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import listRoutes from './routes/listRoutes.js';
import taskCardRoutes from './routes/taskCardRoutes.js';
dotenv.config();

const app = express();

app.use(express.json());

connectDB();

// Config Cors
const whitelist = ['http://localhost:5173', 'https://trullo-thello-clone-rafarth1.netlify.app'];

const corsOptions = {
	origin: function (origin, callback) {
		if (whitelist.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error('Error de cors'));
		}
	},
};

app.use(cors(corsOptions));

// Puerto 3.
const PORT = process.env.PORT || 4000;

app.use('/user', userRoutes);
app.use('/projects', projectRoutes);
app.use('/list', listRoutes);
app.use('/taskCard', taskCardRoutes);

app.listen(PORT, () => {
	console.log(`servidor corriendo en el puerto ${PORT}`);
});
