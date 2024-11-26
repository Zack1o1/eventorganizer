import express from "express";
import client from "../db/index.js";
import { configDotenv } from "dotenv";
import isEventExists from "../middleware/eventExists.js";

configDotenv();

const router = express.Router();

// create event
router.post("/create", async (req, res) => {
  const { title, description, location, event_date, capacity } = req.body;
  const user_id = req.user.id;

  try {
    let query =
      "INSERT INTO events (user_id, title, description, location, event_date, capacity) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
    let values = [user_id, title, description, location, event_date, capacity];
    const newEvent = await client.query(query, values);
    res.status(201).json({ event: newEvent.rows[0] });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// get event have limit and offset
router.get("/", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    let query =
      "SELECT * FROM events ORDER BY event_date ASC LIMIT $1 OFFSET $2";
    const getEvents = await client.query(query, [limit, (page - 1) * 10]);
    res.status(200).json({ Events: getEvents.rows });
  } catch (error) {
    console.error("Error getting events", error);
    res.status(500).json({ error: "server error" });
  }
});

// get event by id
router.get("/id/:id", isEventExists, async (req, res) => {
  const { id } = req.params;
  try {
    let query = "SELECT * FROM events WHERE id = $1";
    const getEventById = await client.query(query, [id]);
    res.status(200).json({ Event: getEventById.rows[0] });
  } catch (error) {
    console.error("Error getting event with id", error);
    res.status(500).json({ error: "server error" });
  }
});

// update event by id
router.put("/update/:id", isEventExists, async (req, res) => {
  const { id } = req.params;
  const { title, description, location, event_date, capacity } = req.body;

  try {
    let updateQuery =
      "UPDATE events SET title = $1, description = $2, location = $3, event_date = $4, capacity = $5 WHERE id = $6 RETURNING *";
    const updateEvent = await client.query(updateQuery, [
      title,
      description,
      location,
      event_date,
      capacity,
      id,
    ]);
    res.status(201).json({ "Updated Event": updateEvent.rows });
  } catch (error) {
    console.error("error updating event", error);
    res.status(500).json({ error: "server error" });
  }
});

// delete the event by id
router.delete("/delete/:id", isEventExists, async (req, res) => {
  const { id } = req.params;

  try {
    let deleteQuery = "DELETE FROM events WHERE id = $1";
    await client.query(deleteQuery, [id]);
    res.status(200).json({ message: "Deleted event succefully" });
  } catch (error) {
    console.error("Error deleting event", error);
    res.status(500).json({ error: "server error" });
  }
});

export default router;
