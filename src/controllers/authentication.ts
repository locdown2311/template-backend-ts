import express from 'express';

import { getUserByEmail, createUser } from '../db/users';
import { authentication, random } from '../helpers';

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.sendStatus(400);
        }

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');

        if (!user) {
            return res.sendStatus(400);
        }

        const auth = user?.authentication;
        if (!auth) {
            return res.sendStatus(400);
        }
        const salt = auth?.salt;
        if (!salt) {
            return res.sendStatus(403);
        }
        const expectedHash = authentication(salt, password);
        if (auth?.password !== expectedHash) {
            return res.sendStatus(403);
        }

        const newSalt = random();
        auth.sessionToken = authentication(newSalt, user._id.toString());
        await user.save();
        res.cookie('IGOR-PROJETO-AUTH', auth.sessionToken, { domain: 'localhost', path: '/' });


        return res.status(200).json(user).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.sendStatus(400);
        }

        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return res.sendStatus(400);
        }

        const salt = random();
        const user = await createUser({
            email,
            name,
            authentication: {
                salt,
                password: authentication(salt, password),
            },
        });

        return res.status(200).json(user).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}