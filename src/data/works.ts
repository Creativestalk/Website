import { WorkItem } from '../types';
import { portfolioStorage } from '../utils/portfolioStorage';

// Default/demo work items
const defaultWorkItems: WorkItem[] = [
  {
    id: 'teliyadhe',
    title: 'Teliyadhe',
    views: '500K+ Views',
    thumbnail: 'https://img.youtube.com/vi/2n4XaTwcs9k/hqdefault.jpg',
    youtubeUrl: 'https://youtu.be/2n4XaTwcs9k?si=OcQMHgAv7ZW4d8TE',
    category: 'videos'
  },
  {
    id: 'Modatisarike',
    title: 'Modatisarike',
    views: '600K+ Views',
    thumbnail: 'https://img.youtube.com/vi/J3UXoWfk9I4/hqdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=J3UXoWfk9I4',
    category: 'reels'
  },
  {
    id: 'Samayam',
    title: 'Samayam',
    views: '70k+ Views',
    thumbnail: 'https://img.youtube.com/vi/rwFbnbtCv5w/hqdefault.jpg ',
    youtubeUrl: 'http://youtube.com/watch?v=rwFbnbtCv5w',
    category: 'animation'
  },
  {
    id: 'tones',
    title: 'Tones AD Video',
    views: '35k+ Views',
    thumbnail: 'https://img.youtube.com/vi/cIQKaxepnMQ/hqdefault.jpg ',
    youtubeUrl: 'http://youtube.com/watch?v=cIQKaxepnMQ',
    category: 'videos'
  },
  {
    id: 'music-video',
    title: 'Teliyadhe Female Cover',
    views: '16k Views',
    thumbnail: 'https://img.youtube.com/vi/ZxeXpIIy7HY/hqdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=ZxeXpIIy7HY',
    category: 'reels'
  },
  {
    id: 'Loca Loka',
    title: 'Loca Loka-Podcast',
    thumbnail: 'https://img.youtube.com/vi/MwknMapP5CA/maxresdefault.jpg',
    youtubeUrl: 'https://youtu.be/MwknMapP5CA?si=CetUtpBpdjg9NSl9',
    category: 'podcasts'
  },
  {
    id: 'promos',
    title: 'Promo',
    thumbnail: 'https://img.youtube.com/vi/grza_OojSSU/maxresdefault.jpg',
    youtubeUrl: 'https://youtu.be/grza_OojSSU?si=w5FqJrLzPFArydXU',
    category: 'promos'
  },
  {
    id: 'shorts1',
    title: 'Short Video 1',
    thumbnail: 'https://img.youtube.com/vi/aWLi0Hs7_VE/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/shorts/aWLi0Hs7_VE',
    category: 'reels'
  },
  {
    id: 'promos2',
    title: 'Modhatisarike Motion Poster',
    thumbnail: 'https://img.youtube.com/vi/lQlORKb3t2Q/maxresdefault.jpg',
    youtubeUrl: 'https://youtu.be/lQlORKb3t2Q?si=D5tk_Mg7eZoyJx3F',
    category: 'promos'
  }
];

// Get all work items (default + uploaded)
export const getWorkItems = (): WorkItem[] => {
  const uploadedItems = portfolioStorage.getAll();
  
  // Convert uploaded items to WorkItem format
  const convertedItems: WorkItem[] = uploadedItems.map(item => ({
    id: item.id,
    title: item.title,
    views: item.views,
    thumbnail: item.thumbnail,
    youtubeUrl: item.youtubeUrl || '#',
    category: item.category as WorkItem['category']
  }));

  // Combine uploaded items with default items
  return [...convertedItems, ...defaultWorkItems];
};

// For backward compatibility
export const workItems = getWorkItems();