use image::{ImageBuffer, ImageOutputFormat, Rgba};
use sha2::{Digest, Sha256};
use std::fs::File;
use std::io::BufWriter;
use std::path::PathBuf;
use uuid::Uuid;

pub fn calculate_image_hash(image_data: &[u8]) -> Vec<u8> {
    let mut hasher = Sha256::new();
    hasher.update(image_data);
    hasher.finalize().to_vec()
}

pub fn save_image(image_dir: &PathBuf, image: &arboard::ImageData) -> std::io::Result<PathBuf> {
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
            format!(
                "Failed to create image buffer. Width: {}, Height: {}, Bytes length: {}",
                image.width,
                image.height,
                image.bytes.len()
            ),
        )
    })?;

    let file = File::create(&file_path)?;
    let mut writer = BufWriter::new(file);

    img_buffer
        .write_to(&mut writer, ImageOutputFormat::Png)
        .map_err(|e| std::io::Error::new(std::io::ErrorKind::Other, e))?;

    Ok(file_path)
}
