
import { supabase } from '@/utils/supabase/client';
import { Unit } from '@/types';
import { INITIAL_SUBJECTS } from './subject-service';

export const INITIAL_UNITS: Unit[] = [
    // s1: Production and Operations Management (PBA204)
    { id: "u1-1", subjectId: "s1", title: "Unit I: Introduction to Operations Management", description: "Nature, Scope, Importance and Functions", order: 1, isCompleted: true, topics: ["Evolution from manufacturing to operations management", "Evolution of the factory system", "Manufacturing systems", "Quality", "Mass customization", "Contribution of Henry Ford, Deming, Crossby, Taguchi"] },
    { id: "u1-2", subjectId: "s1", title: "Unit II: Productivity and Work Study", description: "Productivity, Objectives, Scope and Uses", order: 2, isCompleted: true, topics: ["Methods Study", "Flow process chart", "Flow diagram", "Process mapping", "Work Measurement", "Elements", "Performance Rating", "Allowances", "Standard Time", "Synthetic Time Standards", "Work Sampling", "Numericals expected for Standard Time"] },
    { id: "u1-3", subjectId: "s1", title: "Unit III: Facilities Location and Layout", description: "Strategic importance and Factors", order: 3, isCompleted: false, topics: ["Factors affecting location and layout", "Installation of facilities", "Single location decisions", "Multi-location decisions", "Principles of Facilities Layout", "Types of Facilities Layout"] },
    { id: "u1-4", subjectId: "s1", title: "Unit IV: Types of Industries and Manufacturing Methods", description: "Variety of Businesses and Integration", order: 4, isCompleted: false, topics: ["Integration of Manufacturing and Services", "Scale of Operations", "Methods of Manufacturing", "Project / Jobbing", "Batch Production", "Flow / Continuous Production", "Process Production", "Characteristics of each method"] },
    { id: "u1-5", subjectId: "s1", title: "Unit V: Inspection, Quality Control and Lean Systems", description: "Inspection and Statistical Quality Control", order: 5, isCompleted: false, topics: ["Cent percent Inspection", "Sample Inspection", "Operation Characteristics Curves", "Construction and Interpretation of Control Charts", "X-R, n, p, c, np charts", "Introduction to Six Sigma", "Numericals expected for Control Charts", "Lean Production Systems", "TOYOTA system", "JIT", "KANBAN", "Theory of Constraints"] },
    // ... (rest of units remain same, truncated for brevity in replacement but full file content preserved effectively by just changing import and method)

    // To avoid replacing the whole file just for correct import and method, I will target specific blocks if possible, but the Import is at top.
    // Actually, since I need to change import AND method, rewriting the file with complete UNITS again is safest or using multi-replace?
    // I'll stick to replacing the logic block and top block. 
    // BUT `replace_file_content` supports single contiguous block.
    // The file is small enough to rewrite the import and valid parts, or I can use `multi_replace`.
    // I'll use `replace_file_content` to update the imports and then another call for the function? No, must be single call.
    // I will target the top of the file down to the start of INITIAL_UNITS to add the import, AND I need to update the function at the bottom.
    // Wait, I can't do two disjoint edits with `replace_file_content`.
    // I will use `replace_file_content` to update the ENTIRE file content for safety and correctness, or `multi_replace`.
    // Let's use `replace_file_content` targeting the top imports, effectively replacing the first few lines? No, imports are at top, function at bottom.
    // I'll use `write_to_file` to overwrite it with the full content to be 100% sure, as I have the full content from memory/context.
    // Be careful with the UNITS array, I must include ALL units.
    // I'll try to use `multi_replace_file_content` to be surgical.

    // s1: Production and Operations Management (PBA204)
    { id: "u1-1", subjectId: "s1", title: "Unit I: Introduction to Operations Management", description: "Nature, Scope, Importance and Functions", order: 1, isCompleted: true, topics: ["Evolution from manufacturing to operations management", "Evolution of the factory system", "Manufacturing systems", "Quality", "Mass customization", "Contribution of Henry Ford, Deming, Crossby, Taguchi"] },
    { id: "u1-2", subjectId: "s1", title: "Unit II: Productivity and Work Study", description: "Productivity, Objectives, Scope and Uses", order: 2, isCompleted: true, topics: ["Methods Study", "Flow process chart", "Flow diagram", "Process mapping", "Work Measurement", "Elements", "Performance Rating", "Allowances", "Standard Time", "Synthetic Time Standards", "Work Sampling", "Numericals expected for Standard Time"] },
    { id: "u1-3", subjectId: "s1", title: "Unit III: Facilities Location and Layout", description: "Strategic importance and Factors", order: 3, isCompleted: false, topics: ["Factors affecting location and layout", "Installation of facilities", "Single location decisions", "Multi-location decisions", "Principles of Facilities Layout", "Types of Facilities Layout"] },
    { id: "u1-4", subjectId: "s1", title: "Unit IV: Types of Industries and Manufacturing Methods", description: "Variety of Businesses and Integration", order: 4, isCompleted: false, topics: ["Integration of Manufacturing and Services", "Scale of Operations", "Methods of Manufacturing", "Project / Jobbing", "Batch Production", "Flow / Continuous Production", "Process Production", "Characteristics of each method"] },
    { id: "u1-5", subjectId: "s1", title: "Unit V: Inspection, Quality Control and Lean Systems", description: "Inspection and Statistical Quality Control", order: 5, isCompleted: false, topics: ["Cent percent Inspection", "Sample Inspection", "Operation Characteristics Curves", "Construction and Interpretation of Control Charts", "X-R, n, p, c, np charts", "Introduction to Six Sigma", "Numericals expected for Control Charts", "Lean Production Systems", "TOYOTA system", "JIT", "KANBAN", "Theory of Constraints"] },

    // s2: Digital Transformation (PBA205)
    { id: "u2-1", subjectId: "s2", title: "Unit I: Understanding Digital Transformation", description: "Definition, Scope and Importance", order: 1, isCompleted: true, topics: ["Definition and Scope", "Importance and Benefits", "Key drivers", "Trends in digital transformation", "Overview of digital transformation frameworks"] },
    { id: "u2-2", subjectId: "s2", title: "Unit II: Leading Digital Transformation", description: "Role of leadership and culture", order: 2, isCompleted: false, topics: ["Role of leadership in driving transformation", "Key competencies for digital leaders", "Building a digital culture", "Introduction to Agile and Lean methodologies", "Applying Agile and Lean principles"] },
    { id: "u2-3", subjectId: "s2", title: "Unit III: Digital Transformation in Various Industries", description: "Retail, Fintech and Healthcare", order: 3, isCompleted: false, topics: ["Trends and technologies in retail", "Omnichannel strategies and customer experience", "Fintech innovations and trends", "Impact on banking services", "Technologies transforming healthcare", "Telemedicine", "Health informatics", "Challenges and opportunities"] },
    { id: "u2-4", subjectId: "s2", title: "Unit IV: Innovation in the Digital Age", description: "Types of innovation and Environment", order: 4, isCompleted: false, topics: ["Incremental, Disruptive, Radical Innovation", "Creating an innovation-friendly environment", "Encouraging creativity and experimentation", "Design thinking", "Open innovation", "Innovation labs and incubators", "Crowdsourcing"] },
    { id: "u2-5", subjectId: "s2", title: "Unit V: Digital Technologies and Trends", description: "Emerging Technologies", order: 5, isCompleted: false, topics: ["Overview of key digital technologies", "Artificial Intelligence", "Internet of Things", "Blockchain", "Cloud computing", "Big data", "Machine learning", "Impact on businesses and industries"] },

    // s3: Legal Aspects of Business (PBA206)
    { id: "u3-1", subjectId: "s3", title: "Unit I: Law of Contract", description: "The Indian Contract Act, 1872", order: 1, isCompleted: true, topics: ["Nature and kinds of contracts", "Essential elements of a valid contract", "Offer and acceptance", "Consideration", "Capacity and Free consent", "Legality and object", "Contingent contracts", "Performance & Discharge", "Quasi contract", "Remedies for breach", "Indemnity and guarantee", "Bailment and pledge", "Law of agency"] },
    { id: "u3-2", subjectId: "s3", title: "Unit II: Sale of Goods and Partnership", description: "Sales of Goods Act 1930 & Partnership Act 1932", order: 2, isCompleted: true, topics: ["Conditions and warranties", "Doctrine of caveat emptor", "Transfer of ownership", "Performance of sale contract", "Remedial measures", "Formation of partnership", "Rights and liabilities of partners", "Dissolution of partnership firms"] },
    { id: "u3-3", subjectId: "s3", title: "Unit III: Company Law", description: "The Indian Companies Act, 1956", order: 3, isCompleted: false, topics: ["Formation of a company", "Memorandum & Articles of association", "Prospectus & Share allotment", "Shares and share capital", "Membership & Directors", "Meetings and proceedings", "Prevention of oppression", "Winding up"] },
    { id: "u3-4", subjectId: "s3", title: "Unit IV: Insurance, Insolvency, Carriage and Arbitration", description: "Principles and Regulations", order: 4, isCompleted: false, topics: ["Nature and principles of insurance", "Life, General, Fire, Marine Insurance", "Insolvency law procedure", "Property and debt of insolvent", "Carriage of goods (Land, Sea, Air)", "Arbitration modes and provisions"] },
    { id: "u3-5", subjectId: "s3", title: "Unit V: Miscellaneous Laws", description: "Economic and Consumer Laws", order: 5, isCompleted: false, topics: ["Essential Commodities Act 1955", "Consumer Protection Act 1986", "Co-operative Societies Act", "Multi-State Co-operative Societies Act", "Foreign Exchange Management Act 1999", "MRTP Act", "Information Technology Act 2000"] },

    // s4: Data Visualization and Story Telling (PBA207)
    { id: "u4-1", subjectId: "s4", title: "Unit I: Visualization Basics", description: "Introduction to visualization", order: 1, isCompleted: true, topics: ["Why and How to visualize", "Stages of data visualizing", "Usages of visualization", "Types of charts"] },
    { id: "u4-2", subjectId: "s4", title: "Unit II: Visualization of Structured Data", description: "Exploratory and Multivariate analysis", order: 2, isCompleted: true, topics: ["Introduction", "Exploratory analysis", "Univariate & Multivariate analysis", "Charts for multiple measures", "Modeling", "Visualization during deployment"] },
    { id: "u4-3", subjectId: "s4", title: "Unit III: Visualization of Unstructured Data", description: "Text data visualization", order: 3, isCompleted: false, topics: ["Importance and challenges", "Forms of text data", "Pre-processing pipeline", "Visualizing text data", "Visualizing conversations"] },
    { id: "u4-4", subjectId: "s4", title: "Unit IV: Visual Story Telling", description: "Introduction to Narrative", order: 4, isCompleted: false, topics: ["Why storytelling matters", "Science behind storytelling"] },
    { id: "u4-5", subjectId: "s4", title: "Unit V: Storytelling Framework", description: "Business and Data Storytelling", order: 5, isCompleted: false, topics: ["Importance of business storytelling", "Data storytelling", "Narrative types", "Dimensions of narrative", "Data story types", "Analytics dashboard"] },

    // s5: Business Research Methodology (PBA208)
    { id: "u5-1", subjectId: "s5", title: "Unit I: Introduction to Business Research", description: "Types and Process", order: 1, isCompleted: true, topics: ["Types of research", "Process of research", "Formulation of research problem", "Development of research hypothesis"] },
    { id: "u5-2", subjectId: "s5", title: "Unit II: Research Design", description: "Definitions, functions and Validity", order: 2, isCompleted: true, topics: ["Exploratory, descriptive, experimental", "Experimental designs (Pre, Quasi, True, Statistical)", "Validity (Face, Content, Construct)", "Methods of data collection", "Attitudinal scales (Likert)", "Questionnaire designing"] },
    { id: "u5-3", subjectId: "s5", title: "Unit III: Sampling", description: "Concept and Data Processing", order: 3, isCompleted: false, topics: ["Concept of sampling", "Sampling design types (Probability/Non-probability/Mixed)", "Sampling frame & size", "Data processing (Editing, Coding, Tabulating)"] },
    { id: "u5-4", subjectId: "s5", title: "Unit IV: Data Analysis", description: "Analysis and Hypothesis Testing", order: 4, isCompleted: false, topics: ["Univariate, Bivariate, Multivariate analysis", "Hypothesis testing concepts", "Types of errors", "Steps in hypothesis testing"] },
    { id: "u5-5", subjectId: "s5", title: "Unit V: Analytical Techniques", description: "Parametric vs non-parametric tests", order: 5, isCompleted: false, topics: ["ANOVA", "Correlation and regression", "Chi-square test", "Non-parametric tests for normality", "Run test", "Factor analysis", "Discriminant analysis", "Conjoint analysis"] },
];

export const UnitService = {
    async getBySubjectId(subjectId: string, subjectCode?: string): Promise<Unit[]> {
        // 1. Try to fetch from DB
        const { data, error } = await supabase
            .from('units')
            .select('*')
            .eq('subject_id', subjectId)
            .order('order', { ascending: true });

        if (error) {
            console.error('Error fetching units:', error);
            return [];
        }

        // 2. If valid data found, map and return
        if (data && data.length > 0) {
            return data.map((item: any) => ({
                id: item.id,
                subjectId: item.subject_id,
                title: item.title,
                description: item.description,
                order: item.order,
                isCompleted: item.is_completed,
                topics: item.topics
            }));
        }

        // 3. If NO data (and it's one of our known static subjects), Seed it!
        // First try matching by ID directly
        let unitsToSeed = INITIAL_UNITS.filter(u => u.subjectId === subjectId);

        // If not found, and we have a code, try to find the static ID for that code
        if (unitsToSeed.length === 0 && subjectCode) {
            const normalizedCode = subjectCode.trim().toUpperCase();
            console.log(`Attempting to match subject code: '${subjectCode}' (normalized: '${normalizedCode}')`);

            const staticSub = INITIAL_SUBJECTS.find(s => s.code.trim().toUpperCase() === normalizedCode);

            if (staticSub) {
                console.log(`Found static subject match for ${subjectCode}: ${staticSub.id}. Using its units template.`);
                unitsToSeed = INITIAL_UNITS.filter(u => u.subjectId === staticSub.id);
            } else {
                console.warn(`No static subject found matching code: ${normalizedCode}. Available codes: ${INITIAL_SUBJECTS.map(s => s.code).join(', ')}`);
            }
        }

        if (unitsToSeed.length > 0) {
            console.log(`Seeding units for subject ${subjectId} (matching ${unitsToSeed[0].subjectId} template)...`);

            const dbPayload = unitsToSeed.map(u => ({
                id: u.id,  // Keep the static ID (e.g., u1-1) - assuming global uniqueness or 1:1 mapping
                subject_id: subjectId, // IMPORTANT: Use the PASSED (real) subject ID, not the template's
                title: u.title,
                description: u.description,
                "order": u.order,
                is_completed: u.isCompleted,
                topics: u.topics
            }));

            const { error: insertError } = await supabase
                .from('units')
                .insert(dbPayload);

            if (insertError) {
                console.error("Error seeding units:", insertError);
                // Return seed data mapped to correct subjectId as fallback
                return unitsToSeed.map(u => ({ ...u, subjectId: subjectId }));
            }

            return unitsToSeed.map(u => ({ ...u, subjectId: subjectId }));
        }

        return [];
    },

    async toggleComplete(unitId: string, isCompleted: boolean): Promise<void> {
        await supabase
            .from('units')
            .update({ is_completed: isCompleted })
            .eq('id', unitId);
    },

    async update(unit: Partial<Unit>): Promise<void> {
        if (!unit.id) return;

        const payload: any = {
            title: unit.title,
            description: unit.description,
            topics: unit.topics,
            updated_at: new Date().toISOString()
        };

        // Filter out undefined values
        Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

        const { error } = await supabase
            .from('units')
            .update(payload)
            .eq('id', unit.id);

        if (error) throw error;
    }
};
