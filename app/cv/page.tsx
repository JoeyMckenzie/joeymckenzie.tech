import * as stylex from "@stylexjs/stylex";
import type { Metadata } from "next";

import { breakpoints, colors, fonts } from "@/app/tokens.stylex";
import { Badge } from "@/components/badge";
import { Main } from "@/components/main";
import { PageHeader } from "@/components/page-header";
import { SectionLabel } from "@/components/section-label";
import { alternates } from "@/lib/metadata";

const styles = stylex.create({
    skill: { fontFamily: fonts.mono },
    intro: {
        marginTop: 32,
        maxWidth: "42rem",
        color: colors.mutedForeground,
    },
    section: {
        marginTop: 64,
        display: "flex",
        flexDirection: "column",
        gap: 24,
    },
    stack: { display: "flex", flexDirection: "column", gap: 24 },
    entry: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
        borderInlineStartWidth: 1,
        borderInlineStartStyle: "solid",
        borderInlineStartColor: colors.border,
        paddingInlineStart: 24,
    },
    entryHead: {
        display: "flex",
        flexDirection: { default: "column", [breakpoints.sm]: "row" },
        alignItems: { default: null, [breakpoints.sm]: "baseline" },
        justifyContent: { default: null, [breakpoints.sm]: "space-between" },
        gap: { default: 4, [breakpoints.sm]: 20 },
    },
    role: { fontSize: "1.125rem", fontWeight: 500 },
    org: {
        marginTop: 2,
        color: colors.primary,
        fontFamily: fonts.mono,
        fontSize: "0.75rem",
    },
    dates: {
        flexShrink: 0,
        color: colors.mutedForeground,
        fontFamily: fonts.mono,
        fontSize: "0.75rem",
    },
    summary: {
        maxWidth: "42rem",
        color: colors.mutedForeground,
        fontSize: "0.875rem",
    },
    skillGroup: { display: "flex", flexDirection: "column", gap: 12 },
    skillCategory: { color: colors.mutedForeground, fontSize: "0.875rem" },
    skillRow: { display: "flex", flexWrap: "wrap", gap: 8 },
});

export const metadata: Metadata = {
    title: "CV",
    description: "Joey McKenzie's resume and professional experience.",
    alternates: alternates("/cv/"),
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

export default function Cv() {
    return (
        <Main>
            <PageHeader heading="Joey McKenzie" />
            <p {...stylex.props(styles.intro)}>
                Product engineer with a passion for tinkering, building web
                applications, distributed systems, and the occasional thing I
                probably should not have over-engineered. I started my career
                analyzing Navy shipbuilding costs, which is a sentence that
                still surprises me. I&apos;ve worked in a lot of language
                ecosystems. These days I mostly write PHP and TypeScript and try
                to leave codebases better than I found them.
            </p>

            <section {...stylex.props(styles.section)}>
                <SectionLabel>experience</SectionLabel>
                <div {...stylex.props(styles.stack)}>
                    {experience.map((job) => (
                        <article
                            key={job.company}
                            {...stylex.props(styles.entry)}
                        >
                            <div {...stylex.props(styles.entryHead)}>
                                <div>
                                    <h3 {...stylex.props(styles.role)}>
                                        {job.role}
                                    </h3>
                                    <p {...stylex.props(styles.org)}>
                                        {job.company}
                                    </p>
                                </div>
                                <span {...stylex.props(styles.dates)}>
                                    {job.dates}
                                </span>
                            </div>
                            <p {...stylex.props(styles.summary)}>
                                {job.summary}
                            </p>
                        </article>
                    ))}
                </div>
            </section>

            <section {...stylex.props(styles.section)}>
                <SectionLabel>education</SectionLabel>
                {education.map((school) => (
                    <div
                        key={school.school}
                        {...stylex.props(styles.entry, styles.entryHead)}
                    >
                        <div>
                            <h3 {...stylex.props(styles.role)}>
                                {school.school}
                            </h3>
                            <p {...stylex.props(styles.org)}>{school.degree}</p>
                        </div>
                        <span {...stylex.props(styles.dates)}>
                            {school.dates}
                        </span>
                    </div>
                ))}
            </section>

            <section {...stylex.props(styles.section)}>
                <SectionLabel>skills</SectionLabel>
                {skills.map((group) => (
                    <div
                        key={group.category}
                        {...stylex.props(styles.skillGroup)}
                    >
                        <h3 {...stylex.props(styles.skillCategory)}>
                            {group.category}
                        </h3>
                        <div {...stylex.props(styles.skillRow)}>
                            {group.items.map((item) => (
                                <Badge key={item} style={styles.skill}>
                                    {item}
                                </Badge>
                            ))}
                        </div>
                    </div>
                ))}
            </section>
        </Main>
    );
}
