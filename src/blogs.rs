use std::{collections::HashMap, sync::RwLock};

/// An in-memory cache of blog content keying off the slug of the associated blog post.
pub type BlogCache = RwLock<HashMap<String, tera::Context>>;

/// Represents the required frontmatter associated to all blogs.
pub struct BlogFrontmatter {
    /// Title of the blog post.
    pub title: String,
    /// A short description of the blog post, also used in the page metadata.
    pub description: String,
    /// Various tags that categorize the blog post.
    pub tags: Vec<String>,
}

impl From<BlogFrontmatter> for tera::Context {
    fn from(front_matter: BlogFrontmatter) -> Self {
        let mut context = tera::Context::new();
        context.insert("title", &front_matter.title);
        context
    }
}

/// Represents a data container encapsulating a blog's content and associated frontmatter.
pub struct BlogMeta {
    /// Parsed and validated frontmatter.
    frontmatter: BlogFrontmatter,
    /// Parsed content to be converted to HTML.
    content: String,
}
