import { Head } from '@inertiajs/react';
import {
    FadeInSection,
    StaggeredItem,
    StaggeredList,
} from '@/components/motion';

const experience = [
    {
        company: 'Givebutter',
        role: 'Senior Software Engineer II',
        dates: 'Aug 2025 — Present',
        summary:
            'Building things with PHP, Laravel, TypeScript, and React at a nonprofit fundraising platform that genuinely cares about doing good in the world. I love my job and the people I work with, which I understand is a rare and slightly suspicious thing to say.',
    },
    {
        company: 'Dayforce',
        role: 'Senior Software Engineer',
        dates: 'Jun 2024 — Aug 2025',
        summary:
            'C# and .NET in the HR and workforce management space. Enterprise security at scale is a humbling domain, and I have the threat models to prove it.',
    },
    {
        company: 'National Funding',
        role: 'Senior Software Engineer',
        dates: 'Jan 2022 — Jun 2024',
        summary:
            'C#, .NET, and AWS in the small business lending space. Serverless, Terraform, and more financial acronyms than any one person should have to know. I now have opinions about loan origination software.',
    },
    {
        company: 'MediKeeper',
        role: 'Software Engineer',
        dates: 'Dec 2020 — Jan 2022',
        summary:
            'C#, .NET, and Vue in the health and wellness space. Corporate wellness turns out to be a real industry, which I did not fully appreciate until I was neck-deep in it.',
    },
    {
        company: 'Sierra Pacific Industries',
        role: 'Applications Developer',
        dates: 'Jan 2020 — Dec 2020',
        summary:
            '.NET and Angular in the lumber and manufacturing space. Also some IBM RPG, briefly and involuntarily. I have made my peace with it.',
    },
    {
        company: 'VSP Vision Care',
        role: 'Associate Software Engineer',
        dates: 'Jun 2018 — Jan 2020',
        summary:
            'Java, Spring Boot, and Angular in the optical insurance space. My first enterprise job, where I learned that healthcare billing is its own entire universe with its own rules, customs, and ancient dialects.',
    },
    {
        company: 'SAIC (formerly Engility)',
        role: 'Operations Research Analyst',
        dates: 'Sept 2016 — May 2018',
        summary:
            'R, Python, SQL, and .NET in the federal defense contracting space. I started my career building cost models for Navy shipbuilding programs, which is still the most interesting sentence I have ever had to explain at a party.',
    },
];

const education = [
    {
        school: 'San Diego State University',
        degree: 'B.S. Astronomy, Minor in Mathematics',
        dates: '2011 — 2016',
    },
];

const skills = [
    {
        category: 'Will yap about (and pays my bills)',
        items: ['PHP', 'Laravel', 'TypeScript', 'React', 'Rust', 'Inertia.js'],
    },
    {
        category: 'What previously paid my bills',
        items: [
            'C#',
            '.NET',
            'Azure',
            'Angular',
            'Vue',
            'Next.js',
            'Java',
            'Spring Boot',
        ],
    },
    {
        category: 'The glue nobody thanks (that also pays my bills)',
        items: ['AWS', 'Docker', 'Terraform', 'GitHub', 'Kubernetes'],
    },
];

export default function Cv() {
    return (
        <>
            <Head title="CV">
                <meta
                    name="description"
                    content="Joey McKenzie's resume and professional experience."
                />
            </Head>

            <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                    <p className="font-mono text-xs tracking-wide text-muted-foreground">
                        ~/cv
                    </p>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Joey McKenzie
                    </h1>
                </div>
            </div>

            <FadeInSection className="mt-6">
                <p className="leading-7 text-muted-foreground">
                    Product engineer with a passion for tinkering, building web
                    applications, distributed systems, and the occasional thing
                    I probably should not have over-engineered. I started my
                    career analyzing Navy shipbuilding costs, which is a
                    sentence that still surprises me. I've worked in a lot of
                    language ecoystems. These days I mostly write PHP and
                    TypeScript and try to leave codebases better than I found
                    them.
                </p>
            </FadeInSection>

            <FadeInSection className="mt-8 space-y-3 pt-6">
                <h2 className="text-xl tracking-tight">Experience</h2>
                <StaggeredList className="space-y-6">
                    {experience.map((job) => (
                        <StaggeredItem key={`${job.company}-${job.role}`}>
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                                <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
                                    <span className="font-medium">
                                        {job.role}
                                    </span>
                                    <span className="text-muted-foreground">
                                        {job.company}
                                    </span>
                                </div>
                                <span className="shrink-0 text-sm text-muted-foreground">
                                    {job.dates}
                                </span>
                            </div>
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                {job.summary}
                            </p>
                        </StaggeredItem>
                    ))}
                </StaggeredList>
            </FadeInSection>

            <FadeInSection className="mt-8 space-y-3 pt-6">
                <h2 className="text-xl tracking-tight">Education</h2>
                {education.map((edu) => (
                    <div
                        key={`${edu.school}-${edu.degree}`}
                        className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                    >
                        <div>
                            <span className="font-medium">{edu.degree}</span>
                            <span className="text-muted-foreground">
                                {' '}
                                &mdash; {edu.school}
                            </span>
                        </div>
                        <span className="shrink-0 text-sm text-muted-foreground">
                            {edu.dates}
                        </span>
                    </div>
                ))}
            </FadeInSection>

            <FadeInSection className="mt-8 space-y-3 pt-6">
                <h2 className="text-xl tracking-tight">What I vibe with</h2>
                <StaggeredList className="space-y-3">
                    {skills.map((group) => (
                        <StaggeredItem
                            key={group.category}
                            className="space-y-2"
                        >
                            <span className="text-sm font-medium">
                                {group.category}
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {group.items.map((item) => (
                                    <span
                                        key={item}
                                        className="rounded-md border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </StaggeredItem>
                    ))}
                </StaggeredList>
            </FadeInSection>
        </>
    );
}
