mod color_operations;
mod image_operations;
mod item_operations;
mod text_operations;

use rusqlite::{Connection, Result};
use std::path::PathBuf;

pub struct Database {
    conn: Connection,
}

impl Database {
    pub fn new(db_path: PathBuf) -> Result<Self, Box<dyn std::error::Error>> {
        let conn = Connection::open(db_path)?;

        // Initialize database schema
        Self::init_schema(&conn)?;

        Ok(Self { conn })
    }

    fn init_schema(conn: &Connection) -> Result<(), Box<dyn std::error::Error>> {
        conn.execute(
            "CREATE TABLE IF NOT EXISTS clipboard_items (
                id INTEGER PRIMARY KEY,
                content_type TEXT NOT NULL,
                category TEXT,
                source TEXT,
                created_at TEXT NOT NULL
            )",
            [],
        )?;

        conn.execute(
            "CREATE TABLE IF NOT EXISTS clipboard_colors (
                item_id INTEGER PRIMARY KEY,
                color TEXT NOT NULL,
                FOREIGN KEY(item_id) REFERENCES clipboard_items(id)
            )",
            [],
        )?;

        conn.execute(
            "CREATE TABLE IF NOT EXISTS clipboard_images (
                item_id INTEGER PRIMARY KEY,
                path TEXT NOT NULL,
                hash BLOB NOT NULL,
                size INTEGER NOT NULL,
                width INTEGER NOT NULL,
                height INTEGER NOT NULL,
                FOREIGN KEY(item_id) REFERENCES clipboard_items(id)
            )",
            [],
        )?;

        conn.execute(
            "CREATE TABLE IF NOT EXISTS clipboard_texts (
                item_id INTEGER PRIMARY KEY,
                text TEXT NOT NULL,
                word_count INTEGER NOT NULL,
                character_count INTEGER NOT NULL,
                FOREIGN KEY(item_id) REFERENCES clipboard_items(id)
            )",
            [],
        )?;

        Ok(())
    }
}
