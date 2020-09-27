import { AppActions, AppViews, AppState } from 'common/types';

export type Context<S> = [S, AppActions, AppViews];

export type UpdateState = (props: Partial<AppState>) => void;

export type Action<S> = (state: AppState, setState: UpdateState) => S;

export type View<S> = (state: AppState) => S;
