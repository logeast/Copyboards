use super::Database;
use crate::content::ClipboardText;
use rusqlite::{params, Result, Transaction};

impl Database {
    pub(super) fn add_text(
        &self,
        tx: &Transaction,
        item_id: i64,
        text: &ClipboardText,
    ) -> Result<(), Box<dyn std::error::Error>> {
        tx.execute(
            "INSERT INTO clipboard_texts (item_id, text, word_count, character_count) VALUES (?, ?, ?, ?)",
            params![item_id, text.text, text.word_count, text.character_count],
        )?;
        Ok(())
    }
}
