// полноценный CRUD цикл для работы с пользователями
const db = require('../db');

class UserController {
    async createUser(req, res) { //метод создания пользователя POST запрос
        const {name, surname} = req.body;
        const newPerson = await db.query('INSERT INTO person (name, surname) values ($1, $2) RETURNING *', [name, surname]);
        console.log(name, surname);
        res.json(newPerson);
    }

    async getUsers(req, res) {  //метод возвращения клиенту всех пользователей GET запрос

    }

    async getOneUser(req, res) {  //метод возвращения клиенту конкретного пользователя GET запрос

    }

    async updateUser(req, res) {  //метод обновления данных пользователя PUT запрос

    }

    async deleteUser(req, res) {  //метод удаления пользователя DELETE запрос

    }
}

module.exports = new UserController(); // экспорт объекта данного контроллера, чтобы использовать его в ROUTES