use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub struct ClipboardImage {
    pub path: PathBuf,
    pub hash: Vec<u8>,
    pub size: u64,
    pub width: u32,
    pub height: u32,
    pub data: Option<Vec<u8>>,
}
