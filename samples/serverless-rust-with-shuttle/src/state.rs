use std::sync::Arc;

#[derive(Debug)]
pub struct HandlerState {
    pub access_token: String,
}

impl HandlerState {
    pub fn new_state(access_token: String) -> Arc<HandlerState> {
        Arc::new(HandlerState { access_token })
    }
}
