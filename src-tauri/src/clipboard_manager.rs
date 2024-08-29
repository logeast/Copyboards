
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use rusqlite::{Connection, Result as SqliteResult, params};
use std::path::PathBuf;
use std::fs;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub enum ClipboardContent {
    Text(String),
    Image(PathBuf),
    Unknown,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ClipboardItem {
    pub id: i64,
    pub content: ClipboardContent,
    pub timestamp: DateTime<Utc>,
    pub category: Option<String>,
}

pub struct ClipboardManager {
    conn: Connection,
    image_dir: PathBuf,
}

impl ClipboardManager {
    pub fn new(data_dir: &PathBuf) -> Result<Self, Box<dyn std::error::Error>> {
        let image_dir = data_dir.join("images");
        fs::create_dir_all(&image_dir)?;
        
        let conn = Connection::open(data_dir.join("clipboard_history.db"))?;

        conn.execute(
            "CREATE TABLE IF NOT EXISTS clipboard_history (
                id INTEGER PRIMARY KEY,
                content_type TEXT NOT NULL,
                content TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                category TEXT
            )",
            [],
        )?;

        Ok(Self { conn, image_dir })
    }

    pub fn add_item(&self, content: ClipboardContent, category: Option<&str>) -> SqliteResult<()> {
        let timestamp = Utc::now();
        let (content_type, content_str) = match &content {
            ClipboardContent::Text(text) => ("text", text.clone()),
            ClipboardContent::Image(path) => ("image", path.to_string_lossy().into_owned()),
            ClipboardContent::Unknown => ("unknown", String::new()),
        };
        self.conn.execute(
            "INSERT INTO clipboard_history (content_type, content, timestamp, category) VALUES (?1, ?2, ?3, ?4)",
            params![content_type, content_str, timestamp.to_rfc3339(), category],
        )?;
        Ok(())
    }

    pub fn get_history(&self, limit: i64) -> SqliteResult<Vec<ClipboardItem>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, content_type, content, timestamp, category FROM clipboard_history 
             ORDER BY timestamp DESC LIMIT ?",
        )?;
        let items = stmt.query_map([limit], |row| {
            Ok(ClipboardItem {
                id: row.get(0)?,
                content: match row.get::<_, String>(1)?.as_str() {
                    "text" => ClipboardContent::Text(row.get(2)?),
                    "image" => ClipboardContent::Image(PathBuf::from(row.get::<_, String>(2)?)),
                    _ => ClipboardContent::Unknown,
                },
                timestamp: DateTime::parse_from_rfc3339(&row.get::<_, String>(3)?)
                    .unwrap()
                    .with_timezone(&Utc),
                category: row.get(4)?,
            })
        })?;
        items.collect()
    }

    pub fn search(&self, query: &str, limit: i64) -> SqliteResult<Vec<ClipboardItem>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, content_type, content, timestamp, category FROM clipboard_history 
             WHERE content LIKE ? ORDER BY timestamp DESC LIMIT ?",
        )?;
        let items = stmt.query_map([format!("%{}%", query), limit.to_string()], |row| {
            Ok(ClipboardItem {
                id: row.get(0)?,
                content: match row.get::<_, String>(1)?.as_str() {
                    "text" => ClipboardContent::Text(row.get(2)?),
                    "image" => ClipboardContent::Image(PathBuf::from(row.get::<_, String>(2)?)),
                    _ => ClipboardContent::Unknown,
                },
                timestamp: DateTime::parse_from_rfc3339(&row.get::<_, String>(3)?)
                    .unwrap()
                    .with_timezone(&Utc),
                category: row.get(4)?,
            })
        })?;
        items.collect()
    }

    pub fn save_image(&self, image_data: &[u8]) -> std::io::Result<PathBuf> {
        let file_name = format!("{}.png", Uuid::new_v4());
        let file_path = self.image_dir.join(&file_name);
        fs::write(&file_path, image_data)?;
        Ok(file_path)
    }
}
