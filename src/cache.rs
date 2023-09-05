use std::{collections::HashMap, env::current_dir, sync::OnceLock};

use anyhow::Context;
use gray_matter::{engine::YAML, Matter};
use tera::Tera;

use crate::blogs::{into_context, BlogCache, BlogFrontmatter};

/// A read cache containing tera templates.
pub static TEMPLATE_CACHE: OnceLock<Tera> = OnceLock::new();

/// A read cache containing blog frontmatter, metadata, and content.
pub static BLOG_META_CACHE: OnceLock<BlogCache> = OnceLock::new();

pub fn load_templates() -> anyhow::Result<()> {
    let templates = {
        let mut tera =
            Tera::new("src/templates/**/*").context("template directory was not found")?;
        tera.autoescape_on(vec![".html"]);
        tera
    };

    TEMPLATE_CACHE
        .set(templates)
        .expect("could not initialize templates");

    Ok(())
}

pub fn load_blog_meta_cache() -> anyhow::Result<()> {
    let working_dir = current_dir().context("failed to determine current working directory")?;
    let content_files = std::fs::read_dir(format!("{}/src/content", working_dir.display()))
        .context("content directory was not found")?;
    let mut blog_cache: BlogCache = HashMap::new();
    let matter = Matter::<YAML>::new();

    for file in content_files {
        // Unwrap the file result, assuming we're all good
        let file = file.context("file not found in content directory")?;

        // Parse the content of the file, we'll run it through gray matter to extract frontmatter and content
        let file_content =
            std::fs::read_to_string(file.path()).context("unable to read file content")?;

        // Extract the file name excluding the extension as we'll use that as the slug to identify the file within the cache
        let file_name = file.file_name();
        let file_with_extension = file_name
            .to_str()
            .context("unable to conver the file name")?;
        let trim_at = file_with_extension
            .rfind('.')
            .context("file extension was not valid")?;
        let file_slug = file_with_extension[..trim_at].to_string();

        // Parse the blog frontmatter into the frontmatter configuration and update the blog cache
        let parsed_markdown_with_frontmatter = matter
            .parse_with_struct::<BlogFrontmatter>(&file_content)
            .context("unable to parse the blog frontmatter")?;

        // Only push blogs meant to be published into the cache
        if parsed_markdown_with_frontmatter
            .data
            .published
            .unwrap_or(false)
        {
            blog_cache.insert(file_slug, into_context(parsed_markdown_with_frontmatter));
        }
    }

    BLOG_META_CACHE
        .set(blog_cache)
        .expect("blog cache was not able to bind to lock");

    Ok(())
}
