// External Dependencies
import {ObjectId} from "mongodb";
import { collections } from "../services/database.service.js";
import type { Event } from "@shared/types";
import express from "express";
// Global Config
export const eventRouter = express.Router();

eventRouter.use(express.json());
// GET ALL
eventRouter.get("/", async (_req, res) => {
    const docs = await collections.events?.find({}).toArray();
    const events = mapEvents(docs!);
    res.status(200).json(events);
});

//GET By DATE Period
eventRouter.get("/range", async (req, res) => {
    const {start, end} = req.query;

    if(!start || !end) {
        return res.status(400).json({message: "Start and end date required."});
    }
    const startDate = start as string;
    const endDate = end as string;

    try {
        const query = {date: { $gte: startDate, $lte: endDate }};
        const docs = await collections.events?.find(query).toArray();
        const events = mapEvents(docs!);

        return res.status(200).send(events);
    } catch (error: any) {
        console.error("Range query error:", error);
        res.status(500).json({error: error.message});
    }
});

//GET BY ID
eventRouter.get("/:id", async (req, res) => {
    const id = req?.params?.id;

    try {
        const query = { _id: new ObjectId(id) };
        const event = (await collections.events?.findOne(query));
        const events = mapEvents([event]);

        if (event) {
            res.status(200).send(events[0]);
        }
    } catch (error: any) {
        res.status(500).send(`Unable to find matching document with id: ${req.params.id}`);
    }
});

//POST
eventRouter.post("/", async (req, res) => {
    const newEvent: Event = req.body;
    const result = await collections.events?.insertOne(newEvent);

    res.status(201).json({insertedId: result?.insertedId});
});

//PUT
eventRouter.put("/:id", async (req, res) => {
    const id = req?.params?.id;

    try {
        const updatedEvent: Event = req.body as Event;
        const query = { _id: new ObjectId(id) };

        const result = await collections.events?.updateOne(query, { $set: updatedEvent });

        result ? res.status(200).send(`Successfully updated event with id ${id}`)
             : res.status(304).send(`Event with id: ${id} not updated`);
    } catch (error: any) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});

//DELETE
eventRouter.delete("/:id", async (req, res) => {
    const id = req?.params?.id;

    try {
        const query = { _id: new ObjectId(id) };
        const result = await collections.events?.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed event with id ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove event with id ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Event with id ${id} does not exist`);
        }
    } catch (error: any) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
})

const mapEvents = (docs: any[]): Event[] => {
    return docs.map(doc => ({
            id: doc._id.toString(),
            eventName: doc.eventName,
            host: doc.host,
            date: doc.date,
            startTime: doc.startTime,
            endTime: doc.endTime,
            location: doc.location,
            eventCategory: doc.eventCategory,
            entryFee: doc.entryFee,
            additionalInfo: doc.additionalInfo,
            extras: doc.extras
        })
    );
}