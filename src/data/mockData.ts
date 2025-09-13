import { Job } from '../features/jobs/jobsSlice';
import { Resume } from '../features/resumes/resumesSlice';

export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    description: 'We are looking for a skilled Frontend Developer to join our dynamic team. You will be responsible for developing user-facing web applications using React, TypeScript, and modern web technologies.\n\nResponsibilities:\n• Develop responsive web applications\n• Collaborate with design and backend teams\n• Optimize applications for maximum speed\n• Write clean, maintainable code\n• Participate in code reviews',
    experience: 5,
    location: 'San Francisco, CA',
    skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML', 'Redux'],
    datePosted: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Full Stack Engineer',
    description: 'Join our innovative startup as a Full Stack Engineer. Work on cutting-edge projects using modern technologies and help build scalable applications that impact millions of users.\n\nWhat you\'ll do:\n• Build end-to-end features\n• Design and implement APIs\n• Work with cloud infrastructure\n• Mentor junior developers\n• Drive technical decisions',
    experience: 4,
    location: 'New York, NY',
    skills: ['Node.js', 'React', 'Python', 'PostgreSQL', 'AWS', 'Docker'],
    datePosted: '2024-01-12T14:30:00Z',
  },
  {
    id: '3',
    title: 'DevOps Engineer',
    description: 'We\'re seeking a DevOps Engineer to help us scale our infrastructure and improve our deployment processes. You\'ll work with containerization, CI/CD pipelines, and cloud platforms.\n\nKey requirements:\n• Experience with Kubernetes\n• Cloud platform expertise\n• Infrastructure as Code\n• Monitoring and logging\n• Security best practices',
    experience: 3,
    location: 'Austin, TX',
    skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'Jenkins', 'Python'],
    datePosted: '2024-01-10T09:15:00Z',
  },
  {
    id: '4',
    title: 'UX/UI Designer',
    description: 'Looking for a creative UX/UI Designer to join our product team. You\'ll be responsible for designing user experiences that are both beautiful and functional across web and mobile platforms.\n\nWhat we offer:\n• Creative freedom\n• Modern design tools\n• Collaborative environment\n• Impact on product direction\n• Growth opportunities',
    experience: 2,
    location: 'Los Angeles, CA',
    skills: ['Figma', 'Sketch', 'Adobe XD', 'Prototyping', 'User Research', 'Design Systems'],
    datePosted: '2024-01-08T11:45:00Z',
  },
  {
    id: '5',
    title: 'Product Manager',
    description: 'We\'re looking for an experienced Product Manager to lead our mobile app development. You\'ll work closely with engineering, design, and business teams to deliver exceptional user experiences.\n\nResponsibilities:\n• Define product roadmap\n• Gather user feedback\n• Coordinate with stakeholders\n• Analyze product metrics\n• Drive product vision',
    experience: 4,
    location: 'Seattle, WA',
    skills: ['Product Strategy', 'Analytics', 'Agile', 'User Research', 'Data Analysis', 'Leadership'],
    datePosted: '2024-01-05T16:20:00Z',
  },
];

export const mockResumes: Resume[] = [
  {
    id: '1',
    fileName: 'john_doe_frontend_resume.pdf',
    fileSize: 245760,
    uploadDate: '2024-01-16T10:30:00Z',
    matchScore: 92,
    status: 'matched',
  },
  {
    id: '2',
    fileName: 'sarah_smith_react_developer.pdf',
    fileSize: 189440,
    uploadDate: '2024-01-16T11:15:00Z',
    matchScore: 88,
    status: 'matched',
  },
  {
    id: '3',
    fileName: 'mike_johnson_fullstack.docx',
    fileSize: 156672,
    uploadDate: '2024-01-16T12:00:00Z',
    matchScore: 85,
    status: 'matched',
  },
  {
    id: '4',
    fileName: 'emily_chen_ui_designer.pdf',
    fileSize: 301024,
    uploadDate: '2024-01-16T14:20:00Z',
    matchScore: 78,
    status: 'matched',
  },
  {
    id: '5',
    fileName: 'alex_rodriguez_developer.pdf',
    fileSize: 198656,
    uploadDate: '2024-01-16T15:45:00Z',
    matchScore: 72,
    status: 'matched',
  },
];