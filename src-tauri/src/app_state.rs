use crate::clipboard_manager::ClipboardManager;
use std::sync::{Arc, Mutex};

pub struct AppState {
    pub clipboard_manager: Arc<Mutex<ClipboardManager>>,
}
