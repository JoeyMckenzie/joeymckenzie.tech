use serde::{Deserialize, Serialize};
use time::Date;

pub mod blog_preview;
pub mod blog_previews;
pub mod footer;
pub mod intro;
pub mod navbar;
mod powered_by;
pub mod section_intro;
pub mod social_buttons;
mod social_icons;
pub mod spotify_not_playing;
mod spotify_now_playing;
mod spotify_tracker;
mod theme_toggle;

#[derive(Clone, Copy, Debug)]
struct DisplayableIcon<'a> {
    href: &'a str,
    display: &'a str,
    icon: Option<&'a str>,
}

#[derive(Clone, Serialize, Deserialize, PartialEq, Eq, Debug)]
pub struct PostMetadata {
    pub title: String,
    pub description: String,
    pub slug: String,
    pub published_date: Date,
    pub views: i64,
    pub category: String,
}
