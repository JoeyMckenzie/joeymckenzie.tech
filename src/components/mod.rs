pub mod footer;
pub mod intro;
pub mod navbar;
mod powered_by;
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
