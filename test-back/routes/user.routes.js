const Router = require('express');
const router = new Router();
const userController = require('../controllers/user.controllers'); // импорт объекта контроллера

// определение маршрута для каждой из функций
router.post('/user', userController.createUser);
router.get('/user', userController.getUsers);
router.get('/user/:id', userController.getOneUser);
router.put('/user', userController.updateUser);
router.delete('/user', userController.deleteUser);





module.exports = router; // экспорт объекта router