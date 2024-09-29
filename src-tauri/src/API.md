# Database Module

The `database` module is responsible for managing the SQLite database used to store clipboard items. It provides functionality for creating the database schema, adding new items, retrieving the clipboard history, and searching for items.

## Database Struct

The `Database` struct represents the SQLite database connection.

```rust
pub struct Database {
    conn: Connection,
}
```

## Initialization

The `Database` struct is initialized by calling the `new` function, which takes the path to the database file as an argument.

```rust
impl Database {
    pub fn new(db_path: PathBuf) -> Result<Self, Box<dyn std::error::Error>> {
        let conn = Connection::open(db_path)?;

        // Initialize database schema
        Self::init_schema(&conn)?;

        Ok(Self { conn })
    }
}
```

The `init_schema` function creates the necessary tables if they don't already exist.

```rust
fn init_schema(conn: &Connection) -> Result<(), Box<dyn std::error::Error>> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS clipboard_items (
            id INTEGER PRIMARY KEY,
            content_type TEXT NOT NULL,
            category TEXT,
            source TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )",
        [],
    )?;

    // Create other tables for different content types
    // ...
}
```

## Adding Items

The `add_item` function is used to add a new clipboard item to the database. It takes the clipboard content, an optional category, and an optional source as arguments.

```rust
pub fn add_item(
    &mut self,
    content: ClipboardContent,
    category: Option<&str>,
    source: Option<&str>,
    _image_dir: &PathBuf,
) -> Result<(), Box<dyn std::error::Error>> {
    // ...
}
```

Depending on the content type, the function inserts the item into the appropriate table(s).

## Retrieving History

The `get_history` function retrieves the clipboard history, limited by the specified number of items.

```rust
pub fn get_history(
    &self,
    limit: i64,
) -> Result<Vec<ClipboardItem>, Box<dyn std::error::Error>> {
    // ...
}
```

It performs a join across multiple tables to retrieve the clipboard items and their associated content.

## Searching

The `search` function allows searching for clipboard items based on a query string.

```rust
pub fn search(
    &self,
    query: &str,
    limit: i64,
) -> Result<Vec<ClipboardItem>, Box<dyn std::error::Error>> {
    // ...
}
```

It performs a similar join as `get_history` but with additional conditions to filter the results based on the query string.

The module also includes separate files for handling different content types, such as `color_operations`, `image_operations`, and `text_operations
