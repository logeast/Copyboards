use crate::content::ClipboardContent;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ClipboardItem {
    pub id: i64,
    pub content: ClipboardContent,
    pub category: Option<String>,
    pub source: Option<String>,
    pub created_at: String,
}
