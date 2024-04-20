use serde::{Deserialize, Serialize};
use time::Date;

#[derive(Clone, Serialize, Deserialize, PartialEq, Eq, Debug)]
pub struct PostAggregate {
    pub post: Post,
    pub keywords: Option<Vec<String>>,
}

#[derive(Clone, Serialize, Deserialize, PartialEq, Eq, Debug)]
pub struct Post {
    pub id: i64,
    pub title: String,
    pub published_date: Date,
    pub views: i64,
    pub category: String,
    pub content: String,
    pub hero_image: String,
    pub description: String,
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

#[derive(Clone, Serialize, Deserialize, PartialEq, Eq, Debug)]
pub struct Keyword {
    pub word: String,
}
