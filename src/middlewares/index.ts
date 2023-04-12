import express from 'express';
import { get, merge } from 'lodash';
import { getUserBySessionToken } from '../db/users';

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const id = req.params?.id;
        const user = get(req, 'identity._id') as string | undefined;
        if (!user) {
            return res.sendStatus(403);
        }
        if (id && user.toString() !== id) {
            return res.sendStatus(403);
        }
        next();
    } catch (error) {
        console.log(error);
    }

}

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const sessionToken = req.cookies['IGOR-PROJETO-AUTH'];
        if (!sessionToken) {
            return res.sendStatus(403);
        }
        const existingUser = await getUserBySessionToken(sessionToken);
        if (!existingUser) {
            return res.sendStatus(403);
        }
        merge(req, { identity: existingUser });
        next();

    } catch (error) {
        console.log(error);

    }
}

