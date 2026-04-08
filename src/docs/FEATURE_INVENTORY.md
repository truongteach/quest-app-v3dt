# DNTRNG™ Intelligence Platform - Feature Inventory Report

## 1. Quiz Player (Student Terminal)
| Feature Name | Location | Description | Status |
| :--- | :--- | :--- | :--- |
| Test Library | `/tests` | Searchable grid/list of available modules with difficulty filters. | ✅ Working |
| Security Gate | `QuizStart.tsx` | Daily access key verification using deterministic hashing. | ✅ Working |
| Mode Selection | `QuizStart.tsx` | Practice, Test, and Race (accuracy-streak) modes. | ✅ Working |
| Identity Registry | `QuizStart.tsx` | Callsign entry for guest users. | ✅ Working |
| Assessment Timer | `QuizTimer.tsx` | Countdown timer with visual circular progress. | ✅ Working |
| Navigation Sidebar | `QuizSidebar.tsx` | Jump-to-question grid with status indicators. | ✅ Working |
| Text Size Control | `QuizActive.tsx` | On-the-fly scaling (Small, Normal, Large). | ✅ Working |
| Progress Tracking | `QuizActive.tsx` | Real-time visual progress bar during assessment. | ✅ Working |

## 2. Admin Panel (Administrative Workspace)
| Feature Name | Location | Description | Status |
| :--- | :--- | :--- | :--- |
| Overview Dashboard | `/admin` | High-level metrics, charts, and system status. | ✅ Working |
| Access Key Management| `AccessKeyPanel.tsx` | Configure daily keys and protocol salts. | ✅ Working |
| Test Management | `/admin/tests` | Full CRUD operations for assessment modules. | ✅ Working |
| Step Editor | `QuestionDialog.tsx` | Visual builder for questions with Terminal Preview. | ✅ Working |
| JSON Direct Push | `BulkDialog.tsx` | Raw JSON editor for question banks. | ✅ Working |
| Student Registry | `/admin/users` | Management of student accounts and bulk provisioning. | ✅ Working |
| Performance Deep-Dive| `/admin/users/detail` | Comprehensive audit of a single student's history. | ✅ Working |
| System Logs | `/admin/activity` | Access tracking (Login/Logout/IP/Device). | ✅ Working |

## 3. Question Types (Interaction Modules)
| Feature Name | Location | Description | Status |
| :--- | :--- | :--- | :--- |
| Single Choice | `SingleChoiceModule` | Standard one-to-one mapping. | ✅ Working |
| Multiple Choice | `MultipleChoiceModule`| Multi-select interaction. | ✅ Working |
| True/False | `TrueFalseModule` | Basic boolean verification. | ✅ Working |
| Multiple T/F | `MultipleTrueFalse` | Grid of boolean claims. | ✅ Working |
| Short Text | `ShortTextModule` | Manual text entry with exact match logic. | ✅ Working |
| Dropdown | `DropdownModule` | Selection from a collapsed list. | ✅ Working |
| Ordering | `OrderingModule` | Drag-and-drop sequence reordering. | ✅ Working |
| Matching | `MatchingModule` | Drag-and-drop pair allocation. | ✅ Working |
| Matrix Choice | `MatrixChoiceModule` | Row/Column attribute grid. | ✅ Working |
| Hotspot (Spatial) | `HotspotModule.tsx` | Precision identification on images using rectangular zones. | ✅ Working |
| Rating | `RatingModule.tsx` | 5-star evaluation scale. | ⚠️ Partial |

## 4. Results & Analytics
| Feature Name | Location | Description | Status |
| :--- | :--- | :--- | :--- |
| Animated Gauge | `PerformanceGauge.tsx` | Dynamic accuracy percentage visualization. | ✅ Working |
| Global Benchmarking | `BenchmarkingSection.tsx`| Percentile comparison against the entire registry. | ✅ Working |
| Question Review | `StepAnalytics.tsx` | Itemized audit of correct/incorrect responses. | ✅ Working |
| Certificate Engine | `certificate-utils.ts` | PDF generation for passing students. | ✅ Working |
| success Rates | `QuestionAnalyticsDialog`| Analytics per question node across all students. | ✅ Working |

## 5. Infrastructure & Settings
| Feature Name | Location | Description | Status |
| :--- | :--- | :--- | :--- |
| Registry Bridge (GAS) | `gas-template.ts` | Google Sheets REST API Bridge v18.3. | ✅ Working |
| Multilingual Engine | `language-context` | Tri-lingual support (EN, VI, ES). | ✅ Working |
| Branding Engine | `settings-context` | Dynamic control of Name, Logo, Colors, and Banners. | ✅ Working |
| Domain Auth | `auth-context.tsx` | Restriction of access to specific email domains. | ✅ Working |
| Maintenance Mode | `QuizPage.tsx` | Global switch to take assessment nodes offline. | ✅ Working |
| Desktop Node | `main.js` | Electron framework for cross-platform desktop use. | ✅ Working |
| Health Monitoring | `/api/health` | Connectivity and latency diagnostics. | ✅ Working |
| AI Integration | `src/ai/` | Genkit scaffolding for future AI capabilities. | 🚧 In Progress |
| Firebase Integration | `src/firebase/` | Firebase config and client providers. | 🚧 In Progress |

---
*Report generated on: 2025-05-22*