/**
 * Convert declarative reducer to standard reducer
 */
import { Action, Reducer } from 'redux';

export type ActionHandler<S> = { [actionType: string]: PayloadReducer<S> };
export type PayloadReducer<S> = (state: Readonly<S>, payload: any) => S;
export type StandardAction<P> = Action & { payload?: P };

export const createReducer = <S, P>(initialState: S, handler: ActionHandler<S>): Reducer<S> => (
  state: Readonly<S> = initialState,
  { payload, type }: StandardAction<any>,
): S => (handler.hasOwnProperty(type) ? handler[type](state, payload) : state);
