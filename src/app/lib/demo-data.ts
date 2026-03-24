import { Question } from "@/types/quiz";

export const DEMO_QUESTIONS: Question[] = [
  {
    id: "sc1",
    question_text: "What is the primary role of Next.js in this architecture?",
    question_type: "single_choice",
    options: JSON.stringify(["Database Engine", "Frontend Framework", "Operating System", "Browser Extension"]),
    correct_answer: JSON.stringify(["Frontend Framework"]),
    required: true
  },
  {
    id: "tf1",
    question_text: "QuestFlow uses Google Sheets as its primary real-time database.",
    question_type: "true_false",
    correct_answer: JSON.stringify(["True"]),
    required: true
  },
  {
    id: "st1",
    question_text: "What script language powers the backend automation in Google Sheets?",
    question_type: "short_text",
    correct_answer: JSON.stringify(["JavaScript"]),
    required: true
  },
  {
    id: "dd1",
    question_text: "Select the UI component library used for the DNTRNG interface:",
    question_type: "dropdown",
    options: JSON.stringify(["Bootstrap", "Material UI", "ShadCN", "Chakra UI"]),
    correct_answer: JSON.stringify(["ShadCN"]),
    required: false
  },
  {
    id: "rt1",
    question_text: "Rate the responsiveness of the spatial hotspot mapper:",
    question_type: "rating",
    required: false
  },
  {
    id: "m1",
    question_text: "Match the following technologies to their specific functions:",
    question_type: "matching",
    order_group: JSON.stringify(["Tailwind|Styling", "Lucide|Icons", "Framer|Animation", "Zod|Validation"]),
    correct_answer: JSON.stringify(["Tailwind|Styling", "Lucide|Icons", "Framer|Animation", "Zod|Validation"]),
    required: true
  },
  {
    id: "q1",
    question_text: "Which features are part of the 'Race' protocol mode?",
    question_type: "multiple_choice",
    options: JSON.stringify(["Fixed Timer", "Permadeath Reset", "Instant Hints", "Speed Bonus", "Unlimited Retries"]),
    correct_answer: JSON.stringify(["Fixed Timer", "Permadeath Reset", "Speed Bonus"]),
    required: true
  },
  {
    id: "o1",
    question_text: "Organize the deployment steps in the correct chronological order:",
    question_type: "ordering",
    order_group: JSON.stringify(["Setup Sheets", "Inject GAS", "Configure API URL", "Deploy Frontend"]),
    correct_answer: JSON.stringify(["Setup Sheets", "Inject GAS", "Configure API URL", "Deploy Frontend"]),
    required: true
  },
  {
    id: "mtf1",
    question_text: "Verify the following claims about the DNTRNG Protocol:",
    question_type: "multiple_true_false",
    order_group: JSON.stringify(["Supports Offline Sync", "Uses Firebase Auth", "Requires Daily Keys", "Is Mobile First"]),
    correct_answer: JSON.stringify(["False", "True", "True", "True"]),
    required: true
  },
  {
    id: "mx1",
    question_text: "Classify these interaction modules by their primary input method:",
    question_type: "matrix_choice",
    options: JSON.stringify(["Keyboard", "Mouse/Touch", "Drag & Drop"]),
    order_group: JSON.stringify(["Short Text", "Hotspot", "Ordering"]),
    correct_answer: JSON.stringify(["Keyboard", "Mouse/Touch", "Drag & Drop"]),
    required: true
  },
  {
    id: "h1",
    question_text: "Identify the 'Primary Action' button in the interface preview below.",
    question_type: "hotspot",
    image_url: "https://picsum.photos/seed/ui/800/450",
    metadata: JSON.stringify([{ id: 'btn', label: 'Action Button', x: 50, y: 50, radius: 15, isCorrect: true }]),
    required: false
  }
];

export const AVAILABLE_TESTS = [
  {
    id: "demo-full",
    title: "Master Protocol Showcase",
    description: "The complete DNTRNG experience. Every question type, validated and synchronized in real-time.",
    category: "Full Tour",
    difficulty: "Beginner",
    questions: 11,
    duration: "15 mins",
    image: "https://picsum.photos/seed/full/800/450"
  },
  {
    id: "logic-master",
    title: "Logic & Sequence Audit",
    description: "A focused assessment on Matching, Ordering, and Matrix modules.",
    category: "Specialized",
    difficulty: "Intermediate",
    questions: 5,
    duration: "10 mins",
    image: "https://picsum.photos/seed/logic/800/450"
  },
  {
    id: "data-viz",
    title: "Visual Intelligence Node",
    description: "Test your spatial recognition with advanced Hotspot mapping and image analysis.",
    category: "Visual",
    difficulty: "Advanced",
    questions: 8,
    duration: "12 mins",
    image: "https://picsum.photos/seed/viz/800/450"
  }
];
