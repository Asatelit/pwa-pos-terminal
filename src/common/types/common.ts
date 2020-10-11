import { AppActions, AppViews, AppState, AppHelpers } from 'common/types';

export type AppContextResponseArray = [
  Readonly<AppState>,
  Readonly<AppActions>,
  Readonly<AppViews>,
  Readonly<AppHelpers>
];

export type AppContextResponseObject = {
  state: Readonly<AppState>;
  actions: Readonly<AppActions>;
  views: Readonly<AppViews>;
  helpers: Readonly<AppHelpers>;
};

export type AppContext = AppContextResponseArray & AppContextResponseObject;

export type UpdateState = (props: Partial<AppState>) => void;

export type Action<S> = (state: AppState, setState: UpdateState) => S;

export type View<S> = (state: AppState) => S;

export type Locales = { [key: string]: Locale };

export type SupportedLocales = string[];
