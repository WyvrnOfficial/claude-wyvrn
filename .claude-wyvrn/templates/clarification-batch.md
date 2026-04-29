# Clarification batch: <flow-id>

**Flow ID:** <FEAT-NNNN | FIX-NNNN | REF-NNNN>
**Status:** <In progress | Complete>
**Started:** <ISO 8601 timestamp>

> [template] Record of clarification Q&A for the flow. Written by the flow skill as session exchanges occur. Human does not edit this file directly.

## Round <N>

> [template] One section per clarification round. Add a new `## Round <N>` section for each round. Do not renumber prior rounds.

**Round started:** <ISO 8601 timestamp>
**Round completed:** <ISO 8601 timestamp | In progress>

### Question <N.M>

> [template] One subsection per question in the round. Numbering is round.question, e.g., 1.1, 1.2, 2.1.

**Classification:** <UNDECIDED | CONTRADICTION>
**Source references:**
> [template] Which authoritative sources were consulted and what was missing or conflicting. For UNDECIDED: cite the sources that did not answer. For CONTRADICTION: cite each conflicting source with the exact text.
- <source reference>

**Question:**
<the question, as posed to the human via `AskUserQuestion` per `HARNESS.md` §8>

**Options:**
> [template] Optional. When the clarifier can suggest a small set of plausible answers, list 2–4 here as a Markdown bulleted list, each as `Label: description`. The flow skill renders these as `AskUserQuestion` options. Omit this field for free-text-shaped questions. The auto-added "Other" option is never listed here.
- <Label>: <description>

**Answer:**
> [template] Human's answer, recorded verbatim from the session. If not yet answered, leave as `<pending>`.
<answer or `<pending>`>

**Recorded at:** <ISO 8601 timestamp of answer, or `<pending>`>
