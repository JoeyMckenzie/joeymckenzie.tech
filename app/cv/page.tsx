import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
    title: "CV",
    description: "Joey McKenzie's resume and professional experience.",
};

const experience = [
    {
        company: "Givebutter",
        role: "Senior Software Engineer II",
        dates: "Aug 2025 — Present",
        summary:
            "Building things with PHP, Laravel, TypeScript, and React at a nonprofit fundraising platform that genuinely cares about doing good in the world. I love my job and the people I work with, which I understand is a rare and slightly suspicious thing to say.",
    },
    {
        company: "Dayforce",
        role: "Senior Software Engineer",
        dates: "Jun 2024 — Aug 2025",
        summary:
            "C# and .NET in the HR and workforce management space. Enterprise security at scale is a humbling domain, and I have the threat models to prove it.",
    },
    {
        company: "National Funding",
        role: "Senior Software Engineer",
        dates: "Jan 2022 — Jun 2024",
        summary:
            "C#, .NET, and AWS in the small business lending space. Serverless, Terraform, and more financial acronyms than any one person should have to know. I now have opinions about loan origination software.",
    },
    {
        company: "MediKeeper",
        role: "Software Engineer",
        dates: "Dec 2020 — Jan 2022",
        summary:
            "C#, .NET, and Vue in the health and wellness space. Corporate wellness turns out to be a real industry, which I did not fully appreciate until I was neck-deep in it.",
    },
    {
        company: "Sierra Pacific Industries",
        role: "Applications Developer",
        dates: "Jan 2020 — Dec 2020",
        summary:
            ".NET and Angular in the lumber and manufacturing space. Also some IBM RPG, briefly and involuntarily. I have made my peace with it.",
    },
    {
        company: "VSP Vision Care",
        role: "Associate Software Engineer",
        dates: "Jun 2018 — Jan 2020",
        summary:
            "Java, Spring Boot, and Angular in the optical insurance space. My first enterprise job, where I learned that healthcare billing is its own entire universe with its own rules, customs, and ancient dialects.",
    },
    {
        company: "SAIC (formerly Engility)",
        role: "Operations Research Analyst",
        dates: "Sept 2016 — May 2018",
        summary:
            "R, Python, SQL, and .NET in the federal defense contracting space. I started my career building cost models for Navy shipbuilding programs, which is still the most interesting sentence I have ever had to explain at a party.",
    },
];

const education = [
    {
        school: "San Diego State University",
        degree: "B.S. Astronomy, Minor in Mathematics",
        dates: "2011 — 2016",
    },
];

const skills = [
    {
        category: "Will yap about (and pays my bills)",
        items: ["PHP", "Laravel", "TypeScript", "React", "Rust", "Inertia.js"],
    },
    {
        category: "What previously paid my bills",
        items: [
            "C#",
            ".NET",
            "Azure",
            "Angular",
            "Vue",
            "Next.js",
            "Java",
            "Spring Boot",
        ],
    },
    {
        category: "The glue nobody thanks (that also pays my bills)",
        items: ["AWS", "Docker", "Terraform", "GitHub", "Kubernetes"],
    },
];

function SectionHeading({ children }: { children: string }) {
    return (
        <h2 className="text-muted-foreground font-mono text-xs tracking-[0.15em] uppercase">
            {children}
        </h2>
    );
}

export default function Cv() {
    return (
        <main className="mx-auto w-full max-w-3xl px-4 py-16">
            <PageHeader heading="Joey McKenzie" />
            <p className="text-muted-foreground mt-8 max-w-2xl">
                Product engineer with a passion for tinkering, building web
                applications, distributed systems, and the occasional thing I
                probably should not have over-engineered. I started my career
                analyzing Navy shipbuilding costs, which is a sentence that
                still surprises me. I&apos;ve worked in a lot of language
                ecosystems. These days I mostly write PHP and TypeScript and try
                to leave codebases better than I found them.
            </p>

            <Separator className="mt-14" />

            <section className="mt-10 flex flex-col gap-6">
                <SectionHeading>experience</SectionHeading>
                <div className="flex flex-col gap-6">
                    {experience.map((job) => (
                        <article
                            key={job.company}
                            className="flex flex-col gap-2 border-l pl-6"
                        >
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-5">
                                <div>
                                    <h3 className="font-heading text-lg font-medium">
                                        {job.role}
                                    </h3>
                                    <p className="text-primary mt-0.5 font-mono text-xs">
                                        {job.company}
                                    </p>
                                </div>
                                <span className="text-muted-foreground shrink-0 font-mono text-xs">
                                    {job.dates}
                                </span>
                            </div>
                            <p className="text-muted-foreground max-w-2xl text-sm">
                                {job.summary}
                            </p>
                        </article>
                    ))}
                </div>
            </section>

            <Separator className="mt-14" />

            <section className="mt-10 flex flex-col gap-6">
                <SectionHeading>education</SectionHeading>
                {education.map((school) => (
                    <div
                        key={school.school}
                        className="flex flex-col gap-1 border-l pl-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-5"
                    >
                        <div>
                            <h3 className="font-heading text-lg font-medium">
                                {school.school}
                            </h3>
                            <p className="text-primary mt-0.5 font-mono text-xs">
                                {school.degree}
                            </p>
                        </div>
                        <span className="text-muted-foreground shrink-0 font-mono text-xs">
                            {school.dates}
                        </span>
                    </div>
                ))}
            </section>

            <Separator className="mt-14" />

            <section className="mt-10 flex flex-col gap-6">
                <SectionHeading>skills</SectionHeading>
                {skills.map((group) => (
                    <div key={group.category} className="flex flex-col gap-3">
                        <h3 className="text-muted-foreground text-sm">
                            {group.category}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {group.items.map((item) => (
                                <Badge
                                    key={item}
                                    variant="outline"
                                    className="font-mono"
                                >
                                    {item}
                                </Badge>
                            ))}
                        </div>
                    </div>
                ))}
            </section>
        </main>
    );
}
