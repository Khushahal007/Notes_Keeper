const express = require('express');
require('dotenv').config();
const router = express.Router();
const admin = require('firebase-admin')
const credentials = require('../key.json')
admin.initializeApp({
    credential: admin.credential.cert(credentials)
});

const db = admin.firestore();


// Create a new note
router.post('/', async (req, res) => {
    try {
        const { title, tagline, body } = req.body;

        // Add a new document to the "notes" collection in Firestore
        const noteRef = db.collection('notes').doc();
        await noteRef.set({ title, tagline, body });

        res.status(201).json({ message: 'Note created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all notes
router.get('/', async (req, res) => {
    try {
        
        const notesSnapshot = await db.collection('notes').get();

        const notes = [];

        notesSnapshot.forEach((doc) => {
            notes.push({
                id: doc.id,
                ...doc.data()
            });
        });

        res.status(200).json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a note by ID
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, tagline, body } = req.body;

        if (!id) {
            // Handle the case where 'id' is not provided in the request
            return res.status(400).json({ error: 'ID is missing in the request' });
        }

        const noteRef = db.collection('notes').doc(id);
        await noteRef.update({ title, tagline, body });

        res.status(200).json({ message: 'Note updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a note by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection('notes').doc(id).delete();

        res.status(204).json({ message: 'Note Deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Pin by Id
router.put('/:id/pin', async (req, res) => {
    try {
        const { id } = req.params;
        const { pinned } = req.body;


        const noteRef = db.collection('notes').doc(id);
        await noteRef.update({ pinned });

        res.status(200).json({ message: 'Note pinned/unpinned successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
