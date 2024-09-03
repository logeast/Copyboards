use crate::content::ClipboardContent;
use arboard::Clipboard;
use image::{ImageBuffer, ImageOutputFormat, Rgba};
use regex::Regex;
use sha2::{Digest, Sha256};
use std::fs::File;
use std::io::BufWriter;
use std::path::PathBuf;
use uuid::Uuid;

pub fn get_clipboard_content(
    clipboard: &mut Clipboard,
    images_dir: &PathBuf,
) -> (ClipboardContent, Vec<u8>) {
    if let Ok(text) = clipboard.get_text() {
        if is_color(&text) {
            (ClipboardContent::Color(text.clone()), text.into_bytes())
        } else {
            (ClipboardContent::Text(text.clone()), text.into_bytes())
        }
    } else if let Ok(image) = clipboard.get_image() {
        let hash = calculate_image_hash(&image.bytes);
        match save_image(images_dir, &image) {
            Ok(path) => (ClipboardContent::Image(path), hash),
            Err(e) => {
                eprintln!("Failed to save image: {}", e);
                (ClipboardContent::Unknown, hash)
            }
        }
    } else {
        (ClipboardContent::Unknown, Vec::new())
    }
}

fn calculate_image_hash(image_data: &[u8]) -> Vec<u8> {
    let mut hasher = Sha256::new();
    hasher.update(image_data);
    hasher.finalize().to_vec()
}

fn save_image(image_dir: &PathBuf, image: &arboard::ImageData) -> std::io::Result<PathBuf> {
    let file_name = format!("{}.png", Uuid::new_v4());
    let file_path = image_dir.join(&file_name);

    let img_buffer = ImageBuffer::<Rgba<u8>, _>::from_raw(
        image.width as u32,
        image.height as u32,
        image.bytes.clone(),
    )
    .ok_or_else(|| {
        std::io::Error::new(
            std::io::ErrorKind::InvalidData,
            "Failed to create image buffer",
        )
    })?;

    let file = File::create(&file_path)?;
    let mut writer = BufWriter::new(file);

    img_buffer
        .write_to(&mut writer, ImageOutputFormat::Png)
        .map_err(|e| std::io::Error::new(std::io::ErrorKind::Other, e))?;

    Ok(file_path)
}

fn is_color(text: &str) -> bool {
    let hex_color_regex = Regex::new(r"^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$").unwrap();
    let rgb_color_regex =
        Regex::new(r"^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$").unwrap();

    hex_color_regex.is_match(text) || rgb_color_regex.is_match(text)
}
