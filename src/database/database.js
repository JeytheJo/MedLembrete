import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('tolembrado.db');

export function initDatabase() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS perfil_usuario (
      id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      idade TEXT,
      descricao TEXT,
      foto_path TEXT,
      observacoes_gerais TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS medicamento (
      id_medicamento INTEGER PRIMARY KEY AUTOINCREMENT,
      id_usuario INTEGER NOT NULL,
      titulo TEXT NOT NULL,
      subtitulo_instrucao TEXT,
      horario_programado TEXT,
      icone_tipo TEXT DEFAULT 'remedio',
      ativo INTEGER DEFAULT 1,
      frequencia_dias TEXT DEFAULT '1111111',
      FOREIGN KEY (id_usuario) REFERENCES perfil_usuario(id_usuario)
    );

    CREATE TABLE IF NOT EXISTS historico_uso (
      id_registro INTEGER PRIMARY KEY AUTOINCREMENT,
      id_medicamento INTEGER NOT NULL,
      data_execucao TEXT NOT NULL,
      status TEXT DEFAULT 'pendente',
      horario_confirmacao TEXT,
      FOREIGN KEY (id_medicamento) REFERENCES medicamento(id_medicamento)
    );
  `);
}

export default db;
