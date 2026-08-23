const storageKey = "arcora:session-id";

/**
 * Identificador anônimo de visita. Não é um usuário: nasce e morre com a aba,
 * não é ligado a e-mail ou perfil, e serve só para agrupar eventos de uma
 * mesma navegação. Retorna undefined quando o armazenamento está bloqueado.
 */
export function getAnonymousSessionId(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const stored = window.sessionStorage.getItem(storageKey);
    if (stored) return stored;
    const created = window.crypto?.randomUUID?.() ?? `anon-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    window.sessionStorage.setItem(storageKey, created);
    return created;
  } catch {
    return undefined;
  }
}
