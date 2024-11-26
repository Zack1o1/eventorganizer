import client from "../db/index.js";

const isEventExists = async (req, res, next) =>{
    const {id} = req.params
    const event = await client.query('SELECT * FROM events WHERE id = $1', [id]);
    if (event.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    req.event = event.rows[0];
    next()
}

export default isEventExists