import express from 'express';
import { deleteUserById, getUsers, updateUserById } from '../db/users';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();
        return res.status(200).json(users).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const {id} = req.params;
        const deletedUser = await deleteUserById(id);
        return res.status(200).json(deletedUser).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}
export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        const {id} = req.params;
        const {name, email, password} = req.body;
        const updatedUser = await updateUserById(id, {name, email, password});
        return res.status(200).json(updatedUser).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}