use serde::{Serialize, Deserialize};
use std::path::PathBuf;

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub struct ClipboardImage {
    pub path: PathBuf,
    pub size: u64,
    pub dimensions: String,
}
