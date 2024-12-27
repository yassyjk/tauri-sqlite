// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use rusqlite::Connection;

// データベースファイル
const TAURI_DB: &str = "../sqlite.db";

pub fn init() -> Result<(),String> {
    create_user_table()?;
    create_question_table()?;
    create_answer_table()?;
    Ok(())
}

// table create
#[tauri::command]
fn create_user_table() -> Result<String,String> {
    let connection = Connection::open(TAURI_DB).map_err(|e| e.to_string())?;
    let query = "
        CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, email TEXT, api TEXT);
    ";

    connection.execute(query,[]).map_err(|e| e.to_string())?;
    Ok("User-Table created successfully".to_string())
}

#[tauri::command]
fn create_question_table() -> Result<String,String> {
    let connection = Connection::open(TAURI_DB).map_err(|e| e.to_string())?;
    let query = "
        CREATE TABLE IF NOT EXISTS question (id INTEGER PRIMARY KEY AUTOINCREMENT, question TEXT NOT NULL);
    ";

    connection.execute(query,[]).map_err(|e| e.to_string())?;
    Ok("Question-Table created successfully".to_string())
}

#[tauri::command]
fn create_answer_table() -> Result<String,String> {
    let connection = Connection::open(TAURI_DB).map_err(|e| e.to_string())?;
    let query = "
        CREATE TABLE IF NOT EXISTS answer (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            question_id INTEGER NOT NULL, 
            name_id INTEGER NOT NULL, 
            answer TEXT NOT NULL,
            FOREIGN KEY (question_id) REFERENCES question(id) ON DELETE CASCADE,
            FOREIGN KEY (name_id) REFERENCES users(id) ON DELETE CASCADE
            );
    ";

    connection.execute(query,[]).map_err(|e| e.to_string())?;
    Ok("Answer-Table created successfully".to_string())
}

#[tauri::command]
pub async fn signup_user(name: String, email: String, api: String) -> Result<String, String> {
    let connection = Connection::open(TAURI_DB).map_err(|e| e.to_string())?;

    // 重複チェック
    let count : i64 = connection.query_row(
        "SELECT COUNT(*) FROM users WHERE name = ?",
        [&name],
        |row| row.get(0),
        ).unwrap_or(0);
    
    if count > 0 {
        return Err("同じユーザー名がすでに存在します。".to_string());
    }

    // ユーザー登録
    connection.execute("INSERT INTO users (name, email, API) VALUES (?, ?, ?)",[&name, &email, &api]).map_err(|e| e.to_string())?;

    Ok("ユーザー登録完了".to_string())
}

