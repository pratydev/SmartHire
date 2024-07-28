import { useState } from 'react';
import moment from 'moment';

interface Note {
  title: string;
  text: string;
  timestamp: Date;
}

const Notes = () => {
  const [notes, setNotes] = useState<Note []>([]);
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [noteText, setNoteText] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState<number | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const notesPerPage: number = 7;
  
  const addNote = () => {
    if (noteTitle.trim() !== '' && noteText.trim() !== '') {
      setNotes([...notes, { title: noteTitle, text: noteText, timestamp: new Date() }]);
      setNoteTitle('');
      setNoteText('');
    }
  };

  const updateNote = () => {
    if (noteTitle.trim() !== '' && noteText.trim() !== '') {
      const updatedNotes = notes.map((note, index) =>
        index === currentNoteIndex ? { ...note, title: noteTitle, text: noteText } : note
      );
      setNotes(updatedNotes);
      setNoteTitle('');
      setNoteText('');
      setIsEditing(false);
      setCurrentNoteIndex(null);
    }
  };

  const deleteNote = (index: number) => {
    const newNotes = notes.filter((_, i) => i !== index);
    setNotes(newNotes);
  };

  const editNote = (index: number) => {
    setNoteTitle(notes[index].title);
    setNoteText(notes[index].text);
    setIsEditing(true);
    setCurrentNoteIndex(index);
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchText.toLowerCase()) ||
    note.text.toLowerCase().includes(searchText.toLowerCase())
  );

  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = filteredNotes.slice(indexOfFirstNote, indexOfLastNote);
  const totalPages = Math.ceil(filteredNotes.length / notesPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-4">Notes</h1>
        <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-4">
          <input
            type="text"
            className="w-full mb-2 p-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Note Title"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
          />
          <textarea
            className="w-full h-24 p-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your note here..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          ></textarea>
          <button
            className="mt-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={isEditing ? updateNote : addNote}
          >
            {isEditing ? 'Update Note' : 'Add Note'}
          </button>
        </div>
        <input
          type="text"
          className="w-full p-2 mb-4 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search notes..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <div className="space-y-4">
          {currentNotes.map((note, index) => (
            <div
              key={index}
              className="bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center"
            >
              <div className="flex flex-col">
                <h2 className="text-lg font-bold text-gray-200">{note.title}</h2>
                <p className="text-gray-400">{note.text.substring(0, 50)}...</p>
                <span className="text-gray-500 text-sm">{moment(note.timestamp).format('MMMM Do YYYY, h:mm:ss a')}</span>
              </div>
              <div>
                <button
                  className="ml-2 px-3 py-1 bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  onClick={() => editNote(index + indexOfFirstNote)}
                >
                  Update
                </button>
                <button
                  className="ml-2 px-3 py-1 bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  onClick={() => deleteNote(index + indexOfFirstNote)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => paginate(page)}
              className={`px-3 py-1 mx-1 rounded-lg ${page === currentPage ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notes;
