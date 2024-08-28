use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use rusqlite::{Connection, Result, params};

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub enum ClipboardContent {
    Text(String),
    Image(String), // Base64 encoded image data
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
}

impl ClipboardManager {
    pub fn new() -> Result<Self> {
        let conn = Connection::open("clipboard_history.db")?;
        
        // Check if the table exists
        let table_exists: bool = conn.query_row(
            "SELECT 1 FROM sqlite_master WHERE type='table' AND name='clipboard_history'",
            [],
            |row| row.get(0),
        ).unwrap_or(false);

        if !table_exists {
            // Create the table if it doesn't exist
            conn.execute(
                "CREATE TABLE clipboard_history (
                    id INTEGER PRIMARY KEY,
                    content_type TEXT NOT NULL,
                    content TEXT NOT NULL,
                    timestamp TEXT NOT NULL,
                    category TEXT
                )",
                [],
            )?;
        } else {
            // Check if content_type column exists
            let content_type_exists: bool = conn.query_row(
                "SELECT 1 FROM pragma_table_info('clipboard_history') WHERE name='content_type'",
                [],
                |row| row.get(0),
            ).unwrap_or(false);

            if !content_type_exists {
                // Add content_type column if it doesn't exist
                conn.execute(
                    "ALTER TABLE clipboard_history ADD COLUMN content_type TEXT NOT NULL DEFAULT 'text'",
                    [],
                )?;
            }
        }

        Ok(Self { conn })
    }

    pub fn add_item(&self, content: ClipboardContent, category: Option<&str>) -> Result<()> {
        let timestamp = Utc::now();
        let (content_type, content_str) = match content {
            ClipboardContent::Text(text) => ("text", text),
            ClipboardContent::Image(base64) => ("image", base64),
            ClipboardContent::Unknown => ("unknown", String::new()),
        };
        self.conn.execute(
            "INSERT INTO clipboard_history (content_type, content, timestamp, category) VALUES (?1, ?2, ?3, ?4)",
            params![content_type, content_str, timestamp.to_rfc3339(), category],
        )?;
        Ok(())
    }

    pub fn get_history(&self, limit: i64) -> Result<Vec<ClipboardItem>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, content_type, content, timestamp, category FROM clipboard_history 
             ORDER BY timestamp DESC LIMIT ?",
        )?;
        let items = stmt.query_map([limit], |row| {
            Ok(ClipboardItem {
                id: row.get(0)?,
                content: match row.get::<_, String>(1)?.as_str() {
                    "text" => ClipboardContent::Text(row.get(2)?),
                    "image" => ClipboardContent::Image(row.get(2)?),
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

    pub fn search(&self, query: &str, limit: i64) -> Result<Vec<ClipboardItem>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, content_type, content, timestamp, category FROM clipboard_history 
             WHERE content LIKE ? ORDER BY timestamp DESC LIMIT ?",
        )?;
        let items = stmt.query_map([format!("%{}%", query), limit.to_string()], |row| {
            Ok(ClipboardItem {
                id: row.get(0)?,
                content: match row.get::<_, String>(1)?.as_str() {
                    "text" => ClipboardContent::Text(row.get(2)?),
                    "image" => ClipboardContent::Image(row.get(2)?),
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
}