export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
}

export interface Board {
  id: string;
  title: string;
  description: string;
  members: TeamMember[];
  color: string;
  category: 'recently-viewed' | 'new' | 'process' | 'completed';
}

export interface Card {
  id: string;
  title: string;
  description: string;
  labels: string[];
  members: TeamMember[];
  comments: number;
  likes: number;
  attachments: number;
  image?: string;
}

export interface Column {
  id: string;
  title: string;
  cards: Card[];
}

export const teamMembers: TeamMember[] = [
  { id: '1', name: 'Alice Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice' },
  { id: '2', name: 'Bob Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob' },
  { id: '3', name: 'Carol Williams', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol' },
  { id: '4', name: 'David Brown', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
  { id: '5', name: 'Eve Davis', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eve' },
  { id: '6', name: 'Frank Miller', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Frank' },
  { id: '7', name: 'Grace Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Grace' },
  { id: '8', name: 'Henry Moore', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Henry' },
];

export const boards: Board[] = [
  {
    id: '1',
    title: 'Brackets',
    description: 'Saving money – is something we would all like.',
    members: [teamMembers[0], teamMembers[1]],
    color: 'gray',
    category: 'recently-viewed',
  },
  {
    id: '2',
    title: 'Pictures In The Sky',
    description: 'In the last five to six years the FTA satellite receiver has become an everyday household electronic device.',
    members: [teamMembers[2], teamMembers[3], teamMembers[4]],
    color: 'blue',
    category: 'recently-viewed',
  },
  {
    id: '3',
    title: 'How To Look Up',
    description: 'Color is so powerful that it can persuade, motivate.',
    members: [teamMembers[5]],
    color: 'pink',
    category: 'recently-viewed',
  },
  {
    id: '4',
    title: 'The Universe Through A Child\'s Eyes',
    description: 'When I was just starting 6th grade I got my first job. Paperboy. Boy, was I excited.',
    members: [teamMembers[0], teamMembers[6], teamMembers[7]],
    color: 'peach',
    category: 'recently-viewed',
  },
  {
    id: '5',
    title: 'Astronomy Or Astrology',
    description: 'Conversations can be a tricky business.',
    members: [teamMembers[1], teamMembers[2]],
    color: 'purple',
    category: 'recently-viewed',
  },
  {
    id: '6',
    title: 'Telescopes 101',
    description: 'The beauty of astronomy is that anybody can do it. From the tiniest baby to the most.',
    members: [teamMembers[3], teamMembers[4], teamMembers[5]],
    color: 'blue',
    category: 'new',
  },
  {
    id: '7',
    title: 'Asteroids',
    description: 'It is a good idea to think of your PC as an office.',
    members: [teamMembers[6], teamMembers[7]],
    color: 'green',
    category: 'new',
  },
  {
    id: '8',
    title: 'The Amazing Hubble',
    description: 'If you are a serious astronomy fanatic like.',
    members: [teamMembers[0], teamMembers[1]],
    color: 'cyan',
    category: 'new',
  },
  {
    id: '9',
    title: 'What If They Let You Run The Hubble',
    description: 'If you are in the market for kitchenware.',
    members: [teamMembers[2], teamMembers[3], teamMembers[4]],
    color: 'purple',
    category: 'process',
  },
  {
    id: '10',
    title: 'Six Pack Abs The Big Picture',
    description: 'Gas prices are soaring!',
    members: [teamMembers[5], teamMembers[6]],
    color: 'yellow',
    category: 'process',
  },
  {
    id: '11',
    title: 'Shooting Stars',
    description: 'Kook-2 Dmers are red links for your site. Kook-2.com. Add url free today.',
    members: [teamMembers[7], teamMembers[0], teamMembers[1]],
    color: 'cyan',
    category: 'process',
  },
  {
    id: '12',
    title: 'Are You Struggling In Life',
    description: 'Now, if you are interested in being the best player.',
    members: [teamMembers[2], teamMembers[3], teamMembers[4]],
    color: 'peach',
    category: 'process',
  },
  {
    id: '13',
    title: 'The Amazing Hubble',
    description: 'If you are in the market for kitchenware.',
    members: [teamMembers[5], teamMembers[6], teamMembers[7]],
    color: 'gray',
    category: 'completed',
  },
  {
    id: '14',
    title: 'Astronomy Or Astrology',
    description: 'If you are in the market for a computer.',
    members: [teamMembers[0], teamMembers[1]],
    color: 'purple',
    category: 'completed',
  },
  {
    id: '15',
    title: 'Radio Astronomy',
    description: 'If you are in the market for a computer, there are a number of factors to consider.',
    members: [teamMembers[2], teamMembers[3], teamMembers[4]],
    color: 'cyan',
    category: 'completed',
  },
  {
    id: '16',
    title: 'How To Look Up',
    description: 'Here, I focus on a range of items and features that we use in life without giving them a second thought such as Coca Cola.',
    members: [teamMembers[5], teamMembers[6], teamMembers[7]],
    color: 'pink',
    category: 'completed',
  },
  {
    id: '17',
    title: 'Pictures In The Sky',
    description: 'The purpose of your brochure may differ.',
    members: [teamMembers[0], teamMembers[1], teamMembers[2]],
    color: 'green',
    category: 'completed',
  },
];

export const boardColumns: Record<string, Column[]> = {
  '1': [
    {
      id: 'design',
      title: 'Design',
      cards: [
        {
          id: 'card-1',
          title: 'Old fashioned recipe for preventing allergies and chemical sensitivities',
          description: '',
          labels: ['yellow'],
          members: [teamMembers[0]],
          comments: 34,
          likes: 0,
          attachments: 34,
        },
        {
          id: 'card-2',
          title: 'Home business advertising ideas',
          description: 'Successful businesses know the importance of building and maintaining good working.',
          labels: ['purple', 'red', 'pink', 'cyan'],
          members: [teamMembers[1], teamMembers[2]],
          comments: 23,
          likes: 0,
          attachments: 43,
        },
        {
          id: 'card-3',
          title: 'Cosmotic surgery abroad making the right choice',
          description: '',
          labels: ['blue', 'cyan'],
          members: [teamMembers[3], teamMembers[4], teamMembers[5]],
          comments: 64,
          likes: 0,
          attachments: 34,
          image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=250&fit=crop',
        },
      ],
    },
    {
      id: 'prototip',
      title: 'Prototip',
      cards: [
        {
          id: 'card-4',
          title: 'Home business advertising ideas',
          description: 'Successful businesses know the importance of building and maintaining good working.',
          labels: ['purple', 'red', 'pink', 'cyan'],
          members: [teamMembers[0]],
          comments: 16,
          likes: 44,
          attachments: 12,
        },
        {
          id: 'card-5',
          title: 'Unmatched toner cartridge quality 20 less than oem price',
          description: 'Why read motivational sayings? For motivation! You might need a bit. If you can use last year\'s list of goals this year because it\'s as good as new.',
          labels: ['blue', 'yellow'],
          members: [teamMembers[1], teamMembers[2], teamMembers[3]],
          comments: 48,
          likes: 92,
          attachments: 66,
          image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=250&fit=crop',
        },
        {
          id: 'card-6',
          title: 'How to look up',
          description: 'Are you considering buying a compatible inkjet cartridge for your printer?',
          labels: ['green'],
          members: [teamMembers[4], teamMembers[5], teamMembers[6]],
          comments: 84,
          likes: 71,
          attachments: 1,
          image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=250&fit=crop',
        },
      ],
    },
    {
      id: 'trello',
      title: 'Trello',
      cards: [
        {
          id: 'card-7',
          title: 'Types of paper in catalog printing',
          description: 'Branding is no longer simply about visual appeal (or the cherry in the apple pie example as given in my earlier article).',
          labels: ['purple', 'red', 'blue'],
          members: [teamMembers[0], teamMembers[1]],
          comments: 34,
          likes: 23,
          attachments: 96,
          image: 'https://images.unsplash.com/photo-1576595580361-90a855b84b20?w=400&h=250&fit=crop',
        },
        {
          id: 'card-8',
          title: 'There is no competition',
          description: 'This article is floated online with an aim to help you find the best dvd printing solution.',
          labels: ['purple', 'green'],
          members: [teamMembers[2], teamMembers[3]],
          comments: 73,
          likes: 0,
          attachments: 44,
        },
      ],
    },
    {
      id: 'test',
      title: 'Test',
      cards: [
        {
          id: 'card-9',
          title: 'Linux or windows which is it',
          description: 'Saving money – is something we would all like.',
          labels: ['cyan', 'red'],
          members: [teamMembers[4], teamMembers[5], teamMembers[6], teamMembers[7]],
          comments: 34,
          likes: 87,
          attachments: 31,
        },
        {
          id: 'card-10',
          title: 'Be single minded',
          description: 'Create a list with all possible keywords that fit to your product, service or business field.',
          labels: ['purple', 'blue'],
          members: [teamMembers[0], teamMembers[1]],
          comments: 21,
          likes: 34,
          attachments: 17,
          image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=250&fit=crop',
        },
        {
          id: 'card-11',
          title: 'Linux or windows which is it',
          description: 'Saving money – is something we would all like.',
          labels: [],
          members: [teamMembers[2], teamMembers[3]],
          comments: 95,
          likes: 23,
          attachments: 0,
        },
        {
          id: 'card-12',
          title: 'Dna the future of nutrition',
          description: 'Why does anyone want a vasectomy reversal? This is a question I hear any time I tell someone what I do for a living.',
          labels: ['purple', 'green'],
          members: [teamMembers[4], teamMembers[5]],
          comments: 12,
          likes: 33,
          attachments: 155,
        },
      ],
    },
    {
      id: 'final',
      title: 'Final',
      cards: [
        {
          id: 'card-13',
          title: 'At home treatments for beauty on a budget',
          description: 'He really shouldn\'t. Bring along with them thoughts of carving the Thanksgiving bird.',
          labels: [],
          members: [teamMembers[6]],
          comments: 27,
          likes: 54,
          attachments: 31,
        },
        {
          id: 'card-14',
          title: 'Home business advertising ideas',
          description: 'Successful businesses know the importance of building and maintaining good working.',
          labels: ['purple', 'cyan'],
          members: [teamMembers[0], teamMembers[1]],
          comments: 13,
          likes: 0,
          attachments: 0,
        },
        {
          id: 'card-15',
          title: 'Tips for choosing the perfect gloss for your lips',
          description: 'With MySpace becoming more popular every day, there is the constant need to be different.',
          labels: ['blue', 'yellow'],
          members: [teamMembers[2], teamMembers[3], teamMembers[4]],
          comments: 21,
          likes: 0,
          attachments: 0,
          image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400&h=250&fit=crop',
        },
      ],
    },
  ],
};
