import { Service } from '../types';

export const services: Service[] = [
  {
    id: 'video-editing',
    title: 'Video Editing',
    icon: 'video',
    subservices: [
      'Film Editing',
      'Corporate Videos',
      'Vlogs Editing',
      'Reels',
      'Wedding',
      'Podcasts & Interviews',
      'Promotional Content'
    ]
  },
  {
    id: 'graphic-designing',
    title: 'Graphic Designing',
    icon: 'palette',
    subservices: [
      'Film Poster',
      'Thumbnails',
      'Branding Creatives',
      'Logo Designs',
      'Pitch Decks'
    ]
  },
  {
    id: 'motion-graphics',
    title: 'Motion Graphics',
    icon: 'box',
    subservices: [
      'Logo Animation',
      'Infographics',
      'Title Animation',
      'Lyrical Videos'
    ]
  },
  {
    id: 'color-grading',
    title: 'Color Grading',
    icon: 'sliders',
    subservices: [
      'Films',
      'Wedding',
      'Corporate',
      'Promotional Content',
      'Vlogs'
    ]
  },
  {
    id: 'vfx-animation',
    title: 'VFX & Animation',
    icon: 'sparkles',
    subservices: [
      '2D Animation',
      '3D Animation',
      'Rotoscoping',
      'Chroma Key',
      'Compositing'
    ]
  },
  {
    id: 'videography-photography',
    title: 'Videography & Photography',
    icon: 'camera',
    subservices: [
      'Films',
      'Weddings',
      'Corporate',
      'Promotional',
      'Podcasts & Interviews',
      'Talking Head Videos',
      'Drone Shoots'
    ]
  }
];