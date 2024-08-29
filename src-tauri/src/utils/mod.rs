use crate::content::ClipboardContent;
use arboard::Clipboard;
use std::fs;
use std::path::PathBuf;
use uuid::Uuid;

pub fn get_clipboard_content(clipboard: &mut Clipboard) -> ClipboardContent {
    if let Ok(text) = clipboard.get_text() {
        ClipboardContent::Text(text)
    } else if let Ok(image) = clipboard.get_image() {
        // We need to save the image data and return the path
        let temp_dir = std::env::temp_dir();
        if let Ok(path) = save_image(&temp_dir, &image.bytes) {
            ClipboardContent::Image(path)
        } else {
            ClipboardContent::Unknown
        }
    } else {
        ClipboardContent::Unknown
    }
}

pub fn save_image(image_dir: &PathBuf, image_data: &[u8]) -> std::io::Result<PathBuf> {
    let file_name = format!("{}.png", Uuid::new_v4());
    let file_path = image_dir.join(&file_name);
    fs::write(&file_path, image_data)?;
    Ok(file_path)
}
