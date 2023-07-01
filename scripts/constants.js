"use strict";

const FLICKR_API_KEY = "f5cd94588d7e7ba8bb21aa1d4e997669";
const FLICKR_USER_ID = "198625833@N06";
const ReduxActions = Object.freeze({
    FETCHED_PRODUCTS: "FETCHED_PRODUCTS",
    SET_ELEVATOR_TYPES: "SET_ELEVATOR_TYPES",
});
const ElevatorTypes = Object.freeze({
    PASSENGER: 0,
    OBSERVATION: 1,
    FREIGHT: 2,
    CAR: 3,
    VILLA: 4,
    ESCALATOR: 5,
    MOVING_WALK: 6
});
