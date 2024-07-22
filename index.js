import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/connectDB.js';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import listRoutes from './routes/listRoutes.js';
import taskCardRoutes from './routes/taskCardRoutes.js';
import searchRoutes from './routes/searchRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());

connectDB();

const whitelist = [process.env.FRONTEND_URL_PRD, process.env.FRONTEND_URL_DEV, process.env.FRONTEND_URL_PRD_TEST];

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

// Directorio Publico
app.use(express.static('public'));

// Lectura y parseo del body
app.use(express.json());

// Puerto 3.
const PORT = process.env.PORT || 4000;

app.use('/user', userRoutes);
app.use('/projects', projectRoutes);
app.use('/list', listRoutes);
app.use('/taskCard', taskCardRoutes);
app.use('/search', searchRoutes);

app.get('*', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, () => {
	console.log(`servidor corriendo en el puerto ${PORT}`);
});
