use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub struct ClipboardText {
    pub text: String,
    pub word_count: u32,
    pub character_count: u32,
}

impl ClipboardText {
    pub fn new(text: String) -> Self {
        let word_count = text.split_whitespace().count() as u32;
        let character_count = text.chars().count() as u32;
        Self {
            text,
            word_count,
            character_count,
        }
    }
}
