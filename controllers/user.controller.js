// routes/users.js
import express from 'express';
import List from '../models/list.model.js';

export const unsubscribeUser = async (req, res) => {
    const { listId, userId } = req.params;
    const list = await List.findById(listId);

    if (!list) {
        return res.status(404).send('List not found.');
    }

    const user = list.users.id(userId);
    if (user) {
        user.unsubscribed = true;
        await list.save();
        res.send('You have been unsubscribed.');
    } else {
        res.status(404).send('User not found.');
    }
}
