use std::path::PathBuf;

use super::Database;
use crate::clipboard_manager::models::ClipboardItem;
use crate::content::{ClipboardColor, ClipboardContent, ClipboardImage, ClipboardText};
use rusqlite::{params, Result};

impl Database {
    pub fn add_item(
        &mut self,
        content: ClipboardContent,
        category: Option<&str>,
        source: Option<&str>,
        _image_dir: &PathBuf,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let tx = self.conn.transaction()?;

        let content_type = match content {
            ClipboardContent::Color(_) => "color",
            ClipboardContent::Image(_) => "image",
            ClipboardContent::Text(_) => "text",
            ClipboardContent::Unknown => return Ok(()),
        };

        tx.execute(
            "INSERT INTO clipboard_items (content_type, category, source) VALUES (?, ?, ?)",
            params![content_type, category, source],
        )?;

        let item_id = tx.last_insert_rowid();

        match content {
            ClipboardContent::Color(color) => {
                Self::add_color(&tx, item_id, &color)?;
            }
            ClipboardContent::Image(image) => {
                Self::add_image(&tx, item_id, &image)?;
            }
            ClipboardContent::Text(text) => {
                Self::add_text(&tx, item_id, &text)?;
            }
            ClipboardContent::Unknown => {}
        }

        tx.commit()?;

        Ok(())
    }

    pub fn get_history(
        &self,
        limit: i64,
    ) -> Result<Vec<ClipboardItem>, Box<dyn std::error::Error>> {
        let mut stmt = self.conn.prepare(
            "SELECT ci.id, ci.content_type, ci.category, ci.source, ci.created_at,
                    cc.color, ci2.path, ci2.hash, ci2.size, ci2.width, ci2.height, 
                    ct.text, ct.word_count, ct.character_count
             FROM clipboard_items ci
             LEFT JOIN clipboard_colors cc ON ci.id = cc.item_id
             LEFT JOIN clipboard_images ci2 ON ci.id = ci2.item_id
             LEFT JOIN clipboard_texts ct ON ci.id = ct.item_id
             ORDER BY ci.created_at DESC LIMIT ?",
        )?;

        let items = stmt.query_map([limit], |row| {
            let content = match row.get::<_, String>(1)?.as_str() {
                "color" => ClipboardContent::Color(ClipboardColor { color: row.get(5)? }),
                "image" => ClipboardContent::Image(ClipboardImage {
                    path: std::path::PathBuf::from(row.get::<_, String>(6)?),
                    hash: row.get(7)?,
                    size: row.get(8)?,
                    width: row.get(9)?,
                    height: row.get(10)?,
                    data: None,
                }),
                "text" => ClipboardContent::Text(ClipboardText {
                    text: row.get(11)?,
                    word_count: row.get(12)?,
                    character_count: row.get(13)?,
                }),
                _ => ClipboardContent::Unknown,
            };

            Ok(ClipboardItem {
                id: row.get(0)?,
                content,
                category: row.get(2)?,
                source: row.get(3)?,
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
            "SELECT ci.id, ci.content_type, ci.category, ci.source, ci.created_at,
                    cc.color, ci2.path, ci2.hash, ci2.size, ci2.width, ci2.height,
                    ct.text, ct.word_count, ct.character_count
             FROM clipboard_items ci
             LEFT JOIN clipboard_colors cc ON ci.id = cc.item_id
             LEFT JOIN clipboard_images ci2 ON ci.id = ci2.item_id
             LEFT JOIN clipboard_texts ct ON ci.id = ct.item_id
             WHERE cc.color LIKE ? OR ci2.path LIKE ? OR ct.text LIKE ?
             ORDER BY ci.created_at DESC LIMIT ?",
        )?;

        let items = stmt.query_map(
            params![
                format!("%{}%", query),
                format!("%{}%", query),
                format!("%{}%", query),
                limit
            ],
            |row| {
                let content = match row.get::<_, String>(1)?.as_str() {
                    "color" => ClipboardContent::Color(ClipboardColor { color: row.get(5)? }),
                    "image" => ClipboardContent::Image(ClipboardImage {
                        path: std::path::PathBuf::from(row.get::<_, String>(6)?),
                        hash: row.get(7)?,
                        size: row.get(8)?,
                        width: row.get(9)?,
                        height: row.get(10)?,
                        data: None,
                    }),
                    "text" => ClipboardContent::Text(ClipboardText {
                        text: row.get(11)?,
                        word_count: row.get(12)?,
                        character_count: row.get(13)?,
                    }),
                    _ => ClipboardContent::Unknown,
                };

                Ok(ClipboardItem {
                    id: row.get(0)?,
                    content,
                    category: row.get(2)?,
                    source: row.get(3)?,
                    created_at: row.get(4)?,
                })
            },
        )?;

        items.collect::<Result<Vec<_>, _>>().map_err(Into::into)
    }
}
