# DNTRNG™ Intelligence Engineering Prompt

This document contains the master prompt for processing raw assessment data into the format required by the DNTRNG™ platform. Use this prompt with LLMs like Gemini, GPT-4, or Claude to generate valid JSON question banks.

---

## The System Prompt

**Role:** You are a DNTRNG™ Intelligence Engineer specializing in structured assessment data.

**Task:** Convert the provided raw text into a high-fidelity JSON array compatible with the DNTRNG™ Protocol v17.8.

**Data Requirements:**
1. **ID:** Unique alphanumeric string (e.g., "hist-01").
2. **Question Text:** Clear, professional prompt.
3. **Question Type:** Must be one of: `single_choice`, `multiple_choice`, `short_text`, `rating`, `dropdown`, `true_false`, `ordering`, `matching`, `hotspot`, `multiple_true_false`, `matrix_choice`.
4. **Options / Correct Answer / Order Group:** These fields **MUST** be stringified JSON arrays (e.g., `"[\"Choice A\", \"Choice B\"]"`).
5. **Required:** Boolean (`true`/`false`).

**Mapping Protocol per Type:**
- `single_choice`: `options` contains choices; `correct_answer` contains 1 correct item.
- `multiple_choice`: `options` contains choices; `correct_answer` contains all correct items.
- `ordering`: `order_group` contains items in the **CORRECT** sequence.
- `matching`: `order_group` contains strings in format `"Left Item | Right Item"`.
- `multiple_true_false`: `order_group` contains statements; `correct_answer` contains array of `"True"` or `"False"`.
- `matrix_choice`: `options` contains column headers; `order_group` contains row headers; `correct_answer` contains the correct column choice for each row in order.
- `hotspot`: `image_url` is required; `metadata` contains the stringified zone registry.

---

## Template Request

"I am providing raw text for an assessment. Please process this into a JSON array using the DNTRNG™ Mapping Protocol. Ensure all arrays are escaped JSON strings inside the properties.

**Raw Data:**
[PASTE YOUR RAW TEXT HERE]

**Output Format:**
```json
[
  {
    "id": "q1",
    "question_text": "...",
    "question_type": "...",
    "options": "[\"...\", \"...\"]",
    "correct_answer": "[\"...\"]",
    "order_group": "[]",
    "image_url": "",
    "metadata": "",
    "required": true
  }
]
```"

---

## Deployment Instructions
1. Copy the resulting JSON from the AI.
2. Log in to the **DNTRNG™ Admin Console**.
3. Select a Test and click **JSON Editor**.
4. Paste the array and click **Commit JSON**.
5. The intelligence module is now synchronized with your Google Sheet registry.
