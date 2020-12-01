let version = "";
const queryString = window.location.search;
export const urlParams = new URLSearchParams(queryString);

export function hasClass(element, className) {
    return (' ' + element.className + ' ').indexOf(' ' + className + ' ') > -1;
}

export function Version(set = "") {
    if (set === "") {
        return version;
    } else {
        version = set;
    }
}
