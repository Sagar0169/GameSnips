import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type Snippet = {
  id: string;
  title: string;
  description: string;
  creator?: string;
  likes: number;
  isLiked: boolean;
};

type SnippetContextType = {
  snippets: Snippet[];
  addSnippet: (snippet: Omit<Snippet, 'id' | 'likes' | 'isLiked'>) => void;
  toggleLike: (id: string) => void;
  clearSnippets: () => void;
    deleteSnippetById: (id: string) => void;
  loading:boolean;
};

const SnippetContext = createContext<SnippetContextType | null>(null);

export const useSnippets = () => {
  const context = useContext(SnippetContext);
  if (!context) throw new Error('useSnippets must be used within SnippetProvider');
  return context;
};

const STORAGE_KEY = 'GameSnipsSnippets';
const LIKED_SNIPPETS_KEY = 'GameSnipsLikedSnippets';

// const initialSnippets: Snippet[] = [
//   {
//     id: '1',
//     title: 'Space Runner',
//     description: 'Endless runner in space with asteroids.',
//     creator: 'Alice',
//     likes: 3,
//     isLiked: false,
//   },
//   {
//     id: '2',
//     title: 'Puzzle Tower',
//     description: 'Solve puzzles to climb the tower.',
//     creator: 'Bob',
//     likes: 7,
//     isLiked: false,
//   },
// ];

export const SnippetProvider = ({ children }: { children: ReactNode }) => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
const [loading, setLoading] = useState(true);

const clearSnippets = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    await AsyncStorage.removeItem(LIKED_SNIPPETS_KEY);
    setSnippets([]); // Clear in-memory state as well
  } catch (e) {
    console.error('Failed to clear snippets:', e);
  }
};
const deleteSnippetById = (id: string) => {
  setSnippets((prev) => prev.filter((snippet) => snippet.id !== id));
};


  // Load snippets and liked status from AsyncStorage on mount
 useEffect(() => {
  const loadData = async () => {
    try {
      const storedSnippets = await AsyncStorage.getItem(STORAGE_KEY);
      let loadedSnippets = storedSnippets ? JSON.parse(storedSnippets) : [];

      const likedSnippetsJson = await AsyncStorage.getItem(LIKED_SNIPPETS_KEY);
      const likedSnippets = likedSnippetsJson ? JSON.parse(likedSnippetsJson) : [];

      loadedSnippets = loadedSnippets.map((snippet: Snippet) => ({
        ...snippet,
        isLiked: likedSnippets.includes(snippet.id),
      }));

      setSnippets(loadedSnippets);
    } catch (e) {
      console.log('Failed to load data from storage', e);
    } finally {
      setLoading(false); // ✅ set loading to false when done
    }
  };
  loadData();
}, []);

  // Save snippets to AsyncStorage on every change
  useEffect(() => {
    const saveSnippets = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(snippets));
      } catch (e) {
        console.log('Failed to save snippets to storage', e);
      }
    };
    saveSnippets();
  }, [snippets]);

  const addSnippet = (snippet: Omit<Snippet, 'id' | 'likes' | 'isLiked'>) => {
    setSnippets(prev => [
      {
        id: Date.now().toString(),
        likes: 0,
        isLiked: false,
        ...snippet,
      },
      ...prev,
    ]);
  };

  const toggleLike = async (id: string) => {
    try {
      // Get current liked snippets from AsyncStorage
      const likedSnippetsJson = await AsyncStorage.getItem(LIKED_SNIPPETS_KEY);
      let likedSnippets = likedSnippetsJson ? JSON.parse(likedSnippetsJson) : [];
      
      // Check if snippet is currently liked
      const isCurrentlyLiked = likedSnippets.includes(id);
      
      if (isCurrentlyLiked) {
        // Remove from liked snippets
        likedSnippets = likedSnippets.filter((snippetId: string) => snippetId !== id);
      } else {
        // Add to liked snippets
        likedSnippets.push(id);
      }
      
      // Save updated liked snippets to AsyncStorage
      await AsyncStorage.setItem(LIKED_SNIPPETS_KEY, JSON.stringify(likedSnippets));
      
      // Update state - only toggle isLiked, keep original like count
    setSnippets(prev =>
  prev.map(snippet =>
    snippet.id === id
      ? {
          ...snippet,
          isLiked: !isCurrentlyLiked,
          likes: snippet.likes + (isCurrentlyLiked ? -1 : 1),
        }
      : snippet
  )
);

    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <SnippetContext.Provider value={{ snippets, addSnippet, toggleLike, clearSnippets,loading: false, deleteSnippetById }}>
      {children}
    </SnippetContext.Provider>
  );
};