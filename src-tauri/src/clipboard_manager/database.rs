use crate::clipboard_manager::models::ClipboardItem;
use crate::content::ClipboardContent;
use rusqlite::{params, Connection, Result};
use std::path::PathBuf;

pub struct Database {
    conn: Connection,
}

impl Database {
    pub fn new(db_path: PathBuf) -> Result<Self, Box<dyn std::error::Error>> {
        let conn = Connection::open(db_path)?;
        // Initialize database schema
        conn.execute(
            "CREATE TABLE IF NOT EXISTS clipboard_items (
                id INTEGER PRIMARY KEY,
                content_type TEXT NOT NULL,
                content TEXT NOT NULL,
                category TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )",
            [],
        )?;
        Ok(Self { conn })
    }

    pub fn add_item(
        &self,
        content: ClipboardContent,
        category: Option<&str>,
        image_dir: &PathBuf,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let (content_type, content_value) = match content {
            ClipboardContent::Text(text) => ("text", text),
            ClipboardContent::Image(path) => {
                let relative_path = path.strip_prefix(image_dir)?.to_str().unwrap().to_string();
                ("image", relative_path)
            }
            ClipboardContent::Color(color) => ("color", color),
            ClipboardContent::Unknown => return Ok(()), // Skip unknown content
        };

        self.conn.execute(
            "INSERT INTO clipboard_items (content_type, content, category) VALUES (?, ?, ?)",
            params![content_type, content_value, category],
        )?;

        Ok(())
    }

    pub fn get_history(
        &self,
        limit: i64,
    ) -> Result<Vec<ClipboardItem>, Box<dyn std::error::Error>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, content_type, content, category, created_at FROM clipboard_items 
             ORDER BY created_at DESC LIMIT ?",
        )?;
        let items = stmt.query_map([limit], |row| {
            Ok(ClipboardItem {
                id: row.get(0)?,
                content: match row.get::<_, String>(1)?.as_str() {
                    "text" => ClipboardContent::Text(row.get(2)?),
                    "image" => ClipboardContent::Image(PathBuf::from(row.get::<_, String>(2)?)),
                    "color" => ClipboardContent::Color(row.get(2)?),
                    _ => ClipboardContent::Unknown,
                },
                category: row.get(3)?,
                created_at: row.get(4)?,
            })
        })?;

        items.collect::<Result<Vec<_>, _>>().map_err(Into::into)
    }

    pub fn search(
        &self,
        query: &str,
        limit: i64,
    ) -> Result<Vec<ClipboardItem>, Box<dyn std::error::Error>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, content_type, content, category, created_at FROM clipboard_items 
             WHERE content LIKE ? ORDER BY created_at DESC LIMIT ?",
        )?;
        let items = stmt.query_map([format!("%{}%", query), limit.to_string()], |row| {
            Ok(ClipboardItem {
                id: row.get(0)?,
                content: match row.get::<_, String>(1)?.as_str() {
                    "text" => ClipboardContent::Text(row.get(2)?),
                    "image" => ClipboardContent::Image(PathBuf::from(row.get::<_, String>(2)?)),
                    "color" => ClipboardContent::Color(row.get(2)?),
                    _ => ClipboardContent::Unknown,
                },
                category: row.get(3)?,
                created_at: row.get(4)?,
            })
        })?;

        items.collect::<Result<Vec<_>, _>>().map_err(Into::into)
    }
}
