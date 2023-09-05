use std::collections::HashMap;

use gray_matter::ParsedEntityStruct;
use pulldown_cmark::{html::push_html, Parser};
use serde::Deserialize;

/// An in-memory cache of blog content keying off the slug of the associated blog post.
pub type BlogCache = HashMap<String, tera::Context>;

/// Represents the required frontmatter associated to all blogs.
#[derive(Deserialize, Debug)]
pub struct BlogFrontmatter {
    /// Title of the blog post.
    pub title: String,
    /// A short description of the blog post, also used in the page metadata.
    pub description: String,
    /// An ISO compliant date formatted string.
    pub published_date: String,
    /// An optional flag representing if the blog post should be publically available.
    pub published: Option<bool>,
    /// Various tags that categorize the blog post.
    pub tags: Vec<String>,
}

/// Converts typed frontmatter content, including the markdown content, into a tera context.
pub fn into_context(parsed_frontmatter: ParsedEntityStruct<BlogFrontmatter>) -> tera::Context {
    // Create parser with example Markdown text.
    let parser = Parser::new(&parsed_frontmatter.content);

    // Write to a new String buffer.
    let mut html_output = String::new();
    push_html(&mut html_output, parser);

    // Build the associated tera context with the converted markdown output
    let mut context = tera::Context::new();
    context.insert("title", &parsed_frontmatter.data.title);
    context.insert("description", &parsed_frontmatter.data.description);
    context.insert("tags", &parsed_frontmatter.data.tags);
    context.insert("published_date", &parsed_frontmatter.data.published_date);
    context.insert("content", &html_output);
    context
}
