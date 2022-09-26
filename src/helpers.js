var helpers = {

    createMarkerWithIcon: function(icon, color = 'rgba(0, 0, 0, 0)') {

        const el = document.createElement('div');
            const width = 40;
            const height = 40;
            el.className = 'marker';
            el.style.backgroundImage = icon;
            el.style.backgroundSize = '75%';
            el.style.backgroundColor = color;
            el.style.backgroundPosition = 'center';
            el.style.backgroundRepeat = 'no-repeat';
            el.style.width = `${width}px`;
            el.style.height = `${height}px`;
            el.style.borderRadius = '50%';

        return el;

    },


    randomNumberBetween: function(min, max) {

        return Math.floor((Math.random() * (max - min)) + min);

    }

}