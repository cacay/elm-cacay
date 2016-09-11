// pull in desired CSS/SASS files
import './styles/main.less'


// inject bundled Elm app into div#main
import Elm from './Main'
var app = Elm.Main.embed( document.getElementById( 'main' ) )

