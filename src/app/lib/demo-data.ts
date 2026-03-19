
import { Question } from "@/types/quiz";

export const DEMO_QUESTIONS: Question[] = [
  {
    id: "m1",
    question_text: "Match the programming languages to their primary use cases:",
    question_type: "matching",
    order_group: "TypeScript|Web Development,Python|Data Science,Swift|iOS Apps,SQL|Databases",
    correct_answer: "TypeScript|Web Development,Python|Data Science,Swift|iOS Apps,SQL|Databases",
    required: true
  },
  {
    id: "1",
    question_text: "What is the primary benefit of using QuestFlow?",
    question_type: "single_choice",
    options: "No coding required, High performance, Google Sheets integration, All of the above",
    correct_answer: "All of the above",
    required: true
  },
  {
    id: "2",
    question_text: "Which technologies power the QuestFlow frontend?",
    question_type: "multiple_choice",
    options: "Next.js, React, Tailwind CSS, Shadcn/UI, Vue.js",
    correct_answer: "Next.js, React, Tailwind CSS, Shadcn/UI",
    required: true
  },
  {
    id: "4",
    question_text: "Rank these steps to set up QuestFlow in the correct order:",
    question_type: "ordering",
    order_group: "Connect API URL, Create Google Sheet, Deploy Apps Script, Share Sheet",
    correct_answer: "Create Google Sheet, Share Sheet, Deploy Apps Script, Connect API URL",
    required: true
  },
  {
    id: "5",
    question_text: "Locate the peak of the mountain in this image.",
    question_type: "hotspot",
    image_url: "https://picsum.photos/seed/mountain1/800/450",
    metadata: JSON.stringify([{ id: 'peak', label: 'Mountain Peak', x: 50, y: 35, radius: 10 }]),
    required: false
  }
];

export const AVAILABLE_TESTS = [
  {
    id: "demo-1",
    title: "QuestFlow Essentials",
    description: "Learn the basics of our interactive quiz platform and master the standard question types.",
    category: "Product Tour",
    difficulty: "Beginner",
    questions: 8,
    duration: "5 mins",
    image: "https://picsum.photos/seed/mountain1/800/450"
  },
  {
    id: "demo-logic",
    title: "Logic & Associations",
    description: "Challenge your mind with our new Matching and Ordering question types. Perfect for language and logic testing.",
    category: "Specialized",
    difficulty: "Intermediate",
    questions: 5,
    duration: "8 mins",
    image: "https://picsum.photos/seed/brain/800/450"
  },
  {
    id: "demo-2",
    title: "Advanced Interactions",
    description: "A deep dive into hotspots, ordering, and complex logic patterns for power users.",
    category: "Technical",
    difficulty: "Advanced",
    questions: 12,
    duration: "15 mins",
    image: "https://picsum.photos/seed/ui/800/450"
  },
  {
    id: "demo-3",
    title: "Data Insights Challenge",
    description: "Test your knowledge on interpreting complex charts, graphs, and data sets.",
    category: "Analytics",
    difficulty: "Intermediate",
    questions: 10,
    duration: "10 mins",
    image: "https://picsum.photos/seed/data/800/450"
  },
  {
    id: "demo-4",
    title: "Ecosystems & Environment",
    description: "An educational survey regarding global ecosystems, climate data, and sustainability.",
    category: "Education",
    difficulty: "Beginner",
    questions: 6,
    duration: "4 mins",
    image: "https://picsum.photos/seed/nature/800/450"
  },
  {
    id: "demo-5",
    title: "Web Tech Quiz",
    description: "Evaluate your understanding of modern web technologies, from CSS to Server Components.",
    category: "Development",
    difficulty: "Intermediate",
    questions: 15,
    duration: "12 mins",
    image: "https://picsum.photos/seed/code/800/450"
  }
];
