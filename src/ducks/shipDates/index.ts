import {ActionInterface} from 'chums-ducks';
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";
import LocalStore, {CURRENT_DATE} from "../../LocalStore";
import {saveManifestEntrySucceeded} from "../manifest/actionTypes";
import {combineReducers} from "redux";
import {loadShipDateFailed, loadShipDateRequested, loadShipDateSucceeded, shipDateSelected} from "./actionTypes";

export interface ShipDatesState {
    list: string[]
    selected: string,
    loading: boolean,
    loaded: boolean,
}

export const defaultState: ShipDatesState = {
    list: [],
    selected: LocalStore.getItem(CURRENT_DATE) || '',
    loading: false,
    loaded: false,
}

export interface ShipDateAction extends ActionInterface {
    payload?: {
        list?: string[],
        selected?: string,
        shipDate?: string,
        error?: Error,
        context?: string,
    }
}

export interface ShipDateThunkAction extends ThunkAction<any, RootState, unknown, ShipDateAction> {
}

export const shipDateListSelector = (state: RootState): string[] => state.shipDates.list.sort().reverse();
export const selectedShipDateSelector = (state: RootState): string => state.shipDates.selected;
export const loadingShipDateSelector = (state: RootState): boolean => state.shipDates.loading;
export const loadedSelector = (state: RootState): boolean => state.shipDates.loaded;


const listReducer = (state: string[] = defaultState.list, action: ShipDateAction) => {
    const {type, payload} = action;
    switch (type) {
    case loadShipDateSucceeded:
        if (payload?.list) {
            return payload.list.sort();
        }
        return state;
    case saveManifestEntrySucceeded:
        if (payload?.shipDate && !state.includes(payload.shipDate)) {
            return [
                ...state,
                payload.shipDate,
            ].sort();
        }
        return state;
    default:
        return state;
    }
}

const selectedReducer = (state: string = defaultState.selected, action: ShipDateAction) => {
    switch (action.type) {
    case shipDateSelected:
        LocalStore.setItem(CURRENT_DATE, action?.payload?.selected || '');
        return action?.payload?.selected || '';
    case saveManifestEntrySucceeded:
        if (action.payload?.shipDate) {
            return action.payload.shipDate || '';
        }
        return state
    default:
        return state;
    }
}

const loadingReducer = (state: boolean = defaultState.loading, action: ShipDateAction) => {
    switch (action.type) {
    case loadShipDateRequested:
        return true;
    case loadShipDateSucceeded:
    case loadShipDateFailed:
        return false;
    default:
        return state;
    }
}

const loadedReducer = (state: boolean = defaultState.loaded, action: ShipDateAction) => {
    switch (action.type) {
    case loadShipDateSucceeded:
        return true;
    default:
        return state;
    }
}

export default combineReducers({
    list: listReducer,
    selected: selectedReducer,
    loading: loadingReducer,
    loaded: loadedReducer,
})
