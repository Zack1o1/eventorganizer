import client from "../db/index.js";

const isEventExists = async (req, res, next) =>{
    const {id} = req.params
    const userId = req.user.id;

    const event = await client.query('SELECT * FROM events WHERE id = $1', [id]);

    if (event.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    const eUid = await client.query('SELECT user_id FROM events WHERE id = $1', [id])

    if (userId !== eUid.rows[0].user_id) {
        return res.status(403).json({ error: "You are not authorized to modify this event" });
    }
    req.event = event.rows[0]
    next()
}

export default isEventExists