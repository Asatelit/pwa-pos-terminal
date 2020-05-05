// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

// add and expose @trust/webcrypto as window.crypto
// @ts-ignore
window.crypto = require('@trust/webcrypto');
