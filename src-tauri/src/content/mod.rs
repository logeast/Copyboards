mod color;
mod image;
mod text;

pub use color::ClipboardColor;
pub use image::ClipboardImage;
pub use text::ClipboardText;

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub enum ClipboardContent {
    Color(ClipboardColor),
    Image(ClipboardImage),
    Text(ClipboardText),
    Unknown,
}
