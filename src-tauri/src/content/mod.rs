mod text;
mod image;

pub use text::ClipboardText;
pub use image::ClipboardImage;

use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub enum ClipboardContent {
    Text(String),
    Image(PathBuf),
    Unknown,
}
