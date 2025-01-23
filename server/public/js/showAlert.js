/* eslint-disable */
export const showAlert = (type, msg, styles, container='body') => {
    const markup = `<div class="alert alert-${type}" style="${styles}">${msg}</div>`;
    if(container === 'body') {
        document.querySelector(container).insertAdjacentHTML('afterbegin', markup);
    } else {
        document.getElementById(container).innerHTML = markup;

    }
};