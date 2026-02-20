/**
 * Constantes centralizadas del proyecto de automatización.
 *
 * Centralizar URLs, valores de dominio y límites aquí evita el uso de "magic strings"
 * y números dispersos en los tests y page objects. Así se facilita el mantenimiento
 * a largo plazo: un único punto de cambio ante actualizaciones de la aplicación
 * o de reglas de negocio (ej. longitud máxima de documento o clave).
 */

/** URL base del home banking (Banco Credicoop). Usar con page.goto() o como base para rutas. */
export const BASE_URL = 'https://bancainternet.bancocredicoop.coop/bcclbe/';

/** Tipos de documento de identidad aceptados en el sistema. Útil para selects y validaciones. */
export const TIPOS_DOCUMENTO = ['DNI', 'LE', 'LC', 'CI', 'Pasaporte'] as const;

/** Longitud máxima permitida para el número de documento. */
export const MAX_LENGTH_DOCUMENTO = 11;

/** Longitud máxima permitida para la clave de acceso. */
export const MAX_LENGTH_CLAVE = 8;
