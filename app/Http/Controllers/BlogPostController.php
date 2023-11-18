<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use League\CommonMark\Environment\Environment;
use League\CommonMark\Extension\CommonMark\CommonMarkCoreExtension;
use League\CommonMark\Extension\FrontMatter\Data\SymfonyYamlFrontMatterParser;
use League\CommonMark\Extension\FrontMatter\FrontMatterExtension;
use League\CommonMark\Extension\FrontMatter\FrontMatterParser;
use League\CommonMark\MarkdownConverter;
use Request;

class BlogPostController
{
    public function show(Request $request, string $slug): Response
    {
        $config = [];

        // Configure the Environment with all the CommonMark parsers/renderers
        $environment = new Environment($config);
        $environment->addExtension(new CommonMarkCoreExtension());

        // Add the extension
        $environment->addExtension(new FrontMatterExtension());

        // Instantiate the converter engine and start converting some Markdown!
        $converter = new MarkdownConverter($environment);

        $basePath = base_path();
        $contentPath = "{$basePath}".'/content';
        $files = glob("$contentPath/**/*.md", GLOB_BRACE);

        foreach ($files as $file) {
            $contents = file_get_contents($file);
            // $result = $converter->convert($contents);
            $frontMatterParser = new FrontMatterParser(new SymfonyYamlFrontMatterParser());
            $result = $frontMatterParser->parse($contents);

            ddd([
                'result' => $result->getContent(),
                'frontMatter' => $result->getFrontMatter(),
            ]);
        }

        return Inertia::render('BlogPost', [
            'slug' => $slug,
        ]);
    }
}
