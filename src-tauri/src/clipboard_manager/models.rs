use crate::content::ClipboardContent;
use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ClipboardItem {
    pub id: i64,
    pub content: ClipboardContent,
    pub category: Option<String>,
    pub created_at: String,
}