var _api_key = 'pk.eyJ1Ijoicnplem9sIiwiYSI6ImNrcGxvM2dhbDA3anIyd211dXQwOHVoNGYifQ.eycHF5doCaGZHzjjnheeIA';
var _map = null;

var _playerMarker = null;

var _resourcesArray = new Array();

var _resourceType = {
    _food: 'Food',
    _wood: 'Wood',
    _metal: 'Metal',
    _dog: 'Dog'
}

var _shelter = {
    _marker: null,
    _population: 1,
    _dogulation: 0,
    _food: 20,
    _wood: 5,
    _metal: 0
}

var _icons = {
    _player: 'url(res/person-solid.svg)',
    _playerWalking: 'url(res/person-walking-solid.svg)',
    _food: 'url(res/wheat-awn-solid.svg)',
    _wood: 'url(res/tree-solid.svg)',
    _metal: 'url(res/gear-solid.svg)',
    _shelter: 'url(res/house-solid.svg)',
    _dog: 'url(res/dog-solid.svg)'
}