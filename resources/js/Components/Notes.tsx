import * as React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/Components/ui/alert';
import { Terminal } from 'lucide-react';

const notes = [
    {
        title: 'Microservices',
        description: 'Beware the myth of the distributed monolith.',
    },
    {
        title: 'Agile',
        description: 'The agile industrial complex is real.',
    },
    {
        title: 'Frameworks',
        description: 'Be an engineer, not a frameworker.',
    },
];

function Note({
    title,
    description,
}: {
    title: string;
    description: string;
}): React.JSX.Element {
    return (
        <Alert key="title">
            <Terminal className="h-4 w-4" />
            <AlertTitle className="font-bold">{title}</AlertTitle>
            <AlertDescription>{description}</AlertDescription>
        </Alert>
    );
}

export default function Notes(): React.JSX.Element {
    return (
        <div className="pb-16">
            <h2 className="pb-4 pt-8 text-left text-4xl font-bold tracking-tight sm:text-center">
                Note to self.
            </h2>
            <div className="mx-auto grid max-w-3xl grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-3">
                {notes.map(({ title, description }, index) => (
                    <Note
                        key={`note-${index}`}
                        title={title}
                        description={description}
                    />
                ))}
            </div>
        </div>
    );
}
