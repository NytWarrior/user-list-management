import List from '../models/list.model.js';
import fs from 'fs';
import csv from 'csv-parser';

export const getList = async (req, res) => {
    const { listId } = req.params;
    try {
        const list = await List.findById(listId);
        if (!list) {
            return res.status(404).json({ error: 'List not found' });
        }
        return res.json(list);
    } catch (error) {
        console.error('Error fetching list:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createList = async (req, res) => {
    const { title, customProperties } = req.body;
    const file = req.file;
    const results = [];
    const errors = [];

    fs.createReadStream(file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            const users = [];
            const emailSet = new Set();
            const customPropertiesMap = JSON.parse(customProperties).reduce((map, prop) => {
                map[prop.title] = prop.defaultValue;
                return map;
            }, {});

            for (const user of results) {
                if (!user.name || !user.email) {
                    errors.push({ user, error: 'Name and email are required' });
                    continue;
                }
                if (emailSet.has(user.email)) {
                    errors.push({ user, error: 'Duplicate email' });
                    continue;
                }

                emailSet.add(user.email);

                const userProperties = new Map(Object.entries(customPropertiesMap));
                for (const prop in user) {
                    if (prop !== 'name' && prop !== 'email') {
                        userProperties.set(prop, user[prop] || customPropertiesMap[prop]);
                    }
                }

                users.push({
                    name: user.name,
                    email: user.email,
                    properties: userProperties
                });
            }

            const list = new List({ title, customProperties: JSON.parse(customProperties), users });
            await list.save();

            res.json({
                list_id: list._id,
                added: users.length,
                errors: errors.length,
                total: users.length + errors.length,
                errorDetails: errors
            });
        });
};
