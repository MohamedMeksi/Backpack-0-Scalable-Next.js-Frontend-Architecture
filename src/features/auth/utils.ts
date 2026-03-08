/**
 * Utilitaires propres à la fonctionnalité d'authentification.
 */

/**
 * Vérifie si une adresse email est valide.
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Vérifie si un mot de passe respecte les critères de sécurité minimaux.
 * - Au moins 8 caractères
 * - Au moins une majuscule
 * - Au moins un chiffre
 */
export function isStrongPassword(password: string): boolean {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password)
  );
}

/**
 * Formate un message d'erreur d'authentification pour l'affichage utilisateur.
 */
export function formatAuthError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Une erreur inattendue est survenue. Veuillez réessayer.";
}
