use crate::blogs::BlogCache;

#[derive(Debug)]
pub struct AppState {
    pub cache: BlogCache,
}
