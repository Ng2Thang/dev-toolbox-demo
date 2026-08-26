import { Parser } from 'node-sql-parser';
import { format, type SqlLanguage } from 'sql-formatter';

export const SQL_DIALECTS = ['postgresql', 'mysql', 'sqlite', 'sqlserver', 'bigquery'] as const;
export const SQL_KEYWORD_CASES = ['upper', 'lower'] as const;
export const SQL_INDENT_STYLES = ['2', '4', 'tabs'] as const;

export type SqlDialect = (typeof SQL_DIALECTS)[number];
export type SqlKeywordCase = (typeof SQL_KEYWORD_CASES)[number];
export type SqlIndentStyle = (typeof SQL_INDENT_STYLES)[number];

export type SqlFormatterOptions = {
  dialect: SqlDialect;
  keywordCase: SqlKeywordCase;
  indentStyle: SqlIndentStyle;
};

export const SQL_DIALECT_LABELS: Record<SqlDialect, string> = {
  postgresql: 'PostgreSQL',
  mysql: 'MySQL',
  sqlite: 'SQLite',
  sqlserver: 'SQL Server',
  bigquery: 'BigQuery',
};

const formatterLanguages: Record<SqlDialect, SqlLanguage> = {
  postgresql: 'postgresql',
  mysql: 'mysql',
  sqlite: 'sqlite',
  sqlserver: 'transactsql',
  bigquery: 'bigquery',
};

const parserDatabases: Record<SqlDialect, string> = {
  postgresql: 'Postgresql',
  mysql: 'MySQL',
  sqlite: 'Sqlite',
  sqlserver: 'TransactSQL',
  bigquery: 'BigQuery',
};

const parser = new Parser();

function syntaxMessage(error: unknown, input: string) {
  if (!(error instanceof Error)) {
    return 'Unable to validate this SQL. Correct the query and format again.';
  }

  const location = (
    error as Error & {
      location?: { start?: { offset?: number; line?: number; column?: number } };
    }
  ).location?.start;

  if (!location?.line || !location.column) {
    return `Unable to validate this SQL: ${error.message}`;
  }

  const offset = location.offset ?? 0;
  const token = input.slice(offset).match(/^[A-Za-z_][A-Za-z0-9_$]*/)?.[0];
  const unexpected = token ? `Unexpected ${token.toUpperCase()}` : 'Unexpected syntax';

  return `${unexpected} at line ${location.line}, column ${location.column}. Correct the query and format again.`;
}

export function formatSql(input: string, options: SqlFormatterOptions) {
  if (!input.trim()) {
    throw new Error('Enter SQL to format and validate.');
  }

  try {
    parser.astify(input, { database: parserDatabases[options.dialect] });
  } catch (error) {
    throw new Error(syntaxMessage(error, input));
  }

  return format(input, {
    language: formatterLanguages[options.dialect],
    keywordCase: options.keywordCase,
    tabWidth: options.indentStyle === '4' ? 4 : 2,
    useTabs: options.indentStyle === 'tabs',
  });
}
