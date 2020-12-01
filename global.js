let version = "";
const queryString = window.location.search;
export const urlParams = new URLSearchParams(queryString);

export function hasClass(element, className) {
    return (' ' + element.className + ' ').indexOf(' ' + className + ' ') > -1;
}

export function getVersion(set = "") {
    if (set === "") {
        return version;
    } else {
        version = set;
    }
}

export function rand(min = 0, max = 50) {
    let num = Math.random() * (max - min) + min;

    return Math.floor(num);
}
