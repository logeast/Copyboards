use super::Database;
use crate::content::ClipboardImage;
use rusqlite::{params, Result, Transaction};

impl Database {
    pub(super) fn add_image(
        tx: &Transaction,
        item_id: i64,
        image: &ClipboardImage,
    ) -> Result<(), Box<dyn std::error::Error>> {
        tx.execute(
            "INSERT INTO clipboard_images (item_id, path, hash, size, width, height) VALUES (?, ?, ?, ?, ?, ?)",
            params![
                item_id,
                image.path.to_str().unwrap(),
                image.hash,
                image.size,
                image.width,
                image.height,
            ],
        )?;
        Ok(())
    }
}
