import express from 'express';
import {getUserFromService} from './client';

const app = express();

app.get('/user/:id', async (req, res) => {
    try {
        const user = await getUserFromService(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch user'});
    }
});

(async () => {
    const user = await getUserFromService("123");
    console.log(user);
})()

const PORT = 4002;

app.listen(PORT, () => {
    console.log(`Order Service running on port ${PORT}`);
});