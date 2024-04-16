import express from 'express';

const router = express.Router();

router.get('/getProds', async (req, res) => {
    res.status(400);
});

export default router;