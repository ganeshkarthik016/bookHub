import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notes: [],
    currentNote: null,
    loading: false,
    hasMore: true, // Useful for paginated lists
    page: 1,
};

const noteSlice = createSlice({
    name: "notes",
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        
        // Replaces the entire list (used on initial load or new search)
        setNotes: (state, action) => {
            state.notes = action.payload.notes || action.payload;
            state.hasMore = action.payload.hasMore ?? true;
            state.page = action.payload.page || 1;
        },

        // Appends to the existing list (used for pagination)
        appendNotes: (state, action) => {
            const newNotes = action.payload.notes || action.payload;
            state.notes = [...state.notes, ...newNotes];
            state.hasMore = action.payload.hasMore ?? newNotes.length > 0;
            if (action.payload.page) {
                state.page = action.payload.page;
            }
        },

        setCurrentNote: (state, action) => {
            state.currentNote = action.payload;
        },

        addNoteToTop: (state, action) => {
            state.notes.unshift(action.payload);
        },

        updateNoteInList: (state, action) => {
            const updatedNote = action.payload;
            const index = state.notes.findIndex((note) => note._id === updatedNote._id);
            if (index !== -1) {
                state.notes[index] = updatedNote;
            }
            if (state.currentNote && state.currentNote._id === updatedNote._id) {
                state.currentNote = updatedNote;
            }
        },

        removeNote: (state, action) => {
            const noteId = action.payload;
            state.notes = state.notes.filter((note) => note._id !== noteId);
            if (state.currentNote && state.currentNote._id === noteId) {
                state.currentNote = null;
            }
        },
        
        clearNotes: (state) => {
            state.notes = [];
            state.currentNote = null;
            state.hasMore = true;
            state.page = 1;
        }
    },
});

export const {
    setLoading,
    setNotes,
    appendNotes,
    setCurrentNote,
    addNoteToTop,
    updateNoteInList,
    removeNote,
    clearNotes,
} = noteSlice.actions;

export default noteSlice.reducer;