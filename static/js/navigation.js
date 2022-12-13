let languageSelected = false;

const updateUrl = element => {

    let unitsSelection = document.getElementById('units-selection')
    let languageSelection = document.getElementById('language-selection')

    if (element === 'units' && languageSelected===false) {
        const url = '?units='+unitsSelection.value;
        window.history.pushState(null, null, url);
    } else {
        const url = '?units='+unitsSelection.value+'&language='+languageSelection.value;
        window.history.pushState(null, null, url);
        languageSelected = true;
    }
}