mod database;
pub mod models;

use crate::content::ClipboardContent;
use database::Database;
use models::ClipboardItem;
use std::path::PathBuf;

pub struct ClipboardManager {
    db: Database,
    image_dir: PathBuf,
}

impl ClipboardManager {
    pub fn new(data_dir: &PathBuf) -> Result<Self, Box<dyn std::error::Error>> {
        let image_dir = data_dir.join("images");
        std::fs::create_dir_all(&image_dir)?;
        let db = Database::new(data_dir.join("clipboard_history.db"))?;
        Ok(Self { db, image_dir })
    }

    pub fn add_item(
        &self,
        content: ClipboardContent,
        category: Option<&str>,
    ) -> Result<(), Box<dyn std::error::Error>> {
        self.db.add_item(content, category, &self.image_dir)
    }

    pub fn get_history(
        &self,
        limit: i64,
    ) -> Result<Vec<ClipboardItem>, Box<dyn std::error::Error>> {
        self.db.get_history(limit)
    }

    pub fn search(
        &self,
        query: &str,
        limit: i64,
    ) -> Result<Vec<ClipboardItem>, Box<dyn std::error::Error>> {
        self.db.search(query, limit)
    }
}
