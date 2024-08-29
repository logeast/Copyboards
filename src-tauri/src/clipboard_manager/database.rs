use super::models::ClipboardItem;
use crate::content::{ClipboardContent, ClipboardImage};
use chrono::{DateTime, Utc};
use image::GenericImageView;
use rusqlite::{params, Connection, Result as SqliteResult};
use std::path::PathBuf;

pub struct Database {
    conn: Connection,
}

impl Database {
    pub fn new(db_path: PathBuf) -> Result<Self, rusqlite::Error> {
        let conn = Connection::open(db_path)?;
        Self::init_tables(&conn)?;
        Ok(Self { conn })
    }

    fn init_tables(conn: &Connection) -> SqliteResult<()> {
        conn.execute(
            "CREATE TABLE IF NOT EXISTS clipboard_history (
                id INTEGER PRIMARY KEY,
                content_type TEXT NOT NULL,
                content_id INTEGER NOT NULL,
                timestamp TEXT NOT NULL,
                category TEXT
            )",
            [],
        )?;

        conn.execute(
            "CREATE TABLE IF NOT EXISTS text_content (
                id INTEGER PRIMARY KEY,
                text TEXT NOT NULL
            )",
            [],
        )?;

        conn.execute(
            "CREATE TABLE IF NOT EXISTS image_content (
                id INTEGER PRIMARY KEY,
                path TEXT NOT NULL,
                size INTEGER NOT NULL,
                dimensions TEXT NOT NULL
            )",
            [],
        )?;

        Ok(())
    }

    pub fn add_item(
        &self,
        content: ClipboardContent,
        category: Option<&str>,
        _image_dir: &PathBuf,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let timestamp = Utc::now();
        let (content_type, content_id) = match content {
            ClipboardContent::Text(text) => {
                let id = self.add_text_content(&text)?;
                ("text", id)
            }
            ClipboardContent::Image(path) => {
                let id = self.add_image_content(&path)?;
                ("image", id)
            }
            ClipboardContent::Unknown => ("unknown", 0),
        };

        self.conn.execute(
            "INSERT INTO clipboard_history (content_type, content_id, timestamp, category) VALUES (?1, ?2, ?3, ?4)",
            params![content_type, content_id, timestamp.to_rfc3339(), category],
        )?;

        Ok(())
    }

    pub fn get_history(
        &self,
        limit: i64,
    ) -> Result<Vec<ClipboardItem>, Box<dyn std::error::Error>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, content_type, content_id, timestamp, category FROM clipboard_history 
             ORDER BY timestamp DESC LIMIT ?",
        )?;
        let items = stmt.query_map([limit], |row| {
            let content_type: String = row.get(1)?;
            let content_id: i64 = row.get(2)?;
            let content = match content_type.as_str() {
                "text" => ClipboardContent::Text(self.get_text_content(content_id)?),
                "image" => ClipboardContent::Image(self.get_image_content(content_id)?.path),
                _ => ClipboardContent::Unknown,
            };
            Ok(ClipboardItem {
                id: row.get(0)?,
                content,
                content_id,
                timestamp: DateTime::parse_from_rfc3339(&row.get::<_, String>(3)?)
                    .unwrap()
                    .with_timezone(&Utc),
                category: row.get(4)?,
            })
        })?;
        items.collect::<Result<Vec<_>, _>>().map_err(|e| e.into())
    }

    pub fn search(
        &self,
        query: &str,
        limit: i64,
    ) -> Result<Vec<ClipboardItem>, Box<dyn std::error::Error>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, content_type, content_id, timestamp, category FROM clipboard_history 
             WHERE content_id IN (
                 SELECT id FROM text_content WHERE text LIKE ?
             ) ORDER BY timestamp DESC LIMIT ?",
        )?;
        let items = stmt.query_map([format!("%{}%", query), limit.to_string()], |row| {
            let content_type: String = row.get(1)?;
            let content_id: i64 = row.get(2)?;
            let content = match content_type.as_str() {
                "text" => ClipboardContent::Text(self.get_text_content(content_id)?),
                "image" => ClipboardContent::Image(self.get_image_content(content_id)?.path),
                _ => ClipboardContent::Unknown,
            };
            Ok(ClipboardItem {
                id: row.get(0)?,
                content,
                content_id,
                timestamp: DateTime::parse_from_rfc3339(&row.get::<_, String>(3)?)
                    .unwrap()
                    .with_timezone(&Utc),
                category: row.get(4)?,
            })
        })?;
        items.collect::<Result<Vec<_>, _>>().map_err(|e| e.into())
    }

    fn add_text_content(&self, text: &str) -> SqliteResult<i64> {
        self.conn
            .execute("INSERT INTO text_content (text) VALUES (?1)", params![text])?;
        Ok(self.conn.last_insert_rowid())
    }

    fn get_text_content(&self, id: i64) -> SqliteResult<String> {
        self.conn.query_row(
            "SELECT text FROM text_content WHERE id = ?1",
            params![id],
            |row| row.get(0),
        )
    }

    fn add_image_content(&self, path: &PathBuf) -> Result<i64, Box<dyn std::error::Error>> {
        let metadata = std::fs::metadata(path)?;
        let size = metadata.len();
        let img = image::open(path)?;
        let dimensions = img.dimensions();
        self.conn.execute(
            "INSERT INTO image_content (path, size, dimensions) VALUES (?1, ?2, ?3)",
            params![
                path.to_string_lossy(),
                size,
                format!("{}x{}", dimensions.0, dimensions.1)
            ],
        )?;
        Ok(self.conn.last_insert_rowid())
    }

    fn get_image_content(&self, id: i64) -> SqliteResult<ClipboardImage> {
        self.conn.query_row(
            "SELECT path, size, dimensions FROM image_content WHERE id = ?1",
            params![id],
            |row| {
                Ok(ClipboardImage {
                    path: PathBuf::from(row.get::<_, String>(0)?),
                    size: row.get(1)?,
                    dimensions: row.get(2)?,
                })
            },
        )
    }
}
