import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Heading,
  Text,
  Input,
  Textarea,
  Button,
  IconButton,
  Grid,
  HStack,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { AiFillPushpin, AiFillDelete } from 'react-icons/ai';
import { BiEdit } from 'react-icons/bi';

const API_BASE_URL = 'https://notes-backend-9jt3.onrender.com';

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: '', tagline: '', body: '' });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6); // Number of notes per page
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();


  useEffect(() => {
    fetchNotes();
  }, [page, pageSize]);

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/notes`, {
        params: { page, pageSize },
      });
      setNotes(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };


  const createNote = async () => {
    try {
      await axios.post(`${API_BASE_URL}/notes`, newNote);
      setNewNote({ title: '', tagline: '', body: '' });
      setShowCreateModal(false);
      fetchNotes();
      setPage(1);
      toast({
        title: 'Note Created',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error While Creating Note',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error(error);
    }
  };

  const saveEditedNote = async () => {
    try {
      await axios.put(`${API_BASE_URL}/notes/${editingNote.id}`, editingNote);
      setIsEditing(false);
      fetchNotes();
      toast({
        title: 'Note Updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error While Updating Note',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error(error);
    }
  };

  const updateNote = (id, updatedNote) => {

    setEditingNote({ ...notes.find((note) => note.id === id), ...updatedNote });
    setIsEditing(true);
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/notes/${id}`);
      fetchNotes();
      toast({
        title: 'Note Deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error while Delete Note',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      console.error(error);
    }
  };

  const togglePin = async (id, pinned) => {
    try {
      await axios.put(`${API_BASE_URL}/notes/${id}/pin`, { pinned });
      fetchNotes();

    } catch (error) {
      toast({
        title: 'Error while Pinning Note',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error(error);
    }
  };

  const pinnedNotes = notes.filter((note) => note.pinned);
  const remainingNotes = notes.filter((note) => !note.pinned);

  // Calculate the number of pages needed for remaining notes
  const totalPages = Math.ceil(remainingNotes.length / pageSize);

  const startIdx = (page - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const currentNotes = remainingNotes.slice(startIdx, endIdx);

  return (
    <div style={{ padding: '20px' }}>
      <Heading as="h1" mb={4} fontSize={{ base: 'xl', md: '2xl' }}>
        Notes Keeper
      </Heading>
      <Button colorScheme="teal" onClick={() => setShowCreateModal(true)}>
        Create New Note
      </Button>
      <Modal isOpen={showCreateModal || isEditing} onClose={() => {
        setShowCreateModal(false);
        setIsEditing(false);
        setEditingNote(null);
      }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditing ? 'Edit Note' : 'Create New Note'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              type="text"
              placeholder="Title"
              value={isEditing ? editingNote.title : newNote.title}
              onChange={(e) => {
                if (isEditing) {
                  setEditingNote({ ...editingNote, title: e.target.value });
                } else {
                  setNewNote({ ...newNote, title: e.target.value });
                }
              }}
            />
            <Input
              type="text"
              placeholder="Tagline"
              value={isEditing ? editingNote.tagline : newNote.tagline}
              onChange={(e) => {
                if (isEditing) {
                  setEditingNote({ ...editingNote, tagline: e.target.value });
                } else {
                  setNewNote({ ...newNote, tagline: e.target.value });
                }
              }}
            />
            <Textarea
              placeholder="Body"
              value={isEditing ? editingNote.body : newNote.body}
              onChange={(e) => {
                if (isEditing) {
                  setEditingNote({ ...editingNote, body: e.target.value });
                } else {
                  setNewNote({ ...newNote, body: e.target.value });
                }
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={isEditing ? saveEditedNote : createNote}>
              {isEditing ? 'Save' : 'Create'}
            </Button>
            <Button onClick={() => {
              setShowCreateModal(false);
              setIsEditing(false);
              setEditingNote(null);
            }}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Divider my={4} />
      {pinnedNotes.length > 0 && (
        <>
          <Heading as="h2" fontSize={{ base: 'lg', md: 'xl' }}>
            Pinned Notes
          </Heading>
          <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }} gap={4}>
            {pinnedNotes.map((note) => (
              <Box
                key={note.id}
                p={4}
                borderWidth="1px"
                borderRadius="md"
                boxShadow="md"
                fontFamily="Poppins"
                position="relative"
                marginBottom="10px"
              >
                <IconButton
                  icon={<BiEdit />}
                  aria-label="Edit"
                  onClick={() => updateNote(note.id, { title: 'Updated Title' })}
                  position="absolute"
                  top={2}
                  right={2}
                />
                <IconButton
                  icon={<AiFillDelete />}
                  aria-label="Delete"
                  onClick={() => deleteNote(note.id)}
                  position="absolute"
                  top={2}
                  right={36}
                />
                <IconButton
                  icon={<AiFillPushpin />}
                  aria-label={note.pinned ? 'Unpin' : 'Pin'}
                  onClick={() => togglePin(note.id, !note.pinned)}
                  position="absolute"
                  top={2}
                  right={70}
                />
                <Heading as="h3" fontSize="lg">
                  {note.title}
                </Heading>
                <Text>{note.tagline}</Text>
                <Text>{note.body}</Text>
              </Box>
            ))}
          </Grid>
        </>
      )}
      <Divider my={4} />
      <Heading as="h2" fontSize={{ base: 'lg', md: 'xl' }} mb={2}>
        Notes
      </Heading>
      <div>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Spinner
              thickness='4px'
              speed='0.65s'
              emptyColor='gray.200'
              color='blue.500'
              size='xl'
            />
          </div>

        ) : currentNotes.length > 0 ? (
          <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }} gap={4}>
            {currentNotes.map((note) => (
              <Box
                key={note.id}
                p={4}
                borderWidth="1px"
                borderRadius="md"
                boxShadow="md"
                fontFamily="Poppins"
                position="relative"
                width="100%"
                marginBottom="10px"
              >
                <IconButton
                  icon={<BiEdit />}
                  aria-label="Edit"
                  onClick={() => updateNote(note.id)}
                  position="absolute"
                  top={2}
                  right={2}
                />
                <IconButton
                  icon={<AiFillDelete />}
                  aria-label="Delete"
                  onClick={() => deleteNote(note.id)}
                  position="absolute"
                  top={2}
                  right={36}
                />
                <IconButton
                  icon={<AiFillPushpin />}
                  aria-label={note.pinned ? 'Unpin' : 'Pin'}
                  onClick={() => togglePin(note.id, !note.pinned)}
                  position="absolute"
                  top={2}
                  right={70}
                />
                <Heading as="h3" fontSize="lg">
                  {note.title}
                </Heading>
                <Text>{note.tagline}</Text>
                <Text>{note.body}</Text>
              </Box>
            ))}
          </Grid>
        ) : (
          <Text as="h4" fontSize="md" mt={5}>
            No data available
          </Text>
        )}
      </div>


      {currentNotes.length === 0 ? (
        null
      ) : (
        <HStack mt={4} spacing={2} justify="center">
          <Button
            onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            onClick={() => setPage((prevPage) => Math.min(prevPage + 1, totalPages))}
            disabled={page === totalPages || totalPages === 0}
          >
            Next
          </Button>
        </HStack>
      )}
    </div>
  );
}

export default App;
