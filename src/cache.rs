use std::{collections::HashMap, env::current_dir, sync::OnceLock};

use anyhow::Context;
use axum::response::Html;
use gray_matter::{engine::YAML, Matter};
use tera::Tera;

use crate::blogs::{try_into_context, BlogFrontmatter};

/// An in-memory cache of blog content keying off the slug of the associated blog post.
pub type BlogContentCache = HashMap<String, Html<String>>;

/// A read cache containing tera templates.
pub static TEMPLATE_CACHE: OnceLock<Tera> = OnceLock::new();

/// A read cache containing blog frontmatter, metadata, and content.
pub static BLOG_CONTENT_CACHE: OnceLock<BlogContentCache> = OnceLock::new();

pub fn load_cache() -> anyhow::Result<()> {
    load_templates()?;
    load_blog_meta_cache()?;

    Ok(())
}

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
    // Next, grab a reference to all the content files on disk
    let working_dir = current_dir().context("failed to determine current working directory")?;
    let content_files = std::fs::read_dir(format!("{}/src/content", working_dir.display()))
        .context("content directory was not found")?;

    // We'll initialize the cache and a frontmatter reader provided by gray matter
    let mut blog_content_cache: BlogContentCache = HashMap::new();
    let matter = Matter::<YAML>::new();

    // The game plan now - roll through each file, render the content associated to the blog page with frontmatter and cache the output
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
            // Extract the tera content
            let context = try_into_context(&file_slug, parsed_markdown_with_frontmatter)?;

            // If we have a publishable page, extract the tera context for it
            let template = TEMPLATE_CACHE
                .get()
                .context("tera template cache was unable to be acquired")?
                .render("pages/blog-page.html", &context)
                .context("unable to render content page")?;

            blog_content_cache.insert(file_slug, Html(template));
        }
    }

    BLOG_CONTENT_CACHE
        .set(blog_content_cache)
        .expect("content cache was unable to lock");

    Ok(())
}
