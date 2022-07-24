// полноценный CRUD цикл для работы с пользователями

class UserController {
    async createUser(req, res) { //метод создания пользователя

    }

    async getUsers(req, res) {  //метод возвращения клиенту всех пользователей

    }

    async getOneUser(req, res) {  //метод возвращения клиенту конкретного пользователя

    }

    async updateUser(req, res) {  //метод обновления данных пользователя

    }

    async deleteUser(req, res) {  //метод удаления пользователя

    }
}

module.exports = new UserController(); // экспорт объекта данного контроллера, чтобы использовать его в ROUTES