use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Clone, Default)]
pub struct AppSettings {
    pub theme: String, // "light" or "dark"
    pub preview: bool,
}

#[derive(Serialize, Deserialize, Clone, Default)]
pub struct EditorDraft {
    pub markdown: String,
    pub selections: Vec<String>,
}
