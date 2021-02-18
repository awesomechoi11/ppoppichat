import {
    atom
} from 'recoil';

/* atoms */
//basically global variables


export const currentMode = atom({
    key: 'currentMode',
    default: 'signin',
});

export const userDataFromFirebase = atom({
    key: 'userDataFromFirebase',
    default: null
})

export const userRefFromFirebase = atom({
    key: 'userRefFromFirebase',
    default: null
})

export const userUIDFromFirebase = atom({
    key: 'userUIDFromFirebase',
    default: null
})