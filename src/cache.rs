use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
};

struct CachedPost {
    pub slug: String,
    pub content: String,
}

type InternalPostCache = Arc<Mutex<HashMap<String, CachedPost>>>;
