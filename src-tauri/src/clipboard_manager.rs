use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use rusqlite::{Connection, Result};

#[derive(Debug, Serialize, Deserialize)]
pub struct ClipboardItem {
    pub id: i64,
    pub content: String,
    pub timestamp: DateTime<Utc>,
    pub category: Option<String>,
}

pub struct ClipboardManager {
    conn: Connection,
}

impl ClipboardManager {
    pub fn new() -> Result<Self> {
        let conn = Connection::open("clipboard_history.db")?;
        conn.execute(
            "CREATE TABLE IF NOT EXISTS clipboard_history (
                id INTEGER PRIMARY KEY,
                content TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                category TEXT
            )",
            [],
        )?;
        Ok(Self { conn })
    }

    pub fn add_item(&self, content: &str, category: Option<&str>) -> Result<()> {
      let timestamp = Utc::now();
      self.conn.execute(
          "INSERT INTO clipboard_history (content, timestamp, category) VALUES (?1, ?2, ?3)",
          rusqlite::params![content, timestamp.to_rfc3339(), category],
      )?;
      Ok(())
    }

    pub fn get_history(&self, limit: i64) -> Result<Vec<ClipboardItem>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, content, timestamp, category FROM clipboard_history 
             ORDER BY timestamp DESC LIMIT ?",
        )?;
        let items = stmt.query_map([limit], |row| {
            Ok(ClipboardItem {
                id: row.get(0)?,
                content: row.get(1)?,
                timestamp: DateTime::parse_from_rfc3339(&row.get::<_, String>(2)?)
                    .unwrap()
                    .with_timezone(&Utc),
                category: row.get(3)?,
            })
        })?;
        items.collect()
    }

    pub fn search(&self, query: &str, limit: i64) -> Result<Vec<ClipboardItem>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, content, timestamp, category FROM clipboard_history 
             WHERE content LIKE ? ORDER BY timestamp DESC LIMIT ?",
        )?;
        let items = stmt.query_map([format!("%{}%", query), limit.to_string()], |row| {
            Ok(ClipboardItem {
                id: row.get(0)?,
                content: row.get(1)?,
                timestamp: DateTime::parse_from_rfc3339(&row.get::<_, String>(2)?)
                    .unwrap()
                    .with_timezone(&Utc),
                category: row.get(3)?,
            })
        })?;
        items.collect()
    }
}