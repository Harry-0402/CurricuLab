import { getSkills, getTracks, getJournalEntries, getResources } from './skillforge.service';

/**
 * Builds a comprehensive context string about the user's SkillForge data
 * for providing personalized AI recommendations
 */
export async function buildSkillForgeContext(): Promise<string> {
    try {
        const [tracks, skills, resources, journal] = await Promise.all([
            getTracks(),
            getSkills(),
            getResources(),
            getJournalEntries()
        ]);

        const contextParts: string[] = [];

        // Learning Tracks Context
        if (tracks.length > 0) {
            const activeTracks = tracks.filter(t => t.status === 'active');
            const completedTracks = tracks.filter(t => t.status === 'completed');

            contextParts.push(`\n**Current Learning Tracks:**`);
            if (activeTracks.length > 0) {
                contextParts.push(`Active tracks (${activeTracks.length}):`);
                activeTracks.forEach(t => {
                    contextParts.push(`- ${t.title} (${t.category}, ${t.progress}% complete)`);
                });
            }
            if (completedTracks.length > 0) {
                contextParts.push(`\nCompleted tracks: ${completedTracks.map(t => t.title).join(', ')}`);
            }
        }

        // Skills Context
        if (skills.length > 0) {
            contextParts.push(`\n**Current Skills:**`);
            const skillsByProficiency = skills.reduce((acc, s) => {
                if (!acc[s.proficiencyLevel]) acc[s.proficiencyLevel] = [];
                acc[s.proficiencyLevel].push(s.name);
                return acc;
            }, {} as Record<string, string[]>);

            Object.entries(skillsByProficiency).forEach(([level, names]) => {
                contextParts.push(`${level}: ${names.join(', ')}`);
            });
        }

        // Resources Context
        if (resources.length > 0) {
            const inProgress = resources.filter(r => r.status === 'in_progress');
            const notStarted = resources.filter(r => r.status === 'not_started');

            if (inProgress.length > 0) {
                contextParts.push(`\n**Currently Learning From:**`);
                inProgress.forEach(r => {
                    contextParts.push(`- ${r.title} (${r.type} on ${r.platform})`);
                });
            }

            if (notStarted.length > 0) {
                contextParts.push(`\n**Saved for Later:** ${notStarted.length} resources`);
            }
        }

        // Recent Journal Insights
        if (journal.length > 0) {
            const recentEntries = journal.slice(0, 3);
            contextParts.push(`\n**Recent Learning Reflections:**`);
            recentEntries.forEach(e => {
                if (e.mood) contextParts.push(`- ${e.title} (feeling: ${e.mood})`);
                if (e.keyLearnings && e.keyLearnings.length > 0) {
                    contextParts.push(`  Key learnings: ${e.keyLearnings.join(', ')}`);
                }
            });
        }

        if (contextParts.length === 0) {
            return "The user is just getting started with their learning journey and hasn't added any tracks, skills, or resources yet.";
        }

        return `Here's the user's current learning context from SkillForge:\n${contextParts.join('\n')}`;
    } catch (error) {
        console.error('Error building SkillForge context:', error);
        return 'Unable to retrieve user learning data at this time.';
    }
}

/**
 * Generates a system prompt for the AI to act as a learning mentor
 */
export function getSkillForgeLearningMentorPrompt(userContext: string): string {
    return `You are a personalized AI Learning Mentor helping a student with their self-directed learning journey. 

Your role is to:
- Provide study planning and learning strategy advice
- Recommend resources and learning paths
- Help with skill development and career growth
- Offer motivation and guidance
- Suggest next steps based on their current progress

Be supportive, encouraging, and practical. Focus on actionable advice.

${userContext}

Provide concise, helpful responses tailored to their learning context above.`;
}

/**
 * Prepares a complete chat request with SkillForge context
 */
export async function prepareSkillForgeChat(userMessage: string, conversationHistory: Array<{ role: string; content: string }> = []) {
    const context = await buildSkillForgeContext();
    const systemPrompt = getSkillForgeLearningMentorPrompt(context);

    return {
        systemPrompt,
        userMessage,
        conversationHistory,
        context
    };
}
