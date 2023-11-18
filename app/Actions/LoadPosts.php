<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\FrontMatter;
use League\CommonMark\Environment\Environment;
use League\CommonMark\Extension\CommonMark\CommonMarkCoreExtension;
use League\CommonMark\Extension\FrontMatter\Data\SymfonyYamlFrontMatterParser;
use League\CommonMark\Extension\FrontMatter\FrontMatterExtension;
use League\CommonMark\Extension\FrontMatter\FrontMatterParser;
use League\CommonMark\MarkdownConverter;

final readonly class LoadPosts
{
    public function handle(): array
    {
        $config = [];

        // Configure the Environment with all the CommonMark parsers/renderers
        $environment = new Environment();
        $environment->addExtension(new CommonMarkCoreExtension());

        // Add the extension
        $environment->addExtension(new FrontMatterExtension());

        // Instantiate the converter engine and start converting some Markdown!
        $converter = new MarkdownConverter($environment);
        $basePath = base_path();
        $contentPath = "$basePath".'/content';
        $files = glob("$contentPath/**/*.md", GLOB_BRACE);
        $filesToReturn = [];

        foreach ($files as $file) {
            $contents = file_get_contents($file);
            $frontMatterParser = new FrontMatterParser(new SymfonyYamlFrontMatterParser());
            $parsedContent = $frontMatterParser->parse($contents);

            $frontMatter = $parsedContent->getFrontMatter();
            $documentContent = $parsedContent->getContent();
            $parsedFrontMatter = new FrontMatter($frontMatter);

            ddd($parsedFrontMatter);

            $filesToReturn[] = [
                'document' => $converter->convert($documentContent)->getContent(),
                'frontMatter' => $frontMatter,
            ];
        }

        return $filesToReturn;
    }
}
