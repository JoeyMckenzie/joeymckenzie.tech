use std::sync::Arc;

use reqwest::Client;

#[derive(Debug)]
pub struct HandlerState {
    pub access_token: String,
    pub client: Client,
}

impl HandlerState {
    pub fn new_state(access_token: String) -> Arc<HandlerState> {
        let client = Client::new();

        Arc::new(HandlerState {
            access_token,
            client,
        })
    }
}
