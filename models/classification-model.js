const pool = require("../database")

async function addClass(classification) {
    return pool.query(`
        INSERT INTO public.classification (classification_name)
        VALUES ($1) RETURNING *
        `,
        [classification])
}


module.exports = { addClass }