// tomtom-navigation-js.d.ts

/**
 * The main Navigation component.
 */
declare const Navigation: any;

/**
 * Themes provided by the library.
 */
export declare const lightTheme: object;
export declare const darkTheme: object;

/**
 * Custom hook for text styles.
 * @returns The text styles.
 */
export declare function useTextStyles(): object;

/**
 * Custom hook for button styles.
 * @returns The button styles.
 */
export declare function useButtonStyles(): object;

/**
 * Utility to calculate the device type.
 * @returns The calculated device type.
 */
export declare function calculateDeviceType(): string;

export default Navigation;
