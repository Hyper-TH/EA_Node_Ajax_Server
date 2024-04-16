import express from 'express';
import cors from 'cors';
import { productsRouter } from 'products/productsRouter.js'

const app = express();
app.use(cors());
app.use(express.json());

// Increase JSON payload limit
app.use(express.json({ limit: '50mb' }));   

// Increase URL-encoded payload limit 
app.use(express.urlencoded({ limit: '50mb', extended: true })); 

// Endpoint for testing
app.get('/message', (req, res) => {
    res.json({ message: 'Hello World' });
});

app.listen(8000, () => {
    console.log(`Server is running on port 8000`);
});

app.use(productsRouter);