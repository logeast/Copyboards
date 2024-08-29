use crate::content::ClipboardContent;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ClipboardItem {
    pub id: i64,
    pub content: ClipboardContent,
    pub timestamp: DateTime<Utc>,
    pub category: Option<String>,
}
