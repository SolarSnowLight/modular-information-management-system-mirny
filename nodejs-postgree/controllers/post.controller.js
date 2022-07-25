const db = require('../db') // соединение с БД

class PostController {

    async createPost(req, res) {
        const {title, content, userID} = req.body
        const newPost = await db.query(
            `INSERT INTO post (title, content, userID) values ($1, $2, $3) RETURNING *`,
            [title, content, userID]
        )
        res.json(newPost.rows[0])
    }

    async getPostsByUser(req, res) {
        const id = req.query.id
        const posts = await db.query(
            `select * from post where user_id = $1`,
            [id]
        )
        res.json(newPost.rows[0])
    }
}

module.exports = new PostController()