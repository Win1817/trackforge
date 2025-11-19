'use server';

/**
 * @fileOverview Generates time entry suggestions based on the selected project and task.
 *
 * - generateTimeEntrySuggestion - A function that generates time entry suggestions.
 * - TimeEntrySuggestionInput - The input type for the generateTimeEntrySuggestion function.
 * - TimeEntrySuggestionOutput - The return type for the generateTimeEntrySuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TimeEntrySuggestionInputSchema = z.object({
  project: z.string().describe('The name of the project.'),
  task: z.string().describe('The name of the task.'),
});
export type TimeEntrySuggestionInput = z.infer<
  typeof TimeEntrySuggestionInputSchema
>;

const TimeEntrySuggestionOutputSchema = z.object({
  suggestion: z.string().describe('A suggested description for the time entry.'),
});
export type TimeEntrySuggestionOutput = z.infer<
  typeof TimeEntrySuggestionOutputSchema
>;

export async function generateTimeEntrySuggestion(
  input: TimeEntrySuggestionInput
): Promise<TimeEntrySuggestionOutput> {
  return generateTimeEntrySuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'timeEntrySuggestionPrompt',
  input: {schema: TimeEntrySuggestionInputSchema},
  output: {schema: TimeEntrySuggestionOutputSchema},
  prompt: `You are a time tracking assistant. Generate a time entry description based on the project and task provided.

Project: {{{project}}}
Task: {{{task}}}

Suggestion: `,
});

const generateTimeEntrySuggestionFlow = ai.defineFlow(
  {
    name: 'generateTimeEntrySuggestionFlow',
    inputSchema: TimeEntrySuggestionInputSchema,
    outputSchema: TimeEntrySuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
