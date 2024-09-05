pub mod color_utils;
mod image_utils;
use crate::content::{ClipboardColor, ClipboardContent, ClipboardImage, ClipboardText};
use arboard::Clipboard;
pub use color_utils::is_color;
pub use image_utils::{calculate_image_hash, save_image};
use std::path::PathBuf;

pub fn get_clipboard_content(clipboard: &mut Clipboard) -> ClipboardContent {
    if let Ok(text) = clipboard.get_text() {
        if is_color(&text) {
            ClipboardContent::Color(ClipboardColor { color: text })
        } else {
            ClipboardContent::Text(ClipboardText::new(text))
        }
    } else if let Ok(image) = clipboard.get_image() {
        let hash = calculate_image_hash(&image.bytes);
        ClipboardContent::Image(ClipboardImage {
            path: PathBuf::new(), // Empty path, will be set when saving
            hash,
            size: image.bytes.len() as u64,
            width: image.width as u32,
            height: image.height as u32,
        })
    } else {
        ClipboardContent::Unknown
    }
}
