pub mod blog_preview;
pub mod blog_previews;
pub mod footer;
pub mod intro;
pub mod navbar;
pub mod note_to_self;
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
