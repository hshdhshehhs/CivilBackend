window.onbeforeunload = (e) => {
    e.preventDefault();
    e.returnValue = '';
    return false;
}