pub mod footer;
pub mod intro;
pub mod navbar;
pub mod powered_by;
pub mod social_buttons;
pub mod social_icons;

#[derive(Clone, Copy, Debug)]
struct DisplayableIcon<'a> {
    href: &'a str,
    display: &'a str,
    icon: Option<&'a str>,
}
