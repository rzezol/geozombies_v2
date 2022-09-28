var _api_key = 'pk.eyJ1Ijoicnplem9sIiwiYSI6ImNsOGl4MWx4djBiYjQzb3BmNHJrMGR2cGYifQ.YLMwZ-TawBov1JB9jVkSXg';
var _map = null;

var _currentPosition = null;

var _playerMarker = null;

var _resourcesArray = new Array();

var _resourceType = {
    _food: 'Food',
    _wood: 'Wood',
    _metal: 'Metal',
    _people: 'People',
    _dog: 'Dog'
}

var _shelter = {
    _marker: null,
    _population: 1,
    _dogs: 0,
    _food: 0,
    _wood: 0,
    _metal: 0,

    addResource: function(resource) {
        switch(resource._type) {
            case _resourceType._food:
                this._food += resource._quantity;
                break;
            case _resourceType._wood:
                this._wood += resource._quantity;
                break;
            case _resourceType._metal:
                this._metal += resource._quantity;
                break;
            case _resourceType._people:
                this._population += resource._quantity;
                break;
            case _resourceType._dog:
                this._dogs += resource._quantity;
                break;
        }
    }
}

var _icons = {
    _player: 'url(res/person-solid.svg)',
    _playerWalking: 'url(res/person-walking-solid.svg)',
    _food: 'url(res/wheat-awn-solid.svg)',
    _wood: 'url(res/tree-solid.svg)',
    _metal: 'url(res/gear-solid.svg)',
    _shelter: 'url(res/house-solid.svg)',
    _dog: 'url(res/dog-solid.svg)',
    _people: 'url(res/people-group-solid.svg)'
}