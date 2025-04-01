import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DocumentEntry } from '@/lib/data';

interface DocumentState {
  documents: DocumentEntry[];
  selectedYear: number | null;
  searchQuery: string;
  currentPage: number;
  itemsPerPage: number;
}

const initialState: DocumentState = {
  documents: [],
  selectedYear: null,
  searchQuery: '',
  currentPage: 1,
  itemsPerPage: 10,
};

const documentSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    addDocument: (state, action: PayloadAction<DocumentEntry>) => {
      state.documents.push(action.payload);
    },
 

    setSelectedYear: (state, action: PayloadAction<string | null>) => {
      state.selectedYear = Number(action.payload);
      state.currentPage = 1; // Reset to first page when changing year
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1; // Reset to first page when searching
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
});

export const { 
  addDocument, 

  setSelectedYear,
  setSearchQuery,
  setCurrentPage
} = documentSlice.actions;

export default documentSlice.reducer;