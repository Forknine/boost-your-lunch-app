declare const process: { env: Record<string, string | undefined> };

declare module 'react' {
  export type ReactNode = any;
  export interface Context<T> {
    _currentValue: T;
    Provider: any;
  }
  export function createContext<T>(defaultValue: T): Context<T>;
  export function useCallback<T extends (...args: any[]) => any>(fn: T, deps: any[]): T;
  export function useContext<T>(context: Context<T>): T;
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useMemo<T>(factory: () => T, deps: any[]): T;
  export function useState<T>(initialState: T): [T, (value: T | ((prev: T) => T)) => void];
  const React: any;
  export default React;
}

declare namespace React {
  type ReactNode = any;
}

declare module 'react-native' {
  export const SafeAreaView: any;
  export const ScrollView: any;
  export const StatusBar: any;
  export const StyleSheet: any;
  export const Switch: any;
  export const Text: any;
  export const TextInput: any;
  export const TouchableOpacity: any;
  export const View: any;
}

declare module 'expo-status-bar' {
  export const StatusBar: any;
}

declare module '@react-navigation/native' {
  export const NavigationContainer: any;
}

declare module '@react-navigation/native-stack' {
  export function createNativeStackNavigator<T = any>(): any;
}

declare module '@react-navigation/bottom-tabs' {
  export function createBottomTabNavigator<T = any>(): any;
}

declare namespace JSX {
  interface Element {}
  interface IntrinsicAttributes {
    key?: string | number;
  }
  interface ElementChildrenAttribute {
    children: {};
  }
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
