/**
 * Constantes centralizadas del proyecto de automatización.
 *
 * Se evita el uso de "magic strings" y tiempos hardcodeados en los tests,
 * concentrando aquí URLs base y timeouts estándar reutilizables.
 */

/** URL base para las pruebas de Mercado Libre (web desktop y mobile). */
export const BASE_URL_ML = 'https://www.mercadolibre.com.ar/';
export const BASE_URL_ORANGE = 'https://opensource-demo.orangehrmlive.com/';

/** Timeouts estándar para esperas explícitas en tests y Page Objects. */
export const TIMEOUTS = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 15000,
} as const;
