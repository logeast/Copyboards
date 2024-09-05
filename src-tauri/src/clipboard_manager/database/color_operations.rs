use super::Database;
use crate::content::ClipboardColor;
use rusqlite::{params, Result, Transaction};

impl Database {
    pub(super) fn add_color(
        tx: &Transaction,
        item_id: i64,
        color: &ClipboardColor,
    ) -> Result<(), Box<dyn std::error::Error>> {
        tx.execute(
            "INSERT INTO clipboard_colors (item_id, color) VALUES (?, ?)",
            params![item_id, color.color],
        )?;
        Ok(())
    }
}
