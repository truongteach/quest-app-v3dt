
import { Question } from "@/types/quiz";

export const DEMO_QUESTIONS: Question[] = [
  {
    id: "tf1",
    question_text: "QuestFlow is built with Next.js and Google Sheets.",
    question_type: "true_false",
    correct_answer: "True",
    required: true
  },
  {
    id: "st1",
    question_text: "What is the primary language used to write Google Apps Script?",
    question_type: "short_text",
    correct_answer: "JavaScript",
    required: true
  },
  {
    id: "dd1",
    question_text: "Select the most popular JavaScript framework used in QuestFlow:",
    question_type: "dropdown",
    options: "React, Vue, Angular, Svelte",
    correct_answer: "React",
    required: false
  },
  {
    id: "rt1",
    question_text: "How would you rate the speed of this assessment platform?",
    question_type: "rating",
    required: false
  },
  {
    id: "m1",
    question_text: "Match the technologies to their roles:",
    question_type: "matching",
    order_group: "Next.js|Frontend Framework,Tailwind|CSS Styling,Sheets|Database,Lucide|Icon Set",
    correct_answer: "Next.js|Frontend Framework,Tailwind|CSS Styling,Sheets|Database,Lucide|Icon Set",
    required: true
  },
  {
    id: "q1",
    question_text: "Which of these are valid question types in QuestFlow?",
    question_type: "multiple_choice",
    options: "Hotspot, Matching, Ordering, AI Voice, Binary Search",
    correct_answer: "Hotspot, Matching, Ordering",
    required: true
  },
  {
    id: "o1",
    question_text: "Rank these steps to set up a new test in the correct order:",
    question_type: "ordering",
    order_group: "Add Questions, Define Test Metadata, Share with Users, Review Results",
    correct_answer: "Define Test Metadata, Add Questions, Share with Users, Review Results",
    required: true
  },
  {
    id: "h1",
    question_text: "Identify the 'Settings' icon in the mobile interface.",
    question_type: "hotspot",
    image_url: "https://picsum.photos/seed/ui/800/450",
    metadata: JSON.stringify([{ id: 'settings', label: 'Settings Icon', x: 85, y: 15, radius: 10 }]),
    required: false
  }
];

export const AVAILABLE_TESTS = [
  {
    id: "demo-full",
    title: "The Ultimate Feature Tour",
    description: "Experience every single question type supported by QuestFlow in one comprehensive test.",
    category: "Product Tour",
    difficulty: "Beginner",
    questions: 8,
    duration: "10 mins",
    image: "https://picsum.photos/seed/mountain1/800/450"
  },
  {
    id: "logic-master",
    title: "Logic & Associations",
    description: "Challenge your mind with advanced Matching and Ordering question types.",
    category: "Specialized",
    difficulty: "Intermediate",
    questions: 5,
    duration: "8 mins",
    image: "https://picsum.photos/seed/brain/800/450"
  },
  {
    id: "data-viz",
    title: "Data Insights Challenge",
    description: "Test your knowledge on interpreting complex charts, graphs, and data sets.",
    category: "Analytics",
    difficulty: "Intermediate",
    questions: 10,
    duration: "10 mins",
    image: "https://picsum.photos/seed/data/800/450"
  }
];
