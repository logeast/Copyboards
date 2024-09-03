use crate::content::ClipboardContent;
use arboard::Clipboard;
use image::{ImageBuffer, ImageOutputFormat, Rgba};
use std::fs::File;
use std::io::BufWriter;
use std::path::PathBuf;
use uuid::Uuid;

pub fn get_clipboard_content(clipboard: &mut Clipboard, image_dir: &PathBuf) -> ClipboardContent {
    if let Ok(text) = clipboard.get_text() {
        ClipboardContent::Text(text)
    } else if let Ok(image) = clipboard.get_image() {
        println!(
            "Image data (first 10 bytes): {:?}",
            &image.bytes[..10.min(image.bytes.len())]
        );

        match save_image(image_dir, &image) {
            Ok(path) => ClipboardContent::Image(path),
            Err(e) => {
                eprintln!("Failed to save image: {}", e);
                ClipboardContent::Unknown
            }
        }
    } else {
        ClipboardContent::Unknown
    }
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
