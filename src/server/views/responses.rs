use serde::Serialize;

#[derive(Serialize, Debug)]
pub struct ViewCountResponse {
    count: i32,
    slug: String,
}

impl ViewCountResponse {
    pub fn new(count: i32, slug: String) -> Self {
        Self { count, slug }
    }
}

#[derive(Serialize, Debug)]
pub struct ViewCountsResponse {
    counts: Vec<ViewCountResponse>,
}

impl ViewCountsResponse {
    pub fn new(counts: Vec<ViewCountResponse>) -> Self {
        Self { counts }
    }
}
